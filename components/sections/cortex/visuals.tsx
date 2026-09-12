"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

import { TWEEN } from "@/lib/motion";
import { CxIcon, Hairline, LiveDot, Pill, T } from "./ui";
import { CX_MARKS } from "./marks";

const SHADOW = "0 1px 6px 1px rgba(0, 0, 0, 0.25)";

const NUB: CSSProperties = {
  position: "absolute",
  width: 8,
  height: 8,
  borderRadius: 8,
  backgroundColor: T.panel,
  zIndex: 1,
  overflow: "hidden",
};

function Nub({ style, color }: { style: CSSProperties; color?: string }) {
  return (
    <div style={{ ...NUB, ...style }}>
      <Hairline radius={8} color={color} />
    </div>
  );
}

function Wire({
  width,
  height,
  d,
  style,
}: {
  width: number;
  height: number;
  d: string;
  style: CSSProperties;
}) {
  return (
    <div style={{ position: "absolute", width, height, ...style }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <path d={d} fill="transparent" stroke={T.line} />
      </svg>
    </div>
  );
}

/** One labelled node in the relationship map. */
function MapNode({
  icon,
  label,
  labelColor,
  style,
  children,
}: {
  icon: string;
  label: string;
  labelColor: string;
  style: CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexFlow: "row nowrap",
        placeContent: "center",
        alignItems: "center",
        gap: 12,
        width: "min-content",
        height: "min-content",
        padding: "12px 16px 12px 12px",
        borderRadius: 12,
        backgroundColor: T.panel,
        boxShadow: SHADOW,
        overflow: "visible",
        ...style,
      }}
    >
      <Hairline radius={12} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: 28,
          aspectRatio: 1,
          height: "auto",
          borderRadius: 6,
          backgroundColor: T.raised,
          overflow: "hidden",
          flex: "none",
        }}
      >
        <CxIcon id={icon} size={12} color={T.icon} strokeWidth={3} />
      </div>
      <div style={{ flex: "none", width: "auto", whiteSpace: "pre" }}>
        <p className="cx-mono-m" style={{ margin: 0, color: labelColor }}>
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

/**
 * The second entry's visual: four entity nodes wired together with the
 * discovered relationship called out on the live edge between them.
 */
export function RelationshipVisual() {
  return (
    <div style={{ width: 324, height: 394, position: "relative", overflow: "visible" }}>
      <Wire width={45} height={1} d="M 44.5 0 L 0 0" style={{ top: 28, left: 279 }} />
      <MapNode icon="2752932676" label="Customer" labelColor={T.dim} style={{ top: 0, left: 144 }}>
        <Nub style={{ top: "54%", left: -4, transform: "translateY(-50%)" }} />
        <Nub style={{ top: "53%", right: -4, transform: "translateY(-50%)" }} />
      </MapNode>
      <Wire
        width={52}
        height={48}
        d="M 52 0 C 52 0 27.357 0 12 0 C 5.373 0 0 5.373 0 12 C 0 26.218 0 48 0 48"
        style={{ top: 28, left: 92 }}
      />
      <MapNode icon="lifebuoy" label="Support Ticket" labelColor={T.bright} style={{ top: 76, left: 0 }}>
        <Nub style={{ top: -4, left: "49%", transform: "translateX(-50%)" }} />
        <Nub style={{ bottom: -4, left: "49%", transform: "translateX(-50%)" }} />
        <div
          style={{
            position: "absolute",
            bottom: -77,
            left: "49%",
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: T.accentSoft,
            zIndex: 1,
            overflow: "hidden",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 118,
            bottom: -72,
            left: 89,
            width: 8,
            borderRadius: 8,
            backgroundColor: T.panel,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <Hairline radius={8} color={T.accent} />
        </div>
      </MapNode>
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 69px)",
          left: 91,
          width: 2,
          height: 138,
          overflow: "hidden",
          background: `linear-gradient(180deg, ${T.line} 0%, ${T.line} 20.7207%, ${T.accent} 50%, ${T.line} 79.7297%, ${T.line} 100%)`,
        }}
      />
      <Wire
        width={60}
        height={50}
        d="M 0 0 C 0 0 30.489 0 47.999 0 C 54.627 0 60 5.373 60 12.001 C 60 26.794 60 50 60 50"
        style={{ top: 292, left: 155 }}
      />
      <MapNode icon="3869555741" label="Revenue" labelColor={T.bright} style={{ top: 266, left: 29 }}>
        <Nub style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} />
        <Nub style={{ top: "50%", right: -4, transform: "translateY(-50%)" }} />
      </MapNode>
      <MapNode icon="refreshccw" label="Subscription" labelColor={T.dim} style={{ top: 342, left: 131 }}>
        <Nub style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} />
        <Nub style={{ top: "50%", left: -4, transform: "translateY(-50%)" }} />
      </MapNode>
      <Wire width={120} height={1} d="M 119.5 0 L 0 0" style={{ top: 368, left: 11 }} />
      <div
        style={{
          position: "absolute",
          top: 187,
          left: 111,
          width: 213,
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 4,
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%" }}>
          <p className="t-mono-s" style={{ margin: 0, color: T.accent }}>
            RELATIONSHIP DISCOVERED
          </p>
        </div>
        <div style={{ width: "100%" }}>
          <p className="t-xs" style={{ margin: 0, color: T.muted }}>
            Support volume correlates with revenue drop
          </p>
        </div>
      </div>
    </div>
  );
}

const RESULTS: Array<{ mark: string; name: string; event: string; score: number; tone: string }> = [
  { mark: CX_MARKS.vaultdb, name: "Northgate Industries", event: "Support spike", score: 82, tone: T.red },
  { mark: CX_MARKS.stride, name: "Apex Systems", event: "Usage -40%", score: 74, tone: T.amber },
  { mark: CX_MARKS.gridwork, name: "Lumen Health", event: "No renewal contact", score: 61, tone: T.red },
];

function ScoreRing({ value, tone }: { value: number; tone: string }) {
  const deg = (value / 100) * 360;
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 24,
        flex: "none",
        WebkitMaskImage:
          "radial-gradient(50% 50%, rgba(0, 0, 0, 0) 57.3333%, rgb(255, 255, 255) 58.3333%)",
        maskImage: "radial-gradient(50% 50%, rgba(0, 0, 0, 0) 57.3333%, rgb(255, 255, 255) 58.3333%)",
        background: `conic-gradient(${tone} ${deg}deg, ${T.ring} ${deg}deg)`,
      }}
    />
  );
}

function ResultRow({ r }: { r: (typeof RESULTS)[number] }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "min-content",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "row nowrap",
          alignContent: "flex-start",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 12,
          flex: "1 0 0",
          width: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexFlow: "row nowrap",
            placeContent: "center",
            alignItems: "center",
            gap: 16,
            width: 28,
            aspectRatio: 1,
            height: "auto",
            borderRadius: 6,
            backgroundColor: T.raised,
            overflow: "hidden",
            flex: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={r.mark} style={{ width: 12, height: 12, flex: "none", display: "block" }} />
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexFlow: "column nowrap",
            alignContent: "flex-start",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 0,
            flex: "1 0 0",
            width: 1,
            overflow: "hidden",
          }}
        >
          <p className="t-label" style={{ margin: 0, width: "100%", color: T.bright }}>
            {r.name}
          </p>
          <p className="t-micro" style={{ margin: 0, width: "100%", color: T.muted }}>
            {r.event}
          </p>
        </div>
      </div>
      <div style={{ alignSelf: "stretch", width: 16, flex: "none" }} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "column nowrap",
          alignContent: "flex-end",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 0,
          width: "min-content",
          flex: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            placeContent: "center",
            alignItems: "center",
            gap: 6,
            width: "min-content",
          }}
        >
          <ScoreRing value={r.score} tone={r.tone} />
          <div style={{ display: "flex", flexFlow: "row nowrap", placeContent: "center", alignItems: "center" }}>
            <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.muted }}>
              {r.score}
            </p>
            <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
              / 100
            </p>
          </div>
        </div>
        <p className="t-micro" style={{ margin: 0, whiteSpace: "pre", color: T.dimmer }}>
          risk score
        </p>
      </div>
    </div>
  );
}

/** The third entry's visual: a natural-language query and its ranked answer. */
export function QueryVisual() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexFlow: "column nowrap",
        placeContent: "center",
        alignItems: "center",
        gap: 8,
        width: 388,
        height: "min-content",
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: "100%",
          height: "min-content",
          padding: "16px 20px",
          borderRadius: 16,
          overflow: "hidden",
          background:
            "linear-gradient(111deg, var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115)) 0%, var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)) 35.1351%, var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)) 73%, var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64)) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 15,
            backgroundColor: T.panel,
            zIndex: 0,
          }}
        />
        <p
          className="t-sm"
          style={{
            position: "relative",
            zIndex: 1,
            margin: 0,
            flex: "1 0 0",
            width: 1,
            color: T.bright,
            whiteSpace: "pre-line",
          }}
        >
          Customers likely to churn in next 30 days
        </p>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexFlow: "row nowrap",
              placeContent: "center",
              alignItems: "center",
              gap: 16,
              width: "min-content",
              height: "min-content",
              padding: "4px 8px",
              borderRadius: 8,
              backgroundColor: T.panel,
              overflow: "hidden",
            }}
          >
            <Hairline radius={8} />
            <p className="t-micro" style={{ margin: 0, whiteSpace: "pre", color: T.muted }}>
              3 Results
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: "100%",
          height: "min-content",
          padding: 20,
          borderRadius: 16,
          backgroundColor: T.panel,
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <Hairline radius={16} />
        <div style={{ width: "100%" }}>
          <p className="t-mono" style={{ margin: 0, color: T.muted }}>
            3 accounts flagged
          </p>
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexFlow: "column nowrap",
            placeContent: "center",
            alignItems: "center",
            gap: 16,
            width: "100%",
            height: "min-content",
          }}
        >
          {RESULTS.map((r, i) => (
            <div key={r.name} style={{ width: "100%", display: "contents" }}>
              {i > 0 ? (
                <div style={{ width: "100%", height: 1, flex: "none", backgroundColor: T.line }} />
              ) : null}
              <div style={{ width: "100%", flex: "none", position: "relative" }}>
                <ResultRow r={r} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexFlow: "row wrap",
          placeContent: "center",
          alignItems: "center",
          gap: 4,
          width: "100%",
          height: "min-content",
          padding: "0 16px",
          borderRadius: 16,
          overflow: "visible",
        }}
      >
        {["Export CSV", "Share with team"].map((label) => (
          <div
            key={label}
            style={{
              position: "relative",
              display: "flex",
              flexFlow: "row nowrap",
              placeContent: "center",
              alignItems: "center",
              gap: 8,
              width: "min-content",
              height: "min-content",
              padding: 8,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <p className="t-micro" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The roster, in the source's own slot order. The ticker window wraps through
 * it, so the order is what decides which four sit under the fade at any moment.
 */
const SOURCES: Array<{ mark: string; name: string; main: string; secondary: string }> = [
  { mark: CX_MARKS.threadbase, name: "ThreadBase", main: "42 channels", secondary: "alerts enabled" },
  { mark: CX_MARKS.pipecloud, name: "Pipecloud", main: "874 accounts", secondary: "12,400 records" },
  { mark: CX_MARKS.chatdock, name: "Chatdock", main: "9.841 conversations", secondary: "204 open" },
  { mark: CX_MARKS.vaultdb, name: "VaultDB", main: "38 schemes", secondary: "6.4M rows" },
  { mark: CX_MARKS.stride, name: "Stride", main: "$2.4 MMR", secondary: "1,204 subscriptions" },
];

/** Slots mounted at once and seconds between advances, both the panel's props. */
const SLOTS = 10;
const INTERVAL = 4;

/** The fade the roster scrolls up under, copied from the container's own mask. */
const FEED_MASK = "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 22.0721%)";

function SourceRow({ source }: { source: (typeof SOURCES)[number] }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexFlow: "row nowrap",
        placeContent: "center",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: 16,
        backgroundColor: T.panel,
        boxShadow: `inset 0 1px 0 0 ${T.line}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: 40,
          height: 40,
          flex: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={source.mark} style={{ width: 32, height: 32, flex: "none", display: "block" }} />
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "column nowrap",
          alignContent: "flex-start",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 0,
          flex: "1 0 0",
          width: 1,
          overflow: "hidden",
        }}
      >
        <p className="t-body" style={{ margin: 0, whiteSpace: "pre", color: T.bright }}>
          {source.name}
        </p>
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            alignContent: "center",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.accent }}>
            {source.main}
          </p>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 96,
              backgroundColor: T.dimmer,
              flex: "none",
            }}
          />
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
            {source.secondary}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The roster ticker. Ten slots are mounted at once and the stack is bottom
 * anchored inside a clipped box under a top fade, so only the last four sit in
 * view. Every four seconds the window advances by one source: each row keeps
 * its identity and slides up a slot, a fresh one enters from the left at the
 * bottom, and the top one leaves under the fade. The rows carry no transition
 * of their own, so the enter and the layout shift both run on the panel's house
 * tween.
 */
function SourceFeed() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setOffset((v) => v + 1), INTERVAL * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-end",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <AnimatePresence initial={false}>
        {Array.from({ length: SLOTS }, (_, slot) => {
          const key = offset + slot;
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0%" }}
              transition={TWEEN}
              style={{ width: "100%", flex: "none" }}
            >
              <SourceRow source={SOURCES[key % SOURCES.length]} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * The first entry's visual: the connected-source roster with its running
 * totals.
 */
export function SourcesVisual() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexFlow: "column nowrap",
        alignContent: "center",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 0,
        width: 307,
        height: 370,
        borderRadius: 12,
        backgroundColor: T.panel,
        overflow: "hidden",
      }}
    >
      <Hairline radius={12} />
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: "100%",
          flex: "none",
          padding: "12px 16px",
        }}
      >
        <p className="t-nano" style={{ margin: 0, flex: "1 0 0", width: 1, color: T.dimmer }}>
          Connected sources
        </p>
      </div>
      <div style={{ width: "100%", height: 1, backgroundColor: T.line, flex: "none" }} />
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          alignItems: "flex-start",
          flex: "1 0 0",
          width: "100%",
          height: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1 0 0",
            width: 1,
            height: "100%",
            WebkitMaskImage: FEED_MASK,
            maskImage: FEED_MASK,
          }}
        >
          <SourceFeed />
        </div>
      </div>
      <div style={{ width: "100%", height: 1, backgroundColor: T.line, flex: "none" }} />
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 18,
          width: "100%",
          flex: "none",
          padding: "12px 16px",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: "1 0 0", width: 1 }}>
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
            41.2M
          </p>
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dimmer }}>
            records indexed
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", width: "min-content" }}>
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
            0
          </p>
          <p className="t-mono-s" style={{ margin: 0, whiteSpace: "pre", color: T.dimmer }}>
            errors
          </p>
        </div>
      </div>
    </div>
  );
}

export { Pill, LiveDot };
