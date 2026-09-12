"use client"

import { useEffect, useRef } from "react"
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  HalfFloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  RedFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from "three"

import { createGuardedRenderer, useWebGLGuard } from "./guard"

/**
 * A flat, regular grid of dots that lights up along the rows the pointer
 * sweeps through and then fades back out.
 *
 * The glow is not computed per dot in the draw call. A one-channel half-float
 * render target, one texel per dot, holds each dot's current heat, and a
 * ping-ponged full-screen pass integrates it: every frame the previous heat is
 * multiplied by `exp(-decay * dt)` and the band of rows swept between the last
 * pointer position and this one is forced back to 1. The dots then read their
 * own texel in the vertex shader and mix between `dotColor` and `glowColor`.
 *
 * Because the sweep is resolved in the simulation pass rather than sampled per
 * frame, a fast pointer move lights every row it crossed instead of only the
 * two it was seen at. The band is widened by half a row on each side so a
 * pointer sitting still still covers the row under it.
 *
 * Each dot's simulation texel is baked into the geometry as an attribute at
 * build time, so the draw call does no index arithmetic at all. The grid is
 * laid out in CSS pixels under an orthographic camera, which is why `spacing`
 * and `dotSize` read as pixel values.
 */

/** Still image shown when the GPU cannot run the grid. */
const GRID_FALLBACK_IMAGE = "/img/img-bc0283b7c9.png"

/** Longest frame the decay integrator will accept, in seconds. */
const MAX_FRAME_DELTA = 0.1
/** Sentinel position meaning "the pointer is not over the grid". */
const POINTER_AWAY = -9999
/** How long the loop stays parked after an orientation change, in ms. */
const ORIENTATION_SETTLE_MS = 300
/** Delay before the discarded context is force-lost on unmount, in ms. */
const CONTEXT_LOSS_DELAY_MS = 100

export interface DotGridFieldProps {
  /** How fast a lit dot falls back to `dotColor`, per second. */
  decay?: number
  /** Dots across. Changing it rebuilds the grid. */
  dotsX?: number
  /** Dots down. Changing it rebuilds the grid. */
  dotsY?: number
  /** Gap between neighbouring dot centres, in CSS pixels. */
  spacing?: number
  /** Side of a single dot sprite, in device pixels. */
  dotSize?: number
  /** Colour of a cold dot. Any CSS colour string. */
  dotColor?: string
  /** Colour a dot reaches at full heat. Any CSS colour string. */
  glowColor?: string
  fallbackImage?: string
  fallbackFit?: "cover" | "contain" | "fill"
  fallbackAlt?: string
  className?: string
  style?: React.CSSProperties
}

/** One built grid: dot positions, per-dot randoms and per-dot sim texel UVs. */
interface DotBuffers {
  positions: Float32Array
  randoms: Float32Array
  simCells: Float32Array
}

/**
 * Lays the dots out row by row, centred on the origin, and records for each
 * one the UV of the simulation texel it will read its heat from.
 */
function buildDots({
  dotsX,
  dotsY,
  spacing,
  cellToUV,
}: {
  dotsX: number
  dotsY: number
  spacing: number
  cellToUV: (index: number) => [number, number]
}): DotBuffers {
  const count = dotsX * dotsY
  const gridWidth = (dotsX - 1) * spacing
  const gridHeight = (dotsY - 1) * spacing
  const positions = new Float32Array(count * 3)
  const randoms = new Float32Array(count)
  const simCells = new Float32Array(count * 2)

  let index = 0
  for (let row = 0; row < dotsY; row++) {
    for (let col = 0; col < dotsX; col++) {
      positions[index * 3 + 0] = -gridWidth / 2 + col * spacing
      positions[index * 3 + 1] = -gridHeight / 2 + row * spacing
      positions[index * 3 + 2] = 0
      randoms[index] = Math.random()
      const [u, v] = cellToUV(row * dotsX + col)
      simCells[index * 2] = u
      simCells[index * 2 + 1] = v
      index++
    }
  }

  return { positions, randoms, simCells }
}

/** Full-screen triangle pair for the simulation pass. */
const SIM_VERTEX_SHADER = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `

/** Exponential decay of the heat buffer, plus the swept-row reset. */
const SIM_FRAGMENT_SHADER = `
        uniform sampler2D tPrev;
        uniform vec2  uMouse;
        uniform vec2  uMousePrev;
        uniform vec2  uGridSize;
        uniform vec2  uCanvasSize;
        uniform float uDelta;
        uniform float uDecay;
        uniform float uDotsY;
        
        varying vec2 vUv;
        

        void main() {
            float prevT = texture2D(tPrev, vUv).r;

            // This sim cannot diverge — it is exponential decay of a value
            // already clamped to [0, 1] — but a ping-pong buffer never
            // clears itself, so one poisoned texel from a driver hiccup
            // would persist for the life of the component. The
            // NOT-greater-or-equal form is NaN-safe: it is true for NaN,
            // where a less-than test would be false.
            if (!(prevT >= 0.0)) prevT = 0.0;
        
            float mouseWorldY     = -(uMouse.y     - uCanvasSize.y * 0.5);
            float mouseWorldYPrev = -(uMousePrev.y - uCanvasSize.y * 0.5);
        
            float mouseV     = (mouseWorldY     + uGridSize.y * 0.5) / uGridSize.y;
            float mouseVPrev = (mouseWorldYPrev + uGridSize.y * 0.5) / uGridSize.y;
        
            // Ensure minV is always the smaller of the two
            float minV = min(mouseV, mouseVPrev);
            float maxV = max(mouseV, mouseVPrev);
        
            // Expand range by half a row on each side
            float halfRow = 0.5 / uDotsY;
            float lit = step(minV - halfRow, vUv.y) * step(vUv.y, maxV + halfRow);
        
            float mouseActive = step(0.0, uMouse.x) * step(0.0, uMousePrev.x);
            lit *= mouseActive;
        
            float newT = mix(prevT * exp(-uDecay * uDelta), 1.0, lit);
            gl_FragColor = vec4(newT, 0.0, 0.0, 1.0);
        }
    `

const VERTEX_SHADER = `
            attribute float aRandom;
            attribute vec2 aSimCell;

            uniform float uDotSize;
            uniform float uTime;

            uniform sampler2D tSim;

            varying float vGlow;

            void main() {
                // aSimCell is the exact texel-center UV baked at geometry
                // generation time — no gl_VertexID / runtime index math.
                vGlow = texture2D(tSim, aSimCell).r;
                if (!(vGlow >= 0.0)) vGlow = 0.0;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = uDotSize;
            }
        `

const FRAGMENT_SHADER = `
            uniform vec3 uDotColor;
            uniform vec3 uGlowColor;

            varying float vGlow;

            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                // if (length(coord) > 0.5) discard;
                vec3 color = mix(uDotColor, uGlowColor, vGlow);
                gl_FragColor = vec4(color, 1.0);
            }
        `

export function DotGridField({
  decay = 2,
  dotsX = 64,
  dotsY = 64,
  spacing = 16,
  dotSize = 2,
  dotColor = "#333333",
  glowColor = "#ffffff",
  fallbackImage,
  fallbackFit = "cover",
  fallbackAlt = "",
  className,
  style,
}: DotGridFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  const { webglAvailable, gpuEpoch, beginSession } =
    useWebGLGuard("DotGridField")

  // Everything except the three props that decide the buffer layout rides a
  // ref, so retuning the look live never rebuilds the point cloud.
  const decayRef = useRef(decay)
  useEffect(() => {
    decayRef.current = decay
  }, [decay])

  const dotSizeRef = useRef(dotSize)
  useEffect(() => {
    dotSizeRef.current = dotSize
  }, [dotSize])

  const dotColorRef = useRef(new Color(dotColor))
  const glowColorRef = useRef(new Color(glowColor))
  useEffect(() => {
    dotColorRef.current.set(dotColor)
  }, [dotColor])
  useEffect(() => {
    glowColorRef.current.set(glowColor)
  }, [glowColor])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const session = beginSession()

    // One texel per dot, squared off into the smallest square texture that
    // holds them all.
    const dotCount = dotsX * dotsY
    const simSize = Math.ceil(Math.sqrt(dotCount))

    const guarded = createGuardedRenderer(session, {
      params: { antialias: true, alpha: true },
      requirements: {
        vertexTextures: true,
        floatRenderTargets: true,
        maxTextureSize: simSize,
      },
    })
    if (!guarded) return

    const renderer = guarded.renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    const scene = new Scene()
    let width = mount.clientWidth
    let height = mount.clientHeight
    const camera = new OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      10,
    )
    camera.position.z = 1

    /** Centre of the simulation texel a linear dot index maps to. */
    function cellToUV(index: number): [number, number] {
      const u = (index % simSize) + 0.5
      const v = Math.floor(index / simSize) + 0.5
      return [u / simSize, v / simSize]
    }

    // --- Heat simulation --------------------------------------------------
    let simRead = new WebGLRenderTarget(simSize, simSize, {
      type: HalfFloatType,
      format: RedFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
    })
    let simWrite = simRead.clone()

    const simMaterial = new ShaderMaterial({
      uniforms: {
        tPrev: { value: simRead.texture },
        uMouse: { value: new Vector2(POINTER_AWAY, POINTER_AWAY) },
        uMousePrev: { value: new Vector2(POINTER_AWAY, POINTER_AWAY) },
        uGridSize: {
          value: new Vector2((dotsX - 1) * spacing, (dotsY - 1) * spacing),
        },
        uCanvasSize: { value: new Vector2(width, height) },
        uDelta: { value: 0 },
        uDecay: { value: 2 },
        uDotsY: { value: dotsY },
      },
      vertexShader: SIM_VERTEX_SHADER,
      fragmentShader: SIM_FRAGMENT_SHADER,
    })

    const simScene = new Scene()
    const simCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const simQuad = new PlaneGeometry(2, 2)
    const simMesh = new Mesh(simQuad, simMaterial)
    simScene.add(simMesh)

    // --- Dots -------------------------------------------------------------
    const { positions, randoms, simCells } = buildDots({
      dotsX,
      dotsY,
      spacing,
      cellToUV,
    })

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setAttribute("aRandom", new BufferAttribute(randoms, 1))
    geometry.setAttribute("aSimCell", new BufferAttribute(simCells, 2))

    const uniforms = {
      tSim: { value: null as WebGLRenderTarget["texture"] | null },
      uDotSize: { value: 2 },
      uTime: { value: 0 },
      uDotColor: { value: dotColorRef.current },
      uGlowColor: { value: glowColorRef.current },
      uMouse: { value: new Vector2(POINTER_AWAY, POINTER_AWAY) },
      uResolution: { value: new Vector2(width, height) },
    }

    const material = new ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    })

    const points = new Points(geometry, material)
    scene.add(points)

    // --- Loop -------------------------------------------------------------
    let isVisible = document.visibilityState === "visible"
    let isIntersecting = false

    const syncLoop = () => {
      if (session.halted()) {
        renderer.setAnimationLoop(null)
        return
      }
      renderer.setAnimationLoop(isVisible && isIntersecting ? renderFrame : null)
    }

    let lastTime = 0

    function renderFrame(timeMs: number) {
      if (session.shouldStop()) return
      const time = timeMs * 0.001
      const delta = Math.min(time - lastTime, MAX_FRAME_DELTA)
      lastTime = time

      uniforms.uTime.value = time
      uniforms.uDotSize.value = dotSizeRef.current
      uniforms.uDotColor.value = dotColorRef.current
      uniforms.uGlowColor.value = glowColorRef.current

      // The previous pointer position is the one the simulation saw last
      // frame, so the swept band always spans the whole gap.
      simMaterial.uniforms.uMousePrev.value.copy(simMaterial.uniforms.uMouse.value)
      simMaterial.uniforms.uMouse.value.copy(uniforms.uMouse.value)
      simMaterial.uniforms.tPrev.value = simRead.texture
      simMaterial.uniforms.uDelta.value = delta
      simMaterial.uniforms.uDecay.value = decayRef.current

      renderer.setRenderTarget(simWrite)
      renderer.render(simScene, simCamera)
      renderer.setRenderTarget(null)

      const swap = simRead
      simRead = simWrite
      simWrite = swap

      uniforms.tSim.value = simRead.texture
      renderer.render(scene, camera)
    }

    const onMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      uniforms.uMouse.value.set(event.clientX - rect.left, event.clientY - rect.top)
    }
    const onMouseLeave = () =>
      uniforms.uMouse.value.set(POINTER_AWAY, POINTER_AWAY)
    mount.addEventListener("mousemove", onMouseMove)
    mount.addEventListener("mouseleave", onMouseLeave)

    const resizeObserver = new ResizeObserver(() => {
      if (!renderer.getContext()) return
      width = mount.clientWidth
      height = mount.clientHeight
      renderer.setSize(width, height)
      camera.left = -width / 2
      camera.right = width / 2
      camera.top = height / 2
      camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      uniforms.uResolution.value.set(width, height)
      simMaterial.uniforms.uCanvasSize.value.set(width, height)
    })
    resizeObserver.observe(mount)

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible"
      syncLoop()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    // Mobile browsers resize the canvas asynchronously after a rotation, so
    // the loop is parked until the new viewport has settled.
    const onOrientationChange = () => {
      renderer.setAnimationLoop(null)
      setTimeout(() => {
        if (!session.halted()) syncLoop()
      }, ORIENTATION_SETTLE_MS)
    }
    window.addEventListener("orientationchange", onOrientationChange)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        syncLoop()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(mount)

    session.ready()

    return () => {
      session.end()
      guarded.detach()
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("orientationchange", onOrientationChange)
      mount.removeEventListener("mousemove", onMouseMove)
      mount.removeEventListener("mouseleave", onMouseLeave)
      geometry.dispose()
      material.dispose()
      simRead.dispose()
      simWrite.dispose()
      simQuad.dispose()
      simMaterial.dispose()
      scene.clear()
      renderer.dispose()
      if (mount.contains(canvas)) mount.removeChild(canvas)
      setTimeout(() => renderer.forceContextLoss(), CONTEXT_LOSS_DELAY_MS)
    }
    // Only the three props baked into the buffers rebuild the grid; the rest
    // are read off refs inside the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotsX, dotsY, spacing, gpuEpoch])

  useEffect(() => {
    if (!fallbackImage) return
    const image = new Image()
    image.src = fallbackImage
  }, [fallbackImage])

  const showFallback = !webglAvailable

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 60,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        ref={mountRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: showFallback ? 0 : 1,
        }}
      />
      {showFallback && fallbackImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fallbackImage}
          alt={fallbackAlt}
          draggable={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: fallbackFit,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ) : null}
    </div>
  )
}

/**
 * The texture behind every bento cell on the three product feature pages.
 * All of them mount it with exactly these props, inside a `position: absolute;
 * inset: 0` container, so a section can spread this straight on.
 *
 * 78x64 dots at 8px pitch is a 616x504 grid, wider and taller than any cell it
 * sits in, so the pattern always bleeds past the edges. The colours are barely
 * above the cell's own background: the grid is meant to be felt, not read.
 */
export const BENTO_DOT_GRID: DotGridFieldProps = {
  decay: 4,
  dotColor: "rgb(28, 25, 23)",
  dotSize: 2,
  dotsX: 78,
  dotsY: 64,
  fallbackAlt: "",
  fallbackFit: "cover",
  fallbackImage: GRID_FALLBACK_IMAGE,
  glowColor: "rgb(68, 64, 59)",
  spacing: 8,
}

export default DotGridField
