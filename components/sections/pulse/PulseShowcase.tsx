"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { SPRING } from "@/lib/motion";
import {
  C_CARD,
  C_DIM,
  C_GREEN,
  C_LINE,
  C_MUTED,
  C_MUTED_2,
  C_TEXT,
  C_TEXT_2,
  C_WELL,
  DotEqualiser,
  DotPattern,
  overlay,
  Sparkline,
  UTIL_CSS,
  type ChartBaselinePoint,
  type ChartPoint,
} from "./parts";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* --------------------------------------------------------------- graph card */

const MRR_POINTS: ChartPoint[] = [{ y: 15 }, { y: 21 }, { y: 47 }, { y: 53 }, { y: 85 }, { y: 99 }];

const MRR_BASELINE: ChartBaselinePoint[] = [
  { y: 16, color: C_GREEN, backgroundColor: "rgba(16, 236, 144, 0.1)", line: "solid" },
  { y: 35, color: C_GREEN, backgroundColor: "rgba(16, 236, 144, 0.1)", line: "solid" },
  { y: 42, color: "rgba(16, 236, 144, 0.5)", backgroundColor: "rgba(16, 236, 144, 0.05)", line: "dashed" },
  { y: 79, color: C_GREEN, backgroundColor: "rgba(16, 236, 144, 0.1)", line: "solid" },
  { y: 92, color: C_LINE, backgroundColor: "rgba(23, 23, 23, 0.25)", line: "solid" },
];

const MRR_GRADIENT = [
  { color: C_TEXT_2, offset: 37 },
  { color: C_TEXT_2, offset: 70 },
];

const MRR_DATES = ["Day 1", "Day 20", "Day 40", "Day 60", "Day 80"];

function BaselineGraph() {
  return (
    <div className="pu-sc-card" style={{ backgroundColor: C_CARD }}>
      <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 16 })} />

      <div className="pu-sc-card-title">
        <div className="pu-sc-card-label">
          <div className="pu-fill">
            <p className="t-nano" style={{ textAlign: "left", color: C_DIM }}>
              MRR &middot; 90D
            </p>
          </div>
          <div className="pu-sc-learning">
            <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
              <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: C_DIM, position: "relative" }} />
            </div>
            <div className="pu-pre">
              <p className="t-nano" style={{ textAlign: "left", color: C_MUTED }}>
                Learning
              </p>
            </div>
          </div>
        </div>
        <div className="pu-w100">
          <p className="t-body" style={{ textAlign: "left", color: C_TEXT }}>
            Baseline adjusting as business grows
          </p>
        </div>
      </div>

      <div style={{ flex: "none", width: "100%", height: 120, position: "relative" }}>
        <Sparkline
          points={MRR_POINTS}
          weight={1}
          topPadding={10}
          yDivisions={3}
          divisionsColor={C_WELL}
          divisionsHeight={100}
          gradientColors={MRR_GRADIENT}
          baseline
          baselinePoints={MRR_BASELINE}
          baselineWidth={32}
        />
      </div>

      <div className="pu-row-between">
        {MRR_DATES.map((d) => (
          <div key={d} className="pu-pre">
            <p className="t-xs" style={{ textAlign: "left", color: C_MUTED_2 }}>
              {d}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The showcase panel for the open section. Only the first panel's graph is
 * built; the other two are authored in the source as a ranked alert list and a
 * routing rule builder, neither of which is visible in any rest state.
 */
function Showcase({ index }: { index: number }) {
  return (
    <div className="pu-sc-slot">
      <div style={{ height: "100%", width: "100%" }}>
        <div className="pu-sc-fit">
          {/* TODO(spec): panels 2 (Alert Container) and 3 (Routing Rule). */}
          {index === 0 ? <BaselineGraph /> : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ sections */

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "Baselines that learn your business.",
    body: "Pulse builds a rolling model of normal for every metric it watches - accounting for weekly patterns, seasonal shifts, and growth - so deviations mean something.",
  },
  {
    title: "Every alert scored by impact.",
    body: "Severity is weighted by how far a deviation sits from baseline, when it’s happening, and which metrics are affected. A ranked signal, not a flat list.",
  },
  {
    title: "Routed to the right person, instantly.",
    // The dash here is the source copy's own punctuation, kept verbatim.
    body: "The right alert reaches the right person every time. Route by severity, by team, or by source — without anyone manually deciding who gets what.",
  },
];

const CLOSED_HEIGHT = 64;
const PAD_TOP = 8;
const PAD_BOTTOM = 20;
const STACK_GAP = 20;
const PANEL_HEIGHT = 450;

function Section({
  index,
  open,
  compact,
  onSelect,
}: {
  index: number;
  open: boolean;
  /** true below 1200, where the panel moves inside the section */
  compact: boolean;
  onSelect: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerHeight, setInnerHeight] = useState(96);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => setInnerHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The first paint must land on the exact resting height, so the spring is
  // only armed once the measured height is in.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const openHeight =
    PAD_TOP + innerHeight + (compact ? STACK_GAP + PANEL_HEIGHT : 0) + PAD_BOTTOM;

  const { title, body } = SECTIONS[index];

  return (
    <motion.div
      className="pu-sc-section"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      initial={false}
      animate={{ height: open ? openHeight : CLOSED_HEIGHT }}
      transition={ready ? SPRING : { duration: 0 }}
    >
      <div ref={innerRef} className="pu-sc-inner">
        <div className="pu-sc-title">
          <div className="pu-clamp2">
            <motion.h3
              className="t-h3"
              initial={false}
              animate={{ color: open ? C_TEXT : C_MUTED }}
              transition={SPRING}
            >
              {title}
            </motion.h3>
          </div>
          <div className="pu-sc-gap" />
          <div style={{ flex: "none", width: 32, height: 32, position: "relative" }}>
            <DotEqualiser up={open} />
          </div>
        </div>
        <div className="pu-sc-content">
          <div className="pu-w100">
            <p className="t-sm" style={{ color: C_MUTED }}>
              {body}
            </p>
          </div>
        </div>
      </div>

      <div className="pu-sc-panel-inline">
        <div style={{ flex: "none", position: "absolute", inset: 0 }}>
          <DotPattern weight={2} space={4} />
        </div>
        <Showcase index={index} />
      </div>
    </motion.div>
  );
}

const CSS = UTIL_CSS + `
.pu-showcase {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.pu-showcase-container {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  max-width: 1400px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-sc-item {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 48px;
  width: 100%; height: min-content; padding: 64px 40px; overflow: clip;
}
.pu-sc-main {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 0;
  width: 1px; height: 450px; padding: 40px; overflow: visible;
}
.pu-sc-slot { position: relative; flex: 1 0 0; width: 1px; height: 100%; }
.pu-sc-fit {
  width: 100%; height: 100%; display: flex; flex-flow: row nowrap;
  align-items: center; justify-content: center;
}
.pu-sc-options {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 4px;
  width: 1px; height: min-content; padding: 0; overflow: visible;
}
.pu-sc-section {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start; align-items: flex-start; gap: 20px;
  width: 100%; padding: 8px 0 20px; overflow: clip; cursor: pointer;
  outline: none;
}
.pu-sc-inner {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0; overflow: visible;
}
.pu-sc-title {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center space-between; align-items: center;
  width: 100%; height: min-content; padding: 8px 0; overflow: visible;
}
.pu-sc-gap {
  flex: none; align-self: stretch; width: 16px; height: auto;
  position: relative; overflow: visible;
}
.pu-sc-content {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 10px;
  width: 100%; height: min-content; padding: 4px 0; overflow: visible;
}
.pu-sc-divider { flex: none; width: 100%; height: 1px; position: relative; overflow: visible; }
.pu-sc-panel-inline {
  display: none;
  position: relative; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: 450px; padding: 0; overflow: visible;
}

.pu-sc-card {
  position: relative; display: flex; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 24px;
  width: 479px; height: min-content; padding: 16px;
  border-radius: 16px; overflow: visible;
}
.pu-sc-card-title {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-sc-card-label {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 16px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-sc-learning {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}

.pu-eq { position: relative; width: 32px; height: 32px; overflow: clip; }
.pu-eq-dot {
  position: absolute; width: 2px; height: 2px; border-radius: 1px;
  transform: translateY(-50%); flex: none; overflow: visible;
  background-color: var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161));
}

@media (max-width: 1199.98px) {
  .pu-showcase { padding: 0; }
  .pu-showcase-line { display: none; }
  .pu-sc-item { padding: 40px; gap: 0; }
  .pu-sc-main { display: none; }
  .pu-sc-panel-inline { display: flex; }
}
@media (max-width: 809.98px) {
  .pu-showcase-container { padding: 0 0 20px; }
  .pu-sc-item { padding: 20px; }
}
`;

export function PulseShowcase() {
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const select = useCallback((i: number) => setActive(i), []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1199.98px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div className="pu-showcase" id="pulse-showcase">
      <style>{CSS}</style>

      <div className="pu-showcase-container">
        <span
          className="pu-showcase-line"
          style={overlay({
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(34, 34, 34))",
          })}
        />

        <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
          <div className="pu-sc-item">
            <div className="pu-sc-main">
              <div style={{ flex: "none", position: "absolute", inset: 0 }}>
                <DotPattern weight={2} space={4} />
              </div>
              <Showcase index={active} />
            </div>

            <div className="pu-sc-options">
              {SECTIONS.map((s, i) => (
                <Fragment key={s.title}>
                  {i > 0 ? (
                    <div className="pu-sc-divider" style={{ backgroundColor: C_LINE }} />
                  ) : null}
                  <Section
                    index={i}
                    open={active === i}
                    compact={compact}
                    onSelect={() => select(i)}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
