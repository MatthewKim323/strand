import type { CSSProperties, ReactNode } from "react";

import { Icon } from "@/components/ui/Sprite";
import { DotGridField, BENTO_DOT_GRID } from "@/components/webgl/DotGridField";

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const MUTED_2 = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const MUTED_4 = "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))";
const GREEN = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";
const BLUE = "var(--token-5e110c3f-82c1-4736-86cd-104cc5e3bfff, rgb(54, 197, 240))";
const ICON_GREY = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";
const PATTERN_TINT = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";

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

const ring = (color = HAIRLINE) => <span style={overlay({ borderWidth: 1, borderColor: color })} />;

/**
 * The phone-only backdrop: a 1px-unit dot grid drawn as an SVG pattern, weight
 * 2 on a 4px lattice, tinted with the surface token. Taken straight from the
 * reference's own pattern component, which is plain SVG.
 * Above 810 the reference swaps this for the WebGL dot field instead; both
 * are rendered and the breakpoint decides which one is visible.
 */
function AkDotPattern() {
  const space = 4;
  const weight = 2;
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern
          id="ak-bento-dots"
          patternUnits="userSpaceOnUse"
          width={space * 2}
          height={space * 2}
        >
          <rect x={space} y={space} width={weight} height={weight} fill={PATTERN_TINT} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ak-bento-dots)" />
    </svg>
  );
}

function Backdrop() {
  return (
    <>
      <div className="ak-bento-gl">
        <DotGridField {...BENTO_DOT_GRID} />
      </div>
      <div className="ak-bento-pattern">
        <AkDotPattern />
      </div>
    </>
  );
}

/** A word chip in the natural-language query, with its connector node. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <div className="ak-chip">
      {ring()}
      <div className="ak-chip-dot">{ring()}</div>
      <div className="ak-chip-word">
        <p className="t-sm" style={{ color: BRIGHT }}>
          {children}
        </p>
      </div>
    </div>
  );
}

type Row = { key: string; keyColor: string; type: string; tint?: string; tag?: string };

const ROWS: Row[] = [
  { key: "id", keyColor: MUTED_4, type: "uuid" },
  { key: "name", keyColor: MUTED_4, type: "string" },
  { key: "tier", keyColor: GREEN, type: "string", tint: GREEN, tag: "Pipercloud" },
  { key: "onwer_id", keyColor: MUTED_4, type: "uuid" },
  { key: "last_session", keyColor: AMBER, type: "timestamp", tint: AMBER, tag: "database" },
  { key: "created_at", keyColor: BLUE, type: "timestamp", tint: BLUE, tag: "auto-resovled" },
  { key: "mrr", keyColor: MUTED_4, type: "float" },
];

function SchemaVisual() {
  return (
    <div className="ak-schema">
      <div className="ak-query">
        <div className="ak-word">
          <p className="t-sm" style={{ color: MUTED }}>
            Which
          </p>
        </div>
        <div className="ak-chip-slot">
          <Chip>accounts</Chip>
        </div>
        <div className="ak-word">
          <p className="t-sm" style={{ color: MUTED }}>
            haven&apos;t
          </p>
        </div>
        <div className="ak-chip-slot">
          <Chip>logged in today</Chip>
        </div>
        <div className="ak-word">
          <p className="t-sm" style={{ color: MUTED }}>
            ?
          </p>
        </div>
      </div>

      <div className="ak-schema-card">
        {ring()}
        <div className="ak-table-title">
          <span style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: HAIRLINE })} />
          <div className="ak-tt-name">
            <p className="t-mono-s" style={{ color: MUTED_2 }}>
              accounts
            </p>
          </div>
          <div className="ak-tt-count">
            <p className="t-mono-s" style={{ textAlign: "right", color: MUTED_4 }}>
              14,203 records
            </p>
          </div>
        </div>
        <div className="ak-rows">
          {ROWS.map((r) => (
            <div className="ak-row-slot" key={r.key}>
              <div className="ak-row">
                <span style={overlay({ borderBottomWidth: 1, borderColor: HAIRLINE })} />
                {r.tint ? (
                  <div className="ak-row-bg" style={{ backgroundColor: r.tint }} />
                ) : null}
                <div className="ak-row-k">
                  <p className="t-mono" style={{ color: r.keyColor }}>
                    {r.key}
                  </p>
                </div>
                <div className="ak-row-v">
                  <p className="t-mono" style={{ textAlign: "right", color: MUTED_4 }}>
                    {r.type}
                  </p>
                </div>
                {r.tag ? (
                  <div className="ak-tag">
                    <div className="ak-tag-l">
                      <p className="t-mono" style={{ color: BRIGHT }}>
                        {r.tag}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ak-conn-a">
        <svg viewBox="0 0 63 48" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <path
            d="M 0 0 C 0 0 0 6 0 12 C 0 18.627 5.373 24 12 24 C 23.194 24 39.803 24 50.998 24 C 57.626 24 63 29.374 63 36.002 C 63 42.002 63 48 63 48"
            fill="transparent"
            stroke={HAIRLINE}
          />
        </svg>
      </div>
      <div className="ak-conn-b">
        <svg viewBox="0 0 74.536 48" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <path
            d="M 74.536 0 C 74.536 0 74.536 6 74.536 12 C 74.536 18.627 69.164 24 62.536 24 C 48.643 24 25.893 24 12 24 C 5.373 24 0 29.373 0 36 C 0 42 0 48 0 48"
            fill="transparent"
            stroke={HAIRLINE}
          />
        </svg>
      </div>
    </div>
  );
}

/** Icon-only button: the reference drops the label block entirely at this size. */
function IconButton({
  id,
  bordered,
}: {
  id: string;
  bordered?: boolean;
}) {
  const color = bordered
    ? "var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))"
    : "var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))";
  return (
    <div
      className="ak-iconbtn"
      style={
        bordered
          ? {
              backgroundColor:
                "var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))",
            }
          : undefined
      }
    >
      {bordered ? (
        <span
          style={overlay({
            borderWidth: 1,
            borderColor: "var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(34, 34, 34))",
          })}
        />
      ) : null}
      <Icon id={id} size={16} color={color} strokeWidth={2} />
    </div>
  );
}

const ACTIONS: Array<{ n: string; label: string; last?: boolean }> = [
  { n: "1", label: "How has their usage trended?" },
  { n: "2", label: "Who is the account owner for each?" },
  { n: "3", label: "Who is the account owner for each?" },
  { n: "4", label: "Ask a different question", last: true },
];

function FollowUpVisual() {
  return (
    <div className="ak-follow">
      <div className="ak-dialog">
        <div className="ak-qrow">
          <div className="ak-qpad" />
          <div className="ak-question">
            {ring()}
            <div className="ak-tb100">
              <p className="t-sm" style={{ color: MUTED }}>
                Which accounts are at risk this quarter?
              </p>
            </div>
          </div>
        </div>
        <div className="ak-answer">
          {ring()}
          <div className="ak-tb100">
            <p className="t-sm" style={{ color: MUTED }}>
              4 enterprise accounts with no session activity in the current calendar month.
            </p>
          </div>
        </div>
      </div>

      <div className="ak-ctx">
        {ring()}
        {ACTIONS.map((a) => (
          <div className="ak-action" key={a.n}>
            <span style={overlay({ borderBottomWidth: 1, borderColor: HAIRLINE })} />
            <div className="ak-num">
              {ring()}
              <div className="ak-num-l">
                <p className="t-mono-s" style={{ color: MUTED }}>
                  {a.n}
                </p>
              </div>
            </div>
            <div className="ak-action-t">
              <p className="t-sm" style={{ color: BRIGHT }}>
                {a.label}
              </p>
            </div>
            <div className="ak-iconbtn-slot">
              <IconButton id={a.last ? "1175957644" : "1475982494"} bordered={a.last} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The channel mark on the first export action, inlined from the reference. */
function ChannelMark() {
  return (
    <svg className="ak-rmark" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(4 4)">
        <path
          d="M 7.858 0 L 10.576 1.257 L 10.228 4.38 L 5.369 9.885 C 2.487 8.033 0.533 5.037 0 1.653 Z"
          fill="rgb(21, 227, 255)"
          transform="translate(0 12.212)"
        />
        <path
          d="M 5.682 1.305 L 9.317 7.568 C 7.3 8.986 4.894 9.745 2.428 9.741 C 1.612 9.741 0.799 9.659 0 9.495 L 0.8 2.332 L 2.858 0 Z"
          fill="rgb(52, 141, 252)"
          transform="translate(9.428 14.259)"
        />
        <path
          d="M 9.929 0 C 10.187 0.98 10.325 2.009 10.325 3.07 C 10.325 5.54 9.579 7.835 8.3 9.744 L 1.577 6.635 L 0 3.919 L 1.982 1.673 Z"
          fill="rgb(253, 72, 115)"
          transform="translate(13.533 8.929)"
        />
        <path
          d="M 0.969 0 C 4.449 0.061 7.73 1.633 9.958 4.307 L 4.403 10.602 L 1.476 11.218 L 0 8.674 Z"
          fill="rgb(255, 199, 0)"
          transform="translate(11.111 0)"
        />
        <path
          d="M 10.802 7.534 L 10.476 10.455 L 7.55 11.071 L 0 7.58 C 0.951 4.245 3.294 1.482 6.43 0 Z"
          fill="rgb(0, 231, 185)"
          transform="translate(0.309 1.141)"
        />
      </g>
    </svg>
  );
}

const EXPORTS: Array<{ title: string; sub: string; icon: ReactNode }> = [
  { title: "Send to Threadbase", sub: "Post to any channel", icon: <ChannelMark /> },
  {
    title: "Export CSV",
    sub: "Download as spreadsheet",
    icon: <Icon id="1683057900" size={18} color={ICON_GREY} strokeWidth={2} />,
  },
  {
    title: "Export JSON",
    sub: "Structured data output",
    icon: <Icon id="3596125116" size={18} color={ICON_GREY} strokeWidth={2} />,
  },
];

function ResultsVisual() {
  return (
    <div className="ak-results">
      <div className="ak-share">
        {ring("var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(64, 64, 64))")}
        <div className="ak-share-l">
          <p className="t-label" style={{ color: BRIGHT }}>
            Share results
          </p>
        </div>
      </div>
      <div className="ak-rlist">
        {ring()}
        {EXPORTS.map((e) => (
          <div className="ak-ract" key={e.title}>
            <span style={overlay({ borderBottomWidth: 1, borderColor: HAIRLINE })} />
            <div className="ak-ricon">{e.icon}</div>
            <div className="ak-rdesc">
              <div className="ak-tb100">
                <p className="t-sm" style={{ color: BRIGHT }}>
                  {e.title}
                </p>
              </div>
              <div className="ak-tb100">
                <p className="t-xs" style={{ color: MUTED_2 }}>
                  {e.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({
  name,
  visual,
  title,
  body,
  divider,
}: {
  name: string;
  visual: ReactNode;
  title: string;
  body: string;
  divider: boolean;
}) {
  return (
    <div className={`ak-cell ak-cell-${name}`}>
      {divider ? (
        <span className="ak-cell-edge" style={overlay({ borderColor: HAIRLINE })} />
      ) : null}
      <div className={`ak-visual ak-visual-${name}`}>
        <Backdrop />
        <div className="ak-visual-body">{visual}</div>
      </div>
      <div className={`ak-text ak-text-${name}`}>
        <div className="ak-tb100">
          <h3 className="t-h3" style={{ color: BRIGHT }}>
            {title}
          </h3>
        </div>
        <div className="ak-tb100">
          <p className="t-body" style={{ color: MUTED }}>
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AskBento() {
  return (
    <div className="ak-bento" id="ask-bento">
      <style>{CSS}</style>
      <div className="ak-bento-grid">
        <span
          className="ak-bento-edge"
          style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderColor: HAIRLINE })}
        />
        <Cell
          name="schema"
          divider
          visual={<SchemaVisual />}
          title="Understands your schema."
          body="Ask is trained on your specific data structure, so it translates questions into precise queries — not guesses."
        />
        <Cell
          name="follow"
          divider
          visual={<FollowUpVisual />}
          title="Knows what to ask next."
          body="Every answer comes with suggested follow-up questions, so the right insight is always one click away."
        />
        <Cell
          name="results"
          divider={false}
          visual={<ResultsVisual />}
          title="Results go where your team works."
          body="Export answers as CSV or JSON, or send them straight to your team. No copy-pasting, no extra steps."
        />
      </div>
    </div>
  );
}

const CSS = `
.ak-bento {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ak-bento-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(3, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.ak-cell {
  position: relative; display: flex; flex: none; place-self: start;
  flex-flow: column nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 40px; width: 100%; height: 100%; padding: 20px; overflow: clip;
}
.ak-cell-edge { border-right-width: 1px; }
.ak-visual {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: 422px; padding: 0; overflow: visible;
}
.ak-visual-schema { gap: 16px; }
.ak-visual-body { position: relative; }
.ak-bento-gl, .ak-bento-pattern { position: absolute; inset: 0; flex: none; overflow: hidden; }
.ak-bento-pattern { display: none; }
.ak-text {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 8px; width: 100%; height: min-content; padding: 16px; overflow: clip;
}
.ak-tb100 {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-tb100 > * { margin: 0; }

/* Schema visual */
.ak-schema {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 48px; width: min-content; height: min-content; padding: 0; overflow: clip;
  user-select: none; -webkit-user-select: none; pointer-events: none;
}
.ak-query {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ak-word { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-word > p, .ak-chip-word > p, .ak-tt-name > p, .ak-tt-count > p,
.ak-row-k > p, .ak-row-v > p, .ak-tag-l > p, .ak-num-l > p, .ak-share-l > p { margin: 0; }
.ak-chip-slot { position: relative; flex: none; width: auto; height: auto; }
.ak-chip {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: min-content; height: min-content; padding: 0 2px; overflow: visible;
  border-radius: 4px;
  background-color: var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23));
}
.ak-chip-dot {
  position: absolute; z-index: 1; flex: none; bottom: -3px; left: 50%;
  transform: translateX(-50%); width: 6px; height: 6px; overflow: clip; border-radius: 8px;
  background-color: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10));
}
.ak-chip-word { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-schema-card {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 300px; height: min-content; padding: 0; overflow: clip; border-radius: 16px;
  background-color: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10));
}
.ak-table-title {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 8px 12px; overflow: clip;
  background-color: var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(23, 23, 23));
}
.ak-tt-name { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-tt-count {
  position: relative; flex: 1 0 0; width: 1px; height: auto; overflow: clip;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.ak-rows {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
  background-color: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10));
}
.ak-row-slot { position: relative; flex: none; width: 100%; height: auto; }
.ak-row {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 6px 12px; overflow: clip;
}
.ak-row-bg { position: absolute; inset: 0; flex: none; overflow: clip; opacity: 0.05; }
.ak-row-k { position: relative; flex: none; width: auto; height: auto; white-space: pre; overflow: visible; }
.ak-row-v {
  position: relative; flex: 1 0 0; width: 1px; height: auto; overflow: clip;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.ak-tag {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 0 5px; overflow: clip;
  border-radius: 4px;
  background-color: var(--token-efb6b80c-ff66-4fd5-b06e-7af1e4433402, rgb(38, 38, 38));
}
.ak-tag-l { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-conn-a { position: absolute; top: 20px; left: 87px; width: 63px; height: 48px; flex-shrink: 0; }
.ak-conn-b { position: absolute; top: 20px; left: 150px; width: 75px; height: 48px; flex-shrink: 0; }

/* Follow up visual */
.ak-follow {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 42px; width: 316px; height: min-content; padding: 0; overflow: clip;
  user-select: none; -webkit-user-select: none; pointer-events: none;
}
.ak-dialog {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-qrow {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-qpad { position: relative; flex: 1 0 0; width: 1px; height: auto; align-self: stretch; overflow: clip; }
.ak-question {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 195px; height: min-content; padding: 12px; overflow: clip; border-radius: 16px;
  background-color: var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23));
}
.ak-answer {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 269px; height: min-content; padding: 12px; overflow: clip; border-radius: 16px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.ak-ctx {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip; border-radius: 12px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.ak-action {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 8px; overflow: clip;
  background-color: var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(23, 23, 23));
}
.ak-num {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 26px; height: auto; aspect-ratio: 1; padding: 0; overflow: clip; border-radius: 4px;
}
.ak-num-l { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-action-t {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-action-t > p { margin: 0; }
.ak-iconbtn-slot { position: relative; flex: none; width: auto; height: auto; }
.ak-iconbtn {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: min-content; height: min-content; padding: 6px; overflow: clip; border-radius: 8px;
}

/* Results visual */
.ak-results {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 292px; height: min-content; padding: 0; overflow: clip;
  user-select: none; -webkit-user-select: none; pointer-events: none;
}
.ak-share {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 8px; overflow: clip; border-radius: 8px;
  background-color: var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(23, 23, 23));
}
.ak-share-l { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-rlist {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip; border-radius: 12px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14));
}
.ak-ract {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 8px; overflow: clip;
}
.ak-ricon {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 36px; height: auto; aspect-ratio: 1; padding: 0; overflow: clip; border-radius: 8px;
  background-color: var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(38, 38, 38));
}
.ak-rmark { display: block; width: 20px; height: 20px; aspect-ratio: 1; flex: none; }
.ak-rdesc {
  position: relative; display: flex; flex: 1 0 0;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 0; overflow: clip;
}

@media (min-width: 810px) and (max-width: 1199.98px) {
  .ak-bento { padding: 0; }
  .ak-bento-edge { border-left-width: 0; border-right-width: 0; }
  .ak-bento-grid { display: flex; flex-flow: column nowrap; align-content: center; align-items: center; }
  .ak-cell {
    display: grid; align-content: unset; align-items: unset; align-self: unset;
    grid-template-rows: repeat(1, min-content);
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    grid-auto-rows: min-content; justify-content: center;
    gap: 40px; height: min-content; padding: 40px;
  }
  .ak-cell-results { display: grid; }
  .ak-cell-edge { border-right-width: 0; border-bottom-width: 1px; }
  .ak-visual { place-self: start; }
  .ak-text { place-self: center start; padding: 0; }
  .ak-visual-follow { order: 1; }
  .ak-text-follow { order: 0; }
}
@media (max-width: 809.98px) {
  .ak-bento { padding: 0; }
  .ak-bento-edge { border-left-width: 0; border-right-width: 0; }
  .ak-bento-grid { grid-template-columns: repeat(1, minmax(50px, 1fr)); }
  .ak-cell-edge { border-right-width: 0; border-bottom-width: 1px; }
  .ak-visual { height: 420px; }
  .ak-text { padding: 0; }
  .ak-follow { width: 321px; }
  .ak-schema, .ak-follow, .ak-results { transform: scale(0.9); }
  .ak-bento-gl { display: none; }
  .ak-bento-pattern { display: block; }
}
`;
