"use client"

import { useEffect, useMemo, useRef } from "react"
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
  Vector4,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three"

import { createGuardedRenderer, useWebGLGuard } from "./guard"
import {
  PANEL_GRAPHIC_SHAPES,
  FEATURE_STAGE_SHAPES,
  type PointShape,
} from "./point-shapes"

/**
 * A GPGPU point field that lays particles along one or more 2D point sets and
 * springs them from one set to the next whenever `currentShape` changes.
 *
 * Every shape is packed into a single float data texture (a grid of equally
 * sized "slots"), and a ping-ponged half-float render target holds the live
 * simulation: the top half of the target is position + opacity, the bottom
 * half is velocity. A `Vector4` per shape remaps a simulation cell's UV into
 * that shape's slot, so switching shapes is a single uniform assignment and
 * costs nothing per frame.
 *
 * Each simulated point is drawn as `tipLayers` stacked camera-facing quads,
 * spread slightly in depth and sampled out of a soft tip texture, which is
 * what gives the field its faint, smoky look under additive blending.
 */

/** Local copy of the 256x256 soft tip sprite the points sample. */
const TIP_TEXTURE = "/img/img-065be4afe6.png"
/** Still image shown when the GPU cannot run the feature stage. */
const STAGE_FALLBACK_IMAGE = "/img/img-1b6dcbbab2.png"

/** How many datasets the simulation target stacks (position, then velocity). */
const SIM_DATASETS = 2
/** Longest frame the integrator will accept, in seconds. */
const MAX_FRAME_DELTA = 0.1
/** Corner offsets of the unit quad, as `x, y` pairs. */
const QUAD_CORNERS = [0, 0, 1, 0, 0, 1, 1, 1]
/** Vertices and indices each tip layer contributes. */
const VERTS_PER_LAYER = 4
const INDICES_PER_LAYER = 6

export interface Vec3Prop {
  x: number
  y: number
  z: number
}

export interface PointMorphFieldProps {
  /** Morph targets, in order. At most ten; an empty list draws nothing. */
  shapes?: PointShape[]
  /** Index of the shape the points are currently springing toward. */
  currentShape?: number
  /** Half-size of a single tip quad, in world units. */
  tipRadius?: number
  /** Stacked quads per point. More layers, softer and deeper points. */
  tipLayers?: number
  /** How much per-point random size variation to apply (0..1). */
  sizeVariance?: number
  /** Width of the band sampled horizontally out of the tip texture (0..1). */
  dispersionBand?: number
  /** How far down the tip texture each point samples (0..1). */
  dispersion?: number
  /** Depth spread between tip layers, in world units. */
  dispersionOffset?: number
  /** URL of the soft sprite the tips sample. */
  tipTexture?: string
  /** Spring constant pulling each point at its target. */
  simSpring?: number
  /** Exponential velocity damping per second. */
  simDamping?: number
  /** Velocity ceiling, in world units per second. */
  simMaxVelocity?: number
  /** Per-point random offset applied to `simSpring`, so points arrive apart. */
  springVariance?: number
  /** How fast a point fades in or out when it gains or loses a target. */
  opacitySpeed?: number
  /** Vertical field of view, in degrees. */
  cameraFov?: number
  /** Camera position in world units. */
  cameraPosition?: Vec3Prop
  /** Draws the data and simulation textures as two small planes. */
  debugMode?: boolean
  /**
   * Flip to rebuild the field from scratch. Point thinning is random, so this
   * reshuffles which points survive; the shapes themselves are otherwise read
   * once at mount.
   */
  refresh?: boolean
  fallbackImage?: string
  fallbackFit?: "cover" | "contain" | "fill"
  fallbackAlt?: string
  className?: string
  style?: React.CSSProperties
}

/** A single parsed point. */
interface ParsedPoint {
  x: number
  y: number
}

/**
 * Splits a flat `x,y,x,y,...` string into points, dropping each one with
 * probability `1 - threshold`. The thinning is deliberately random rather
 * than evenly spaced: an even stride would alias against the source path and
 * produce visible banding.
 */
function parsePoints(source: string, threshold: number): ParsedPoint[] {
  if (!source || !source.trim()) return []
  const values = source.split(",").map(Number)
  if (values.length < 2 || values.length % 2 !== 0 || values.some(isNaN)) {
    return []
  }
  const points: ParsedPoint[] = []
  for (let i = 0; i < values.length / 2; i++) {
    if (Math.random() > threshold) continue
    points.push({ x: values[i * 2], y: values[i * 2 + 1] })
  }
  return points
}

/** Fisher-Yates shuffle, on a copy. */
function shuffle<T>(input: T[]): T[] {
  const out = [...input]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Picks the width of the square simulation target: the smallest width whose
 * height leaves room for `datasets` stacked copies of the cell grid.
 */
function simLayout(cellCount: number, datasets: number) {
  let simW = 1
  for (;;) {
    const rows = Math.ceil(cellCount / simW)
    if (simW >= rows * datasets) break
    simW++
  }
  const rowsPerDataset = Math.ceil(cellCount / simW)
  return { simW, rowsPerDataset }
}

/**
 * Arranges `slotCount` equally sized slots into the squarest grid that still
 * holds them all, then returns the pixel size of the atlas that results.
 */
function atlasLayout(slotCount: number, slotWidth: number, slotHeight: number) {
  let cols = 1
  let rows = slotCount
  let bestAspect = Infinity
  const even = slotCount % 2 === 0 ? slotCount : slotCount + 1
  for (let c = 1; c <= even; c++) {
    const r = Math.ceil(even / c)
    if (c * r < slotCount) continue
    const aspect = Math.max(c, r) / Math.min(c, r)
    if (aspect < bestAspect) {
      bestAspect = aspect
      cols = c
      rows = r
    }
  }
  if ((cols * slotWidth) / (rows * slotHeight) > 4) rows++
  return {
    cols,
    rows,
    staticTexWidth: cols * slotWidth,
    staticTexHeight: rows * slotHeight,
  }
}

/**
 * Builds the `scale.xy, offset.zw` vector that remaps a UV in one texture's
 * cell space into a sub-rectangle of another texture.
 */
function subTextureTransform(
  cellWidth: number,
  cellHeight: number,
  sourceWidth: number,
  sourceHeight: number,
  offsetX: number,
  offsetY: number,
  spanWidth: number,
  spanHeight: number,
  destWidth: number,
  destHeight: number,
) {
  const sx = spanWidth / destWidth / (cellWidth / sourceWidth)
  const sy = spanHeight / destHeight / (cellHeight / sourceHeight)
  return new Vector4(
    sx,
    sy,
    (offsetX + 0.5) / destWidth - (0.5 / sourceWidth) * sx,
    (offsetY + 0.5) / destHeight - (0.5 / sourceHeight) * sy,
  )
}

/** Loads the tip sprite and returns a disposer. */
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

const SIM_VERTEX_SHADER = `
                varying vec2 vFragUV;
                void main() {
                    vFragUV = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `

const SIM_FRAGMENT_SHADER = `
                uniform sampler2D tPrev;
                uniform sampler2D tData;
                uniform float uDelta;
                uniform float uSimSpring;
                uniform float uSimDamping;
                uniform float uSimMaxVelocity;
                uniform float uSpringVariance;
                uniform float uOpacitySpeed;
                uniform vec4  uActiveShapeTransform;
                uniform vec4  uT_velocity;
                uniform float uRtSize;
                uniform float uRowsPerDataset;

                // Squared-magnitude ceiling for sanity checks. The render
                // targets are half-float, which saturates at 65504 — well
                // below this — and every shape lives within about half a
                // unit of the origin.
                const float SANE_SQ = 1.0e8;

                // Largest explicit-Euler spring impulse per step. Beyond
                // about 2.0 the integrator overshoots and diverges.
                const float MAX_SPRING_STEP = 2.0;

                varying vec2 vFragUV;

                vec2 transformUV(vec2 uv, vec4 m) {
                    return uv * m.xy + m.zw;
                }

                void main() {
                    // Integer row index of this fragment in the RT
                    float rowF = floor(vFragUV.y * uRtSize);
                    bool isVelocity = rowF >= uRowsPerDataset;

                    // Cell UV — addresses the same logical cell in dataset 0 space.
                    // For dataset 0 fragments, this IS vFragUV.
                    // For dataset 1 fragments, we subtract the row offset to get
                    // the equivalent dataset 0 address for the same cell.
                    // This is what aSimUV produces in the vertex shader, and it is
                    // the correct input space for uActiveShapeTransform and uT_velocity.
                    vec2 cellUV = isVelocity
                        ? vec2(vFragUV.x, (rowF - uRowsPerDataset + 0.5) / uRtSize)
                        : vFragUV;

                    if (isVelocity) {
                        // Read current position from dataset 0 using cellUV
                        vec4 posData = texture2D(tPrev, cellUV);
                        vec2 pos     = posData.rg;

                        // Read current velocity from dataset 1 — this fragment's own UV
                        vec4 velData = texture2D(tPrev, vFragUV);
                        vec2 vel     = velData.rg;

                        // Read target position from active shape slot in data texture
                        // Transform from dataset 0 cell UV space to shape slot UV space
                        vec2 dataUV    = transformUV(cellUV, uActiveShapeTransform);
                        vec4 target    = texture2D(tData, dataUV);
                        vec2 targetPos = target.rg;

                        // --- Sanitize incoming state ---
                        // A single NaN or Inf entering a ping-pong buffer never
                        // leaves it: the next frame reads it back, propagates
                        // it, and every subsequent frame is poisoned. Under
                        // additive blending with depth testing off, that reads
                        // on screen as a solid white canvas with no error and
                        // no context loss. The NOT-less-than form below is
                        // NaN-safe: it is true for NaN, where a greater-than
                        // test would be false.
                        if (!(dot(pos, pos) < SANE_SQ)) pos = targetPos;
                        if (!(dot(vel, vel) < SANE_SQ)) vel = vec2(0.0);

                        // Per-cell spring variance — B channel holds a [0,1] random
                        // remapped to [-1,1] and scaled by uSpringVariance to offset
                        // each point's effective spring strength uniquely
                        float springRandom = target.b * 2.0 - 1.0;
                        float effectiveSpring = uSimSpring + springRandom * uSpringVariance;

                        // Spring toward target position.
                        // effectiveSpring can go NEGATIVE when uSpringVariance
                        // exceeds uSimSpring — the controls allow variance up
                        // to 100 against a spring as low as 0.1 — and a
                        // negative spring pushes a point away from its target
                        // without bound until half-float overflows to Inf.
                        // Clamping the impulse to [0, MAX_SPRING_STEP] fixes
                        // that and explicit-Euler overshoot on long frames in
                        // one step. At 60fps with default values this never
                        // engages.
                        vec2 displacement = pos - targetPos;
                        vel -= displacement * clamp(effectiveSpring * uDelta, 0.0, MAX_SPRING_STEP);

                        // Exponential damping. The naive form
                        // (1.0 - uSimDamping * uDelta) goes negative once
                        // uSimDamping * uDelta exceeds 1 — reachable at the top
                        // of the Sim Damping range on a slow frame — which
                        // flips the velocity sign and amplifies it every step
                        // until it overflows. exp(-x) matches it to first order
                        // and is stable for all inputs.
                        vel *= exp(-uSimDamping * uDelta);

                        float speed = length(vel);
                        if (speed > uSimMaxVelocity) vel = vel / speed * uSimMaxVelocity;

                        gl_FragColor = vec4(vel, 0.0, 1.0);

                    } else {
                        // Read current position + opacity from dataset 0 — this fragment's own UV
                        vec4 posData  = texture2D(tPrev, vFragUV);
                        vec2 pos      = posData.rg;
                        float opacity = posData.a;

                        // Read velocity from dataset 1
                        // Transform from dataset 0 cell UV (= vFragUV here) → dataset 1 UV
                        vec4 velData = texture2D(tPrev, transformUV(cellUV, uT_velocity));
                        vec2 vel     = velData.rg;

                        // Read target opacity from active shape slot
                        // Transform from dataset 0 cell UV space → shape slot UV space
                        vec2 dataUV         = transformUV(cellUV, uActiveShapeTransform);
                        vec4 target         = texture2D(tData, dataUV);
                        float targetOpacity = target.a;

                        // Same sanitation as the velocity branch — both
                        // sections have to self-heal or a poisoned cell would
                        // simply be re-read from the other one next frame.
                        if (!(dot(pos, pos) < SANE_SQ)) pos = target.rg;
                        if (!(dot(vel, vel) < SANE_SQ)) vel = vec2(0.0);
                        if (!(opacity >= 0.0)) opacity = 0.0;

                        // Integrate position
                        pos += vel * uDelta;

                        // Linear opacity interpolation
                        opacity += (targetOpacity - opacity) * clamp(uOpacitySpeed * uDelta, 0.0, 1.0);
                        opacity = clamp(opacity, 0.0, 1.0);

                        gl_FragColor = vec4(pos, 0.0, opacity);
                    }
                }
            `

const DRAW_VERTEX_SHADER = `
                attribute vec2  aRandom;
                attribute vec2  aSimUV;
                attribute vec3  aUV;

                uniform sampler2D tSim;
                uniform float uTipRadius;
                uniform float uSizeVariance;
                uniform float uDispersionOffset;
                uniform float uTime;

                varying vec2  vRandom;
                varying vec3  vUV;
                varying float vOpacity;

                void main() {
                    vRandom = aRandom;
                    vUV     = aUV;

                    // Read current position and opacity from sim dataset0
                    vec4 simData = texture2D(tSim, aSimUV);
                    // Negate Y to convert from SVG space (Y down) to world space (Y up)
                    vec2 worldPos = vec2(simData.r, -simData.g);
                    vOpacity      = simData.a;

                    // Second line of defence against a poisoned sim buffer.
                    // The sim shader self-heals, but a bad value would still
                    // be visible for the one frame before it does — and a
                    // non-finite gl_Position produces undefined, often
                    // screen-filling, geometry. Collapse the vertex instead.
                    if (!(dot(worldPos, worldPos) < 1.0e8)) {
                        gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
                        vOpacity = 0.0;
                        return;
                    }
                    if (!(vOpacity >= 0.0)) vOpacity = 0.0;

                    // Billboard expansion in view space
                    vec4 centerView = modelViewMatrix * vec4(worldPos, 0.0, 1.0);
                    float sv = mix(1.0 - uSizeVariance, 1.0, aRandom.y);
                    float ox = (aUV.x - 0.5) * 2.0 * uTipRadius * sv;
                    float oy = (aUV.y - 0.5) * 2.0 * uTipRadius * sv;
                    centerView.xy += vec2(ox, oy);

                    // Layer Z offset — spreads tip layers in depth with animated cycle
                    float cycle = sin(uTime + aRandom.x * 6.28318) * 0.5 + 0.5;
                    centerView.z += aUV.z * uDispersionOffset * cycle;

                    gl_Position = projectionMatrix * centerView;
                }
            `

const DRAW_FRAGMENT_SHADER = `
                uniform float     uTipLayers;
                uniform float     uDispersionBand;
                uniform float     uDispersion;
                uniform sampler2D uTipTexture;

                varying vec2  vRandom;
                varying vec3  vUV;
                varying float vOpacity;

                void main() {
                    // Circular clip
                    vec2 centered = vUV.xy - vec2(0.5);
                    if (length(centered) > 0.5) discard;

                    // Sample tip texture — same as original tip branch
                    float uvMin = 0.5 - uDispersionBand * 0.5;
                    float uvMax = 0.5 + uDispersionBand * 0.5;
                    float texU  = mix(uvMin, uvMax, vUV.z);
                    float texV  = uDispersion * vRandom.x;

                    vec3 color = texture2D(uTipTexture, vec2(texU, texV)).xyz;

                    float alpha = vOpacity * (vRandom.y / uTipLayers);
                    gl_FragColor = vec4(color * alpha, alpha);
                }
            `

const DEBUG_VERTEX_SHADER = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

const DEBUG_FRAGMENT_SHADER = `
            uniform sampler2D tDebug;
            varying vec2 vUv;
            void main() {
                vec4 data = texture2D(tDebug, vUv);
                vec3 rgb = data.rgb * 0.5 + 0.5;
                // Tint by alpha so opacity state is visible
                gl_FragColor = vec4(rgb + vec3(data.a * 0.3, 0.0, 0.0), 1.0);
            }
        `

export function PointMorphField({
  shapes = [],
  currentShape = 0,
  tipRadius = 0.003,
  tipLayers = 8,
  sizeVariance = 0.5,
  dispersionBand = 0.9,
  dispersion = 0.8,
  dispersionOffset = 0.05,
  tipTexture = TIP_TEXTURE,
  simSpring = 60,
  simDamping = 7,
  simMaxVelocity = 9.5,
  springVariance = 22.6,
  opacitySpeed = 5.3,
  cameraFov = 34,
  cameraPosition = { x: 0, y: 0, z: 1.8 },
  debugMode = false,
  refresh = false,
  fallbackImage,
  fallbackFit = "cover",
  fallbackAlt = "",
  className,
  style,
}: PointMorphFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  const { webglAvailable, gpuEpoch, beginSession } =
    useWebGLGuard("PointMorphField")

  // Thinning is random, so re-running this would reshuffle which points
  // survive and visibly re-scatter the field. It is deliberately keyed to
  // `refresh` alone: the shapes are read once, at build time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const parsedShapes = useMemo(
    () => (shapes || []).map((s) => parsePoints(s?.points ?? "", s?.threshold ?? 1)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh],
  )
  const shapeCount = useMemo(
    () => Math.max(1, parsedShapes.length),
    [parsedShapes],
  )
  const cellCount = useMemo(
    () => Math.max(1, ...parsedShapes.map((s) => s.length), 1),
    [parsedShapes],
  )

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const simMaterialRef = useRef<ShaderMaterial | null>(null)
  const drawMaterialRef = useRef<ShaderMaterial | null>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const loaderRef = useRef(new TextureLoader())
  const tipTextureRef = useRef<Texture | null>(null)
  const shapeTransformsRef = useRef<Vector4[]>([])
  const sceneRef = useRef<Scene | null>(null)
  const dataTextureRef = useRef<DataTexture | null>(null)
  const simTextureRef = useRef<Texture | null>(null)
  const debugDataMeshRef = useRef<Mesh | null>(null)
  const debugSimMeshRef = useRef<Mesh | null>(null)
  const debugDataGeometryRef = useRef<PlaneGeometry | null>(null)
  const debugSimGeometryRef = useRef<PlaneGeometry | null>(null)
  const debugDataMaterialRef = useRef<ShaderMaterial | null>(null)
  const debugSimMaterialRef = useRef<ShaderMaterial | null>(null)

  // The design source wraps every animatable value in a spring so it can be
  // scrubbed live. Ours are static, so the settled value is the prop itself;
  // a ref is all the render loop needs to read the current one.
  const simSpringRef = useRef(simSpring)
  const simDampingRef = useRef(simDamping)
  const simMaxVelocityRef = useRef(simMaxVelocity)
  const opacitySpeedRef = useRef(opacitySpeed)
  const tipRadiusRef = useRef(tipRadius)
  const sizeVarianceRef = useRef(sizeVariance)
  const dispersionBandRef = useRef(dispersionBand)
  const dispersionRef = useRef(dispersion)
  const dispersionOffsetRef = useRef(dispersionOffset)
  const springVarianceRef = useRef(springVariance)

  useEffect(() => {
    simSpringRef.current = simSpring
  }, [simSpring])
  useEffect(() => {
    simDampingRef.current = simDamping
  }, [simDamping])
  useEffect(() => {
    simMaxVelocityRef.current = simMaxVelocity
  }, [simMaxVelocity])
  useEffect(() => {
    opacitySpeedRef.current = opacitySpeed
  }, [opacitySpeed])
  useEffect(() => {
    tipRadiusRef.current = tipRadius
  }, [tipRadius])
  useEffect(() => {
    sizeVarianceRef.current = sizeVariance
  }, [sizeVariance])
  useEffect(() => {
    dispersionBandRef.current = dispersionBand
  }, [dispersionBand])
  useEffect(() => {
    dispersionRef.current = dispersion
  }, [dispersion])
  useEffect(() => {
    dispersionOffsetRef.current = dispersionOffset
  }, [dispersionOffset])
  useEffect(() => {
    springVarianceRef.current = springVariance
  }, [springVariance])

  useEffect(() => {
    if (!cameraRef.current) return
    cameraRef.current.fov = cameraFov
    cameraRef.current.updateProjectionMatrix()
  }, [cameraFov])

  useEffect(() => {
    if (!cameraRef.current) return
    cameraRef.current.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
    )
  }, [cameraPosition.x, cameraPosition.y, cameraPosition.z])

  // Switching shapes is one uniform assignment: the simulation keeps running
  // and springs every point from wherever it is to its new slot.
  useEffect(() => {
    if (!simMaterialRef.current) return
    const transforms = shapeTransformsRef.current
    if (!transforms.length) return
    const index = Math.max(0, Math.min(currentShape, transforms.length - 1))
    simMaterialRef.current.uniforms.uActiveShapeTransform.value =
      transforms[index]
  }, [currentShape])

  useEffect(() => {
    if (!tipTexture) {
      tipTextureRef.current?.dispose()
      tipTextureRef.current = null
      if (drawMaterialRef.current) {
        drawMaterialRef.current.uniforms.uTipTexture.value = null
      }
      return
    }
    return loadTipTexture(loaderRef.current, tipTexture, (texture) => {
      tipTextureRef.current?.dispose()
      tipTextureRef.current = texture
      if (drawMaterialRef.current) {
        drawMaterialRef.current.uniforms.uTipTexture.value = texture
      }
    })
  }, [tipTexture])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const session = beginSession()
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
    rendererRef.current = renderer

    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(
      cameraFov,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    scene.add(camera)
    cameraRef.current = camera

    // --- Texture layout -------------------------------------------------
    // One simulation cell per point of the densest shape. The simulation
    // target is square and holds both datasets stacked; the static data
    // texture is a grid of shape slots, each the size of one dataset.
    const { simW, rowsPerDataset } = simLayout(cellCount, SIM_DATASETS)
    const rtSize = simW
    const { cols, staticTexWidth, staticTexHeight } = atlasLayout(
      shapeCount,
      simW,
      rowsPerDataset,
    )
    if (
      !guarded.require({
        maxTextureSize: Math.max(rtSize, staticTexWidth, staticTexHeight),
      })
    ) {
      return
    }

    // --- Static data texture --------------------------------------------
    const data = new Float32Array(staticTexWidth * staticTexHeight * 4)
    // One random per cell, shared by every shape, so a given point keeps its
    // spring offset as it morphs instead of jumping between personalities.
    const cellRandom = new Float32Array(cellCount)
    for (let i = 0; i < cellCount; i++) cellRandom[i] = Math.random()

    const shapeTransforms: Vector4[] = []
    for (let shapeIndex = 0; shapeIndex < shapeCount; shapeIndex++) {
      const col = shapeIndex % cols
      const row = Math.floor(shapeIndex / cols)
      const offsetX = col * simW
      const offsetY = row * rowsPerDataset
      shapeTransforms.push(
        subTextureTransform(
          simW,
          rowsPerDataset,
          rtSize,
          rtSize,
          offsetX,
          offsetY,
          simW,
          rowsPerDataset,
          staticTexWidth,
          staticTexHeight,
        ),
      )

      const scale = shapes[shapeIndex]?.scale ?? 1
      const points = parsedShapes[shapeIndex] || []
      const pointCount = points.length
      // Which simulation cell gets which point is shuffled, so a shape with
      // fewer points than cells leaves its unused cells scattered through the
      // grid rather than in one solid block.
      const cellOrder = shuffle(Array.from({ length: cellCount }, (_, i) => i))
      for (let i = 0; i < cellCount; i++) {
        const cell = cellOrder[i]
        const used = i < pointCount
        const cellX = cell % simW
        const cellY = Math.floor(cell / simW)
        const x = offsetX + cellX
        const index = ((offsetY + cellY) * staticTexWidth + x) * 4
        if (used) {
          data[index + 0] = points[i].x * scale
          data[index + 1] = points[i].y * scale
          data[index + 2] = cellRandom[cell]
          data[index + 3] = 1
        } else {
          // Unused cells park at a random spot near the origin with zero
          // opacity, so they fade out in place instead of collapsing.
          data[index + 0] = Math.random() - 0.5
          data[index + 1] = Math.random() - 0.5
          data[index + 2] = cellRandom[cell]
          data[index + 3] = 0
        }
      }
    }
    shapeTransformsRef.current = shapeTransforms

    const dataTexture = new DataTexture(
      data,
      staticTexWidth,
      staticTexHeight,
      RGBAFormat,
      FloatType,
    )
    dataTexture.minFilter = NearestFilter
    dataTexture.magFilter = NearestFilter
    dataTexture.needsUpdate = true
    dataTextureRef.current = dataTexture

    // Maps a dataset-0 cell UV onto the same cell in dataset 1.
    const velocityTransform = subTextureTransform(
      simW,
      rowsPerDataset,
      rtSize,
      rtSize,
      0,
      rowsPerDataset,
      simW,
      rowsPerDataset,
      rtSize,
      rtSize,
    )

    // --- Point geometry --------------------------------------------------
    const vertsPerCell = VERTS_PER_LAYER * tipLayers
    const vertexCount = cellCount * vertsPerCell
    const indicesPerCell = INDICES_PER_LAYER * tipLayers
    const indexCount = cellCount * indicesPerCell

    const positions = new Float32Array(vertexCount * 3)
    const randoms = new Float32Array(vertexCount * 2)
    const simUVs = new Float32Array(vertexCount * 2)
    const quadUVs = new Float32Array(vertexCount * 3)
    const indices = new Uint32Array(indexCount)

    let vertexCursor = 0
    let indexCursor = 0
    for (let cell = 0; cell < cellCount; cell++) {
      const cellX = cell % simW
      const cellY = Math.floor(cell / simW)
      const simU = (cellX + 0.5) / rtSize
      const simV = (cellY + 0.5) / rtSize
      const randomA = Math.random()
      const randomB = Math.random()
      const cellBase = cell * vertsPerCell
      for (let layer = 0; layer < tipLayers; layer++) {
        const depth = tipLayers > 1 ? layer / (tipLayers - 1) : 0
        const layerBase = cellBase + layer * VERTS_PER_LAYER
        for (let corner = 0; corner < VERTS_PER_LAYER; corner++) {
          const v = vertexCursor
          positions[v * 3 + 0] = 0
          positions[v * 3 + 1] = 0
          positions[v * 3 + 2] = 0
          randoms[v * 2 + 0] = randomA
          randoms[v * 2 + 1] = randomB
          simUVs[v * 2 + 0] = simU
          simUVs[v * 2 + 1] = simV
          quadUVs[v * 3 + 0] = QUAD_CORNERS[corner * 2 + 0]
          quadUVs[v * 3 + 1] = QUAD_CORNERS[corner * 2 + 1]
          quadUVs[v * 3 + 2] = depth
          vertexCursor++
        }
        indices[indexCursor++] = layerBase + 0
        indices[indexCursor++] = layerBase + 1
        indices[indexCursor++] = layerBase + 2
        indices[indexCursor++] = layerBase + 2
        indices[indexCursor++] = layerBase + 1
        indices[indexCursor++] = layerBase + 3
      }
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setAttribute("aRandom", new BufferAttribute(randoms, 2))
    geometry.setAttribute("aSimUV", new BufferAttribute(simUVs, 2))
    geometry.setAttribute("aUV", new BufferAttribute(quadUVs, 3))
    geometry.setIndex(new BufferAttribute(indices, 1))

    // --- Simulation ------------------------------------------------------
    const rtOptions = {
      format: RGBAFormat,
      type: HalfFloatType,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: false,
    }
    let simCurrent = new WebGLRenderTarget(rtSize, rtSize, rtOptions)
    let simNext = new WebGLRenderTarget(rtSize, rtSize, rtOptions)

    const activeTransform =
      shapeTransforms[
        Math.max(0, Math.min(currentShape, shapeTransforms.length - 1))
      ]

    const simScene = new Scene()
    const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const quadGeometry = new PlaneGeometry(2, 2)
    const simMaterial = new ShaderMaterial({
      uniforms: {
        tPrev: { value: simCurrent.texture },
        tData: { value: dataTexture },
        uDelta: { value: 0.016 },
        uSimSpring: { value: simSpring },
        uSimDamping: { value: simDamping },
        uSimMaxVelocity: { value: simMaxVelocity },
        uSpringVariance: { value: springVariance },
        uOpacitySpeed: { value: opacitySpeed },
        uActiveShapeTransform: { value: activeTransform.clone() },
        uT_velocity: { value: velocityTransform.clone() },
        uRtSize: { value: rtSize },
        uRowsPerDataset: { value: rowsPerDataset },
      },
      vertexShader: SIM_VERTEX_SHADER,
      fragmentShader: SIM_FRAGMENT_SHADER,
    })
    simMaterialRef.current = simMaterial
    simScene.add(new Mesh(quadGeometry, simMaterial))

    const drawMaterial = new ShaderMaterial({
      uniforms: {
        tSim: { value: simCurrent.texture },
        uTipTexture: { value: tipTextureRef.current },
        uTipRadius: { value: tipRadius },
        uTipLayers: { value: tipLayers },
        uSizeVariance: { value: sizeVariance },
        uDispersionBand: { value: dispersionBand },
        uDispersion: { value: dispersion },
        uDispersionOffset: { value: dispersionOffset },
        uTime: { value: 0 },
      },
      vertexShader: DRAW_VERTEX_SHADER,
      fragmentShader: DRAW_FRAGMENT_SHADER,
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
    drawMaterialRef.current = drawMaterial
    scene.add(new Mesh(geometry, drawMaterial))

    // --- Loop ------------------------------------------------------------
    let lastTime = 0
    let isVisible = document.visibilityState === "visible"
    let isIntersecting = false

    const syncLoop = () => {
      if (session.halted()) {
        renderer.setAnimationLoop(null)
        return
      }
      renderer.setAnimationLoop(
        isVisible && isIntersecting ? renderFrame : null,
      )
    }
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible"
      syncLoop()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    function renderFrame(timeMs: number) {
      if (session.shouldStop()) return
      const time = timeMs * 0.001
      const delta = Math.min(time - lastTime, MAX_FRAME_DELTA)
      lastTime = time

      simMaterial.uniforms.tPrev.value = simCurrent.texture
      simMaterial.uniforms.uDelta.value = delta
      simMaterial.uniforms.uSimSpring.value = simSpringRef.current
      simMaterial.uniforms.uSimDamping.value = simDampingRef.current
      simMaterial.uniforms.uSimMaxVelocity.value = simMaxVelocityRef.current
      simMaterial.uniforms.uSpringVariance.value = springVarianceRef.current
      simMaterial.uniforms.uOpacitySpeed.value = opacitySpeedRef.current

      renderer.setRenderTarget(simNext)
      renderer.render(simScene, quadCamera)
      renderer.setRenderTarget(null)

      const swap = simCurrent
      simCurrent = simNext
      simNext = swap
      simTextureRef.current = simCurrent.texture

      drawMaterial.uniforms.tSim.value = simCurrent.texture
      drawMaterial.uniforms.uTime.value = time
      drawMaterial.uniforms.uTipRadius.value = tipRadiusRef.current
      drawMaterial.uniforms.uSizeVariance.value = sizeVarianceRef.current
      drawMaterial.uniforms.uDispersionBand.value = dispersionBandRef.current
      drawMaterial.uniforms.uDispersion.value = dispersionRef.current
      drawMaterial.uniforms.uDispersionOffset.value =
        dispersionOffsetRef.current

      if (debugSimMaterialRef.current) {
        debugSimMaterialRef.current.uniforms.tDebug.value =
          simTextureRef.current
      }

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
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      cameraRef.current = null
      simMaterialRef.current = null
      drawMaterialRef.current = null
      rendererRef.current = null
      sceneRef.current = null
      dataTextureRef.current = null
      simTextureRef.current = null
      simCurrent.dispose()
      simNext.dispose()
      dataTexture.dispose()
      simMaterial.dispose()
      quadGeometry.dispose()
      simScene.clear()
      geometry.dispose()
      drawMaterial.dispose()
      scene.clear()
      renderer.dispose()
      if (mount.contains(canvas)) mount.removeChild(canvas)
      setTimeout(() => renderer.forceContextLoss(), 1)
    }
    // Rebuilt only on an explicit refresh, a tip-layer change (which changes
    // the vertex count) or a GPU epoch bump from the guard. Shape and camera
    // changes are pushed through uniforms by the effects above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, tipLayers, gpuEpoch])

  // Two small planes showing the static data texture and the live simulation
  // texture, for checking the atlas layout by eye.
  useEffect(() => {
    if (!debugMode) return
    const scene = sceneRef.current
    if (!scene) return

    const size = 0.3
    const dataGeometry = new PlaneGeometry(size, size)
    const dataMaterial = new ShaderMaterial({
      uniforms: { tDebug: { value: dataTextureRef.current } },
      vertexShader: DEBUG_VERTEX_SHADER,
      fragmentShader: DEBUG_FRAGMENT_SHADER,
      depthTest: false,
      transparent: false,
    })
    const dataMesh = new Mesh(dataGeometry, dataMaterial)
    dataMesh.position.set(-0.4, -0.4, 0.5)
    scene.add(dataMesh)

    const simGeometry = new PlaneGeometry(size, size)
    const simMaterial = new ShaderMaterial({
      uniforms: { tDebug: { value: simTextureRef.current } },
      vertexShader: DEBUG_VERTEX_SHADER,
      fragmentShader: DEBUG_FRAGMENT_SHADER,
      depthTest: false,
      transparent: false,
    })
    const simMesh = new Mesh(simGeometry, simMaterial)
    simMesh.position.set(0.4, -0.4, 0.5)
    scene.add(simMesh)

    debugDataMeshRef.current = dataMesh
    debugSimMeshRef.current = simMesh
    debugDataGeometryRef.current = dataGeometry
    debugSimGeometryRef.current = simGeometry
    debugDataMaterialRef.current = dataMaterial
    debugSimMaterialRef.current = simMaterial

    return () => {
      const current = sceneRef.current
      if (current && debugDataMeshRef.current) {
        current.remove(debugDataMeshRef.current)
      }
      if (current && debugSimMeshRef.current) {
        current.remove(debugSimMeshRef.current)
      }
      debugDataGeometryRef.current?.dispose()
      debugSimGeometryRef.current?.dispose()
      debugDataMaterialRef.current?.dispose()
      debugSimMaterialRef.current?.dispose()
      debugDataMeshRef.current = null
      debugSimMeshRef.current = null
      debugDataGeometryRef.current = null
      debugSimGeometryRef.current = null
      debugDataMaterialRef.current = null
      debugSimMaterialRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugMode, refresh, tipLayers, gpuEpoch])

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
 * The standalone field used inside a graphics row (a 410px-tall container,
 * one field per column). Its `currentShape` is stepped by breakpoint rather
 * than by scroll: 0 at the base layout, 1 and 2 at the two breakpoints that
 * override it.
 */
export const PANEL_GRAPHIC_FIELD: PointMorphFieldProps = {
  cameraFov: 34,
  cameraPosition: { x: 0, y: 0, z: 2 },
  currentShape: 0,
  debugMode: false,
  dispersion: 0.8,
  dispersionBand: 0.9,
  dispersionOffset: 0.05,
  fallbackAlt: "",
  fallbackFit: "cover",
  opacitySpeed: 5.3,
  refresh: false,
  shapes: PANEL_GRAPHIC_SHAPES,
  simDamping: 7,
  simMaxVelocity: 9.5,
  simSpring: 60,
  sizeVariance: 0.5,
  springVariance: 22.6,
  tipLayers: 8,
  tipRadius: 0.0045,
  tipTexture: TIP_TEXTURE,
}

/**
 * The field behind the feature section's card stack. Its `currentShape` is
 * stepped by scroll progress through the section, which is what
 * `ScrollShapeStage` drives.
 */
export const FEATURE_STAGE_FIELD: PointMorphFieldProps = {
  cameraFov: 34,
  cameraPosition: { x: 0, y: 0, z: 1.8 },
  debugMode: false,
  dispersion: 0.8,
  dispersionBand: 0.9,
  dispersionOffset: 0.05,
  fallbackAlt: "",
  fallbackFit: "contain",
  fallbackImage: STAGE_FALLBACK_IMAGE,
  opacitySpeed: 5.3,
  refresh: false,
  shapes: FEATURE_STAGE_SHAPES,
  simDamping: 7,
  simMaxVelocity: 9.5,
  simSpring: 60,
  sizeVariance: 0.5,
  springVariance: 22.6,
  tipLayers: 8,
  tipRadius: 0.003,
  tipTexture: TIP_TEXTURE,
}

export default PointMorphField
