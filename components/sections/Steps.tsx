"use client";

import { Appear } from "@/lib/appear";

/* Colours copied verbatim from the spec so they resolve with no translation. */
const C_NUM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const C_NAME = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const C_DESC = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const C_BORDER = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, #222)";

/*
 * Three on-mount reveals and nothing else. Each step is
 *   initial {opacity: 0.001, y: 10} -> animate {opacity: 1, y: 0}
 *   transition {type: 'tween', duration: 0.4, ease: [0.12, 0.23, 0.5, 1]}
 * with delays cascading 0.5 / 0.6 / 0.7s, which continues the hero's 0 / 0.1 /
 * 0.2 / 0.3 run so the last step settles at t = 1.1s. Only a desktop entry
 * exists in the appear payload, so the same numbers apply at every breakpoint.
 *
 * The row component itself declares a spring, but the page only ever renders
 * its Visible variant: no hover, no press, no scroll link, no loop.
 */
type Step = { num: string; name: string; desc: string; delay: number };

const STEPS: Step[] = [
  {
    num: "1.",
    name: "Connect",
    desc: "Plug in your tools. 240+ integrations out of the box.",
    delay: 0.5,
  },
  {
    num: "2.",
    name: "Map",
    desc: "Cortex automatically builds your knowledge graph.",
    delay: 0.6,
  },
  {
    num: "3.",
    name: "Ask",
    desc: "Query in plain language. Share results with your team.",
    delay: 0.7,
  },
];

export function Steps() {
  return (
    <div className="st-section">
      <div
        className="st-container"
        style={{
          /* data-border: left + right hairlines drawn as an overlay so the
             box keeps its exact width. */
          boxShadow: `inset 1px 0 0 0 ${C_BORDER}, inset -1px 0 0 0 ${C_BORDER}`,
        }}
      >
        {STEPS.map((step) => (
          <Appear key={step.num} y={10} delay={step.delay} className="st-item">
            <div className="st-visible">
              <div className="st-head">
                <div className="st-num">
                  <h3 className="t-h4" style={{ color: C_NUM }}>
                    {step.num}
                  </h3>
                </div>
                <div className="st-name">
                  <h3 className="t-h4" style={{ color: C_NAME }}>
                    {step.name}
                  </h3>
                </div>
              </div>
              <div className="st-desc">
                <p className="t-sm" style={{ color: C_DESC }}>
                  {step.desc}
                </p>
              </div>
            </div>
          </Appear>
        ))}
      </div>

      <style>{`
        .st-section {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 16px;
          width: 100%;
          height: min-content;
          padding: 0 64px;
          overflow: clip;
        }
        .st-container {
          position: relative;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          grid-auto-rows: minmax(0, 1fr);
          justify-content: center;
          gap: 32px;
          flex: none;
          width: 100%;
          max-width: 1400px;
          height: min-content;
          padding: 40px;
          overflow: clip;
        }
        .st-item {
          position: relative;
          width: 100%;
          height: 100%;
          will-change: transform;
        }
        .st-visible {
          position: relative;
          display: flex;
          flex-flow: column;
          place-content: center;
          align-items: center;
          gap: 8px;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .st-head {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 4px;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: visible;
        }
        .st-num {
          position: relative;
          flex: none;
          width: auto;
          height: auto;
          white-space: pre;
        }
        .st-name {
          position: relative;
          flex: 1 0 0;
          width: 1px;
          height: auto;
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }
        .st-desc {
          position: relative;
          flex: none;
          width: 100%;
          height: auto;
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }

        @media (max-width: 1199.98px) {
          .st-section { padding: 0; }
          .st-container { box-shadow: none !important; }
        }
        @media (max-width: 809.98px) {
          .st-container {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            grid-auto-rows: min-content;
            gap: 24px 32px;
            padding: 40px 20px;
          }
        }
      `}</style>
    </div>
  );
}
