"use client"

import { useEffect, useRef } from "react"
import { MotionValue, useMotionValue, useSpring } from "motion/react"
import {
  AddEquation,
  BufferAttribute,
  BufferGeometry,
  CustomBlending,
  DataTexture,
  FloatType,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  Mesh,
  NearestFilter,
  OneFactor,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from "three"

import { createGuardedRenderer, useWebGLGuard } from "./guard"

const TIP_TEXTURE = "/img/img-065be4afe6.png"
const FALLBACK_IMAGE = "/img/img-71010125cd.png"

export interface Vec3Prop {
  x: number
  y: number
  z: number
}

export interface FilamentBurstProps {
  /**
   * Reveals filaments along their length, root to tip, from 0 (hidden) to 1
   * (fully revealed). Positions never move for this; only visibility changes.
   * Accepts a plain number or a MotionValue so a section can drive the reveal.
   */
  introProgress?: number | MotionValue<number>
  /** Thickness of each filament tube. Rebuilds the mesh when changed. */
  tubeRadius?: number
  /** Stacked quads per glowing tip. Rebuilds the mesh when changed. */
  tipLayers?: number
  /** Total number of filaments. Rebuilds the mesh when changed. */
  totalLines?: number
  /** Fraction generated as short lines rather than long ones. */
  shortLineRatio?: number
  shortSegments?: number
  longSegments?: number
  /** Lower bound of the random direction box. */
  minStart?: Vec3Prop
  /** Upper bound of the random direction box. */
  maxStart?: Vec3Prop
  shortLengthMin?: number
  shortLengthMax?: number
  longLengthMin?: number
  longLengthMax?: number
  /**
   * Accepted for API parity. Every animatable value except introProgress is
   * static here, so the spring settles on the prop immediately and the shader
   * sees the same number either way; nothing reads this. introProgress has
   * its own fixed { duration: 3000, bounce: 0 } spring, as in the reference.
   */
  springSettings?: { duration: number; bounce: number }
  tipRadius?: number
  noiseStrength?: number
  noiseScale?: number
  sizeVariance?: number
  dispersionOffset?: number
  dispersionBand?: number
  dispersion?: number
  /** Base opacity of filament tubes. */
  filamentOpacity?: number
  highlightRadius?: number
  highlightStrength?: number
  highlightSpeed?: number
  pulseStrength?: number
  pulseSpeedBase?: number
  pulseSpeedRandomMax?: number
  simRadius?: number
  simStrength?: number
  simSpring?: number
  simDamping?: number
  simMaxVelocity?: number
  tipTexture?: string
  fallbackImage?: string
  fallbackFit?: "cover" | "contain" | "fill"
  fallbackAlt?: string
  className?: string
  style?: React.CSSProperties
}

function loadTipTexture(
  loader: TextureLoader,
  url: string,
  onLoad: (texture: Texture) => void,
) {
  let loaded: Texture | null = null
  loader.load(url, (texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.minFilter = LinearMipmapLinearFilter
    texture.magFilter = LinearFilter
    loaded = texture
    onLoad(texture)
  })
  return () => {
    loaded?.dispose()
    loaded = null
  }
}

export function FilamentBurst({
  introProgress = 1.1,
  tubeRadius = 0.01,
  tipLayers = 6,
  totalLines = 1600,
  shortLineRatio = 0.9,
  shortSegments = 48,
  longSegments = 96,
  minStart = { x: -1, y: 0.6, z: 0 },
  maxStart = { x: 1, y: -0.6, z: 1 },
  shortLengthMin = 1.4,
  shortLengthMax = 4,
  longLengthMin = 3,
  longLengthMax = 8,
  tipRadius = 0.02,
  noiseStrength = 0.35,
  noiseScale = 0.73,
  sizeVariance = 0.5,
  dispersionOffset = 0.385,
  dispersionBand = 0.9,
  dispersion = 0.8,
  filamentOpacity = 0.25,
  highlightRadius = 2,
  highlightStrength = 2,
  highlightSpeed = 8,
  pulseStrength = 0.35,
  pulseSpeedBase = 0.03,
  pulseSpeedRandomMax = 0.1,
  simRadius = 2,
  simStrength = 15,
  simSpring = 45,
  simDamping = 6,
  simMaxVelocity = 14,
  tipTexture = TIP_TEXTURE,
  fallbackImage = FALLBACK_IMAGE,
  fallbackFit = "cover",
  fallbackAlt = "",
  className,
  style,
}: FilamentBurstProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const loaderRef = useRef(new TextureLoader())
  const tipTextureRef = useRef<Texture | null>(null)

  const { webglAvailable, gpuEpoch, beginSession } = useWebGLGuard("FilamentBurst")

  // The reveal is the one genuinely animated property: the reference feeds
  // the raw prop through a { duration: 3000, bounce: 0 } spring.
  const introSource = useMotionValue(
    typeof introProgress === "number" ? introProgress : introProgress.get(),
  )
  const introSpring = useSpring(introSource, { duration: 3000, bounce: 0 })

  useEffect(() => {
    if (typeof introProgress === "number") {
      introSource.set(introProgress)
      return
    }
    introSource.set(introProgress.get())
    return introProgress.on("change", (value) => introSource.set(value))
  }, [introProgress, introSource])

  // Every other animatable prop is static here, so the settled spring value
  // is the prop itself; a ref keeps the render loop reading the current one.
  const live = useRef({
    tipRadius,
    noiseStrength,
    noiseScale,
    sizeVariance,
    dispersionOffset,
    dispersionBand,
    dispersion,
    filamentOpacity,
    highlightRadius,
    highlightStrength,
    highlightSpeed,
    pulseStrength,
    pulseSpeedBase,
    pulseSpeedRandomMax,
    simRadius,
    simStrength,
    simSpring,
    simDamping,
    simMaxVelocity,
  })
  live.current = {
    tipRadius,
    noiseStrength,
    noiseScale,
    sizeVariance,
    dispersionOffset,
    dispersionBand,
    dispersion,
    filamentOpacity,
    highlightRadius,
    highlightStrength,
    highlightSpeed,
    pulseStrength,
    pulseSpeedBase,
    pulseSpeedRandomMax,
    simRadius,
    simStrength,
    simSpring,
    simDamping,
    simMaxVelocity,
  }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const session = beginSession()
    const OFFSCREEN = -9999

    const guarded = createGuardedRenderer(session, {
      params: { antialias: true, alpha: true, premultipliedAlpha: true },
      requirements: {
        vertexTextures: true,
        floatDataTextures: true,
        floatRenderTargets: true,
      },
    })
    if (!guarded) return

    const renderer = guarded.renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    const scene = new Scene()
    const camera = new PerspectiveCamera(
      34,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 16
    camera.position.y = 0
    camera.rotation.x = 0.01

    const config = {
      totalLines,
      shortLineRatio,
      shortSegments,
      longSegments,
      minStart: new Vector3(minStart.x, minStart.y, minStart.z),
      maxStart: new Vector3(maxStart.x, maxStart.y, maxStart.z),
      shortLengthMin,
      shortLengthMax,
      longLengthMin,
      longLengthMax,
    }

    const shortCount = Math.round(config.totalLines * config.shortLineRatio)
    const longCount = config.totalLines - shortCount
    const shortRings = config.shortSegments
    const longRings = config.longSegments

    const shortVerts = shortRings * 3 + 4 * tipLayers
    const longVerts = longRings * 3 + 4 * tipLayers
    const vertexCount = shortCount * shortVerts + longCount * longVerts

    const shortTubeIndices = (shortRings - 1) * 3 * 2 * 3
    const longTubeIndices = (longRings - 1) * 3 * 2 * 3
    const tipIndices = 6 * tipLayers
    const indexCount =
      shortCount * (shortTubeIndices + tipIndices) +
      longCount * (longTubeIndices + tipIndices)

    const shortCells = shortRings + tipLayers
    const longCells = longRings + tipLayers
    const totalCells = shortCount * shortCells + longCount * longCells

    const texSize = Math.ceil(Math.sqrt(totalCells))
    const simHeight = texSize * 2
    const dataHeight = texSize * 2

    if (
      !guarded.require({
        maxTextureSize: Math.max(texSize, simHeight, dataHeight),
      })
    ) {
      return
    }

    const atlasPos = new Vector4(1, 0.5, 0, 0)
    const atlasVel = new Vector4(1, 0.5, 0, 0.5)
    const dataTarget = new Vector4(1, 0.5, 0, 0)
    const dataHighlightRef = new Vector4(1, 0.5, 0, 0.5)

    function cellUv(index: number): [number, number] {
      return [
        ((index % texSize) + 0.5) / texSize,
        (Math.floor(index / texSize) + 0.5) / texSize,
      ]
    }

    const aPosition = new Float32Array(vertexCount * 3)
    const aDir = new Float32Array(vertexCount * 3)
    const aSide = new Uint8Array(vertexCount)
    const aRandom = new Float32Array(vertexCount * 2)
    const aUV = new Float32Array(vertexCount * 3)
    const aTip = new Uint8Array(vertexCount)
    const aLong = new Uint8Array(vertexCount)
    const aSimCell = new Float32Array(vertexCount * 2)
    const indices = new Uint32Array(indexCount)
    const data = new Float32Array(texSize * dataHeight * 4)
    const sectionSize = texSize * texSize

    const dir = new Vector3()
    const start = new Vector3()
    const end = new Vector3()
    const ringPos = new Vector3()
    const tipCorners = [0, 0, 1, 0, 0, 1, 1, 1]

    let vertexCursor = 0
    let indexCursor = 0
    let cellCursor = 0

    function buildLine(segments: number, isLong: boolean) {
      const lengthT = Math.random()
      const randomA = Math.random()
      const randomB = Math.random()
      const vertexBase = vertexCursor
      const cellBase = cellCursor

      dir
        .set(
          MathUtils.lerp(config.minStart.x, config.maxStart.x, Math.random()),
          MathUtils.lerp(config.minStart.y, config.maxStart.y, Math.random()),
          MathUtils.lerp(config.minStart.z, config.maxStart.z, Math.random()),
        )
        .normalize()

      const startRadius = MathUtils.lerp(0.3, 0.9, lengthT)
      start.copy(dir).multiplyScalar(startRadius)

      const length = isLong
        ? MathUtils.lerp(config.longLengthMin, config.longLengthMax, lengthT)
        : MathUtils.lerp(config.shortLengthMin, config.shortLengthMax, lengthT)
      const step = length / (segments - 1)
      end.copy(start).addScaledVector(dir, length)

      for (let ring = 0; ring < segments; ring++) {
        const factor = ring / (segments - 1)
        ringPos.copy(start).addScaledVector(dir, ring * step)
        const cell = cellBase + ring
        const [cu, cv] = cellUv(cell)

        data[(0 + cell) * 4] = ringPos.x
        data[(0 + cell) * 4 + 1] = ringPos.y
        data[(0 + cell) * 4 + 2] = ringPos.z
        data[(0 + cell) * 4 + 3] = 0
        data[(sectionSize + cell) * 4] = end.x
        data[(sectionSize + cell) * 4 + 1] = end.y
        data[(sectionSize + cell) * 4 + 2] = end.z
        data[(sectionSize + cell) * 4 + 3] = 0

        for (let side = 0; side < 3; side++) {
          const i3 = vertexCursor * 3
          const i2 = vertexCursor * 2
          aPosition[i3] = ringPos.x
          aPosition[i3 + 1] = ringPos.y
          aPosition[i3 + 2] = ringPos.z
          aDir[i3] = dir.x
          aDir[i3 + 1] = dir.y
          aDir[i3 + 2] = dir.z
          aSide[vertexCursor] = side
          aRandom[i2] = randomA
          aRandom[i2 + 1] = randomB
          aUV[i3] = factor
          aUV[i3 + 1] = side / 3
          aUV[i3 + 2] = 0
          aLong[vertexCursor] = isLong ? 1 : 0
          aSimCell[i2] = cu
          aSimCell[i2 + 1] = cv
          vertexCursor++
        }

        if (ring < segments - 1) {
          for (let side = 0; side < 3; side++) {
            const a = vertexBase + ring * 3 + side
            const b = vertexBase + ring * 3 + ((side + 1) % 3)
            const c = vertexBase + (ring + 1) * 3 + side
            const d = vertexBase + (ring + 1) * 3 + ((side + 1) % 3)
            indices[indexCursor++] = a
            indices[indexCursor++] = c
            indices[indexCursor++] = b
            indices[indexCursor++] = c
            indices[indexCursor++] = d
            indices[indexCursor++] = b
          }
        }
      }

      for (let layer = 0; layer < tipLayers; layer++) {
        const depth = tipLayers > 1 ? layer / (tipLayers - 1) : 0
        const quadBase = vertexBase + segments * 3 + layer * 4
        const cell = cellBase + segments + layer
        const [cu, cv] = cellUv(cell)

        data[(0 + cell) * 4] = end.x
        data[(0 + cell) * 4 + 1] = end.y
        data[(0 + cell) * 4 + 2] = end.z
        data[(0 + cell) * 4 + 3] = 0
        data[(sectionSize + cell) * 4] = end.x
        data[(sectionSize + cell) * 4 + 1] = end.y
        data[(sectionSize + cell) * 4 + 2] = end.z
        data[(sectionSize + cell) * 4 + 3] = 0

        for (let corner = 0; corner < 4; corner++) {
          const i3 = vertexCursor * 3
          const i2 = vertexCursor * 2
          aPosition[i3] = end.x
          aPosition[i3 + 1] = end.y
          aPosition[i3 + 2] = end.z
          aDir[i3] = dir.x
          aDir[i3 + 1] = dir.y
          aDir[i3 + 2] = dir.z
          aSide[vertexCursor] = 0
          aRandom[i2] = randomA
          aRandom[i2 + 1] = randomB
          aUV[i3] = tipCorners[corner * 2]
          aUV[i3 + 1] = tipCorners[corner * 2 + 1]
          aUV[i3 + 2] = depth
          aLong[vertexCursor] = isLong ? 1 : 0
          aTip[vertexCursor] = 1
          aSimCell[i2] = cu
          aSimCell[i2 + 1] = cv
          vertexCursor++
        }

        indices[indexCursor++] = quadBase + 0
        indices[indexCursor++] = quadBase + 2
        indices[indexCursor++] = quadBase + 1
        indices[indexCursor++] = quadBase + 2
        indices[indexCursor++] = quadBase + 3
        indices[indexCursor++] = quadBase + 1
      }

      cellCursor += segments + tipLayers
    }

    for (let i = 0; i < shortCount; i++) buildLine(shortRings, false)
    for (let i = 0; i < longCount; i++) buildLine(longRings, true)

    const dataTexture = new DataTexture(
      data,
      texSize,
      dataHeight,
      RGBAFormat,
      FloatType,
    )
    dataTexture.minFilter = NearestFilter
    dataTexture.magFilter = NearestFilter
    dataTexture.needsUpdate = true

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(aPosition, 3))
    geometry.setAttribute("aDir", new BufferAttribute(aDir, 3))
    geometry.setAttribute("aSide", new BufferAttribute(aSide, 1, false))
    geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 2))
    geometry.setAttribute("aUV", new BufferAttribute(aUV, 3))
    geometry.setAttribute("aTip", new BufferAttribute(aTip, 1, false))
    geometry.setAttribute("aLong", new BufferAttribute(aLong, 1, false))
    geometry.setAttribute("aSimCell", new BufferAttribute(aSimCell, 2))
    geometry.setIndex(new BufferAttribute(indices, 1))

    let simCurrent = new WebGLRenderTarget(texSize, simHeight, {
      type: HalfFloatType,
      format: RGBAFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
    })
    let simNext = simCurrent.clone()

    const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quadGeometry = new PlaneGeometry(2, 2)

    const seedMaterial = new ShaderMaterial({
      uniforms: {
        tData: { value: dataTexture },
        uAtlasPos: { value: atlasPos.clone() },
        uAtlasVel: { value: atlasVel.clone() },
        uDataTarget: { value: dataTarget.clone() },
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform sampler2D tData;
                uniform vec4 uAtlasPos;
                uniform vec4 uAtlasVel;
                uniform vec4 uDataTarget;
                varying vec2 vUv;

                vec2 atlasUV(vec2 cellUv, vec4 region) {
                    return cellUv * region.xy + region.zw;
                }
                vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) {
                    return (atlasUv - region.zw) / region.xy;
                }

                void main() {
                    bool isVelocity = vUv.y >= uAtlasVel.w;
                    if (isVelocity) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        return;
                    }
                    vec2 cellUv = cellUVfromAtlas(vUv, uAtlasPos);
                    vec3 restPos = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
                    gl_FragColor = vec4(restPos, 1.0);
                }
            `,
    })

    const seedScene = new Scene()
    seedScene.add(new Mesh(quadGeometry, seedMaterial))
    renderer.setRenderTarget(simCurrent)
    renderer.render(seedScene, quadCamera)
    renderer.setRenderTarget(simNext)
    renderer.render(seedScene, quadCamera)
    renderer.setRenderTarget(null)
    seedScene.clear()
    seedMaterial.dispose()

    const simScene = new Scene()
    const simMaterial = new ShaderMaterial({
      uniforms: {
        tPrev: { value: simCurrent.texture },
        tData: { value: dataTexture },
        uMouse: { value: new Vector2(OFFSCREEN, OFFSCREEN) },
        uDelta: { value: 0 },
        uRadius: { value: live.current.simRadius },
        uStrength: { value: live.current.simStrength },
        uSpring: { value: live.current.simSpring },
        uDamping: { value: live.current.simDamping },
        uMaxVelocity: { value: live.current.simMaxVelocity },
        uHighlightRadius: { value: live.current.highlightRadius },
        uHighlightSpeed: { value: live.current.highlightSpeed },
        uAtlasPos: { value: atlasPos.clone() },
        uAtlasVel: { value: atlasVel.clone() },
        uDataTarget: { value: dataTarget.clone() },
        uDataHighlightRef: { value: dataHighlightRef.clone() },
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform sampler2D tPrev;
                uniform sampler2D tData;
                uniform vec2  uMouse;
                uniform float uDelta;
                uniform float uRadius;
                uniform float uStrength;
                uniform float uSpring;
                uniform float uDamping;
                uniform float uMaxVelocity;
                uniform float uHighlightRadius;
                uniform float uHighlightSpeed;
                uniform vec4  uAtlasPos;
                uniform vec4  uAtlasVel;
                uniform vec4  uDataTarget;
                uniform vec4  uDataHighlightRef;

                // Squared-magnitude ceiling for sanity checks. The render
                // targets are half-float, which saturates at 65504 — well
                // below this — and the whole scene lives within a few dozen
                // world units of the origin.
                const float SANE_SQ = 1.0e8;

                // Largest explicit-Euler spring impulse per step. Beyond
                // about 2.0 the integrator overshoots and diverges. At 60fps
                // with the default uSpring this never clamps; it only engages
                // on long frames or extreme stiffness.
                const float MAX_SPRING_STEP = 2.0;

                varying vec2 vUv;

                vec2 atlasUV(vec2 cellUv, vec4 region) {
                    return cellUv * region.xy + region.zw;
                }

                vec2 cellUVfromAtlas(vec2 atlasUv, vec4 region) {
                    return (atlasUv - region.zw) / region.xy;
                }

                void main() {
                    bool isVelocity = vUv.y >= uAtlasVel.w;

                    vec2 cellUv = isVelocity
                        ? cellUVfromAtlas(vUv, uAtlasVel)
                        : cellUVfromAtlas(vUv, uAtlasPos);

                    vec3 pos = texture2D(tPrev, atlasUV(cellUv, uAtlasPos)).rgb;

                    vec4 velData    = texture2D(tPrev, atlasUV(cellUv, uAtlasVel));
                    vec3 vel        = velData.rgb;
                    float highlight = velData.a;

                    vec3 targetPos    = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
                    vec3 highlightRef = texture2D(tData, atlasUV(cellUv, uDataHighlightRef)).rgb;

                    // --- Sanitize incoming state ---
                    // A single NaN or Inf entering a ping-pong buffer never
                    // leaves it: the next frame reads it back, propagates it,
                    // and every subsequent frame is poisoned. Under additive
                    // blending with depth testing off, that reads on screen as
                    // a solid white canvas with no error and no context loss.
                    // The NOT-less-than form below is NaN-safe: it is true for
                    // NaN, where a greater-than test would be false.
                    if (!(dot(pos, pos) < SANE_SQ)) {
                        pos = targetPos;
                        vel = vec3(0.0);
                    }
                    if (!(dot(vel, vel) < SANE_SQ)) vel = vec3(0.0);
                    if (!(highlight >= 0.0)) highlight = 0.0;

                    // --- Repulsion physics — mouse pushes the live position around ---
                    vec2 toCell   = pos.xy - uMouse;
                    float dist    = length(toCell);
                    float repulse = 1.0 - smoothstep(0.0, uRadius, dist);
                    vec2 repelDir = dist > 0.0001 ? toCell / dist : vec2(0.0, 1.0);
                    vel.xy       += repelDir * repulse * uStrength * uDelta;

                    float speed = length(vel);
                    if (speed > uMaxVelocity) vel = vel / speed * uMaxVelocity;

                    // --- Spring always pulling the live position back to rest ---
                    // The impulse is clamped so a long frame, or a very stiff
                    // uSpring, cannot overshoot into exponential divergence.
                    vel -= (pos - targetPos) * min(uSpring * uDelta, MAX_SPRING_STEP);

                    // Exponential damping. The naive form
                    // (1.0 - uDamping * uDelta) goes negative once
                    // uDamping * uDelta exceeds 1 — reachable at the top of
                    // the Sim Damping range on a slow frame — which flips the
                    // velocity sign and amplifies it every step until it
                    // overflows to Inf and then NaN. exp(-x) matches it to
                    // first order and is stable for all inputs.
                    vel *= exp(-uDamping * uDelta);

                    pos += vel * uDelta;

                    // --- Highlight — distance from mouse to the nordwell's tip ---
                    float tipDist = length(uMouse - highlightRef.xy);
                    float target  = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);
                    highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
                    highlight = clamp(highlight, 0.0, 1.0);

                    gl_FragColor = isVelocity
                        ? vec4(vel, highlight)
                        : vec4(pos, 1.0);
                }
            `,
    })
    simScene.add(new Mesh(quadGeometry, simMaterial))

    const drawMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntroProgress: { value: introSpring.get() },
        uNoiseStrength: { value: live.current.noiseStrength },
        uNoiseScale: { value: live.current.noiseScale },
        uTubeRadius: { value: tubeRadius },
        uTipRadius: { value: live.current.tipRadius },
        uTipTexture: { value: tipTextureRef.current },
        uTipLayers: { value: tipLayers },
        uSizeVariance: { value: live.current.sizeVariance },
        uDispersionOffset: { value: live.current.dispersionOffset },
        uDispersionBand: { value: live.current.dispersionBand },
        uDispersion: { value: live.current.dispersion },
        uFilamentOpacity: { value: live.current.filamentOpacity },
        uHighlightStrength: { value: live.current.highlightStrength },
        uPulseStrength: { value: live.current.pulseStrength },
        uPulseSpeedBase: { value: live.current.pulseSpeedBase },
        uPulseSpeedRandomMax: { value: live.current.pulseSpeedRandomMax },
        tSim: { value: simCurrent.texture },
        uAtlasPos: { value: atlasPos.clone() },
        uAtlasVel: { value: atlasVel.clone() },
      },
      vertexShader: `
#define OCTAVES 1

vec3 rand(in vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
}

vec3 quintic(const in vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin(in vec3 xyz) {
    vec3 gridUV = fract(xyz);
    vec3 gridID = floor(xyz);
    vec3 c000=vec3(0,0,0); vec3 c100=vec3(1,0,0);
    vec3 c010=vec3(0,1,0); vec3 c110=vec3(1,1,0);
    vec3 c001=vec3(0,0,1); vec3 c101=vec3(1,0,1);
    vec3 c011=vec3(0,1,1); vec3 c111=vec3(1,1,1);
    float r000=dot(gridUV-c000,rand(gridID+c000)); float r100=dot(gridUV-c100,rand(gridID+c100));
    float r010=dot(gridUV-c010,rand(gridID+c010)); float r110=dot(gridUV-c110,rand(gridID+c110));
    float r001=dot(gridUV-c001,rand(gridID+c001)); float r101=dot(gridUV-c101,rand(gridID+c101));
    float r011=dot(gridUV-c011,rand(gridID+c011)); float r111=dot(gridUV-c111,rand(gridID+c111));
    vec3 f=quintic(gridUV);
    float x0=mix(r000,r100,f.x); float x1=mix(r010,r110,f.x);
    float x2=mix(r001,r101,f.x); float x3=mix(r011,r111,f.x);
    float y0=mix(x0,x1,f.y); float y1=mix(x2,x3,f.y);
    return mix(y0,y1,f.z)*2.0;
}

float fractalBrownian(const in vec3 xyz, const in float ampWeight) {
    float result=0.0; float amp=1.0; float freq=1.0; float maxAmp=0.0;
    for(int i=0;i<OCTAVES;i++){
        result+=amp*perlin(xyz*freq); maxAmp+=amp; amp*=ampWeight; freq*=2.0;
    }
    return result/maxAmp;
}

attribute vec3  aDir;
attribute float aSide;
attribute vec2  aRandom;
attribute vec3  aUV;
attribute float aTip;
attribute float aLong;
attribute vec2  aSimCell;

uniform float uTime;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uTubeRadius;
uniform float uTipRadius;
uniform float uSizeVariance;
uniform float uDispersionOffset;
uniform sampler2D tSim;
uniform vec4  uAtlasPos;
uniform vec4  uAtlasVel;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;

vec2 atlasUV(vec2 cellUv, vec4 region) {
    return cellUv * region.xy + region.zw;
}

void main() {
    vRandom = aRandom;
    vUV     = aUV;
    vTip    = aTip;

    vec3 worldPos = texture2D(tSim, atlasUV(aSimCell, uAtlasPos)).rgb;
    vHighlight = texture2D(tSim, atlasUV(aSimCell, uAtlasVel)).a;

    // Second line of defence against a poisoned sim buffer. The sim shader
    // self-heals, but a bad value would still be visible for the one frame
    // before it does — and a non-finite gl_Position produces undefined,
    // often screen-filling, geometry. Collapse the vertex instead.
    if (!(dot(worldPos, worldPos) < 1.0e8)) {
        gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
        vHighlight = 0.0;
        return;
    }
    if (!(vHighlight >= 0.0)) vHighlight = 0.0;

    // A nordwell's own "factor" along its length: 0 at the root, 1 at the
    // tip. Tip billboard vertices don't carry a meaningful aUV.x (that
    // slot holds the billboard-local UV instead), so they're treated as
    // sitting at factor 1, same as the last tube ring.
    float nordwellFactor = aTip > 0.5 ? 1.0 : aUV.x;

    // Noise coordinate drifts along the nordwell's own direction over time,
    // at a per-nordwell random rate, plus a shared per-nordwell random offset.
    float lineOffset = aRandom.x * 1.8 + uTime * 0.03;
    vec3  coords      = worldPos + vec3(lineOffset);
    float animFactor  = -0.3;
    coords -= aDir * animFactor * uTime * aRandom.x;
    coords *= uNoiseScale;

    float dx = fractalBrownian(coords, 0.5);
    float dy = fractalBrownian(coords + vec3(3.963, 1.053, 5.263), 0.5);

    float dispScale    = aLong > 0.5 ? 0.910 : 0.830;
    vec3  noiseDisp    = vec3(dx, dy, dx * dy) * dispScale * uNoiseStrength * nordwellFactor;
    vec3  displacedPos = worldPos + noiseDisp;

    if (aTip > 0.5) {
        vec4 centerView = modelViewMatrix * vec4(displacedPos, 1.0);
        float sv  = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
        float ox  = (aUV.x - 0.5) * 2.0 * uTipRadius * sv;
        float oy  = (aUV.y - 0.5) * -2.0 * uTipRadius * sv;
        centerView.xy += vec2(ox, oy);
        float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
        centerView.z += aUV.z * uDispersionOffset * cycle;
        gl_Position = projectionMatrix * centerView;
    } else {
        float angle     = aSide * (2.0 * 3.14159265359 / 3.0);
        vec3 tangent    = aDir;
        vec3 worldUp    = abs(tangent.y) < 0.99 ? vec3(0,1,0) : vec3(1,0,0);
        vec3 right      = normalize(cross(tangent, worldUp));
        vec3 up         = normalize(cross(right, tangent));
        vec3 radial     = cos(angle) * right + sin(angle) * up;
        vec3 extruded   = displacedPos + radial * uTubeRadius;
        gl_Position     = projectionMatrix * modelViewMatrix * vec4(extruded, 1.0);
    }
}
`,
      fragmentShader: `
uniform float uTime;
uniform float uTipLayers;
uniform float uDispersionBand;
uniform float uDispersion;
uniform float uFilamentOpacity;
uniform float uHighlightStrength;
uniform float uPulseStrength;
uniform float uPulseSpeedBase;
uniform float uPulseSpeedRandomMax;
uniform float uIntroProgress;
uniform sampler2D uTipTexture;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;

void main() {
    vec3 color = vec3(0.0);

    // Reveal the nordwell along its own length as Intro Progress increases,
    // root first: each point becomes visible once 2x progress passes its
    // own factor-plus-random threshold, so different filaments (and different
    // points along the same nordwell) cross over at slightly different times.
    float reveal = uIntroProgress * 2.0 > (vUV.x + vRandom.x) ? 1.0 : 0.0;

    float pulseSpeed = uPulseSpeedBase + vRandom.x * uPulseSpeedRandomMax;
    float pulsePos   = fract(uTime * pulseSpeed);
    float pulseDist  = abs(vUV.x * 0.2 + pulsePos);
    pulseDist        = min(pulseDist, 1.0 - pulseDist);
    float pulse      = exp(-pulseDist * pulseDist * mix(5000.0, 10000.0, vRandom.y)) * vUV.x * uPulseStrength;

if (vTip > 0.5) {
        vec2 centered = vUV.xy - vec2(0.5);
        if (length(centered) > 0.5) discard;
        float uvMin = 0.5 - uDispersionBand * 0.5;
        float uvMax = 0.5 + uDispersionBand * 0.5;
        float texU  = mix(uvMin, uvMax, vUV.z);
        float texV  = uDispersion * vRandom.x;
        color = texture2D(uTipTexture, vec2(texU, texV)).xyz;

        float a = clamp((vRandom.y / uTipLayers) * clamp(uIntroProgress, 0.0, 1.0), 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    } else {
        vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0 * 1.0, uDispersion)).xyz;
        color = vec3(uFilamentOpacity);
        color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
        color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;

        float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1
                         + vHighlight * vUV.x * vUV.x) * reveal, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    }
}
`,
      transparent: true,
      depthTest: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendEquationAlpha: AddEquation,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneFactor,
    })
    materialRef.current = drawMaterial

    const mesh = new Mesh(geometry, drawMaterial)
    scene.add(mesh)
    mesh.updateWorldMatrix(true, false)
    const meshInverse = mesh.matrixWorld.clone().invert()

    let isPageVisible = document.visibilityState === "visible"
    let isIntersecting = false
    const syncLoop = () => {
      if (session.halted()) {
        renderer.setAnimationLoop(null)
        return
      }
      if (isPageVisible && isIntersecting) renderer.setAnimationLoop(frame)
      else renderer.setAnimationLoop(null)
    }
    const onVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible"
      syncLoop()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    const pointer = new Vector2(OFFSCREEN, OFFSCREEN)
    const ndc = new Vector3()
    const camOrigin = new Vector3()
    const rayDir = new Vector3()
    const camForward = new Vector3()
    const hit = new Vector3()

    const onMouseMove = (event: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      pointer.set(event.clientX - rect.left, event.clientY - rect.top)
    }
    const onMouseLeave = () => {
      pointer.set(OFFSCREEN, OFFSCREEN)
    }
    mount.addEventListener("mousemove", onMouseMove)
    mount.addEventListener("mouseleave", onMouseLeave)

    let lastTime = 0
    let elapsed = 0

    function frame(now: number) {
      if (session.shouldStop()) return
      const time = now * 0.001
      const delta = Math.min(time - lastTime, 0.1)
      lastTime = time
      elapsed += delta

      camera.updateWorldMatrix(true, false)

      const width = mount!.clientWidth
      const height = mount!.clientHeight

      if (pointer.x <= OFFSCREEN) {
        simMaterial.uniforms.uMouse.value.set(OFFSCREEN, OFFSCREEN)
      } else {
        const nx = (pointer.x / width) * 2 - 1
        const ny = -((pointer.y / height) * 2 - 1)
        ndc
          .set(nx, ny, 0.5)
          .applyMatrix4(camera.projectionMatrixInverse)
          .applyMatrix4(camera.matrixWorld)
        camOrigin.setFromMatrixPosition(camera.matrixWorld)
        rayDir.copy(ndc).sub(camOrigin).normalize()
        camera.getWorldDirection(camForward)
        const t = -camForward.dot(camOrigin) / camForward.dot(rayDir)
        hit.copy(camOrigin).addScaledVector(rayDir, t).applyMatrix4(meshInverse)
        simMaterial.uniforms.uMouse.value.set(hit.x, hit.y)
      }

      simMaterial.uniforms.tPrev.value = simCurrent.texture
      simMaterial.uniforms.uDelta.value = delta
      simMaterial.uniforms.uRadius.value = live.current.simRadius
      simMaterial.uniforms.uStrength.value = live.current.simStrength
      simMaterial.uniforms.uSpring.value = live.current.simSpring
      simMaterial.uniforms.uDamping.value = live.current.simDamping
      simMaterial.uniforms.uMaxVelocity.value = live.current.simMaxVelocity
      simMaterial.uniforms.uHighlightRadius.value = live.current.highlightRadius
      simMaterial.uniforms.uHighlightSpeed.value = live.current.highlightSpeed

      renderer.setRenderTarget(simNext)
      renderer.render(simScene, quadCamera)
      renderer.setRenderTarget(null)

      const swap = simCurrent
      simCurrent = simNext
      simNext = swap

      drawMaterial.uniforms.tSim.value = simCurrent.texture
      drawMaterial.uniforms.uTime.value = elapsed
      drawMaterial.uniforms.uIntroProgress.value = introSpring.get()
      drawMaterial.uniforms.uNoiseStrength.value = live.current.noiseStrength
      drawMaterial.uniforms.uNoiseScale.value = live.current.noiseScale
      drawMaterial.uniforms.uTipRadius.value = live.current.tipRadius
      drawMaterial.uniforms.uSizeVariance.value = live.current.sizeVariance
      drawMaterial.uniforms.uDispersionOffset.value =
        live.current.dispersionOffset
      drawMaterial.uniforms.uDispersionBand.value = live.current.dispersionBand
      drawMaterial.uniforms.uDispersion.value = live.current.dispersion
      drawMaterial.uniforms.uFilamentOpacity.value =
        live.current.filamentOpacity
      drawMaterial.uniforms.uHighlightStrength.value =
        live.current.highlightStrength
      drawMaterial.uniforms.uPulseStrength.value = live.current.pulseStrength
      drawMaterial.uniforms.uPulseSpeedBase.value = live.current.pulseSpeedBase
      drawMaterial.uniforms.uPulseSpeedRandomMax.value =
        live.current.pulseSpeedRandomMax

      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    })
    resizeObserver.observe(mount)

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
      mount.removeEventListener("mousemove", onMouseMove)
      mount.removeEventListener("mouseleave", onMouseLeave)
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      materialRef.current = null
      document.removeEventListener("visibilitychange", onVisibilityChange)
      scene.clear()
      geometry.dispose()
      drawMaterial.dispose()
      dataTexture.dispose()
      simCurrent.dispose()
      simNext.dispose()
      quadGeometry.dispose()
      simMaterial.dispose()
      renderer.dispose()
      if (mount.contains(canvas)) mount.removeChild(canvas)
      setTimeout(() => renderer.forceContextLoss(), 1)
    }
  }, [
    beginSession,
    introSpring,
    tubeRadius,
    tipLayers,
    totalLines,
    shortLineRatio,
    shortSegments,
    longSegments,
    minStart.x,
    minStart.y,
    minStart.z,
    maxStart.x,
    maxStart.y,
    maxStart.z,
    shortLengthMin,
    shortLengthMax,
    longLengthMin,
    longLengthMax,
    gpuEpoch,
  ])

  useEffect(() => {
    if (!tipTexture) {
      tipTextureRef.current?.dispose()
      tipTextureRef.current = null
      if (materialRef.current) {
        materialRef.current.uniforms.uTipTexture.value = null
      }
      return
    }
    return loadTipTexture(loaderRef.current, tipTexture, (texture) => {
      tipTextureRef.current?.dispose()
      tipTextureRef.current = texture
      if (materialRef.current) {
        materialRef.current.uniforms.uTipTexture.value = texture
      }
    })
  }, [tipTexture])

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

export default FilamentBurst
