"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { Icon } from "@/components/ui/Sprite";

/* Colours copied verbatim from the spec so they resolve with no translation. */
const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
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
}: {
  play: boolean;
  size: number;
  tint: string;
  pingSize?: number;
  pingWeight?: number;
  repeatDelay?: number;
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
            delay: 0,
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

type Source = { name: string; entities: string; status: string; tint: string; ping: boolean };

const SOURCES: Source[] = [
  { name: "Scaleforce", entities: "14,203 entities", status: "Live", tint: C_GREEN, ping: true },
  { name: "Strive", entities: "8,847 entities", status: "Live", tint: C_GREEN, ping: true },
  { name: "PostgridDB", entities: "52,091 entities", status: "Syncing", tint: C_BLUE, ping: false },
  { name: "HotSpot", entities: "52,091 entities", status: "Pending", tint: C_AMBER, ping: false },
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
              <StatusPing play={s.ping} size={8} tint={s.tint} />
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
              {/* TODO(spec): the microphone glyph is not in the captured sprite. */}
              <svg viewBox="0 0 20 20" style={{ width: 20, height: 20, display: "block" }} aria-hidden>
                <rect
                  x="7"
                  y="2"
                  width="6"
                  height="10"
                  rx="3"
                  fill="none"
                  stroke={C_TEXT}
                  strokeWidth="1.6"
                />
                <path
                  d="M 4 9 C 4 12.3 6.7 15 10 15 C 13.3 15 16 12.3 16 9 M 10 15 L 10 18"
                  fill="none"
                  stroke={C_TEXT}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
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

/* Chart geometry from the reference's own props: seven sample points, five
   fainter baseline points, two y divisions, 19px of top padding. */
const CHART_POINTS = [91, 84, 91, 85, 91, 34, 55];
const CHART_BASELINE = [90, 81, 90, 83, 89];
const CHART_H = 101;

// TODO(spec): the reference draws this with a chart code component; the curve
// below plots the same point list with the same gradient stops.
function chartY(v: number) {
  return CHART_H - 0.93333 * v;
}

function polyline(values: number[], w: number) {
  return values
    .map((v, i) => `${((i / (values.length - 1)) * w).toFixed(2)},${chartY(v).toFixed(2)}`)
    .join(" ");
}

export function AlertPanel({ width }: { width: number }) {
  const inner = width - 32;
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
            borderRadius: 6,
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
        <svg
          viewBox={`0 0 ${inner} ${CHART_H}`}
          style={{ width: "100%", height: CHART_H, display: "block" }}
          aria-hidden
        >
          <defs>
            <linearGradient id="ft-alert-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="69%" stopColor={C_LINE_2} />
              <stop offset="75%" stopColor={C_RED} />
            </linearGradient>
          </defs>
          {[1, 2, 3].map((i) => (
            <line
              key={i}
              x1={(inner / 4) * i}
              y1={0}
              x2={(inner / 4) * i}
              y2={CHART_H}
              stroke={C_WELL}
              strokeWidth="1"
            />
          ))}
          {[1, 2].map((i) => (
            <line
              key={i}
              x1={0}
              y1={(CHART_H / 3) * i}
              x2={inner}
              y2={(CHART_H / 3) * i}
              stroke={C_WELL}
              strokeWidth="1"
            />
          ))}
          <polyline
            points={polyline(CHART_BASELINE, inner)}
            fill="none"
            stroke={C_LINE}
            strokeWidth="1"
          />
          <polyline
            points={polyline(CHART_POINTS, inner)}
            fill="none"
            stroke="url(#ft-alert-line)"
            strokeWidth="1"
          />
        </svg>
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
            {/* TODO(spec): the hash glyph is not in the captured sprite. */}
            <svg viewBox="0 0 12 12" style={{ width: 12, height: 12, display: "block" }} aria-hidden>
              <path
                d="M 4.2 1.5 L 3 10.5 M 9 1.5 L 7.8 10.5 M 1.5 4.2 L 10.5 4.2 M 1.5 7.8 L 10.5 7.8"
                fill="none"
                stroke="var(--token-b5638a62-26ff-4efc-a9d7-90e970d50095, rgb(82, 82, 82))"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
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
