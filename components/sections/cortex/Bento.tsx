"use client";

import type { CSSProperties, ReactNode } from "react";
import { Border, CxIcon, DotPattern, Hairline, LiveDot, Pill, T } from "./ui";
import { CX_MARKS } from "./marks";
import { EndDivider } from "./EndDivider";
import { DotGridField, BENTO_DOT_GRID } from "@/components/webgl/DotGridField";

const SHADOW = "0 1px 6px 1px rgba(0, 0, 0, 0.25)";

/** One of the three stacked source cards on the left of the first visual. */
const SOURCE_CARDS: Array<{
  top: number;
  mark: string;
  name: string;
  account: string;
  /** which side the 8px connector nub sits on */
  nub: "right" | "left-top";
}> = [
  { top: 24, mark: CX_MARKS.pipecloud, name: "Pipecloud", account: "John Smith", nub: "left-top" },
  { top: 104, mark: CX_MARKS.gridwork, name: "Gridwork", account: "J. Smith", nub: "right" },
  { top: 184, mark: CX_MARKS.vaultdb, name: "VaultDB", account: "jsmith@co.com", nub: "right" },
];

/** The five rolling activity cards in the second visual. */
const FEED: Array<{ icon: string; title: string; source: string; time: string }> = [
  { icon: "2876127492", title: "Account updated", source: "Pipecloud", time: "just now" },
  { icon: "736863830", title: "New payment linked", source: "Stride", time: "12s ago" },
  { icon: "4051758266", title: "Record created", source: "VaultDB", time: "28s ago" },
  { icon: "3038134698", title: "Entity resolved", source: "Pipecloud", time: "1m ago" },
  { icon: "228321436", title: "Subscription changed", source: "Stride", time: "2m ago" },
];

/** The curved connectors from each source card into the resolved record. */
const CONNECTORS: Array<{ top: number; h: number; d: string }> = [
  { top: 60, h: 220, d: "M 0 0 C 0 0 7.184 0 14 0 C 20.627 0 26 5.373 26 12 C 26 57.931 26 220 26 220" },
  { top: 140, h: 140, d: "M 0 0 C 0 0 7.184 0 14 0 C 20.627 0 26 5.373 26 12 C 26 45.911 26 140 26 140" },
  { top: 220, h: 60, d: "M 0 0 C 0 0 7.184 0 14 0 C 20.627 0 26 5.373 26 12 C 26 29.51 26 60 26 60" },
];

const NUB: CSSProperties = {
  position: "absolute",
  width: 8,
  height: 8,
  borderRadius: 8,
  backgroundColor: T.panel,
  zIndex: 1,
  overflow: "hidden",
};

function Nub({ style }: { style: CSSProperties }) {
  return (
    <div style={{ ...NUB, ...style }}>
      <Hairline radius={8} />
    </div>
  );
}

const CSS = `
.cx-bento {
  --cx-bt: 1px; --cx-br: 0px; --cx-bb: 0px; --cx-bl: 0px;
  --cx-bc: ${T.line};
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.cx-bento-frame {
  --cx-bt: 0px; --cx-br: 1px; --cx-bb: 0px; --cx-bl: 1px;
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.cx-row1 {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center; gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.cx-cell {
  --cx-bt: 1px; --cx-br: 1px; --cx-bb: 0px; --cx-bl: 0px;
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  place-self: start; gap: 40px; width: 100%; height: 100%; padding: 40px; overflow: clip;
}
.cx-visual {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: 480px; padding: 0; overflow: visible;
}
.cx-visual-b { height: 480px; }
.cx-text {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: flex-start; justify-content: center; align-items: flex-start; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.cx-text h3, .cx-text p { margin: 0; width: 100%; height: auto; position: relative; flex: none;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word; }
.cx-graph { position: relative; z-index: 2; pointer-events: none; flex: none; width: 320px; height: 429px; overflow: visible; }
.cx-feed {
  position: relative; z-index: 2; pointer-events: none; display: flex; flex: none;
  flex-flow: column nowrap; place-content: center; align-items: center; gap: 8px;
  width: 301px; height: min-content; padding: 0; overflow: clip;
}
.cx-row2 {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, min-content);
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: min-content;
  justify-content: center; gap: 0 80px; width: 100%; height: min-content; padding: 40px; overflow: clip;
}
.cx-row2-text { place-self: end center; }
.cx-row2-text-phone { display: none; }
.cx-visual2 {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; place-self: start; align-items: center; gap: 8px;
  width: 100%; height: 446px; padding: 32px 0 33px; overflow: visible;
}
.cx-chain {
  position: relative; z-index: 2; pointer-events: none; display: flex; flex: none;
  flex-flow: row nowrap; place-content: center; align-items: center; gap: 12px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
  transform: scale(0.9);
}
.cx-node {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 50px; aspect-ratio: 1; height: auto; padding: 12px;
  border-radius: 12px; background-color: ${T.panel}; overflow: visible;
}
.cx-dotgrid { position: absolute; inset: 0; z-index: 1; flex: none; display: none; }
.cx-dotgl { position: absolute; inset: 0; z-index: 1; flex: none; overflow: hidden; }
.cx-mono-m { font-family: var(--font-code); font-weight: 500; font-size: 14px; line-height: 20px; }
@media (min-width: 1200px) { .cx-chain { transform: none; } }
@media (max-width: 1199.98px) {
  .cx-bento { padding: 0; }
  .cx-bento-frame { --cx-bt: unset; --cx-br: unset; --cx-bb: unset; --cx-bl: unset; }
  .cx-cell { padding: 32px; }
  .cx-row2 { gap: 0 64px; padding: 32px; }
}
@media (max-width: 809.98px) {
  .cx-row1 { grid-template-columns: repeat(1, minmax(50px, 1fr)); }
  .cx-cell { --cx-br: 0px; padding: 20px; }
  .cx-visual { height: 464px; }
  .cx-visual-b { height: 411px; }
  .cx-row2 { grid-template-columns: repeat(1, minmax(50px, 1fr)); gap: 40px 80px; padding: 20px; }
  .cx-visual2 { order: 1; }
  .cx-row2-text { display: none; }
  .cx-row2-text-phone { display: flex; order: 2; }
  .cx-graph, .cx-feed { transform: scale(0.9); }
  .cx-dotgrid { display: block; }
  .cx-dotgl { display: none; }
}
`;

function CellText({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="cx-text">
      <div style={{ width: "100%" }}>
        <h3 className="t-h3" style={{ color: T.bright }}>
          {heading}
        </h3>
      </div>
      <div style={{ width: "100%" }}>
        <p className="t-body" style={{ color: T.muted }}>
          {body}
        </p>
      </div>
    </div>
  );
}

function ResolvedCard() {
  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 109,
        width: 211,
        height: "min-content",
        display: "flex",
        flexFlow: "column nowrap",
        alignContent: "flex-start",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 24,
        padding: 12,
        borderRadius: 12,
        backgroundColor: T.panel,
        boxShadow: SHADOW,
        overflow: "visible",
      }}
    >
      <Hairline radius={12} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%" }}>
          <p className="t-body" style={{ margin: 0, color: T.bright }}>
            J. Smith
          </p>
        </div>
        <div style={{ width: "100%" }}>
          <p className="t-sm" style={{ margin: 0, color: T.dim }}>
            john.smith@company.com
          </p>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 4,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%" }}>
          <p className="t-mono" style={{ margin: 0, color: T.dim }}>
            Synced from:
          </p>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexFlow: "row wrap",
            alignContent: "center",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}
        >
          {[CX_MARKS.pipecloud, CX_MARKS.gridwork, CX_MARKS.vaultdb].map((src, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "row nowrap",
                placeContent: "center",
                alignItems: "center",
                gap: 16,
                width: "min-content",
                height: "min-content",
                padding: 8,
                borderRadius: 8,
                backgroundColor: T.panel,
                overflow: "hidden",
              }}
            >
              <Hairline radius={8} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={src} style={{ width: 20, height: 20, flex: "none", display: "block" }} />
            </div>
          ))}
        </div>
      </div>
      <Nub style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} />
    </div>
  );
}

function EntityGraph() {
  return (
    <div className="cx-graph">
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Pill padding="2px 8px">Records found</Pill>
      </div>
      {CONNECTORS.map((c, i) => (
        <div key={i} style={{ position: "absolute", top: c.top, left: 189, width: 26, height: c.h }}>
          <svg viewBox={`0 0 26 ${c.h}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <path d={c.d} fill="transparent" stroke={T.line} />
          </svg>
        </div>
      ))}
      {SOURCE_CARDS.map((c) => (
        <div
          key={c.name}
          style={{
            position: "absolute",
            top: c.top,
            left: 0,
            width: 189,
            height: "min-content",
            display: "flex",
            flexFlow: "column nowrap",
            alignContent: "flex-start",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 4,
            padding: 12,
            borderRadius: 12,
            backgroundColor: T.panel,
            boxShadow: SHADOW,
            overflow: "visible",
          }}
        >
          <Hairline radius={12} />
          {c.nub === "left-top" ? <Nub style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} /> : null}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexFlow: "row nowrap",
              placeContent: "center",
              alignItems: "center",
              gap: 8,
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={c.mark} style={{ width: 20, height: 20, flex: "none", display: "block" }} />
            <div style={{ flex: "1 0 0", width: 1 }}>
              <p className="t-xs" style={{ margin: 0, color: T.dim }}>
                {c.name}
              </p>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <p className="t-sm" style={{ margin: 0, color: T.bright }}>
              {c.account}
            </p>
          </div>
          {c.nub === "right" ? <Nub style={{ top: "53%", right: -4, transform: "translateY(-50%)" }} /> : null}
        </div>
      ))}
      <div style={{ position: "absolute", top: 256, left: 266 }}>
        <Pill padding="2px 8px">Synced</Pill>
      </div>
      <ResolvedCard />
    </div>
  );
}

function Feed() {
  return (
    <div className="cx-feed">
      {FEED.map((f) => (
        <div key={f.title} style={{ flex: "none", width: "100%" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexFlow: "row nowrap",
              alignContent: "center",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 12,
              minWidth: 300,
              width: "100%",
              height: "min-content",
              padding: 12,
              borderRadius: 12,
              backgroundColor: T.panel,
              overflow: "hidden",
            }}
          >
            <Hairline radius={12} />
            <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
              <LiveDot />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "row nowrap",
                placeContent: "center",
                alignItems: "center",
                gap: 16,
                width: 42,
                aspectRatio: 1,
                height: "auto",
                borderRadius: 6,
                backgroundColor: T.raised,
                overflow: "hidden",
                flex: "none",
              }}
            >
              <CxIcon id={f.icon} size={20} color={T.icon} />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "column nowrap",
                placeContent: "center",
                alignItems: "center",
                gap: 0,
                flex: "1 0 0",
                width: 1,
                overflow: "hidden",
              }}
            >
              <div style={{ width: "100%" }}>
                <p className="cx-mono-m" style={{ margin: 0, color: T.bright }}>
                  {f.title}
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexFlow: "row nowrap",
                  placeContent: "center",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <div style={{ flex: "1 0 0", width: 1 }}>
                  <p className="t-xs" style={{ margin: 0, color: T.muted }}>
                    {f.source}
                  </p>
                </div>
                <div style={{ flex: "none", width: "auto" }}>
                  <p className="t-micro" style={{ margin: 0, whiteSpace: "pre", color: T.dim }}>
                    {f.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChainNode({ id, nubs }: { id: string; nubs: ReactNode }) {
  return (
    <div className="cx-node">
      <Hairline radius={12} />
      <CxIcon id={id} size={16} color={T.dim} />
      {nubs}
    </div>
  );
}

function ChainLine() {
  return (
    <div style={{ width: 1, height: 32, position: "relative" }}>
      <svg viewBox="0 0 1 32" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <path d="M 0 0 L 0 32" fill="transparent" stroke={T.line} />
      </svg>
    </div>
  );
}

function Chain() {
  const top = <Nub style={{ top: -4, left: "48%", transform: "translateX(-50%)" }} />;
  const bottom = <Nub style={{ bottom: -4, left: "48%", transform: "translateX(-50%)" }} />;
  return (
    <div className="cx-chain">
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "min-content",
          height: "min-content",
          overflow: "visible",
        }}
      >
        <ChainNode id="2752932676" nubs={bottom} />
        <ChainLine />
        <ChainNode
          id="2511577395"
          nubs={
            <>
              {top}
              {bottom}
            </>
          }
        />
        <ChainLine />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexFlow: "row nowrap",
            placeContent: "center",
            alignItems: "center",
            gap: 8,
            width: "min-content",
            height: "min-content",
            padding: "8px 12px 8px 8px",
            borderRadius: 12,
            backgroundColor: T.raised,
            overflow: "visible",
          }}
        >
          <Hairline radius={12} />
          <Nub style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} />
          <Nub style={{ bottom: -4, left: "50%", transform: "translateX(-50%)" }} />
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
              backgroundColor: T.raised2,
              overflow: "hidden",
              flex: "none",
            }}
          >
            <CxIcon id="2876127492" size={16} color={T.icon} />
          </div>
          <div style={{ flex: "none", width: "auto", whiteSpace: "pre" }}>
            <p className="cx-mono-m" style={{ margin: 0, color: T.bright }}>
              Subscription
            </p>
          </div>
        </div>
        <ChainLine />
        <ChainNode
          id="1378337905"
          nubs={
            <>
              {top}
              {bottom}
            </>
          }
        />
        <ChainLine />
        <ChainNode id="73151267" nubs={top} />
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "column nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: 211,
          height: "min-content",
          padding: 16,
          borderRadius: 12,
          backgroundColor: T.panel,
          overflow: "hidden",
          flex: "none",
        }}
      >
        <Hairline radius={12} />
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
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={CX_MARKS.stride} style={{ width: 16, height: 16, flex: "none", display: "block" }} />
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
              placeContent: "center",
              alignItems: "center",
              gap: 8,
              width: "min-content",
            }}
          >
            <LiveDot />
            <p className="t-micro" style={{ margin: 0, whiteSpace: "pre", color: T.bright }}>
              Active
            </p>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexFlow: "column nowrap",
            placeContent: "center",
            alignItems: "center",
            gap: 8,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {[
            ["Plan", "Enterprise"],
            ["Renewal", "Dec 14, 2025"],
            ["MRR", "$1,240"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "row nowrap",
                placeContent: "center",
                alignItems: "center",
                gap: 16,
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div style={{ flex: "1 0 0", width: 1 }}>
                <p className="t-label" style={{ margin: 0, color: T.muted }}>
                  {k}
                </p>
              </div>
              <div style={{ flex: "none", width: "auto", whiteSpace: "pre" }}>
                <p className="t-label" style={{ margin: 0, color: T.bright }}>
                  {v}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ROW2_HEADING = "Explore relationships without writing a query.";
const ROW2_BODY =
  "Browse connections between any two entities - customers, revenue, support history - without touching SQL.";

export function CortexBento() {
  return (
    <>
      <style>{CSS}</style>
      <div className="cx-bento" data-cx-block="bento">
        <Border />
        <div className="cx-bento-frame">
          <Border />
          <div className="cx-row1">
            <div className="cx-cell">
              <Border />
              <div className="cx-visual">
                <EntityGraph />
                <div className="cx-dotgl"><DotGridField {...BENTO_DOT_GRID} /></div>
                <div className="cx-dotgrid"><DotPattern id="cx-dots-entity" /></div>
              </div>
              <CellText
                heading="Entity resolution, automatic."
                body="Same customer across your CRM, payments, and database - Cortex links them without configuration."
              />
            </div>
            <div className="cx-cell">
              <Border />
              <div className="cx-visual cx-visual-b">
                <Feed />
                <div className="cx-dotgl"><DotGridField {...BENTO_DOT_GRID} /></div>
                <div className="cx-dotgrid"><DotPattern id="cx-dots-feed" /></div>
              </div>
              <CellText
                heading="The graph updates itself."
                body="Every change in a connected tool reflects within seconds. Always current, zero manual effort."
              />
            </div>
          </div>
          <EndDivider />
          <div className="cx-row2">
            <div className="cx-text cx-row2-text">
              <div style={{ width: "100%" }}>
                <h3 className="t-h3" style={{ color: T.bright }}>
                  {ROW2_HEADING}
                </h3>
              </div>
              <div style={{ width: "100%" }}>
                <p className="t-body" style={{ color: T.muted }}>
                  {ROW2_BODY}
                </p>
              </div>
            </div>
            <div className="cx-text cx-row2-text-phone">
              <div style={{ width: "100%" }}>
                <h3 className="t-h3" style={{ color: T.bright }}>
                  {ROW2_HEADING}
                </h3>
              </div>
              <div style={{ width: "100%" }}>
                <p className="t-body" style={{ color: T.muted }}>
                  {ROW2_BODY}
                </p>
              </div>
            </div>
            <div className="cx-visual2">
              <Chain />
              <div className="cx-dotgl"><DotGridField {...BENTO_DOT_GRID} /></div>
                <div className="cx-dotgrid"><DotPattern id="cx-dots-chain" /></div>
            </div>
          </div>
          <EndDivider />
        </div>
      </div>
    </>
  );
}
