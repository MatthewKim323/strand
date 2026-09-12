"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "motion/react";
import type { CSSProperties } from "react";

import { EASE, SPRING } from "@/lib/motion";

/* ------------------------------------------------------------------ tokens */
/* Copied verbatim out of the spec so every value resolves from the one token
   map with no translation. */

export const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
export const C_TEXT_2 = "var(--token-ba35e0ab-850d-49cf-be59-934f032ab5a0, rgb(245, 245, 245))";
export const C_MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
export const C_MUTED_2 = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
export const C_DIM = "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))";
export const C_LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
export const C_LINE_2 = "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))";
export const C_CARD = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
export const C_WELL = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))";
export const C_WELL_2 = "var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))";
export const C_PATTERN = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";
export const C_DOT = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";
export const C_GREEN = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
export const C_AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";
export const C_RED = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";
export const C_ICON_DIM = "var(--token-b5638a62-26ff-4efc-a9d7-90e970d50095, rgb(82, 82, 82))";
/* The `hlupby` preset ships its own default text colour and two labels use it
   unchanged. */
export const C_PRESET_DEFAULT = "rgb(102, 102, 102)";

/**
 * An overlay border. The reference paints every `data-border` as a pseudo
 * element on top of the box, so it never grows the box the way a real CSS
 * border would.
 */
export const overlay = (style: CSSProperties): CSSProperties => ({
  position: "absolute",
  inset: 0,
  boxSizing: "border-box",
  borderStyle: "solid",
  borderRadius: "inherit",
  pointerEvents: "none",
  borderWidth: 0,
  ...style,
});

/**
 * The handful of layout idioms the reference repeats everywhere. Each block
 * injects this so it also renders correctly on its own.
 */
export const UTIL_CSS = `
.pu-pre { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.pu-w100 { position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word; }
.pu-fill { position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word; }
.pu-clamp2 {
  position: relative; flex: 1 0 0; width: 1px; height: auto; overflow: clip;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.pu-row-between {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center space-between; align-items: center;
  width: 100%; padding: 0; overflow: clip;
}
`;

/* ------------------------------------------------------------- dot pattern */

/**
 * The SVG lattice the reference paints behind the showcase graphic: one
 * `weight` square per `space * 2` cell, offset to the cell centre.
 */
export function DotPattern({
  weight = 2,
  space = 4,
  tint = C_PATTERN,
}: {
  weight?: number;
  space?: number;
  tint?: string;
}) {
  const id = `pu-pattern-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg width="100%" height="100%" aria-hidden style={{ height: "100%", width: "100%" }}>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width={space * 2} height={space * 2}>
          <rect x={space} y={space} width={weight} height={weight} fill={tint} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ---------------------------------------------------------- chromatic rule */

/*
 * The 1px rule that opens and closes the statement block. Six bars, three per
 * half, grown outward from the centre; the g and r bars screen-blend over the
 * b bar so the three primaries settle on one neutral hairline where they meet.
 */

const HALF: CSSProperties = {
  height: 1,
  overflow: "clip",
  flex: "1 0 0",
  width: 1,
  position: "relative",
  opacity: 1,
};

const BAR: CSSProperties = {
  zIndex: 1,
  flex: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  overflow: "visible",
};

type BarSpec = { from: string; to: string; delay: number; blend: boolean };

const RULE_LEFT: BarSpec[] = [
  { from: "rgb(0, 0, 255)", to: "rgb(0, 0, 36)", delay: 0.04, blend: false },
  { from: "rgb(0, 255, 0)", to: "rgb(0, 37, 0)", delay: 0.02, blend: true },
  { from: "rgb(255, 0, 0)", to: "rgb(41, 0, 0)", delay: 0, blend: true },
];

const RULE_RIGHT: BarSpec[] = [
  { from: "rgb(0, 0, 255)", to: "rgb(0, 0, 36)", delay: 0, blend: false },
  { from: "rgb(0, 255, 0)", to: "rgb(0, 37, 0)", delay: 0.02, blend: true },
  { from: "rgb(255, 0, 0)", to: "rgb(41, 0, 0)", delay: 0.04, blend: true },
];

function RuleHalf({ bars, side }: { bars: BarSpec[]; side: "left" | "right" }) {
  return (
    <div style={HALF}>
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ width: "0%", backgroundColor: b.from }}
          animate={{ width: "100%", backgroundColor: b.to }}
          transition={{ type: "tween", duration: 0.4, ease: EASE, delay: b.delay }}
          style={{
            ...BAR,
            [side === "left" ? "right" : "left"]: 0,
            mixBlendMode: b.blend ? "screen" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Motion spec section D: a plain in-view observer on the element itself,
 * `amount: 1` (the whole 1px box must be on screen), `once: true`, six tweens
 * of 0.4s on EASE with mirrored 0 / 0.02 / 0.04 delays.
 */
export function ChromaticRule() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });

  return (
    <div ref={ref} style={{ position: "relative", flex: "none", width: "100%", height: "auto" }}>
      <div
        style={{
          height: "min-content",
          overflow: "clip",
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          padding: 0,
          position: "relative",
        }}
      >
        {inView ? (
          <>
            <RuleHalf bars={RULE_LEFT} side="left" />
            <RuleHalf bars={RULE_RIGHT} side="right" />
          </>
        ) : (
          <>
            <div style={HALF} />
            <div style={HALF} />
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- dot equaliser */

/*
 * "Vertical Dot Arrow": five 2x2 dots in a 32px box. Neutral is a flat row at
 * top 50%; Up lifts the middle three into a hill. Read off the component's
 * variant rules: dot 2 `top:13px` with no translate, dot 3 `top:38%` and dot 4
 * `top:44%`, both still translated -50%.
 */
const DOT_LEFT = [7, 11, 15, 19, 23];
const DOT_TOP_NEUTRAL = [15, 15, 15, 15, 15];
const DOT_TOP_UP = [15, 13, 11.16, 13.08, 15];

export function DotEqualiser({ up }: { up: boolean }) {
  return (
    <div className="pu-eq">
      {DOT_LEFT.map((left, i) => (
        <motion.div
          key={left}
          className="pu-eq-dot"
          style={{ left }}
          initial={{ top: DOT_TOP_NEUTRAL[i] }}
          animate={{ top: up ? DOT_TOP_UP[i] : DOT_TOP_NEUTRAL[i] }}
          transition={SPRING}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- breadcrumb dots */

/*
 * The six 2x2 dots between the two crumbs. The component authors a second
 * variant that marches them one box right, but this page never triggers it, so
 * three sit visible on the right and three sit hidden on the left.
 */
const CRUMB_DOTS: Array<{ top: number; left: number; opacity: 0 | 1 }> = [
  { top: 4, left: -10, opacity: 0 },
  { top: 10, left: -10, opacity: 0 },
  { top: 7, left: -7, opacity: 0 },
  { top: 4, left: 6, opacity: 1 },
  { top: 10, left: 6, opacity: 1 },
  { top: 7, left: 9, opacity: 1 },
];

const CRUMB_MASK =
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)";

export function CrumbDots() {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        position: "relative",
        overflow: "visible",
        WebkitMaskImage: CRUMB_MASK,
        maskImage: CRUMB_MASK,
      }}
    >
      {CRUMB_DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: 2,
            height: 2,
            borderRadius: 36,
            opacity: d.opacity,
            overflow: "hidden",
            flex: "none",
            backgroundColor: C_DOT,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- sparkline */

export type ChartPoint = { y: number };
export type ChartBaselinePoint = {
  y: number;
  color: string;
  backgroundColor: string;
  line: "solid" | "dashed";
};

/**
 * The chart the two graph cards draw. The viewBox is 100 wide by
 * `max(y) + topPadding%` tall and stretched with `preserveAspectRatio="none"`,
 * every stroke is non-scaling so `weight` stays in pixels, the divisions are
 * dashed rules counted up from the floor, and the baseline is a band of quads
 * between consecutive baseline points, `width / 2` either side of each.
 */
export function Sparkline({
  points,
  weight,
  topPadding,
  yDivisions,
  divisionsHeight,
  divisionsColor,
  gradientColors,
  baseline,
  baselinePoints,
  baselineWidth,
}: {
  points: ChartPoint[];
  weight: number;
  topPadding: number;
  yDivisions: number;
  divisionsHeight: number;
  divisionsColor: string;
  gradientColors: { color: string; offset: number }[];
  baseline: boolean;
  baselinePoints: ChartBaselinePoint[];
  baselineWidth: number;
}) {
  // The source seeds this with Math.random(); useId keeps it stable across the
  // server and the client render instead.
  const gradientId = `pu-chart-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const max = Math.max(...points.map((p) => p.y));
  const height = max + (topPadding / 100) * max;

  const step = 100 / (points.length - 1);
  const linePath =
    points.length < 2
      ? ""
      : points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - p.y}`).join(" ");

  const divisionStep = ((divisionsHeight / 100) * height) / yDivisions;
  const divisions = [
    `M 0 ${height - 2} L 100 ${height - 2}`,
    ...Array.from(
      { length: yDivisions },
      (_, i) =>
        `M 0 ${height - divisionStep * (i + 1) + 2} L 100 ${height - divisionStep * (i + 1) + 2}`,
    ),
  ];

  const half = baselineWidth / 2;
  const bandStep = 100 / (baselinePoints.length - 1);
  const bands: { d: string; fill?: string; stroke?: string; strokeDasharray?: string }[] = [];
  if (baselinePoints.length >= 2) {
    for (let i = 0; i < baselinePoints.length - 1; i++) {
      const x0 = i * bandStep;
      const x1 = (i + 1) * bandStep;
      const lo0 = height - (baselinePoints[i].y + half);
      const lo1 = height - (baselinePoints[i + 1].y + half);
      const hi0 = height - (baselinePoints[i].y - half);
      const hi1 = height - (baselinePoints[i + 1].y - half);
      const dash = baselinePoints[i].line === "dashed" ? "4" : undefined;
      bands.push({
        d: `M ${x0} ${lo0} L ${x1} ${lo1} L ${x1} ${hi1} L ${x0} ${hi0} Z`,
        fill: baselinePoints[i].backgroundColor,
      });
      bands.push({
        d: `M ${x0} ${lo0} L ${x1} ${lo1}`,
        stroke: baselinePoints[i].color,
        strokeDasharray: dash,
        fill: "none",
      });
      bands.push({
        d: `M ${x0} ${hi0} L ${x1} ${hi1}`,
        stroke: baselinePoints[i].color,
        strokeDasharray: dash,
        fill: "none",
      });
    }
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          {gradientColors.map((g, i) => (
            <stop key={i} offset={`${g.offset}%`} stopColor={g.color} />
          ))}
        </linearGradient>
      </defs>
      {divisions.map((d) => (
        <path
          key={d}
          vectorEffect="non-scaling-stroke"
          d={d}
          stroke={divisionsColor}
          strokeDasharray="4"
          strokeWidth={weight}
        />
      ))}
      {baseline &&
        bands.map((b, i) => (
          <path key={i} {...b} strokeWidth={weight} vectorEffect="non-scaling-stroke" />
        ))}
      <path
        vectorEffect="non-scaling-stroke"
        d={linePath}
        stroke={`url(#${gradientId})`}
        strokeWidth={weight}
      />
    </svg>
  );
}

/* ------------------------------------------------------------ source marks */

/** The two source marks in the score card: plain geometry, drawn desaturated. */
export function SourceMarkA() {
  return (
    <svg viewBox="0 0 32 32" width={16} height={16} aria-hidden style={{ display: "block", filter: "grayscale(1)", flex: "none" }}>
      <g transform="translate(3 3)">
        <path
          d="M 13 0 C 17.092 0 20.945 1.927 23.4 5.2 L 13 5.2 C 8.692 5.2 5.2 8.692 5.2 13 L 13 13 L 23.992 6.058 C 24.808 7.351 25.39 8.777 25.711 10.272 L 20.8 13 L 26 13 L 25.996 13.323 C 25.858 18.858 22.231 23.698 16.957 25.383 C 11.684 27.068 5.922 25.229 2.6 20.8 L 13 20.8 C 17.157 20.8 20.584 17.539 20.79 13.387 L 20.8 13 L 13 13 L 2.008 19.941 C 1.192 18.648 0.611 17.222 0.291 15.727 L 5.2 13 L 0 13 C 0 5.82 5.82 0 13 0 Z"
          fill="rgb(83, 58, 253)"
        />
      </g>
    </svg>
  );
}

export function SourceMarkB() {
  return (
    <svg viewBox="0 0 32 32" width={16} height={16} aria-hidden style={{ display: "block", filter: "grayscale(1)", flex: "none" }}>
      <g transform="translate(2.5 6)">
        <path
          d="M 8.68 0.001 L 20.485 0.001 L 11.805 12.96 L 0 12.96 L 8.68 0 Z"
          fill="rgb(0, 122, 255)"
        />
        <path
          d="M 3.362 7.94 L 0 12.96 L 12.366 12.96 L 21.046 0 L 11.919 0 L 6.601 7.94 L 3.361 7.94 Z"
          fill="rgb(49, 46, 203)"
          transform="translate(6 6.5)"
        />
      </g>
    </svg>
  );
}
