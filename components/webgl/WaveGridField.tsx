"use client"

import { useEffect, useMemo, useRef } from "react"
import { animate, useMotionValue, useSpring } from "motion/react"
import {
  AddEquation,
  BufferAttribute,
  BufferGeometry,
  CustomBlending,
  LinearFilter,
  LinearMipmapLinearFilter,
  OneFactor,
  PerspectiveCamera,
  Points,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from "three"

import { createGuardedRenderer, useWebGLGuard } from "./guard"

/**
 * A flat grid of points displaced vertically by fractal Brownian noise.
 *
 * The grid is `gridDivisions^2` points repeated over `layers` stacked copies;
 * every copy shares the same xz positions and per-point randoms, and differs
 * only in the `w` channel, which slices the noise field at a slightly
 * different depth and picks a different column out of the dispersion map. The
 * vertex shader takes exactly three fbm samples per point: one for the
 * displacement and two more, offset by `NOISE_EPS` along x and z, to build the
 * tangent-plane normal analytically. The fragment shader shades that normal
 * against a light direction, discards the corners of each point sprite to make
 * a disc, and dims the sprite in proportion to how much the depth-of-field
 * term grew it, so a blurred point spreads its energy instead of gaining any.
 *
 * Everything except the octave count and the layer count is pushed through
 * uniforms each frame, so a caller can retune the field live without paying
 * for a rebuild of the point cloud.
 */

/** Local copy of the 256x256 gradient strip the points sample their colour from. */
const DISPERSION_MAP = "/img/img-065be4afe6.png"
/** Still image shown when the GPU cannot run the field. */
const FIELD_FALLBACK_IMAGE = "/img/img-469e6aee23.png"

/** Width of the grid in world units. */
const GRID_SIZE = 5
/** Points per side. The cloud is this squared, times the layer count. */
const GRID_DIVISIONS = 256
/** Row of the dispersion map the point colours are read from. */
const DISPERSION_OFFSET = 0.8
/** How far the horizontal mouse offset pushes the sampled noise coordinates. */
const MOUSE_SCALE = 0.1
/** Longest frame the clock will accept, in seconds. */
const MAX_FRAME_DELTA = 0.1

export interface WaveGridFieldProps {
  /** URL of the gradient strip the points read their colour out of. */
  dispersionMap?: string
  /** fbm output amplitude, i.e. the height of the wave in world units. */
  waveHeightScale?: number
  /** Starting coordinate scale for octave 0. */
  noiseFrequency?: number
  /** Octaves summed per fbm sample. Clamped to 1..3; changing it rebuilds. */
  octaves?: number
  /** Stacked copies of the grid. Clamped to 1..8; changing it rebuilds. */
  layers?: number
  /** Per-octave amplitude falloff. */
  ampWeight?: number
  /** How far apart each layer slices the noise field. */
  noiseLayerSpread?: number
  /** Direction the noise drifts through as time advances. */
  noiseOffsetX?: number
  noiseOffsetY?: number
  noiseOffsetZ?: number
  /** Direction the heightfield normal is shaded against. */
  lightX?: number
  lightY?: number
  lightZ?: number
  /** Camera position in world units. */
  cameraPositionX?: number
  cameraPositionY?: number
  cameraPositionZ?: number
  /** Camera rotation in radians. */
  cameraRotationX?: number
  cameraRotationY?: number
  cameraRotationZ?: number
  /** Multiplier on how fast the noise field drifts. */
  timeScale?: number
  /** Base sprite size, before the perspective and blur scaling. */
  pointSize?: number
  /** Distance from the camera that stays sharp, in world units. */
  focalDistance?: number
  /** How far either side of `focalDistance` the blur ramps over. */
  focalRange?: number
  /** How much out-of-focus points grow (and correspondingly dim). */
  blurStrength?: number
  /** Overall brightness multiplier, applied after the per-layer division. */
  intensity?: number
  fallbackImage?: string
  fallbackFit?: "cover" | "contain" | "fill"
  fallbackAlt?: string
  className?: string
  style?: React.CSSProperties
}

/** One built grid: flat position and random buffers plus the point count. */
interface GridBuffers {
  positions: Float32Array
  random: Float32Array
  count: number
}

/**
 * Builds the point cloud. Layer 0 rolls the three xyz randoms for each grid
 * cell and every further layer reuses them, so a column of stacked points
 * shares a colour and only its `w` (and therefore its noise slice) differs.
 */
function buildGrid(
  gridSize: number,
  gridDivisions: number,
  gridLayers: number,
): GridBuffers {
  const perLayer = gridDivisions * gridDivisions
  const count = perLayer * gridLayers
  const positions = new Float32Array(count * 3)
  const random = new Float32Array(count * 4)
  const sharedRandom = new Float32Array(perLayer * 3)
  const half = gridSize / 2
  const step = gridSize / (gridDivisions - 1)

  for (let layer = 0; layer < gridLayers; layer++) {
    const w = gridLayers > 1 ? -1 + (2 * layer) / (gridLayers - 1) : 0
    let cell = 0
    for (let ix = 0; ix < gridDivisions; ix++) {
      for (let iz = 0; iz < gridDivisions; iz++) {
        const index = layer * perLayer + cell
        const p = index * 3
        const r = index * 4
        positions[p + 0] = -half + ix * step
        positions[p + 1] = 0
        positions[p + 2] = -half + iz * step
        if (layer === 0) {
          sharedRandom[cell * 3 + 0] = Math.random()
          sharedRandom[cell * 3 + 1] = Math.random()
          sharedRandom[cell * 3 + 2] = Math.random()
        }
        random[r + 0] = sharedRandom[cell * 3 + 0]
        random[r + 1] = sharedRandom[cell * 3 + 1]
        random[r + 2] = sharedRandom[cell * 3 + 2]
        random[r + 3] = w
        cell++
      }
    }
  }

  return { positions, random, count }
}

/** Loads the dispersion strip and returns a disposer. */
function loadTexture(
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

/** The octave count is a compile-time constant, so the shader is built per value. */
const buildVertexShader = (octaves: number) => `
        precision highp float;

        #define OCTAVES ${octaves}

        attribute vec4 random;

        varying vec4 vRandom;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying float vFactor;
        varying float vBlur;

        uniform float uTime;
        uniform float uGridSize;
        uniform float uPointSize;
        uniform sampler2D uDispersionMap;

        uniform float uDispersionOffset; // 0.8, row into the dispersion (color) map
        uniform float uNoiseFrequency;   // starting coordinate scale for octave 0
        uniform float uWaveHeightScale;  // 0.1 — also used as fbm's output amplitude
        uniform float uAmpWeight;        // fbm per-octave amplitude falloff, 0.5
        uniform float uNoiseLayerSpread; // how far apart each layer slices the field
        uniform vec3 uNoiseOffset;       // direction the noise drifts through over time

        uniform float uIntensity; // 2.0

        uniform float uFocalDistance;
        uniform float uFocalRange;
        uniform float uBlurStrength;

        uniform vec2 uMouse;
        uniform float uMouseScale;

        // --- fbm noise (gradient noise, 3D) ---

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

        // fbm: samples xyz across OCTAVES, each octave drifting through
        // the noise field as t advances.
        //
        // - ampWeight: fbm per-octave amplitude falloff.
        // - frequency: starting coordinate scale for octave 0. Each further
        //   octave samples at half that scale, layering broader variation
        //   underneath the base octave.
        // - offset: direction the noise drifts through as t increases.
        // - t: current time.
        float fractalBrownian(
            const in vec3 xyz,
            const in float ampWeight,
            const in float frequency,
            const in vec3 offset,
            in float t
        ) {
            float result=0.0; float amp=1.0; float freq = 1.0; float maxAmp=0.0;
            for(int i=0;i<OCTAVES;i++){
                result += amp * perlin(xyz * freq * frequency + offset * t);
                maxAmp += amp;
                amp *= ampWeight;
                freq *= 2.0;
            }
            return result / maxAmp;
        }
        

        const float NOISE_EPS = 0.015; // tangent-plane sample offset, world units

        void main() {
            vRandom = random;
            vPosition = position;

            vec2 uv = position.xz / uGridSize * 2.0;
            float factor = clamp(1.0 - distance(uv, vec2(0.0)), 0.0, 1.0);
            vFactor = factor * factor;

            vec2 planeXZ = position.xz - vec2(uMouse.x * uMouseScale, 0.0);

            // Static per-layer separation — each of the layers samples a
            // different point along the noise field's z axis, independent
            // of the time-based drift below.
            float layerSlice = random.w * uNoiseLayerSpread;

            vec3 baseCoord = vec3(planeXZ, layerSlice);
            vec3 coordT = vec3(planeXZ + vec2(NOISE_EPS, 0.0), layerSlice);
            vec3 coordB = vec3(planeXZ + vec2(0.0, NOISE_EPS), layerSlice);

            // Exactly 3 fbm samples total: 1 for displacement, 2 for the
            // tangent-plane normal (see the chat writeup for why 3, not 6).
            // uWaveHeightScale is now fbm's amplitude, so h/hT/hB come back
            // already scaled — no separate multiply needed below.
            float h  = fractalBrownian(baseCoord, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;
            float hT = fractalBrownian(coordT, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;
            float hB = fractalBrownian(coordB, uAmpWeight, uNoiseFrequency, uNoiseOffset, uTime) * uWaveHeightScale;

            float dhdx = (hT - h) / NOISE_EPS;
            float dhdz = (hB - h) / NOISE_EPS;

            // Standard heightfield normal: N = normalize(-dy/dx, 1, -dy/dz).
            // Only the edge falloff (factor) still needs applying here —
            // the amplitude is already baked into dhdx/dhdz via fbm.
            vNormal = normalize(vec3(-dhdx * factor, 1.0, -dhdz * factor));

            vec3 dispPosition = position + vec3(0.0, h * factor, 0.0);

            vec2 dispersionUV = vec2((random.w * 0.7 + 1.0) / 2.0, uDispersionOffset);
            vColor = texture2D(uDispersionMap, dispersionUV).xyz;

            vec4 mvPosition = modelViewMatrix * vec4(dispPosition, 1.0);

            float cameraDist = length(mvPosition.xyz);
            float focalDelta = abs(cameraDist - uFocalDistance);
            float blur = clamp(focalDelta / uFocalRange, 0.0, 1.0);
            vBlur = blur;

            gl_PointSize = uPointSize * (1.0 + blur * uBlurStrength) * (1.0 / -mvPosition.z); // perspective scale
            gl_Position = projectionMatrix * mvPosition;
        }
    `

const FRAGMENT_SHADER = `
        varying vec4 vRandom;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying float vFactor;
        varying float vBlur;

        uniform float uTime;
        uniform float uNumLayers;

        uniform float uIntensity; // 2.0

        uniform float uFocalDistance;
        uniform float uFocalRange;
        uniform float uBlurStrength;

        uniform vec3 uLightDirection;

        void main() {
            // gl_PointCoord is the UV across the quad (0..1)
            // This draws a circle by discarding corners
            vec2 quadUV = gl_PointCoord - 0.5;
            if (length(quadUV) > 0.5) discard;

            vec3 col = vColor;
            vec3 normal = normalize(vNormal);

            float alpha = clamp((dot(normal, normalize(uLightDirection))) * vFactor, 0.0, 1.0);
            float randomOpacity = mix(1.0, 1.0, sin(vRandom.y * 3.14 * 2.0 + uTime * 0.5) * 0.5 + 0.5);  
            alpha *= randomOpacity;

            // Physically motivated dimming — energy spreads as point grows
            float enlargedSize = 1.0 + vBlur * uBlurStrength;
            float energyFactor = 1.3 / (enlargedSize * enlargedSize);
            alpha *= energyFactor;

            alpha = clamp(alpha / uNumLayers * uIntensity, 0.0, 1.0);

            gl_FragColor = vec4(col * alpha, alpha);
        }
    `

export function WaveGridField({
  dispersionMap = DISPERSION_MAP,
  waveHeightScale = 0.1,
  noiseFrequency = 1,
  octaves = 2,
  layers = 3,
  ampWeight = 0.5,
  noiseLayerSpread = 0,
  noiseOffsetX = 0.2,
  noiseOffsetY = 0,
  noiseOffsetZ = 0.01,
  lightX = 0.5,
  lightY = 1,
  lightZ = 0,
  cameraPositionX = -1,
  cameraPositionY = 0.4,
  cameraPositionZ = 1.3,
  cameraRotationX = -0.1,
  cameraRotationY = -0.5,
  cameraRotationZ = 0.1,
  timeScale = 1,
  pointSize = 3,
  focalDistance = 1.5,
  focalRange = 1,
  blurStrength = 2,
  intensity = 1,
  fallbackImage,
  fallbackFit = "cover",
  fallbackAlt = "",
  className,
  style,
}: WaveGridFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const loaderRef = useRef(new TextureLoader())
  const dispersionTextureRef = useRef<Texture | null>(null)

  const { webglAvailable, gpuEpoch, beginSession } =
    useWebGLGuard("WaveGridField")

  // The two values baked into the shader and the buffer layout. Everything
  // else below rides a ref or a motion value and survives a prop change.
  const octaveCount = Math.min(3, Math.max(1, Math.round(octaves)))
  const layerCount = Math.min(8, Math.max(1, Math.round(layers)))

  // Amplitude, frequency and time scale are eased rather than snapped, so a
  // caller switching the field between phases gets a 1-2s ramp for free.
  const waveHeightScaleValue = useMotionValue(waveHeightScale)
  const waveHeightScaleRef = useRef(waveHeightScale)
  const noiseFrequencyValue = useMotionValue(noiseFrequency)
  const noiseFrequencyRef = useRef(noiseFrequency)
  const timeScaleValue = useMotionValue(timeScale)
  const timeScaleRef = useRef(timeScale)

  const ampWeightRef = useRef(ampWeight)
  const noiseLayerSpreadRef = useRef(noiseLayerSpread)
  const noiseOffset = useMemo(
    () => new Vector3(noiseOffsetX, noiseOffsetY, noiseOffsetZ),
    [noiseOffsetX, noiseOffsetY, noiseOffsetZ],
  )
  const noiseOffsetRef = useRef(noiseOffset)
  const lightDirection = useMemo(
    () => new Vector3(lightX, lightY, lightZ),
    [lightX, lightY, lightZ],
  )
  const lightDirectionRef = useRef(lightDirection)
  const cameraPositionXRef = useRef(cameraPositionX)
  const cameraPositionYRef = useRef(cameraPositionY)
  const cameraPositionZRef = useRef(cameraPositionZ)
  const cameraRotationXRef = useRef(cameraRotationX)
  const cameraRotationYRef = useRef(cameraRotationY)
  const cameraRotationZRef = useRef(cameraRotationZ)
  const pointSizeRef = useRef(pointSize)
  const focalDistanceRef = useRef(focalDistance)
  const focalRangeRef = useRef(focalRange)
  const blurStrengthRef = useRef(blurStrength)
  const intensityRef = useRef(intensity)

  // Mouse drift. x accumulates raw pointer movement, y tracks the cursor's
  // height in the box; both are spring-smoothed before they reach the shader.
  const mouseXValue = useMotionValue(0)
  const mouseYValue = useMotionValue(1)
  const mouseXSpring = useSpring(mouseXValue, { stiffness: 50, damping: 20 })
  const mouseYSpring = useSpring(mouseYValue, { stiffness: 50, damping: 20 })

  useEffect(
    () =>
      waveHeightScaleValue.on("change", (value) => {
        waveHeightScaleRef.current = value
      }),
    [waveHeightScaleValue],
  )
  useEffect(
    () =>
      noiseFrequencyValue.on("change", (value) => {
        noiseFrequencyRef.current = value
      }),
    [noiseFrequencyValue],
  )
  useEffect(
    () =>
      timeScaleValue.on("change", (value) => {
        timeScaleRef.current = value
      }),
    [timeScaleValue],
  )

  useEffect(() => {
    animate(waveHeightScaleValue, waveHeightScale, {
      duration: 2,
      ease: "easeOut",
    })
  }, [waveHeightScale, waveHeightScaleValue])
  useEffect(() => {
    animate(noiseFrequencyValue, noiseFrequency, {
      duration: 2,
      ease: "easeOut",
    })
  }, [noiseFrequency, noiseFrequencyValue])
  useEffect(() => {
    animate(timeScaleValue, timeScale, { duration: 1, ease: "easeOut" })
  }, [timeScale, timeScaleValue])

  useEffect(() => {
    ampWeightRef.current = ampWeight
  }, [ampWeight])
  useEffect(() => {
    noiseLayerSpreadRef.current = noiseLayerSpread
  }, [noiseLayerSpread])
  useEffect(() => {
    noiseOffsetRef.current = noiseOffset
  }, [noiseOffset])
  useEffect(() => {
    lightDirectionRef.current = lightDirection
  }, [lightDirection])
  useEffect(() => {
    cameraPositionXRef.current = cameraPositionX
  }, [cameraPositionX])
  useEffect(() => {
    cameraPositionYRef.current = cameraPositionY
  }, [cameraPositionY])
  useEffect(() => {
    cameraPositionZRef.current = cameraPositionZ
  }, [cameraPositionZ])
  useEffect(() => {
    cameraRotationXRef.current = cameraRotationX
  }, [cameraRotationX])
  useEffect(() => {
    cameraRotationYRef.current = cameraRotationY
  }, [cameraRotationY])
  useEffect(() => {
    cameraRotationZRef.current = cameraRotationZ
  }, [cameraRotationZ])
  useEffect(() => {
    pointSizeRef.current = pointSize
  }, [pointSize])
  useEffect(() => {
    focalDistanceRef.current = focalDistance
  }, [focalDistance])
  useEffect(() => {
    focalRangeRef.current = focalRange
  }, [focalRange])
  useEffect(() => {
    blurStrengthRef.current = blurStrength
  }, [blurStrength])
  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const session = beginSession()
    const guarded = createGuardedRenderer(session, {
      params: { antialias: true, alpha: true, premultipliedAlpha: true },
      requirements: { vertexTextures: true },
    })
    if (!guarded) return

    const renderer = guarded.renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    const scene = new Scene()
    const camera = new PerspectiveCamera(
      30,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    )
    camera.position.set(
      cameraPositionXRef.current,
      cameraPositionYRef.current,
      cameraPositionZRef.current,
    )
    camera.rotation.set(
      cameraRotationXRef.current,
      cameraRotationYRef.current,
      cameraRotationZRef.current,
    )

    const config = {
      gridSize: GRID_SIZE,
      gridDivisions: GRID_DIVISIONS,
      gridLayers: layerCount,
      pointSize,
      dispersionOffset: DISPERSION_OFFSET,
      noiseFrequency,
      waveHeightScale,
      ampWeight,
      noiseLayerSpread,
      intensity,
      focalDistance,
      focalRange,
      blurStrength,
      mouseScale: MOUSE_SCALE,
    }

    const { positions, random } = buildGrid(
      config.gridSize,
      config.gridDivisions,
      config.gridLayers,
    )

    const geometry = new BufferGeometry()
    geometry.setAttribute("position", new BufferAttribute(positions, 3))
    geometry.setAttribute("random", new BufferAttribute(random, 4))

    const material = new ShaderMaterial({
      uniforms: {
        uDispersionMap: { value: null },
        uTime: { value: 0 },
        uGridSize: { value: config.gridSize },
        uPointSize: { value: config.pointSize },
        uNumLayers: { value: config.gridLayers },
        uDispersionOffset: { value: config.dispersionOffset },
        uNoiseFrequency: { value: config.noiseFrequency },
        uWaveHeightScale: { value: config.waveHeightScale },
        uAmpWeight: { value: config.ampWeight },
        uNoiseLayerSpread: { value: config.noiseLayerSpread },
        uIntensity: { value: config.intensity },
        uFocalDistance: { value: config.focalDistance },
        uFocalRange: { value: config.focalRange },
        uBlurStrength: { value: config.blurStrength },
        uMouse: { value: new Vector2(0, 1) },
        uMouseScale: { value: config.mouseScale },
        uLightDirection: { value: lightDirectionRef.current.clone() },
        uNoiseOffset: { value: noiseOffsetRef.current.clone() },
      },
      vertexShader: buildVertexShader(octaveCount),
      fragmentShader: FRAGMENT_SHADER,
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
    materialRef.current = material
    if (dispersionTextureRef.current) {
      material.uniforms.uDispersionMap.value = dispersionTextureRef.current
    }

    const points = new Points(geometry, material)
    scene.add(points)

    // --- Loop ------------------------------------------------------------
    let isVisible = document.visibilityState === "visible"
    let isIntersecting = false

    const syncLoop = () => {
      if (session.halted()) {
        renderer.setAnimationLoop(null)
        return
      }
      renderer.setAnimationLoop(isVisible && isIntersecting ? renderFrame : null)
    }
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible"
      syncLoop()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    // The shader's clock is integrated rather than read straight off the
    // frame stamp, so changing the time scale bends the drift from here on
    // instead of jumping the whole field to a new point in the noise.
    let lastTime = 0
    let noiseTime = 0

    function renderFrame(timeMs: number) {
      if (session.shouldStop()) return
      const time = timeMs * 0.001
      const delta = Math.min(time - lastTime, MAX_FRAME_DELTA)
      lastTime = time
      noiseTime += delta * timeScaleRef.current

      material.uniforms.uTime.value = noiseTime
      material.uniforms.uWaveHeightScale.value = waveHeightScaleRef.current
      material.uniforms.uNoiseFrequency.value = noiseFrequencyRef.current
      material.uniforms.uAmpWeight.value = ampWeightRef.current
      material.uniforms.uNoiseLayerSpread.value = noiseLayerSpreadRef.current
      material.uniforms.uNoiseOffset.value.copy(noiseOffsetRef.current)
      material.uniforms.uLightDirection.value.copy(lightDirectionRef.current)
      camera.position.set(
        cameraPositionXRef.current,
        cameraPositionYRef.current,
        cameraPositionZRef.current,
      )
      camera.rotation.set(
        cameraRotationXRef.current,
        cameraRotationYRef.current,
        cameraRotationZRef.current,
      )
      material.uniforms.uPointSize.value = pointSizeRef.current
      material.uniforms.uFocalDistance.value = focalDistanceRef.current
      material.uniforms.uFocalRange.value = focalRangeRef.current
      material.uniforms.uBlurStrength.value = blurStrengthRef.current
      material.uniforms.uIntensity.value = intensityRef.current
      material.uniforms.uMouse.value.set(mouseXSpring.get(), mouseYSpring.get())

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

    const onMouseMove = (event: MouseEvent) => {
      mouseXValue.set(mouseXValue.get() + event.movementX * 0.001)
      mouseYValue.set(1 - event.offsetY / mount.clientHeight)
    }
    mount.addEventListener("mousemove", onMouseMove)

    session.ready()

    return () => {
      session.end()
      guarded.detach()
      renderer.setAnimationLoop(null)
      mount.removeEventListener("mousemove", onMouseMove)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      geometry.dispose()
      material.dispose()
      materialRef.current = null
      scene.clear()
      renderer.dispose()
      if (mount.contains(canvas)) mount.removeChild(canvas)
      setTimeout(() => renderer.forceContextLoss(), 1)
    }
    // Rebuilt only when the octave count (baked into the shader) or the layer
    // count (baked into the buffers) changes, or the guard bumps the epoch.
    // Every other prop is read off a ref inside the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [octaveCount, layerCount, gpuEpoch])

  useEffect(() => {
    if (!dispersionMap) return
    return loadTexture(loaderRef.current, dispersionMap, (texture) => {
      dispersionTextureRef.current = texture
      if (materialRef.current) {
        materialRef.current.uniforms.uDispersionMap.value = texture
      }
    })
  }, [dispersionMap])

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
 * The field as it sits behind the mock chat panel: a wide, slow, very faint
 * wave, seen from a low camera off to the left. The panel's own container
 * supplies the 0.3 opacity and the bottom-up mask, so this is the unmasked
 * field.
 */
export const PANEL_WAVE_FIELD: WaveGridFieldProps = {
  ampWeight: 0.5,
  blurStrength: 5,
  cameraPositionX: -1,
  cameraPositionY: 0.4,
  cameraPositionZ: 1.3,
  cameraRotationX: -0.1,
  cameraRotationY: -0.5,
  cameraRotationZ: 0.1,
  dispersionMap: DISPERSION_MAP,
  fallbackAlt: "",
  fallbackFit: "cover",
  fallbackImage: FIELD_FALLBACK_IMAGE,
  focalDistance: 1.6,
  focalRange: 0.54,
  intensity: 10,
  layers: 3,
  lightX: 1,
  lightY: 0.2,
  lightZ: 0,
  noiseFrequency: 2,
  noiseLayerSpread: 0.005,
  noiseOffsetX: 1.97,
  noiseOffsetY: 0,
  noiseOffsetZ: 0,
  octaves: 2,
  pointSize: 2,
  timeScale: 0.05,
  waveHeightScale: 0.1,
}

/** The phases the mock panel's loop steps through. */
export type WaveGridPhase = "base" | "chatStart" | "thinking" | "results"

/**
 * Per-phase overrides on top of `PANEL_WAVE_FIELD`. None of these four props
 * rebuilds the point cloud, and all four are eased rather than snapped, so
 * the section that owns the panel can spread them straight onto the field as
 * its loop advances: the wave gets choppier and roughly six times faster
 * while the panel is thinking or showing results, and drifts at a middling
 * speed as a new conversation opens.
 */
export const PANEL_WAVE_PHASES: Record<
  WaveGridPhase,
  Partial<WaveGridFieldProps>
> = {
  base: {},
  chatStart: { timeScale: 0.25 },
  thinking: {
    noiseFrequency: 3,
    noiseLayerSpread: 0.01,
    timeScale: 0.31,
    waveHeightScale: 0.14,
  },
  results: {
    noiseFrequency: 3,
    noiseLayerSpread: 0.01,
    timeScale: 0.31,
    waveHeightScale: 0.14,
  },
}

export default WaveGridField
