"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Icon } from "@/components/ui/Sprite";
import {
  FEATURE_STAGE_FIELD,
  PANEL_GRAPHIC_FIELD,
  PointMorphField,
} from "@/components/webgl/PointMorphField";
import { ScrollShapeStage } from "@/components/webgl/ScrollShapeStage";
import { SPRING } from "@/lib/motion";
import { ProgressRail } from "./features/ProgressRail";
import { AlertPanel, AskPanel, SourcesPanel } from "./features/panels";

/* The pinned particle stage. Both call sites are the shared GPGPU field:
   FEATURE_STAGE_FIELD is the sticky stage (camera z 1.8, tipRadius 0.003, its
   own middle shape) and PANEL_GRAPHIC_FIELD is the phone carousel's field
   (camera z 2, tipRadius 0.0045, a wider middle shape). ScrollShapeStage
   carries the scroll->index maths and the AnimatePresence slot swap. */

/* Colours copied verbatim from the spec so they resolve with no translation. */
const C_LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))";
const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const C_TEXT_2 = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";
const C_DESC = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const C_BTN = "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))";
const C_PAGE = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(17, 15, 13))";

/* The phone tab bar animates its background, its bottom hairline and its label
   colour, so those four tokens are used as the literals the page resolves them
   to: a var() cannot be interpolated between two keyframes. */
const TAB_BG = "#110f0d"; /* token-7f40e4a1 */
const TAB_BG_HOVER = "#141210"; /* token-ac705832 */
const TAB_BG_PRESS = "#1c1917"; /* token-93b991d8 */
const TAB_LINE = "#292524"; /* token-f3013730 */
const TAB_LINE_ON = "#44403c"; /* token-a9ea621e */
const TAB_TEXT = "#79716b"; /* token-2f1d35ad */
const TAB_TEXT_ON = "#fafaf9"; /* token-17151d22 */

const RAIL_FONT = {
  fontFamily: '"Geist Mono", "Geist Mono Placeholder", monospace',
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
  letterSpacing: "0em",
  lineHeight: "31px",
  textAlign: "left",
} as const;

type Block = {
  id: string;
  name: string;
  description: string;
  bullets: { icon: string; text: string }[];
  href: string;
};

const BLOCKS: Block[] = [
  {
    id: "features-cortex",
    name: "Cortex",
    description:
      "Connect every data source. Nordwell maps relationships automatically — customers to revenue, usage to churn signals, support tickets to product gaps. One graph. Zero manual mapping.",
    bullets: [
      { icon: "1916995349", text: "Resolves entities across every source." },
      { icon: "2876127492", text: "Updates in real time, no rebuilds." },
      { icon: "2119597464", text: "Visual graph explorer for every team." },
    ],
    href: "/features/cortex",
  },
  {
    id: "features-ask",
    name: "Ask",
    description:
      'Stop writing SQL for simple questions. Ask "Which enterprise accounts haven\'t logged in this month?" and get an answer in seconds. Nordwell translates intent into insight.',
    bullets: [
      { icon: "1954469862", text: "Understands your exact data model." },
      { icon: "3349784521", text: "Suggests smart follow-up questions." },
      { icon: "1964716429", text: "Exports to Slack, CSV, or JSON." },
    ],
    href: "/features/ask",
  },
  {
    id: "features-pulse",
    name: "Pulse",
    description:
      "Not another dashboard with 47 alerts. Pulse learns what normal looks like for your business and only surfaces what's genuinely unusual. Less noise, more signal.",
    bullets: [
      { icon: "3261614140", text: "Adaptive baselines, zero config. " },
      { icon: "3286913657", text: "Severity scoring by business impact." },
      { icon: "1875504585", text: "Routes alerts to the right channel." },
    ],
    href: "/features/pulse",
  },
];

function BlockBody({ block }: { block: Block }) {
  return (
    <div className="ft-block">
      <div className="ft-ctx">
        <div className="ft-line">
          <h2 className="t-h2" style={{ color: C_TEXT }}>
            {block.name}
          </h2>
        </div>
        <div className="ft-line">
          <p className="t-body" style={{ color: C_DESC }}>
            {block.description}
          </p>
        </div>
      </div>

      <div className="ft-feats">
        {block.bullets.map((b) => (
          <div key={b.text} className="ft-feat">
            <div className="ft-bullet">
              <Icon id={b.icon} size={16} color={C_TEXT} strokeWidth={2.5} className="ft-bicon" />
              <div className="ft-bullet-txt">
                <p className="t-label" style={{ color: C_TEXT }}>
                  {b.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ft-more-wrap">
        <a className="ft-more" href={block.href}>
          <div className="ft-more-title">
            <p className="t-label t-link" style={{ color: C_DESC }}>
              Explore more
            </p>
          </div>
          <button className="ft-more-btn" type="button" tabIndex={-1} aria-hidden>
            <Icon id="2903821725" size={14} color={C_TEXT_2} strokeWidth={2} />
          </button>
        </a>
      </div>
    </div>
  );
}

export function Features() {
  const [tab, setTab] = useState(0);

  const graphics = [
    <SourcesPanel key="sources" width={289} gap={8} />,
    <AskPanel key="ask" width={401} />,
    <AlertPanel key="alert" width={297} />,
  ];

  return (
    <div className="ft-section" id="features">
      <div className="ft-container">
        {/* ---------------------------------------------- >= 810: two rails */}
        <div className="ft-left" id="products-swap-scroll">
          <div className="ft-scroll" id="products-scroll">
            {BLOCKS.slice(0, 2).map((b) => (
              <div key={b.id} className="ft-rail ft-rail-b">
                <div className="ft-cart" id={b.id}>
                  <div>
                    <div className="ft-block-wrap">
                      <BlockBody block={b} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ft-rail">
            <div className="ft-cart" id={BLOCKS[2].id}>
              <div>
                <div className="ft-block-wrap">
                  <BlockBody block={BLOCKS[2]} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-right">
          <div className="ft-rcart">
            <div className="ft-visual">
              <div className="ft-field">
                <ScrollShapeStage
                  {...FEATURE_STAGE_FIELD}
                  sectionId="products-swap-scroll"
                >
                  {graphics}
                </ScrollShapeStage>
              </div>
            </div>
            <div className="ft-progress">
              <div className="ft-prail">
                <ProgressRail
                  sections={3}
                  sectionName="products-scroll"
                  numLines={8}
                  lineGap={10}
                  lineWeight={1}
                  fade={0.05}
                  primaryColor="rgb(250, 250, 250)"
                  secondaryColor="rgb(115, 115, 115)"
                  font={RAIL_FONT}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- <= 809: tabbed */}
        <div className="ft-mobile">
          <div className="ft-mswap">
            <div className="ft-tabs">
              {BLOCKS.map((b, i) => {
                const selected = i === tab;
                return (
                  <motion.a
                    key={b.id}
                    className="ft-tab"
                    role="button"
                    tabIndex={0}
                    onClick={() => setTab(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setTab(i);
                    }}
                    initial={false}
                    animate={{
                      backgroundColor: TAB_BG,
                      boxShadow: `inset 0 -1px 0 0 ${selected ? TAB_LINE_ON : TAB_LINE}`,
                    }}
                    whileHover={{ backgroundColor: TAB_BG_HOVER }}
                    whileTap={{ backgroundColor: TAB_BG_PRESS }}
                    transition={SPRING}
                  >
                    <div className="ft-tab-inner">
                      <div className="ft-tab-txt">
                        <motion.p
                          className="t-label"
                          initial={false}
                          animate={{ color: selected ? TAB_TEXT_ON : TAB_TEXT }}
                          transition={SPRING}
                        >
                          {b.name}
                        </motion.p>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            <div className="ft-graphics">
              <div className="ft-mfield">
                <PointMorphField {...PANEL_GRAPHIC_FIELD} currentShape={tab} />
              </div>
              {/* The three cards cross-fade on the carousel's own spring; only
                  opacity is driven, the boxes never move. */}
              <motion.div
                className="ft-mgraphic"
                style={{ width: 270 }}
                initial={false}
                animate={{ opacity: tab === 0 ? 1 : 0 }}
                transition={SPRING}
              >
                <SourcesPanel width={270} gap={4} />
              </motion.div>
              <motion.div
                className="ft-mgraphic"
                style={{ width: 315 }}
                initial={false}
                animate={{ opacity: tab === 1 ? 1 : 0 }}
                transition={SPRING}
              >
                <AskPanel width={315} />
              </motion.div>
              <motion.div
                className="ft-mgraphic"
                style={{ width: 293 }}
                initial={false}
                animate={{ opacity: tab === 2 ? 1 : 0 }}
                transition={SPRING}
              >
                <AlertPanel width={293} />
              </motion.div>
            </div>

            <div className="ft-mblock">
              <BlockBody block={BLOCKS[tab]} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ft-section {
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
        .ft-container {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          max-width: 1400px;
          height: min-content;
          padding: 0;
          overflow: clip;
          /* data-border: left + right hairlines drawn as an overlay so the
             box keeps its exact width. */
          box-shadow: inset 1px 0 0 0 ${C_LINE}, inset -1px 0 0 0 ${C_LINE};
        }

        .ft-left {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: 1 0 0;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 1px;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-scroll {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-rail {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center flex-start;
          align-items: center;
          gap: 0;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-rail-b { box-shadow: inset 0 -1px 0 0 ${C_LINE}; }
        .ft-cart {
          position: sticky;
          top: 0;
          z-index: 1;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          height: 100vh;
          padding: 0;
          scroll-margin-top: 68px;
          overflow: clip;
        }
        .ft-block-wrap { position: relative; width: 100%; }

        .ft-right {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: 1 0 0;
          place-content: center flex-start;
          align-self: stretch;
          align-items: center;
          gap: 0;
          width: 1px;
          height: auto;
          padding: 0;
          overflow: clip;
        }
        .ft-rcart {
          position: sticky;
          top: 0;
          z-index: 1;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          height: 100vh;
          padding: 0;
          overflow: clip;
        }
        .ft-visual {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 16px;
          width: 100%;
          height: 508px;
          padding: 0;
          overflow: clip;
        }
        .ft-field {
          position: relative;
          flex: 1 0 0;
          width: 1px;
          height: 100%;
          -webkit-mask-image: linear-gradient(#0000 0%, #000 10%, #000 90%, #0000 100%),
            linear-gradient(90deg, #0000 0%, #000 10%, #000 90%, #0000 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(#0000 0%, #000 10%, #000 90%, #0000 100%),
            linear-gradient(90deg, #0000 0%, #000 10%, #000 90%, #0000 100%);
          mask-composite: intersect;
        }
        .ft-progress {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 1px;
          z-index: 1;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 16px;
          width: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-prail {
          position: relative;
          flex: none;
          width: auto;
          height: 300px;
          -webkit-user-select: none;
          user-select: none;
        }

        /* ----------------------------------------------------------- block */
        .ft-block {
          position: relative;
          display: flex;
          flex-flow: column;
          place-content: flex-start center;
          align-items: flex-start;
          gap: 40px;
          width: 100%;
          height: min-content;
          padding: 40px;
          overflow: clip;
        }
        .ft-ctx {
          position: relative;
          display: flex;
          flex-flow: column;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 12px;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-line {
          position: relative;
          flex: none;
          width: 100%;
          height: auto;
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }
        .ft-feats {
          position: relative;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
          grid-auto-rows: minmax(0, 1fr);
          justify-content: center;
          gap: 32px 20px;
          flex: none;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-feat {
          position: relative;
          flex: none;
          place-self: start;
          width: 100%;
          height: auto;
        }
        .ft-bullet {
          position: relative;
          display: flex;
          flex-flow: column;
          place-content: flex-start center;
          align-items: flex-start;
          gap: 10px;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-bicon { flex: none; }
        .ft-bullet-txt {
          position: relative;
          flex: none;
          width: 100%;
          height: auto;
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
        }
        .ft-more-wrap { position: relative; flex: none; width: auto; height: auto; }
        .ft-more {
          position: relative;
          display: flex;
          flex-flow: row;
          place-content: center;
          align-items: center;
          gap: 12px;
          width: min-content;
          height: min-content;
          padding: 0;
          cursor: pointer;
          text-decoration: none;
          overflow: clip;
        }
        .ft-more-title {
          position: relative;
          flex: none;
          width: auto;
          height: auto;
          white-space: pre;
          -webkit-user-select: none;
          user-select: none;
        }
        .ft-more-btn {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 4px;
          width: 26px;
          height: auto;
          aspect-ratio: 1;
          padding: 0;
          border-radius: 52px;
          background-color: ${C_BTN};
          cursor: pointer;
          overflow: clip;
        }

        /* ---------------------------------------------------------- mobile */
        .ft-mobile {
          position: relative;
          flex: 1 0 0;
          width: 1px;
          height: auto;
          display: none;
        }
        .ft-mswap {
          position: relative;
          display: flex;
          flex-flow: column;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: clip;
        }
        .ft-tabs {
          position: sticky;
          top: 68px;
          z-index: 2;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          height: min-content;
          padding: 0;
          overflow: visible;
        }
        .ft-tab {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: 1 0 0;
          place-content: center;
          align-items: center;
          gap: 4px;
          width: 1px;
          height: min-content;
          padding: 12px 6px;
          cursor: pointer;
          text-decoration: none;
          background-color: ${C_PAGE};
          overflow: clip;
        }
        .ft-tab-inner {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 16px;
          width: min-content;
          height: min-content;
          padding: 0 4px;
          overflow: visible;
        }
        .ft-tab-txt {
          position: relative;
          flex: none;
          width: auto;
          height: auto;
          white-space: pre;
          -webkit-user-select: none;
          user-select: none;
        }
        .ft-graphics {
          position: relative;
          display: flex;
          flex-flow: row;
          flex: none;
          place-content: center;
          align-items: center;
          gap: 16px;
          width: 100%;
          height: 410px;
          padding: 0;
          overflow: visible;
        }
        .ft-mfield { position: relative; flex: 1 0 0; width: 1px; height: 100%; }
        .ft-mgraphic {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          flex: none;
          height: auto;
          pointer-events: none;
          -webkit-user-select: none;
          user-select: none;
        }
        .ft-mblock { position: relative; flex: none; width: 100%; height: auto; }

        @media (max-width: 1199.98px) {
          .ft-section { padding: 0; }
          .ft-container { box-shadow: none; }
          .ft-visual { height: 447px; }
          .ft-feats {
            display: flex;
            flex-flow: column;
            place-content: center flex-start;
            align-items: center;
            gap: 16px;
          }
          .ft-feat { align-self: unset; }
          .ft-bullet { flex-direction: row; justify-content: flex-start; gap: 12px; }
          .ft-bullet-txt { flex: 1 0 0; width: 1px; }
        }
        @media (max-width: 809.98px) {
          .ft-container { padding: 32px 0; }
          .ft-left, .ft-right { display: none; }
          .ft-mobile { display: block; }
          .ft-block { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
