"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { SHAPES } from "./shapes";

/* Camera the reference points at the field: 34 degrees of vertical FOV from
   z = 1.8, so one world unit maps to height / (2 * 1.8 * tan(17deg)) pixels. */
const CAMERA_FOV = 34;
const CAMERA_Z = 1.8;
const WORLD_PER_PX = CAMERA_Z * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));

/* Particle look. The reference runs a GPU filament simulation for this; the
   shapes, their scales and thresholds below are its real inputs, and the rest
   is a lightweight 2D renderer of the same point cloud. */
// TODO(spec): the reference draws these points as simulated filaments with
// glowing tips in WebGL; this renders the same point set as dispersed dots.
const DISPERSION = 0.8;
const DISPERSION_BAND = 0.9;
const DISPERSION_OFFSET = 0.05;
const DOT_COLOR = "250, 250, 250";
const MORPH_MS = 900;

function clamp(min: number, max: number, v: number) {
  return Math.min(Math.max(v, min), max);
}

/** Triangle wave over each of `count` equal slices of 0..1, from -1 to 1. */
function slicePhase(value: number, count: number) {
  const size = 1 / count;
  const a = ((((value % size) % size) + size) % size) / size;
  return a < 0.5 ? 4 * a - 1 : 3 - 4 * a;
}

/* Deterministic per-particle randomness, so the field is identical on every
   render and between server and client. */
function hash(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Particle = {
  /** index into each shape's point list */
  idx: number;
  /** radial push applied to the dispersed half of the cloud */
  push: number;
  angleJitter: number;
  size: number;
  alpha: number;
  driftPhase: number;
  driftSpeed: number;
  r0: number;
};

const POINT_COUNT = Math.max(...SHAPES.map((s) => s.points.length / 2));
const PARTICLES: Particle[] = Array.from({ length: POINT_COUNT }, (_, i) => {
  const r0 = hash(i, 1);
  return {
    idx: i,
    push: (hash(i, 2) - 0.4) * DISPERSION * 0.3,
    angleJitter: (hash(i, 3) - 0.5) * DISPERSION_BAND * 0.16,
    size: 0.7 + hash(i, 4) * hash(i, 8) * 2,
    alpha: 0.08 + hash(i, 5) * hash(i, 9) * 0.6,
    driftPhase: hash(i, 6) * Math.PI * 2,
    driftSpeed: 0.15 + hash(i, 7) * 0.35,
    r0,
  };
});

function shapePoint(shape: number, i: number, out: { x: number; y: number }) {
  const s = SHAPES[shape];
  const n = s.points.length / 2;
  const k = (i % n) * 2;
  out.x = s.points[k] * s.scale;
  out.y = s.points[k + 1] * s.scale;
}

export function ParticleField({ currentShape }: { currentShape: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef({ from: currentShape, to: currentShape, at: 0 });

  useEffect(() => {
    const s = shapeRef.current;
    if (s.to !== currentShape) {
      s.from = s.to;
      s.to = currentShape;
      s.at = performance.now();
    }
  }, [currentShape]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = { x: 0, y: 0 };
    const b = { x: 0, y: 0 };
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const s = shapeRef.current;
      const t = s.at === 0 ? 1 : clamp(0, 1, (now - s.at) / MORPH_MS);
      const mix = t * t * (3 - 2 * t);
      const time = reduce ? 0 : now / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const k = h / (2 * WORLD_PER_PX);
      const cx = w / 2;
      const cy = h / 2;
      // A smaller box packs the same point count into less area, so the cloud
      // is thinned to keep the density the reference has at full size.
      const density = clamp(0.5, 1, h / 508);
      const thresh =
        SHAPES[s.from].threshold + (SHAPES[s.to].threshold - SHAPES[s.from].threshold) * mix;

      for (const p of PARTICLES) {
        shapePoint(s.from, p.idx, a);
        shapePoint(s.to, p.idx, b);
        let x = a.x + (b.x - a.x) * mix;
        let y = a.y + (b.y - a.y) * mix;

        // Particles above the shape's threshold stay loose around the outline.
        if (p.r0 >= thresh) {
          const len = Math.hypot(x, y) || 1;
          const drift = Math.sin(time * p.driftSpeed + p.driftPhase);
          const push = p.push + DISPERSION_OFFSET * drift;
          x += (x / len) * push - (y / len) * p.angleJitter;
          y += (y / len) * push + (x / len) * p.angleJitter;
        } else {
          const drift = Math.sin(time * p.driftSpeed * 0.6 + p.driftPhase);
          x += drift * 0.006 + p.angleJitter * 0.12;
          y += Math.cos(time * p.driftSpeed * 0.6 + p.driftPhase) * 0.006 - p.push * 0.1;
        }

        const px = cx + x * k;
        const py = cy - y * k;
        const alpha = p.alpha * (p.r0 >= thresh ? 0.75 : 1) * density;
        ctx.fillStyle = `rgba(${DOT_COLOR}, ${alpha.toFixed(3)})`;
        ctx.fillRect(px, py, p.size, p.size);
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

/**
 * The particle field plus the graphic it carries. Which graphic shows is the
 * scroll progress of the section named by `sectionName`, measured over
 * ['start center', 'end center'] and sliced into as many steps as there are
 * children; the graphic fades out near each boundary and back in after it.
 * Ported from the reference's own component, not a whileInView stand-in.
 */
export function ShapeField({
  sectionName,
  children,
}: {
  sectionName: string;
  children: ReactNode[];
}) {
  const target = useRef<HTMLElement | null>(null);
  // Resolved during render so the scroll listener below sees it on first pass;
  // the element is already in the document by the time the client runs.
  if (typeof document !== "undefined" && !target.current) {
    target.current = document.getElementById(sectionName);
  }
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = children.length;
  const { scrollYProgress } = useScroll({
    target: target as React.RefObject<HTMLElement>,
    offset: ["start center", "end center"],
  });

  const [index, setIndex] = useState(0);
  useEffect(
    () =>
      scrollYProgress.on("change", (v) => {
        if (count === 0) return;
        setIndex(clamp(0, count - 1, Math.floor(v * count)));
      }),
    [scrollYProgress, count],
  );

  const edge = 1 / (count * 2);
  const inner = useTransform(scrollYProgress, (v) => clamp(edge, 1 - edge, v));
  const shown = useTransform(inner, (v) => slicePhase(v, count) * 0.5 + 0.3 > 0);
  const [visible, setVisible] = useState(true);
  useMotionValueEvent(shown, "change", (v) => setVisible(v));

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {mounted && <ParticleField currentShape={index} />}
      <AnimatePresence mode="wait" initial={false}>
        {visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.1,
                ease: "easeOut",
                filter: { duration: 0.3, ease: "easeOut" },
                scale: { duration: 0.3, ease: "easeOut" },
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(8px)",
              transition: { duration: 0.15, ease: "easeIn" },
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <div
              style={{
                pointerEvents: "none",
                userSelect: "none",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px 12px",
              }}
            >
              {children[index]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
