"use client";

import { motion } from "motion/react";
import { useId, type CSSProperties, type ReactNode } from "react";

import { Icon } from "@/components/ui/Sprite";

/* Colours copied verbatim from the spec so they resolve with no translation. */
const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const C_TEXT_2 = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 250))";
const C_MUTED = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const C_MUTED_2 = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const C_DIM = "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))";
const C_LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const C_LINE_2 = "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(64, 64, 64))";
const C_CARD = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const C_WELL = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const C_GREEN = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const C_BLUE = "var(--token-5e110c3f-82c1-4736-86cd-104cc5e3bfff, rgb(54, 197, 240))";
const C_AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";
const C_RED = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";
const C_RED_A = "var(--token-3a95eaa6-e51b-4092-9cd6-e78e24a17dd1, rgba(229, 72, 77, 0.2))";
const C_ICON_DIM = "var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(115, 115, 115))";

const BORDER = `inset 0 0 0 1px ${C_LINE}`;
const CARD_APPEAR_EASE: [number, number, number, number] = [0.44, 0, 0.56, 1];

/* ------------------------------------------------------------ status ping */

/** Ported from the reference: a tinted dot with a ring that grows and fades. */
export function StatusPing({
  play,
  size,
  tint,
  pingSize = 16,
  pingWeight = 2,
  repeatDelay = 1,
  delay = 0,
}: {
  play: boolean;
  size: number;
  tint: string;
  pingSize?: number;
  pingWeight?: number;
  repeatDelay?: number;
  /** `pingTransition.delay`, which staggers the cards' rings against each other. */
  delay?: number;
}) {
  const startSize = Math.max(size - pingWeight * 2, 1);
  const endSize = startSize + pingSize;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: tint,
        position: "relative",
      }}
    >
      {play && (
        <motion.div
          initial={{ width: startSize, height: startSize, opacity: 1 }}
          animate={{ width: endSize, height: endSize, opacity: 0 }}
          transition={{
            type: "tween",
            duration: 0.3,
            delay,
            ease: CARD_APPEAR_EASE,
            repeat: Infinity,
            repeatDelay,
          }}
          style={{
            borderRadius: 9999,
            outline: `${pingWeight}px solid ${tint}`,
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------- sources panel */

type Source = {
  name: string;
  entities: string;
  status: string;
  tint: string;
  ping: boolean;
  /** `pingTransition.delay` on this card's ring. */
  pingDelay: number;
};

/* Card order, copy, tint and ping flags are the spec's table: only the two
   Live rows pulse, and each card's ring carries its own delay. */
const SOURCES: Source[] = [
  { name: "Scaleforce", entities: "14,203 entities", status: "Live", tint: C_GREEN, ping: true, pingDelay: 0 },
  { name: "Strive", entities: "8,847 entities", status: "Live", tint: C_GREEN, ping: true, pingDelay: 0.1 },
  { name: "PostgridDB", entities: "52,091 entities", status: "Syncing", tint: C_BLUE, ping: false, pingDelay: 0.3 },
  { name: "HotSpot", entities: "52,091 entities", status: "Pending", tint: C_AMBER, ping: false, pingDelay: 0.4 },
];

export function SourcesPanel({ width, gap }: { width: number; gap: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap,
        width,
        height: "min-content",
      }}
    >
      {SOURCES.map((s, i) => (
        <motion.div
          key={s.name}
          style={{ position: "relative", flex: "none", width: "100%", height: "auto", willChange: "transform" }}
          initial={{ opacity: 0.001, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "tween", duration: 0.2, delay: i * 0.05, ease: CARD_APPEAR_EASE }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              width: "100%",
              height: "min-content",
              padding: 16,
              borderRadius: 16,
              backgroundColor: C_CARD,
              boxShadow: BORDER,
              overflow: "clip",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                flex: "1 0 0",
                width: 1,
                height: "min-content",
                overflow: "clip",
              }}
            >
              <div style={{ width: "100%" }}>
                <p className="t-body" style={{ color: C_TEXT }}>
                  {s.name}
                </p>
              </div>
              <div style={{ width: "100%" }}>
                <p className="t-mono" style={{ color: C_MUTED }}>
                  {s.entities}
                </p>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flex: "none",
                width: "min-content",
                height: "min-content",
              }}
            >
              <StatusPing play={s.ping} size={8} tint={s.tint} delay={s.pingDelay} />
              <div style={{ whiteSpace: "pre", flex: "none", width: "auto" }}>
                <p className="t-xs" style={{ color: C_TEXT }}>
                  {s.status}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- ask panel */

const CHIPS: { icon: string; label: string }[] = [
  { icon: "89488612", label: "Analyze" },
  { icon: "3092554709", label: "Compare" },
  { icon: "3261614140", label: "Monitor" },
];

/**
 * Finding, not a gap: this glyph really is absent from the captured sprite.
 * The sheet only carries the symbols the captured DOM actually rendered, and
 * the composer's right-hand button swaps glyph per variant. The captured page
 * shows the chat's animated variant, which uses the arrow; the standalone
 * variant this panel renders uses the microphone, so the microphone symbol was
 * never registered and cannot be referenced by id. The four subpaths below are
 * the source glyph's own, at its own 24-unit grid, drawn at 20px with the
 * stroke weight the call site sets.
 */
function MicGlyph() {
  const d = [
    "M 12 19 L 12 22",
    "M 19 10 L 19 12 C 19 15.866 15.866 19 12 19 C 8.134 19 5 15.866 5 12 L 5 10",
    "M 12 15 C 10.343 15 9 13.657 9 12 L 9 5 C 9 3.343 10.343 2 12 2 L 12 2 C 13.657 2 15 3.343 15 5 L 15 12 C 15 13.657 13.657 15 12 15 Z",
  ];
  return (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, display: "block" }} aria-hidden>
      {d.map((path) => (
        <path
          key={path}
          d={path}
          fill="transparent"
          stroke={C_TEXT_2}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

function ChatButton({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        width: 36,
        height: 36,
        padding: 8,
        flex: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function AskPanel({ width }: { width: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width,
        height: "min-content",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          width: "100%",
          height: 128,
          borderRadius: 16,
          background: `linear-gradient(111deg, ${C_LINE_2} 0%, ${C_LINE} 35.13513513513514%, ${C_LINE} 73%, ${C_LINE_2} 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 15,
            backgroundColor: C_CARD,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            width: "100%",
            height: 128,
            overflow: "clip",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              height: 64,
              padding: "0 8px 0 20px",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "1 0 0",
                width: 1,
                height: 64,
                padding: "20px 0",
              }}
            >
              <div style={{ width: "100%" }}>
                <p className="t-body" style={{ color: C_MUTED }}>
                  How can I help today?
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              height: 48,
              padding: "0 12px 12px",
            }}
          >
            <ChatButton>
              <Icon id="3356954461" size={20} color={C_ICON_DIM} strokeWidth={2} />
            </ChatButton>
            <ChatButton style={{ backgroundColor: "rgba(38, 38, 38, 0)", borderRadius: 12 }}>
              <MicGlyph />
            </ChatButton>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          width: "100%",
          height: 32,
          padding: "0 16px",
          borderRadius: 16,
        }}
      >
        {CHIPS.map((c) => (
          <div
            key={c.label}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 32,
              padding: 8,
              borderRadius: 8,
              backgroundColor: C_CARD,
              boxShadow: BORDER,
            }}
          >
            <Icon id={c.icon} size={14} color={C_MUTED_2} strokeWidth={2} />
            <div style={{ whiteSpace: "pre" }}>
              <p className="t-micro" style={{ color: C_MUTED_2 }}>
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ alert panel */

/* The chart row is 101px tall; the sparkline itself fills the row and is
   drawn by the chart component below. */
const CHART_H = 101;

type ChartPoint = { y: number };
type ChartBaselinePoint = {
  y: number;
  color: string;
  backgroundColor: string;
  line: "solid" | "dashed";
};

/**
 * Port of the sparkline code component the panel uses, with its own maths:
 * the viewBox is 100 wide by `max(y) + topPadding%` tall and stretched with
 * `preserveAspectRatio="none"`, every stroke is non-scaling so `weight` stays
 * in pixels, the divisions are dashed rules counted up from the floor, and the
 * baseline is a band of quads between consecutive baseline points, `width/2`
 * either side of each.
 */
function Sparkline({
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
  // server and client render instead.
  const gradientId = `chart-gradient-${useId().replace(/:/g, "")}`;

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
      (_, i) => `M 0 ${height - divisionStep * (i + 1) + 2} L 100 ${height - divisionStep * (i + 1) + 2}`,
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

/* The chart's props, verbatim from the panel's own instance. */
const CHART_POINTS: ChartPoint[] = [
  { y: 91 },
  { y: 84 },
  { y: 91 },
  { y: 85 },
  { y: 91 },
  { y: 34 },
  { y: 55 },
];
const CHART_BAND = "rgba(23, 23, 23, 0.25)";
const CHART_BASELINE: ChartBaselinePoint[] = [
  { y: 90, color: C_LINE, backgroundColor: CHART_BAND, line: "solid" },
  { y: 81, color: C_LINE, backgroundColor: CHART_BAND, line: "solid" },
  { y: 90, color: C_LINE, backgroundColor: CHART_BAND, line: "dashed" },
  { y: 83, color: C_LINE, backgroundColor: CHART_BAND, line: "solid" },
  { y: 89, color: C_LINE, backgroundColor: "rgb(0, 51, 0)", line: "solid" },
];
const CHART_GRADIENT = [
  { color: C_LINE_2, offset: 69 },
  { color: C_RED, offset: 75 },
];

export function AlertPanel({ width }: { width: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        width,
        height: "min-content",
        padding: 16,
        borderRadius: 16,
        backgroundColor: C_CARD,
        boxShadow: BORDER,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          width: "100%",
          height: "min-content",
          overflow: "clip",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
            padding: "4px 8px",
            borderRadius: 4,
            backgroundColor: C_RED_A,
          }}
        >
          <div style={{ whiteSpace: "pre" }}>
            <p className="t-micro" style={{ color: C_RED }}>
              High severity
            </p>
          </div>
        </div>
        <div style={{ flex: "1 0 0", width: 1 }}>
          <p className="t-nano" style={{ textAlign: "right", color: "rgb(102, 102, 102)" }}>
            2 min ago
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          overflow: "clip",
        }}
      >
        <div style={{ width: "100%" }}>
          <p className="t-body" style={{ textAlign: "left", color: C_TEXT }}>
            EU activation rate dropped 12%
          </p>
        </div>
        <div style={{ width: "100%" }}>
          <p className="t-xs" style={{ textAlign: "left", color: C_MUTED }}>
            Activation in EU markets fell from 34% to 22% over the past 6 hours.
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          width: "100%",
          height: CHART_H,
          overflow: "clip",
        }}
      >
        <div style={{ position: "relative", flex: "1 0 0", width: 1, height: "100%" }}>
          <Sparkline
            points={CHART_POINTS}
            weight={1}
            topPadding={19}
            yDivisions={2}
            divisionsHeight={100}
            divisionsColor={C_WELL}
            gradientColors={CHART_GRADIENT}
            baseline
            baselinePoints={CHART_BASELINE}
            baselineWidth={35}
          />
        </div>
        <div style={{ position: "absolute", left: "83%", top: "68%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
          <StatusPing play={false} size={6} tint={C_RED} pingSize={16} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "91%",
            top: "21%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "pre",
            zIndex: 1,
          }}
        >
          <p className="t-nano" style={{ color: C_DIM }}>
            Baseline
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            left: "83%",
            top: "81%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "pre",
            zIndex: 1,
          }}
        >
          <p className="t-nano" style={{ color: C_RED }}>
            Anomaly
          </p>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "8px 0px",
          width: "100%",
          overflow: "clip",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            flex: "none",
            width: "min-content",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: C_WELL,
            }}
          >
            {/* The glyph is in the sprite after all, under this id. */}
            <Icon
              id="2166604194"
              size={12}
              color="var(--token-b5638a62-26ff-4efc-a9d7-90e970d50095, rgb(82, 82, 82))"
              strokeWidth={2}
            />
          </div>
          <div style={{ whiteSpace: "pre" }}>
            <p className="t-nano" style={{ textAlign: "left", color: C_MUTED_2 }}>
              <span style={{ color: C_MUTED }}>Sent to</span>
              <span style={{ color: C_TEXT }}> </span>
              {"#product-alerts"}
            </p>
          </div>
        </div>
        <div style={{ flex: "1 0 0", width: 1, minHeight: 16, minWidth: 16 }} />
        <div style={{ whiteSpace: "pre", flex: "none", width: "auto" }}>
          <p className="t-nano" style={{ textAlign: "right", color: "rgb(102, 102, 102)" }}>
            Delivered 1m ago
          </p>
        </div>
      </div>
    </div>
  );
}
