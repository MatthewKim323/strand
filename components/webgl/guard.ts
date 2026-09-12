"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { WebGLRenderer } from "three"

/**
 * Capability guard for the GPGPU background effects.
 *
 * Probes for a WebGL2 context plus the specific features the simulation
 * needs (vertex texture fetch, float data textures, half-float render
 * targets, a large enough texture) and bails out cleanly when any of them
 * is missing, so an unsupported browser shows the fallback image instead
 * of a blank box or a thrown error.
 */

/** How many times a session is allowed to rebuild after a recoverable failure. */
const MAX_RECOVERIES = 2
/** Delay before a recoverable failure triggers a rebuild. */
const RECOVERY_DELAY_MS = 600
/** How often (in frames) the render loop re-checks for a lost context. */
const WATCHDOG_INTERVAL = 16

export interface GuardRequirements {
  vertexTextures?: boolean
  floatDataTextures?: boolean
  floatRenderTargets?: boolean
  maxTextureSize?: number
}

export interface GuardSession {
  failed: boolean
  destroyed: boolean
  renderer: WebGLRenderer | null
  /** Give up on this session. `recoverable` allows a later rebuild attempt. */
  fail(reason: string, recoverable: boolean): void
  /** True once the session has failed or been torn down. */
  halted(): boolean
  /** Called at the top of every frame; also runs the lost-context watchdog. */
  shouldStop(): boolean
  /** Called once the scene is up and drawing. */
  ready(): void
  /** Called from the effect cleanup. */
  end(): void
  /** Force an immediate rebuild (used on context restore). */
  rebuildNow(): void
}

export interface GuardedRenderer {
  renderer: WebGLRenderer
  detach(): void
  require(requirements: GuardRequirements): boolean
}

export interface GuardedRendererOptions {
  params?: WebGLContextAttributes & { antialias?: boolean }
  requirements?: GuardRequirements
}

type Capabilities = WebGLRenderer["capabilities"] & { isWebGL2?: boolean }

/**
 * Returns a human-readable reason string when the renderer cannot satisfy
 * `requirements`, or null when everything it needs is present.
 */
export function checkRequirements(
  renderer: WebGLRenderer,
  requirements: GuardRequirements,
): string | null {
  if (!renderer.getContext()) return "no WebGL context"

  const capabilities = renderer.capabilities as Capabilities

  if (requirements.vertexTextures && capabilities.maxVertexTextures < 1) {
    return "GPU reports no vertex texture image units"
  }

  // Modern three builds are WebGL2-only and drop the flag entirely, so an
  // absent flag means "yes".
  const isWebGL2 = capabilities.isWebGL2 !== false

  if (
    requirements.floatRenderTargets &&
    !(isWebGL2
      ? renderer.extensions.has("EXT_color_buffer_float") ||
        renderer.extensions.has("EXT_color_buffer_half_float")
      : renderer.extensions.has("OES_texture_half_float") &&
        renderer.extensions.has("EXT_color_buffer_half_float"))
  ) {
    return "half-float render targets unsupported"
  }

  if (
    requirements.floatDataTextures &&
    !isWebGL2 &&
    !renderer.extensions.has("OES_texture_float")
  ) {
    return "float data textures unsupported"
  }

  if (
    requirements.maxTextureSize &&
    requirements.maxTextureSize > capabilities.maxTextureSize
  ) {
    return (
      "required texture size " +
      requirements.maxTextureSize +
      " exceeds GPU maximum " +
      capabilities.maxTextureSize
    )
  }

  return null
}

/**
 * Tracks whether the effect is currently renderable, and hands out a
 * per-mount session object that the render loop reports failures through.
 */
export function useWebGLGuard(label = "WebGL") {
  const [webglAvailable, setWebglAvailable] = useState(true)
  const [gpuEpoch, setGpuEpoch] = useState(0)
  const recoveries = useRef(0)
  const recovering = useRef(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current)
        timer.current = null
      }
    },
    [],
  )

  const beginSession = useCallback((): GuardSession => {
    // A fresh mount resets the recovery budget; a rebuild after a
    // recoverable failure keeps spending the existing one.
    if (!recovering.current) recoveries.current = 0
    recovering.current = false

    let frames = 0

    const session: GuardSession = {
      failed: false,
      destroyed: false,
      renderer: null,
      fail(reason: string, recoverable: boolean) {
        if (session.failed || session.destroyed) return
        session.failed = true
        console.warn("[" + label + "] showing fallback — " + reason)
        session.renderer?.setAnimationLoop(null)
        if (!recoverable) recoveries.current = MAX_RECOVERIES
        setWebglAvailable(false)
        if (recoveries.current < MAX_RECOVERIES) {
          recoveries.current += 1
          recovering.current = true
          if (timer.current !== null) clearTimeout(timer.current)
          timer.current = window.setTimeout(() => {
            timer.current = null
            setGpuEpoch((epoch) => epoch + 1)
          }, RECOVERY_DELAY_MS)
        } else {
          console.warn(
            "[" + label + "] recovery budget exhausted — staying on fallback",
          )
        }
      },
      halted() {
        return session.failed || session.destroyed
      },
      shouldStop() {
        if (session.failed || session.destroyed) return true
        frames++
        if (frames % WATCHDOG_INTERVAL === 0) {
          const gl = session.renderer?.getContext()
          if (!gl || gl.isContextLost()) {
            session.fail("context lost (watchdog)", true)
            return true
          }
        }
        return false
      },
      ready() {
        if (!session.failed) setWebglAvailable(true)
      },
      end() {
        session.destroyed = true
      },
      rebuildNow() {
        if (timer.current !== null) {
          clearTimeout(timer.current)
          timer.current = null
          setGpuEpoch((epoch) => epoch + 1)
        }
      },
    }

    return session
  }, [label])

  return { webglAvailable, gpuEpoch, beginSession }
}

/**
 * Builds a renderer on its own canvas and validates it against
 * `requirements`. Returns null (having already reported the failure to the
 * session) whenever the environment cannot run the effect.
 */
export function createGuardedRenderer(
  session: GuardSession,
  options: GuardedRendererOptions = {},
): GuardedRenderer | null {
  const canvas = document.createElement("canvas")

  const onCreationError = (event: Event) => {
    const reason =
      (event as WebGLContextEvent).statusMessage || "unknown reason"
    session.fail("context creation failed — " + reason, false)
  }
  canvas.addEventListener("webglcontextcreationerror", onCreationError)

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ ...(options.params || {}), canvas })
  } catch (error) {
    canvas.removeEventListener("webglcontextcreationerror", onCreationError)
    session.fail("WebGLRenderer construction threw — " + String(error), false)
    return null
  }

  session.renderer = renderer

  const missing = checkRequirements(renderer, options.requirements || {})
  if (missing) {
    canvas.removeEventListener("webglcontextcreationerror", onCreationError)
    renderer.dispose()
    session.fail(missing, false)
    return null
  }

  if (renderer.debug) {
    renderer.debug.checkShaderErrors = true
    renderer.debug.onShaderError = () => {
      session.fail("shader compile/link error", false)
    }
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    session.fail("webglcontextlost", true)
  }
  const onContextRestored = () => {
    session.rebuildNow()
  }
  canvas.addEventListener("webglcontextlost", onContextLost)
  canvas.addEventListener("webglcontextrestored", onContextRestored)

  const detach = () => {
    canvas.removeEventListener("webglcontextcreationerror", onCreationError)
    canvas.removeEventListener("webglcontextlost", onContextLost)
    canvas.removeEventListener("webglcontextrestored", onContextRestored)
    if (renderer.debug) renderer.debug.onShaderError = null
  }

  return {
    renderer,
    detach,
    require(requirements: GuardRequirements) {
      const reason = checkRequirements(renderer, requirements)
      if (reason) {
        detach()
        renderer.dispose()
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
        session.fail(reason, false)
        return false
      }
      return true
    },
  }
}
