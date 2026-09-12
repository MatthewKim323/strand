"use client";

import { Icon } from "@/components/ui/Sprite";
import { BENTO_DOT_GRID, DotGridField } from "@/components/webgl/DotGridField";
import {
  C_AMBER,
  C_CARD,
  C_DIM,
  C_GREEN,
  C_ICON_DIM,
  C_LINE,
  C_LINE_2,
  C_MUTED,
  C_MUTED_2,
  C_PRESET_DEFAULT,
  C_RED,
  C_TEXT,
  C_WELL,
  C_WELL_2,
  DotPattern,
  overlay,
  Sparkline,
  SourceMarkA,
  SourceMarkB,
  UTIL_CSS,
  type ChartBaselinePoint,
  type ChartPoint,
} from "./parts";

/* ------------------------------------------------------------------ charts */

const ALERT_BAND = "rgba(255, 255, 255, 0.03)";

const ALERT_POINTS: ChartPoint[] = [
  { y: 84 },
  { y: 91 },
  { y: 73 },
  { y: 85 },
  { y: 91 },
  { y: 91 },
  { y: 80 },
  { y: 88 },
  { y: 47 },
  { y: 58 },
  { y: 35 },
  { y: 44 },
];

const ALERT_BASELINE: ChartBaselinePoint[] = [
  { y: 90, color: C_LINE, backgroundColor: ALERT_BAND, line: "solid" },
  { y: 81, color: C_LINE, backgroundColor: ALERT_BAND, line: "solid" },
  { y: 90, color: C_LINE, backgroundColor: ALERT_BAND, line: "dashed" },
  { y: 83, color: C_LINE, backgroundColor: ALERT_BAND, line: "solid" },
  { y: 89, color: C_LINE, backgroundColor: ALERT_BAND, line: "solid" },
  { y: 81, color: C_LINE, backgroundColor: ALERT_BAND, line: "solid" },
];

const ALERT_GRADIENT = [
  { color: C_LINE_2, offset: 67 },
  { color: C_RED, offset: 70 },
];

/* --------------------------------------------------------------- alert card */

const INFO_ROWS: Array<[string, string, string]> = [
  ["metric", "active_sessions", C_TEXT],
  ["current", "1,840", C_TEXT],
  ["expected", "3,200–3,800", C_TEXT],
  ["deviation", "-42%", C_RED],
];

const ALERT_DATES = ["Oct 1", "Oct 8", "Oct 15", "Oct 22", "Oct 29"];

function AlertCard() {
  return (
    <div className="pu-card pu-alert" style={{ backgroundColor: C_CARD }}>
      <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 16 })} />

      {/* Info */}
      <div className="pu-alert-info" style={{ backgroundColor: C_WELL_2 }}>
        <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 16 })} />
        {INFO_ROWS.map(([k, v, colour]) => (
          <div key={k} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
            <div className="pu-alert-info-row">
              <div className="pu-pre">
                <p className="t-mono" style={{ color: C_DIM }}>
                  {k}
                </p>
              </div>
              <div className="pu-pre">
                <p className="t-mono" style={{ color: colour }}>
                  {v}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tag */}
      <div className="pu-alert-tag">
        <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
          <div className="pu-alert-badge" style={{ backgroundColor: C_WELL }}>
            <div className="pu-pre">
              <p className="t-micro" style={{ color: C_MUTED_2 }}>
                High severity
              </p>
            </div>
          </div>
        </div>
        <div className="pu-fill">
          <p className="t-nano" style={{ textAlign: "right", color: C_PRESET_DEFAULT }}>
            2 min ago
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="pu-alert-title">
        <div className="pu-w100">
          <p className="t-body" style={{ textAlign: "left", color: C_TEXT }}>
            Active sessions
          </p>
        </div>
        <div className="pu-w100">
          <p className="t-xs" style={{ textAlign: "left", color: C_MUTED_2 }}>
            Activation in EU markets fell from 34% to 22% over the past 6 hours.
          </p>
        </div>
      </div>

      {/* Graph Container */}
      <div className="pu-alert-chart">
        <div style={{ position: "relative", flex: "1 0 0", width: 1, height: "100%" }}>
          <Sparkline
            points={ALERT_POINTS}
            weight={1}
            topPadding={19}
            yDivisions={2}
            divisionsColor={C_WELL}
            divisionsHeight={100}
            gradientColors={ALERT_GRADIENT}
            baseline
            baselinePoints={ALERT_BASELINE}
            baselineWidth={35}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "56%",
            left: "73%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: C_RED, position: "relative" }} />
        </div>
        <div className="pu-alert-chart-label" style={{ top: "21%", left: "91%" }}>
          <p className="t-nano" style={{ color: C_DIM }}>
            Baseline
          </p>
        </div>
        <div className="pu-alert-chart-label" style={{ top: "67%", left: "73%" }}>
          <p className="t-nano" style={{ color: C_RED }}>
            Anomaly
          </p>
        </div>
      </div>

      {/* Graph dates */}
      <div className="pu-row-between">
        {ALERT_DATES.map((d) => (
          <div key={d} className="pu-pre">
            <p className="t-xs" style={{ textAlign: "left", color: C_MUTED_2 }}>
              {d}
            </p>
          </div>
        ))}
      </div>

      {/* Additional notifications */}
      <div className="pu-alert-notif">
        <div className="pu-alert-sentto">
          <div className="pu-alert-hash" style={{ backgroundColor: C_WELL }}>
            <Icon id="2166604194" size={12} color={C_ICON_DIM} strokeWidth={2} />
          </div>
          <div className="pu-pre">
            <p className="t-nano" style={{ textAlign: "left", color: C_MUTED }}>
              <span style={{ color: C_MUTED_2 }}>Sent to</span>
              <span style={{ color: C_TEXT }}> </span>
              {"#product-alerts"}
            </p>
          </div>
        </div>
        <div style={{ flex: "1 0 0", width: 1, minWidth: 16, minHeight: 16 }} />
        <div className="pu-pre">
          <p className="t-nano" style={{ textAlign: "right", color: C_PRESET_DEFAULT }}>
            Delivered 1m ago
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- score card */

const BREAKDOWN: Array<{ label: string; value: string; width: string; tint: string }> = [
  { label: "Deviation from baseline", value: "-34% · high", width: "73%", tint: C_RED },
  { label: "Timing context", value: "peak traffic window", width: "64%", tint: C_AMBER },
  { label: "Business impact", value: "revenue-critical metric", width: "82.5%", tint: C_RED },
  { label: "Historical recurrence", value: "first occurrence", width: "37.5%", tint: C_GREEN },
];

/* 87 of 100, as the arc's sweep: 87% of a full turn. */
const SCORE_SWEEP = "313.2deg";

function ScoreCard() {
  return (
    <div className="pu-card pu-score" style={{ backgroundColor: C_CARD }}>
      <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 16 })} />

      <div className="pu-score-head">
        <div className="pu-fill">
          <p className="t-body" style={{ textAlign: "left", color: C_TEXT }}>
            Active sessions
          </p>
        </div>
        <div className="pu-score-chip">
          <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 24,
                position: "relative",
                WebkitMaskImage: "radial-gradient(closest-side, #00000000 74%, #ffffffff 75%)",
                maskImage: "radial-gradient(closest-side, #00000000 74%, #ffffffff 75%)",
                background: `conic-gradient(${C_MUTED} ${SCORE_SWEEP}, ${C_LINE_2} ${SCORE_SWEEP})`,
              }}
            />
          </div>
          <div className="pu-score-num">
            <div className="pu-pre">
              <p className="t-mono-s" style={{ color: C_MUTED }}>
                87
              </p>
            </div>
            <div className="pu-pre">
              <p className="t-mono-s" style={{ color: C_MUTED_2 }}>
                {" / 100"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pu-score-source">
        <div className="pu-pre">
          <p className="t-xs" style={{ textAlign: "left", color: C_MUTED_2 }}>
            Source:
          </p>
        </div>
        <div className="pu-score-chip">
          <SourceMarkA />
          <div className="pu-pre">
            <p className="t-xs" style={{ textAlign: "left", color: C_MUTED }}>
              Stride
            </p>
          </div>
        </div>
        <div className="pu-pre">
          <p className="t-xs" style={{ textAlign: "left", color: C_MUTED }}>
            /
          </p>
        </div>
        <div className="pu-score-chip">
          <SourceMarkB />
          <div className="pu-pre">
            <p className="t-xs" style={{ textAlign: "left", color: C_MUTED }}>
              Mixboard
            </p>
          </div>
        </div>
      </div>

      <div className="pu-score-breakdown">
        <div className="pu-w100">
          <p className="t-nano" style={{ textAlign: "left", color: C_DIM }}>
            Score breakdown
          </p>
        </div>
        {BREAKDOWN.map((b) => (
          <div key={b.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
            <div className="pu-score-row">
              <div className="pu-score-row-head">
                <div className="pu-clamp2">
                  <p className="t-micro" style={{ textAlign: "left", color: C_MUTED }}>
                    {b.label}
                  </p>
                </div>
                <div className="pu-pre">
                  <p className="t-mono" style={{ textAlign: "right", color: C_DIM }}>
                    {b.value}
                  </p>
                </div>
              </div>
              <div className="pu-score-bar" style={{ backgroundColor: C_WELL }}>
                <div style={{ flex: "1 0 0", width: 1, height: "auto", position: "relative" }}>
                  <div style={{ height: 2, borderRadius: 2, backgroundColor: b.tint, width: b.width }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

/**
 * The dotted field behind each visual. The reference draws it with a WebGL
 * point grid from 810 up and swaps to a flat SVG lattice on phones. Both are
 * rendered and a media query picks one, which is what the page owns; the
 * field itself is absolutely positioned and never changes a height.
 */
function VisualField() {
  return (
    <>
      <div className="pu-bento-gl" style={{ flex: "none", position: "absolute", inset: 0, overflow: "hidden" }}>
        <DotGridField {...BENTO_DOT_GRID} />
      </div>
      <div className="pu-bento-pattern" style={{ flex: "none", position: "absolute", inset: 0 }}>
        <DotPattern weight={2} space={4} />
      </div>
    </>
  );
}

const CSS = UTIL_CSS + `
.pu-bento {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.pu-bento-row {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center;
  gap: 0; max-width: 1400px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-bento-cell {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center flex-start; place-self: start; align-items: center; gap: 40px;
  width: 100%; height: 100%; padding: 40px; overflow: clip;
}
.pu-bento-visual {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: 440px; padding: 0; overflow: visible;
}
.pu-bento-scale { position: relative; }
.pu-bento-pattern { display: none; }
.pu-bento-text {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-bento-text > div {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}


.pu-card {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center;
  width: 310px; height: min-content; padding: 16px;
  border-radius: 16px; pointer-events: none; overflow: visible;
}
.pu-alert { gap: 16px; }
.pu-alert-info {
  position: absolute; bottom: -8px; right: -13px; z-index: 1;
  display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 4px;
  width: 211px; height: min-content; padding: 12px;
  border-radius: 16px; overflow: clip;
}
.pu-alert-info-row {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center space-between; align-items: center;
  width: 187px; height: min-content; padding: 0; overflow: clip;
}
.pu-alert-tag {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-alert-badge {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 0;
  width: min-content; height: min-content; padding: 4px 8px;
  border-radius: 4px; overflow: visible;
}
.pu-alert-title {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-alert-chart {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: 101px; padding: 0; overflow: clip;
}
.pu-alert-chart-label {
  position: absolute; z-index: 1; flex: none; width: auto; height: auto;
  white-space: pre; transform: translate(-50%, -50%);
}
.pu-alert-notif {
  position: relative; display: flex; flex-flow: row wrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 8px 0;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-alert-sentto {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.pu-alert-hash {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 20px; height: 20px; aspect-ratio: 1; padding: 0;
  border-radius: 4px; overflow: clip;
}

.pu-score { gap: 8px; }
.pu-score-head {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 16px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-score-chip {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 6px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.pu-score-num {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: min-content; height: min-content; padding: 0; overflow: visible;
}
.pu-score-source {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 6px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-score-breakdown {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 12px;
  width: 100%; height: min-content; padding: 12px 0; overflow: clip;
}
.pu-score-row {
  position: relative; display: flex; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 10px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-score-row-head {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: flex-start space-between; align-items: flex-start;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-score-bar {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 16px;
  width: 100%; height: 2px; padding: 0; border-radius: 2px; overflow: clip;
}

@media (max-width: 1199.98px) {
  .pu-bento { padding: 0; }
  .pu-bento-row-line { display: none; }
  .pu-bento-cell { padding: 32px; }
  .pu-bento-graph-line { display: none; }
}
@media (max-width: 809.98px) {
  .pu-bento-row {
    grid-template-rows: repeat(1, min-content);
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-auto-rows: min-content;
  }
  .pu-bento-cell { padding: 20px; }
  .pu-bento-entity { height: 648px; }
  .pu-bento-entity .pu-bento-visual { height: 464px; }
  .pu-bento-entity-line { border-right-width: 0 !important; border-bottom-width: 1px !important; }
  .pu-bento-graph { height: min-content; }
  .pu-bento-graph .pu-bento-visual { height: 411px; }
  .pu-bento-scale { transform: scale(0.9); }
  .pu-bento-gl { display: none; }
  .pu-bento-pattern { display: block; }
}
`;

export function PulseBento() {
  return (
    <div className="pu-bento" id="pulse-bento">
      <style>{CSS}</style>

      <div className="pu-bento-row">
        <span
          className="pu-bento-row-line"
          style={overlay({
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(34, 34, 34))",
          })}
        />

        {/* Entity */}
        <div className="pu-bento-cell pu-bento-entity">
          <span
            className="pu-bento-entity-line"
            style={overlay({ borderRightWidth: 1, borderColor: C_LINE })}
          />
          <div className="pu-bento-visual">
            <VisualField />
            <div className="pu-bento-scale">
              <AlertCard />
            </div>
          </div>
          <div className="pu-bento-text">
            <div>
              <h3 className="t-h3" style={{ color: C_TEXT }}>
                Adaptive baselines, per metric.
              </h3>
            </div>
            <div>
              <p className="t-body" style={{ color: C_MUTED }}>
                Pulse builds a normal range for every data point it watches. Thresholds adjust
                automatically as your business grows.
              </p>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="pu-bento-cell pu-bento-graph">
          <span
            className="pu-bento-graph-line"
            style={overlay({ borderRightWidth: 1, borderColor: C_LINE })}
          />
          <div className="pu-bento-visual">
            <VisualField />
            <div className="pu-bento-scale">
              <ScoreCard />
            </div>
          </div>
          <div className="pu-bento-text">
            <div>
              <h3 className="t-h3" style={{ color: C_TEXT }}>
                Severity scoring with context.
              </h3>
            </div>
            <div>
              <p className="t-body" style={{ color: C_MUTED }}>
                Not every deviation is an emergency. Pulse scores each alert by impact and timing so
                you know what to act on first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
