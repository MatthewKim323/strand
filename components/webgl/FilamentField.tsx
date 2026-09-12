"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
  Mesh,
  NearestFilter,
  Object3D,
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
import { HERO_POINTS } from "./hero-points"

const DEG2RAD = Math.PI / 180

const TIP_TEXTURE = "/img/img-065be4afe6.png"
const FALLBACK_IMAGE = "/img/img-ab61be9c2a.png"

export interface Vec3Prop {
  x: number
  y: number
  z: number
}

export interface FilamentFieldProps {
  /** Comma-separated x,y point pairs defining filament root positions. */
  points?: string
  /** Fraction of points kept when building filaments (lower = fewer). */
  threshold?: number
  /** Overall size multiplier for filament positions. */
  scale?: number
  /** How much filament tips shrink/grow toward the extrude offset. */
  extrudeScale?: number
  /** Direction and distance filaments extrude toward, and the shared launch point. */
  extrudeOffset?: Vec3Prop
  /** Per-filament random seed offset used to vary noise. */
  randomOffset?: Vec3Prop
  /** Number of segments (rings) per filament tube. */
  steps?: number
  /** Thickness of each filament tube. */
  tubeRadius?: number
  /** Number of stacked quads used to build each filament tip. */
  tipLayers?: number
  /** Size of the glowing tip quad at each filament's root. */
  tipRadius?: number
  /**
   * Accepted for API parity. Every animatable value here is static, so the
   * spring settles on the prop immediately and the shader sees the same
   * number either way; nothing reads this.
   */
  springSettings?: { duration: number; bounce: number }
  noiseStrength?: number
  noiseScale?: number
  cameraFov?: number
  cameraPosition?: Vec3Prop
  cameraRotationX?: number
  cameraRotationY?: number
  sizeVariance?: number
  dispersionOffset?: number
  dispersionBand?: number
  dispersion?: number
  simRadius?: number
  simStrength?: number
  simSpring?: number
  simDamping?: number
  simMaxVelocity?: number
  opacitySpeed?: number
  maxDelay?: number
  highlightRadius?: number
  highlightStrength?: number
  highlightSpeed?: number
  /** Base opacity of filament tubes. */
  filamentOpacity?: number
  pulseStrength?: number
  pulseSpeedBase?: number
  pulseSpeedRandomMax?: number
  tipTexture?: string
  fallbackImage?: string
  fallbackFit?: "cover" | "contain" | "fill"
  fallbackAlt?: string
  /** Values swapped in below the phone breakpoint. */
  phoneOverrides?: { filamentOpacity?: number; tipRadius?: number }
  className?: string
  style?: React.CSSProperties
}

/** Splits the point string and thins it by `threshold`. */
function parsePoints(source: string, threshold = 1) {
  if (!source || !source.trim()) return { positions: null, numFilaments: 0 }
  const values = source.split(",").map(Number)
  if (
    values.length < 2 ||
    values.length % 2 !== 0 ||
    values.some((value) => isNaN(value))
  ) {
    return { positions: null, numFilaments: 0 }
  }
  const positions: number[] = []
  for (let i = 0; i < values.length / 2; i++) {
    if (Math.random() > threshold) continue
    positions.push(values[i * 2], values[i * 2 + 1], 0)
  }
  if (positions.length === 0) return { positions: null, numFilaments: 0 }
  return { positions, numFilaments: positions.length / 3 }
}

/** Ramps the noise advection from the root out toward the extruded end. */
function noiseCurve(t: number) {
  return t * t * (3 - 2 * t) + 0.05
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

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [query])
  return matches
}

export function FilamentField({
  points = HERO_POINTS,
  threshold = 0.4,
  scale = 1,
  extrudeScale = 0.95,
  extrudeOffset = { x: 0, y: 0.1, z: 0.4 },
  randomOffset = { x: 0.4, y: 0.2, z: 0.2 },
  steps = 32,
  tubeRadius = 0.0012,
  tipLayers = 8,
  tipRadius = 0.0035,
  noiseStrength = 0.15,
  noiseScale = 5,
  cameraFov = 36,
  cameraPosition = { x: 0, y: 0, z: 1.8 },
  cameraRotationX = 2,
  cameraRotationY = 0,
  sizeVariance = 0.49,
  dispersionOffset = 0.05,
  dispersionBand = 0.9,
  dispersion = 0.8,
  simRadius = 0.15,
  simStrength = 8,
  simSpring = 60,
  simDamping = 6,
  simMaxVelocity = 5,
  opacitySpeed = 2,
  maxDelay = 1,
  highlightRadius = 0.3,
  highlightStrength = 2,
  highlightSpeed = 10,
  filamentOpacity = 0.2,
  pulseStrength = 1,
  pulseSpeedBase = 0.1,
  pulseSpeedRandomMax = 0.1,
  tipTexture = TIP_TEXTURE,
  fallbackImage = FALLBACK_IMAGE,
  fallbackFit = "cover",
  fallbackAlt = "",
  phoneOverrides = { filamentOpacity: 0.26, tipRadius: 0.004 },
  className,
  style,
}: FilamentFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const loaderRef = useRef(new TextureLoader())
  const tipTextureRef = useRef<Texture | null>(null)

  const { webglAvailable, gpuEpoch, beginSession } = useWebGLGuard("FilamentField")

  const { positions, numFilaments } = useMemo(
    () => parsePoints(points, threshold),
    [points, threshold],
  )

  const isPhone = useMediaQuery("(max-width: 809.98px)")
  const activeFilamentOpacity =
    isPhone && phoneOverrides?.filamentOpacity !== undefined
      ? phoneOverrides.filamentOpacity
      : filamentOpacity
  const activeTipRadius =
    isPhone && phoneOverrides?.tipRadius !== undefined
      ? phoneOverrides.tipRadius
      : tipRadius

  // The reference wraps every animatable prop in a spring so the design
  // canvas can scrub it live. Ours are static, so the settled value is the
  // prop itself; a ref keeps the render loop reading the current one.
  const live = useRef({
    tipRadius: activeTipRadius,
    noiseStrength,
    noiseScale,
    cameraFov,
    cameraX: cameraPosition.x,
    cameraY: cameraPosition.y,
    cameraZ: cameraPosition.z,
    cameraRotationX,
    cameraRotationY,
    sizeVariance,
    dispersionOffset,
    dispersionBand,
    dispersion,
    simRadius,
    simStrength,
    simSpring,
    simDamping,
    simMaxVelocity,
    opacitySpeed,
    maxDelay,
    highlightRadius,
    highlightStrength,
    highlightSpeed,
    filamentOpacity: activeFilamentOpacity,
    pulseStrength,
    pulseSpeedBase,
    pulseSpeedRandomMax,
  })
  live.current = {
    tipRadius: activeTipRadius,
    noiseStrength,
    noiseScale,
    cameraFov,
    cameraX: cameraPosition.x,
    cameraY: cameraPosition.y,
    cameraZ: cameraPosition.z,
    cameraRotationX,
    cameraRotationY,
    sizeVariance,
    dispersionOffset,
    dispersionBand,
    dispersion,
    simRadius,
    simStrength,
    simSpring,
    simDamping,
    simMaxVelocity,
    opacitySpeed,
    maxDelay,
    highlightRadius,
    highlightStrength,
    highlightSpeed,
    filamentOpacity: activeFilamentOpacity,
    pulseStrength,
    pulseSpeedBase,
    pulseSpeedRandomMax,
  }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !positions) return

    const session = beginSession()

    const ringCount = steps + 1
    const cellsPerFilament = ringCount + tipLayers
    const totalCells = numFilaments * cellsPerFilament
    const texSize = Math.ceil(Math.sqrt(totalCells))
    const simHeight = texSize * 2
    const dataHeight = texSize * 3

    const guarded = createGuardedRenderer(session, {
      params: { antialias: true, alpha: true },
      requirements: {
        vertexTextures: true,
        floatDataTextures: true,
        floatRenderTargets: true,
        maxTextureSize: Math.max(texSize, simHeight, dataHeight),
      },
    })
    if (!guarded) return

    const renderer = guarded.renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    const scene = new Scene()
    const cameraRig = new Object3D()
    scene.add(cameraRig)

    const camera = new PerspectiveCamera(
      live.current.cameraFov,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(
      live.current.cameraX,
      live.current.cameraY,
      live.current.cameraZ,
    )
    cameraRig.add(camera)
    cameraRig.rotation.x = live.current.cameraRotationX * DEG2RAD
    cameraRig.rotation.y = live.current.cameraRotationY * DEG2RAD

    const config = {
      scale,
      extrudeScale,
      extrudeOffset: new Vector3(
        extrudeOffset.x,
        extrudeOffset.y,
        extrudeOffset.z,
      ),
      randomOffset: new Vector3(randomOffset.x, randomOffset.y, randomOffset.z),
      steps,
      tubeRadius,
      tipRadius,
      noiseCurve,
      tipLayers,
    }

    const vertsPerFilament = ringCount * 3 + 4 * config.tipLayers
    const vertexCount = numFilaments * vertsPerFilament
    const tubeIndicesPerFilament = (ringCount - 1) * 3 * 2 * 3
    const tipIndicesPerFilament = 6 * config.tipLayers
    const indexCount =
      numFilaments * (tubeIndicesPerFilament + tipIndicesPerFilament)

    const atlasPos = new Vector4(1, 0.5, 0, 0)
    const atlasVel = new Vector4(1, 0.5, 0, 0.5)
    const dataTarget = new Vector4(1, 1 / 3, 0, 0)
    const dataStart = new Vector4(1, 1 / 3, 0, 1 / 3)
    const dataHighlightRef = new Vector4(1, 1 / 3, 0, 2 / 3)

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
    const aAdvect = new Float32Array(vertexCount)
    const aSimCell = new Float32Array(vertexCount * 2)
    const indices = new Uint32Array(indexCount)
    const data = new Float32Array(texSize * dataHeight * 4)
    const sectionSize = texSize * texSize
    const startSection = sectionSize
    const highlightSection = sectionSize * 2

    const ringPos = new Vector3()
    const rootPos = new Vector3()
    const launchPos = new Vector3()
    const axis = new Vector3()
    let vertexCursor = 0
    let indexCursor = 0

    const tipCorners = [0, 0, 1, 0, 0, 1, 1, 1]

    function buildFilament(index: number) {
      const p = index * 3
      const randomA = Math.random()
      const randomB = Math.random()
      const stagger = Math.random()
      const vertexBase = index * vertsPerFilament

      rootPos
        .set(positions![p], positions![p + 1], positions![p + 2])
        .multiplyScalar(config.scale)
      launchPos
        .copy(rootPos)
        .multiplyScalar(config.extrudeScale)
        .add(config.extrudeOffset)
      axis.subVectors(launchPos, rootPos).normalize()

      for (let ring = 0; ring < ringCount; ring++) {
        const t = ring / (ringCount - 1)
        ringPos.lerpVectors(rootPos, launchPos, t)
        const rx = ringPos.x
        const ry = ringPos.y
        const rz = ringPos.z
        const factor = 1 - t
        const cell = index * cellsPerFilament + ring
        const [cu, cv] = cellUv(cell)

        data[(0 + cell) * 4] = rx
        data[(0 + cell) * 4 + 1] = ry
        data[(0 + cell) * 4 + 2] = rz
        data[(0 + cell) * 4 + 3] = factor
        data[(startSection + cell) * 4] = launchPos.x
        data[(startSection + cell) * 4 + 1] = launchPos.y
        data[(startSection + cell) * 4 + 2] = launchPos.z
        data[(startSection + cell) * 4 + 3] = stagger
        data[(highlightSection + cell) * 4] = rootPos.x
        data[(highlightSection + cell) * 4 + 1] = rootPos.y
        data[(highlightSection + cell) * 4 + 2] = rootPos.z
        data[(highlightSection + cell) * 4 + 3] = 0

        for (let side = 0; side < 3; side++) {
          const i3 = vertexCursor * 3
          const i2 = vertexCursor * 2
          aPosition[i3] = launchPos.x
          aPosition[i3 + 1] = launchPos.y
          aPosition[i3 + 2] = launchPos.z
          aDir[i3] = axis.x
          aDir[i3 + 1] = axis.y
          aDir[i3 + 2] = axis.z
          aSide[vertexCursor] = side
          aRandom[i2] = randomA
          aRandom[i2 + 1] = randomB
          aUV[i3] = factor
          aUV[i3 + 1] = side / 3
          aUV[i3 + 2] = 0
          aAdvect[vertexCursor] = config.noiseCurve(1 - factor)
          aSimCell[i2] = cu
          aSimCell[i2 + 1] = cv
          vertexCursor++
        }

        if (ring < ringCount - 1) {
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

      for (let layer = 0; layer < config.tipLayers; layer++) {
        const depth =
          config.tipLayers > 1 ? layer / (config.tipLayers - 1) : 0
        const quadBase = vertexBase + ringCount * 3 + layer * 4
        const cell = index * cellsPerFilament + ringCount + layer
        const [cu, cv] = cellUv(cell)

        data[(0 + cell) * 4] = rootPos.x
        data[(0 + cell) * 4 + 1] = rootPos.y
        data[(0 + cell) * 4 + 2] = rootPos.z
        data[(0 + cell) * 4 + 3] = 1
        data[(startSection + cell) * 4] = launchPos.x
        data[(startSection + cell) * 4 + 1] = launchPos.y
        data[(startSection + cell) * 4 + 2] = launchPos.z
        data[(startSection + cell) * 4 + 3] = stagger
        data[(highlightSection + cell) * 4] = rootPos.x
        data[(highlightSection + cell) * 4 + 1] = rootPos.y
        data[(highlightSection + cell) * 4 + 2] = rootPos.z
        data[(highlightSection + cell) * 4 + 3] = 0

        for (let corner = 0; corner < 4; corner++) {
          const i3 = vertexCursor * 3
          const i2 = vertexCursor * 2
          aPosition[i3] = launchPos.x
          aPosition[i3 + 1] = launchPos.y
          aPosition[i3 + 2] = launchPos.z
          aDir[i3] = axis.x
          aDir[i3 + 1] = axis.y
          aDir[i3 + 2] = axis.z
          aSide[vertexCursor] = 0
          aRandom[i2] = randomA
          aRandom[i2 + 1] = randomB
          aUV[i3] = tipCorners[corner * 2]
          aUV[i3 + 1] = tipCorners[corner * 2 + 1]
          aUV[i3 + 2] = depth
          aAdvect[vertexCursor] = config.noiseCurve(0)
          aTip[vertexCursor] = 255
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
    }

    for (let i = 0; i < numFilaments; i++) buildFilament(i)

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
    geometry.setAttribute("aSide", new BufferAttribute(aSide, 1, true))
    geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 2))
    geometry.setAttribute("aUV", new BufferAttribute(aUV, 3))
    geometry.setAttribute("aTip", new BufferAttribute(aTip, 1, true))
    geometry.setAttribute("aAdvect", new BufferAttribute(aAdvect, 1))
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
        uDataStart: { value: dataStart.clone() },
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
                uniform vec4 uDataStart;
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
                    vec3 startPos = texture2D(tData, atlasUV(cellUv, uDataStart)).rgb;
                    gl_FragColor = vec4(startPos, 0.0);
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
        uMouse: { value: new Vector2(0, 0) },
        uDelta: { value: 0 },
        uRadius: { value: live.current.simRadius },
        uStrength: { value: live.current.simStrength },
        uSpring: { value: live.current.simSpring },
        uDamping: { value: live.current.simDamping },
        uMaxVelocity: { value: live.current.simMaxVelocity },
        uHighlightRadius: { value: live.current.highlightRadius },
        uHighlightSpeed: { value: live.current.highlightSpeed },
        uOpacitySpeed: { value: live.current.opacitySpeed },
        uElapsed: { value: 0 },
        uMaxDelay: { value: live.current.maxDelay },
        uAtlasPos: { value: atlasPos.clone() },
        uAtlasVel: { value: atlasVel.clone() },
        uDataTarget: { value: dataTarget.clone() },
        uDataStart: { value: dataStart.clone() },
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
                uniform float uOpacitySpeed;
                uniform float uElapsed;
                uniform float uMaxDelay;
                uniform vec4  uAtlasPos;
                uniform vec4  uAtlasVel;
                uniform vec4  uDataTarget;
                uniform vec4  uDataStart;
                uniform vec4  uDataHighlightRef;

                // How long a nordwell takes to ramp from inactive to fully
                // active once its stagger delay has elapsed. Kept as a fixed
                // constant rather than a control — it's a smoothing detail,
                // not a creative parameter.
                const float ACTIVATE_EASE = 0.35;

                // Squared-magnitude ceiling for sanity checks. The render
                // targets are half-float, which saturates at 65504 — well
                // below this — so anything approaching it is already a
                // runaway, and everything in this scene lives near unit scale.
                const float SANE_SQ = 1.0e8;

                // Largest explicit-Euler spring impulse per step. Beyond ~2.0
                // the integrator overshoots and diverges. At 60fps with the
                // default uSpring this never clamps; it only engages on long
                // frames or extreme stiffness.
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

                    // Read sim state
                    vec4 posData  = texture2D(tPrev, atlasUV(cellUv, uAtlasPos));
                    vec3 pos      = posData.rgb;
                    float opacity = posData.a;

                    vec4 velData    = texture2D(tPrev, atlasUV(cellUv, uAtlasVel));
                    vec3 vel        = velData.rgb;
                    float highlight = velData.a;

                    // Read static targets from the data texture
                    vec3 targetPos    = texture2D(tData, atlasUV(cellUv, uDataTarget)).rgb;
                    vec3 highlightRef = texture2D(tData, atlasUV(cellUv, uDataHighlightRef)).rgb;
                    float rStagger    = texture2D(tData, atlasUV(cellUv, uDataStart)).a;

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
                    if (!(dot(vel, vel) < SANE_SQ)) {
                        vel = vec3(0.0);
                    }
                    if (!(opacity >= 0.0))   opacity = 0.0;
                    if (!(highlight >= 0.0)) highlight = 0.0;

                    // --- Stagger activation ---
                    // Each nordwell waits rStagger * uMaxDelay seconds, then
                    // ramps smoothly to fully active over ACTIVATE_EASE seconds.
                    // Gates the spring pull and the opacity target below so an
                    // inactive nordwell stays parked at the launch point, invisible.
                    float nordwellDelay = rStagger * uMaxDelay;
                    float activeT = clamp((uElapsed - nordwellDelay) / ACTIVATE_EASE, 0.0, 1.0);

                    // --- Repulsion physics — mouse pushes the live position around ---
                    vec2 toCell   = pos.xy - uMouse;
                    float dist    = length(toCell);
                    float repulse = 1.0 - smoothstep(0.0, uRadius, dist);
                    vec2 repelDir = dist > 0.0001 ? toCell / dist : vec2(0.0, 1.0);
                    vel.xy       += repelDir * repulse * uStrength * uDelta;

                    float speed = length(vel);
                    if (speed > uMaxVelocity) vel = vel / speed * uMaxVelocity;

                    // --- Spring pulling the live position toward its target ---
                    // Gated by activeT: an inactive nordwell feels no pull yet,
                    // so it stays parked at the seeded launch point (velocity
                    // still damps down from any residual mouse repulsion).
                    // The impulse is clamped so a long frame (or a very stiff
                    // uSpring) can't overshoot into exponential divergence.
                    float springStep = min(uSpring * uDelta, MAX_SPRING_STEP);
                    vel -= (pos - targetPos) * springStep * activeT;

                    // Exponential damping. The naive form (1.0 - uDamping * uDelta)
                    // goes negative once uDamping * uDelta exceeds 1 — reachable at
                    // high damping on a slow frame — which flips the velocity sign
                    // and amplifies it every step until it overflows to Inf.
                    // exp(-x) matches it to first order and is stable for all inputs.
                    vel *= exp(-uDamping * uDelta);

                    // --- Integrate position + ease opacity toward its (gated) target ---
                    pos     += vel * uDelta;
                    opacity += (activeT - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
                    opacity  = clamp(opacity, 0.0, 1.0);

                    // --- Highlight ---
                    // Distance from mouse to this nordwell's reference point.
                    // All cells in the nordwell share the same reference point so
                    // the highlight value is identical for the whole nordwell.
                    float tipDist = length(uMouse - highlightRef.xy);
                    float target  = 1.0 - smoothstep(0.0, uHighlightRadius, tipDist);

                    // Smooth lerp toward target — rises fast when mouse approaches,
                    // fades naturally when mouse moves away.
                    highlight = mix(highlight, target, clamp(uHighlightSpeed * uDelta, 0.0, 1.0));
                    highlight = clamp(highlight, 0.0, 1.0);

                    gl_FragColor = isVelocity
                        ? vec4(vel, highlight)
                        : vec4(pos, opacity);
                }
            `,
    })
    simScene.add(new Mesh(quadGeometry, simMaterial))

    const drawMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDirection: {
          value: new Vector3().copy(config.extrudeOffset).normalize(),
        },
        uNoiseStrength: { value: live.current.noiseStrength },
        uNoiseScale: { value: live.current.noiseScale },
        uRandomOffset: { value: config.randomOffset },
        uTubeRadius: { value: tubeRadius },
        uTipRadius: { value: live.current.tipRadius },
        uTipTexture: { value: tipTextureRef.current },
        uTipLayers: { value: config.tipLayers },
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
attribute float aAdvect;
attribute vec2  aSimCell;

uniform float uTime;
uniform float uNoiseStrength;
uniform float uNoiseScale;
uniform float uTubeRadius;
uniform float uTipRadius;
uniform float uSizeVariance;
uniform float uDispersionOffset;
uniform vec3  uDirection;
uniform vec3  uRandomOffset;
uniform sampler2D tSim;
uniform vec4  uAtlasPos;
uniform vec4  uAtlasVel;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vAdvect;
varying float vHighlight;
varying float vOpacity;

vec2 atlasUV(vec2 cellUv, vec4 region) {
    return cellUv * region.xy + region.zw;
}

void main() {
    vRandom = aRandom;
    vUV     = aUV;
    vTip    = aTip;
    vAdvect = aAdvect;

    // Sample live position (rgb) + opacity (a) from the position section
    vec4 posData  = texture2D(tSim, atlasUV(aSimCell, uAtlasPos));
    vec3 worldPos = posData.rgb;
    vOpacity      = posData.a;

    // Sample highlight (a) from the velocity section
    vHighlight = texture2D(tSim, atlasUV(aSimCell, uAtlasVel)).a;

    // Second line of defence against a poisoned sim buffer. The sim shader
    // self-heals, but a bad value would still be visible for the one frame
    // before it does — and a non-finite gl_Position produces undefined,
    // often screen-filling, geometry. Collapse the vertex instead.
    if (!(dot(worldPos, worldPos) < 1.0e8)) {
        gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
        vOpacity = 0.0;
        return;
    }
    if (!(vOpacity >= 0.0))   vOpacity = 0.0;
    if (!(vHighlight >= 0.0)) vHighlight = 0.0;

    vec3 coords = worldPos * uNoiseScale
        + uTime * -0.15 * uDirection
        + aRandom.yxy * uRandomOffset;

    float dx = fractalBrownian(coords, 0.5);
    float dy = fractalBrownian(coords + vec3(3.963, 1.053, 5.263), 0.5);

    vec3 noiseDisp    = vec3(dx, dy, dx * dy) * aAdvect * uNoiseStrength;
    vec3 displacedPos = worldPos + noiseDisp;

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
        float sideIndex = round(aSide * 255.0);
        float angle     = sideIndex * (2.0 * 3.14159265359 / 3.0);
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
uniform sampler2D uTipTexture;

varying vec2  vRandom;
varying vec3  vUV;
varying float vTip;
varying float vHighlight;
varying float vOpacity;

void main() {
    vec3 color = vec3(0.0);

    float pulseSpeed = uPulseSpeedBase + vRandom.x * uPulseSpeedRandomMax;
    float pulsePos   = fract(uTime * pulseSpeed);
    float pulseDist  = abs(vUV.x * 0.2 - pulsePos);
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
        // color += vHighlight * color;
        float a = clamp((vRandom.y / uTipLayers) * vOpacity, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);    } else {
        vec3 disperse = texture2D(uTipTexture, vec2(vUV.x * 2.0 * 1.0, uDispersion)).xyz;
        color = vec3(uFilamentOpacity);
        color += pulse * mix(vec3(1.0, 0.85, 0.7), disperse, vRandom.y);
        color += vHighlight * disperse * vUV.x * vUV.x * uHighlightStrength * 0.5;
        float a = clamp((vRandom.x * vUV.x * vUV.x + pulse * 0.1
                         + vHighlight * vUV.x * vUV.x) * vOpacity, 0.0, 1.0);
        gl_FragColor = vec4(clamp(color, 0.0, 1.0) * a, a);
    }

    // gl_FragColor = vec4(vec3(vUV.x), 1.0);
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
    mesh.rotateX(Math.PI)
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

    const OFFSCREEN = -9999
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

      camera.fov = live.current.cameraFov
      camera.updateProjectionMatrix()
      camera.position.set(
        live.current.cameraX,
        live.current.cameraY,
        live.current.cameraZ,
      )
      cameraRig.rotation.x = live.current.cameraRotationX * DEG2RAD
      cameraRig.rotation.y = live.current.cameraRotationY * DEG2RAD
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
      simMaterial.uniforms.uOpacitySpeed.value = live.current.opacitySpeed
      simMaterial.uniforms.uElapsed.value = elapsed
      simMaterial.uniforms.uMaxDelay.value = live.current.maxDelay

      renderer.setRenderTarget(simNext)
      renderer.render(simScene, quadCamera)
      renderer.setRenderTarget(null)

      const swap = simCurrent
      simCurrent = simNext
      simNext = swap

      drawMaterial.uniforms.tSim.value = simCurrent.texture
      drawMaterial.uniforms.uTime.value = time
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
    positions,
    numFilaments,
    beginSession,
    scale,
    extrudeScale,
    extrudeOffset.x,
    extrudeOffset.y,
    extrudeOffset.z,
    randomOffset.x,
    randomOffset.y,
    randomOffset.z,
    steps,
    tubeRadius,
    tipLayers,
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

  const showFallback = !webglAvailable || !positions

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

export default FilamentField
