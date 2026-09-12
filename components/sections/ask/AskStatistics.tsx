import type { CSSProperties } from "react";

import { StatLottie } from "@/components/sections/statistics/StatLottie";
import { AkEndRule } from "./AkEndRule";

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";

/** An overlay border: never a real border, which would grow the box. */
const overlay = (style: CSSProperties): CSSProperties => ({
  content: '""',
  position: "absolute",
  inset: 0,
  boxSizing: "border-box",
  borderStyle: "solid",
  borderRadius: "inherit",
  pointerEvents: "none",
  borderWidth: 0,
  ...style,
});

const STATS = [
  {
    name: "Stat1 Animation",
    src: "/data/data-27ff2ca1e9.json",
    value: "16x",
    caption: "Faster time-to-answer",
  },
  {
    name: "Stat2 Animation",
    src: "/data/data-d3bf04b46d.json",
    value: "47%",
    caption: "Fewer tools needed",
  },
  {
    name: "Stat3 Animation",
    src: "/data/data-dfc68c0986.json",
    value: "80%",
    caption: "Less time building reports",
  },
  {
    name: "Stat4 Animation",
    src: "/data/data-f790898626.json",
    value: "4.2hrs",
    caption: "Saved per team per week",
  },
];

/**
 * The same four counters the home page carries, but this route puts the
 * chromatic rule at the top of the block rather than the bottom and pads the
 * heading differently below 1200, so it is built here rather than shared.
 */
export function AskStatistics() {
  return (
    <div className="ak-stats" id="ask-statistics">
      <style>{CSS}</style>
      <div className="ak-stats-shell">
        <span
          className="ak-stats-edge"
          style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderColor: HAIRLINE })}
        />

        <div>
          <AkEndRule />
        </div>

        <div className="ak-stats-head">
          <div className="ak-stats-head-text">
            <h2 className="t-h2" style={{ textAlign: "start" }}>
              <span style={{ color: MUTED }}>Your team already has the data.</span>{" "}
              <span style={{ color: BRIGHT }}>Nordwell gives you the answers.</span>
            </h2>
          </div>
        </div>

        <div className="ak-stats-grid">
          {STATS.map((s) => (
            <div className="ak-stat" key={s.value}>
              <div className="ak-stat-anim">
                <StatLottie src={s.src} name={s.name} />
              </div>
              <div className="ak-stat-info">
                <div className="ak-stat-tb">
                  <h3 className="t-d3" style={{ color: BRIGHT }}>
                    {s.value}
                  </h3>
                </div>
                <div className="ak-stat-tb">
                  <p className="t-body" style={{ color: MUTED }}>
                    {s.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ak-stats {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ak-stats-shell {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.ak-stats-head {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 80px 40px 40px; overflow: clip;
}
.ak-stats-head-text {
  position: relative; flex: 0.5 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-stats-head-text > h2 { margin: 0; }
.ak-stats-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, min-content);
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  grid-auto-rows: min-content; justify-content: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-stat {
  position: relative; display: flex; flex: none; place-self: start;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 40px; width: 100%; height: min-content; padding: 60px 40px; overflow: clip;
}
.ak-stat-anim { position: relative; flex: none; width: 64px; height: 64px; }
.ak-stat-info {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-stat-tb {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-stat-tb > * { margin: 0; }

@media (max-width: 1199.98px) {
  .ak-stats { padding: 0; }
  .ak-stats-edge { border-left-width: 0; border-right-width: 0; }
  .ak-stats-head { padding: 60px 40px 40px; }
  .ak-stats-head-text { flex: 0.66 0 0; }
  .ak-stats-grid { grid-template-columns: repeat(2, minmax(315px, 1fr)); }
  .ak-stat { padding: 20px 40px; }
}
@media (max-width: 809.98px) {
  .ak-stats-head { padding: 40px 20px; }
  .ak-stats-head-text { flex: 1 0 0; }
  .ak-stats-grid {
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, minmax(100px, 1fr));
  }
  .ak-stat { padding: 20px; }
}
`;
