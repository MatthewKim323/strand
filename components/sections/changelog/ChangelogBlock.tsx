import { Fragment } from "react";
import { StatusPing } from "@/components/sections/footer/StatusPing";

/* ------------------------------------------------------------------ tokens */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const BRIGHT_2 = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const PILL_BG = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";
const STICKY_BG = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9))";
const DOT = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";

const GREEN = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const BLUE = "var(--token-5e110c3f-82c1-4736-86cd-104cc5e3bfff, rgb(54, 197, 240))";
const AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";

/* -------------------------------------------------------------------- data
   Every release entry, in order, exactly as the reference lists them.
   `pad` is the number of blank lines the entry's body copy carries after the
   sentence; they are part of the measured height of the block.              */

type Item = { text: string; pad?: number };
type Group = { label: string; color: string; items: Item[] };
type Release = {
  version: string;
  date: string;
  iso: string;
  title: string;
  image?: { src: string; ratio: number; width: number; height: number };
  groups: Group[];
};

const NEW = { label: "NEW", color: GREEN };
const IMPROVED = { label: "IMPROVED", color: BLUE };
const FIXED = { label: "FIXED", color: AMBER };

const RELEASES: Release[] = [
  {
    version: "v2.4.0",
    date: "Jun 12, 2026",
    iso: "2026-06-12T00:00:00.000Z",
    title: "Faster cross source queries and quieter Pulse alerts",
    image: { src: "/img/img-4f97fa2133.png", ratio: 1.3079, width: 960, height: 734 },
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Ask now suggests two or three follow up questions after every result, so you can keep digging without typing a new query from scratch.",
            pad: 1,
          },
        ],
      },
      {
        ...IMPROVED,
        items: [
          {
            text: "Queries spanning five or more connected sources resolve noticeably faster, with no change to how you phrase them.",
          },
          {
            text: "Pulse adjusts its baseline for known seasonal patterns, like quarter end spikes, so expected swings stop triggering alerts.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "Jun 3, 2026",
    iso: "2026-06-03T00:00:00.000Z",
    title: "Cortex traces deeper relationships, Nucleus streams larger results",
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Cortex now resolves relationships across three or more linked entities in a single pass, not just direct connections.",
          },
          {
            text: "Nucleus TypeScript SDK v1.4.0 adds streaming support for large query results, instead of waiting on the full payload.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.2.1",
    date: "May 20, 2026",
    iso: "2026-05-20T00:00:00.000Z",
    title: "Local schema validation and a Snowflake sync fix",
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Nucleus CLI v2.1.0 validates your graph schema locally before pushing changes, instead of waiting on a round trip to the server.",
            pad: 1,
          },
        ],
      },
      {
        ...IMPROVED,
        items: [
          {
            text: "Resolved a delay where the Snowflake connector could lag behind other sources during high volume Pathways syncs.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "May 6, 2026",
    iso: "2026-05-06T00:00:00.000Z",
    title: "Recall now scores its own confidence",
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Recall attaches a confidence score to every correlation it surfaces, so you can tell a strong signal from a coincidence at a glance.",
            pad: 1,
          },
        ],
      },
      {
        ...IMPROVED,
        items: [
          {
            text: "Weekly insight reports load faster when spanning a full quarter of historical data.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "Apr 22, 2026",
    iso: "2026-04-22T00:00:00.000Z",
    title: "Configurable sync rules and a Jira fix",
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Pathways supports configurable conflict resolution rules, so you can set which source wins when two systems disagree on the same field.",
            pad: 1,
          },
        ],
      },
      {
        ...IMPROVED,
        items: [
          {
            text: "Resolved an issue where Jira custom fields with special characters failed to map into the knowledge graph.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.0.1",
    date: "Apr 9, 2026",
    iso: "2026-04-09T00:00:00.000Z",
    title: "Query latency and alert routing fixes",
    groups: [
      {
        ...FIXED,
        items: [
          {
            text: "Resolved a latency spike affecting Ask queries that combined date filters with nested relationships.",
          },
          {
            text: "Fixed an issue where some Pulse alerts routed to the wrong Slack channel after a workspace rename.",
          },
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "Mar 28, 2026",
    iso: "2026-03-28T00:00:00.000Z",
    title: "Automated insight reports and webhook support land",
    groups: [
      {
        ...NEW,
        items: [
          {
            text: "Recall now generates automated insight reports on a weekly cadence, or on demand, summarizing the trends and correlations it finds across your historical data.",
          },
          {
            text: "Nucleus adds webhook support, so you can trigger downstream workflows whenever the graph changes.",
            pad: 1,
          },
        ],
      },
      {
        ...IMPROVED,
        items: [
          {
            text: "The graph explorer in Cortex renders large graphs with noticeably less lag.",
          },
        ],
      },
    ],
  },
];

/* --------------------------------------------------------------------- css
   Every hairline is an overlay (`.cl-edge`) so it never changes a box: the
   four widths are read off custom properties set per element.               */
const CSS = `
.cl-edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: inherit;
  border-style: solid;
  border-color: ${LINE};
  border-width: var(--cl-bt, 0px) var(--cl-br, 0px) var(--cl-bb, 0px) var(--cl-bl, 0px);
}

.cl-root {
  height: min-content;
  overflow: clip;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 64px;
  display: flex;
  position: relative;
}
.cl-container {
  --cl-bt: 0px; --cl-br: 1px; --cl-bb: 0px; --cl-bl: 1px;
  max-width: 1400px;
  height: min-content;
  overflow: clip;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 0;
  display: flex;
  position: relative;
}
.cl-strip { flex: none; align-self: stretch; width: 96px; height: auto; position: relative; }
.cl-content {
  height: min-content;
  overflow: clip;
  flex-flow: column;
  flex: 1 0 0;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 1px;
  padding: 0;
  display: flex;
  position: relative;
}

/* --------------------------------------------------------------- title bar */
.cl-titlebar {
  --cl-bt: 0px; --cl-br: 1px; --cl-bb: 1px; --cl-bl: 1px;
  height: min-content;
  overflow: clip;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 40px;
  display: flex;
  position: relative;
}
.cl-title {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  flex: 1 0 0;
  width: 1px;
  height: auto;
  position: relative;
}
.cl-h1 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 40px;
  line-height: 40px;
  letter-spacing: -0.01em;
  text-align: start;
  font-feature-settings: normal;
}
.cl-uptime {
  --cl-bt: 1px; --cl-br: 1px; --cl-bb: 1px; --cl-bl: 1px;
  background-color: ${PILL_BG};
  height: min-content;
  overflow: clip;
  border-radius: 210px;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: min-content;
  padding: 12px 16px;
  display: flex;
  position: relative;
}
.cl-status {
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 12px;
  width: min-content;
  height: min-content;
  padding: 0;
  display: flex;
  position: relative;
  overflow: visible;
}
.cl-ping { z-index: 1; flex: none; width: auto; height: auto; position: relative; }
.cl-status-text {
  height: auto;
  overflow: clip;
  white-space: pre;
  flex: none;
  width: auto;
  display: block;
  position: relative;
}
.cl-pill-rule {
  --cl-bt: 1px; --cl-br: 1px; --cl-bb: 1px; --cl-bl: 1px;
  flex: none;
  align-self: stretch;
  width: 1px;
  height: auto;
  position: relative;
  overflow: visible;
}
.cl-uptime-val { white-space: pre; flex: none; width: auto; height: auto; position: relative; }

/* -------------------------------------------------------------------- logs */
.cl-logs {
  --cl-bt: 0px; --cl-br: 1px; --cl-bb: 0px; --cl-bl: 1px;
  flex-flow: column;
  flex: none;
  place-content: center flex-start;
  align-items: center;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 0;
  display: flex;
  position: relative;
}
.cl-log {
  flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(12, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 0;
  display: grid;
  position: relative;
}
.cl-left {
  --cl-bt: 0px; --cl-br: 1px; --cl-bb: 0px; --cl-bl: 0px;
  height: 100%;
  overflow: clip;
  flex-flow: column;
  flex: none;
  grid-column: span 4;
  place-content: flex-end flex-start;
  place-self: start;
  align-items: flex-end;
  gap: 16px;
  width: 100%;
  padding: 0;
  display: flex;
  position: relative;
}
.cl-sticky {
  height: min-content;
  overflow: clip;
  z-index: 1;
  flex-flow: column;
  flex: none;
  place-content: flex-start;
  align-items: flex-start;
  gap: 32px;
  width: 50%;
  padding: 0;
  display: flex;
  position: sticky;
  top: 68px;
}
.cl-meta {
  --cl-bt: 0px; --cl-br: 0px; --cl-bb: 1px; --cl-bl: 0px;
  height: min-content;
  overflow: clip;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 2px;
  width: 100%;
  padding: 16px;
  display: flex;
  position: relative;
}
.cl-ver, .cl-date, .cl-heading {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  flex: none;
  width: 100%;
  height: auto;
  position: relative;
}
.cl-ver-t {
  font-family: var(--font-code);
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0;
  text-align: start;
}
.cl-right {
  height: min-content;
  overflow: clip;
  flex-flow: column;
  flex: none;
  grid-column: span 8;
  place-content: center;
  place-self: start;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 32px 32px 72px;
  display: flex;
  position: relative;
}
.cl-body {
  height: min-content;
  overflow: clip;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 0;
  display: flex;
  position: relative;
}

/* --------------------------------------------------------------- rich text */
.cl-rt {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  flex: none;
  width: 100%;
  height: auto;
  position: relative;
}
.cl-rt > :not(:first-child) { margin-top: 16px; }
.cl-media {
  height: min-content;
  overflow: clip;
  padding: 80px;
  flex-flow: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  display: flex;
  position: relative;
}
.cl-media-dots { flex: none; position: absolute; inset: 0; }
.cl-media-img { flex: none; width: 100%; height: auto; position: relative; }
.cl-media-img > span { position: absolute; border-radius: inherit; inset: 0; }
.cl-media-img img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-position: center;
  object-fit: cover;
}
.cl-badge {
  height: min-content;
  overflow: clip;
  flex-flow: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0;
  display: flex;
  position: relative;
}
.cl-badge > p {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  flex: none;
  width: 100%;
  height: auto;
  position: relative;
}
.cl-list { padding-inline-start: 0; margin: 0; position: relative; list-style: none; }
.cl-list > li { padding-inline-start: 2ch; list-style: none; }
.cl-list > li::before { content: "\\2022"; position: absolute; inset-inline-start: 0; }

/* -------------------------------------------------------------- <= 1199.98 */
@media (max-width: 1199.98px) {
  .cl-root { padding: 0; }
  .cl-container, .cl-logs { --cl-bl: 0px; --cl-br: 0px; }
  .cl-strip { display: none; }
  .cl-titlebar { --cl-bl: 0px; --cl-br: 0px; }
  .cl-h1 { font-size: 32px; line-height: 34px; }
  .cl-log { grid-template-columns: repeat(8, minmax(50px, 1fr)); }
  .cl-left { grid-column: span 3; }
  .cl-right { grid-column: span 5; }
}

/* --------------------------------------------------------------- <= 809.98 */
@media (max-width: 809.98px) {
  .cl-titlebar {
    flex-direction: column;
    align-content: flex-start;
    align-items: flex-start;
    padding: 32px 20px;
  }
  .cl-title { flex: none; width: 100%; }
  .cl-status { justify-content: flex-start; }
  .cl-logs { gap: 12px; }
  .cl-log {
    grid-template-rows: repeat(1, min-content);
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-auto-rows: min-content;
  }
  .cl-left {
    --cl-bb: 1px;
    --cl-br: 0px;
    z-index: 1;
    grid-column: span 1;
    height: min-content;
    position: sticky;
    top: 68px;
  }
  .cl-sticky {
    background-color: ${STICKY_BG};
    top: unset;
    width: 100%;
    position: relative;
  }
  .cl-meta { flex-direction: row; gap: 8px; padding: 12px 16px; }
  .cl-ver { white-space: pre; width: auto; }
  .cl-date { flex: 1 0 0; width: 1px; }
  .cl-right { grid-column: span 1; padding: 20px; }
}
`;

/* ------------------------------------------------------------------- parts */
function Edge() {
  return <span className="cl-edge" aria-hidden="true" />;
}

function Dots({ id }: { id: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ height: "100%", width: "100%" }}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect x="4" y="4" width="1.5" height="1.5" fill={DOT} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Bullet({ item }: { item: Item }) {
  return (
    <li className="t-sm" style={{ color: MUTED }}>
      <p className="t-sm" style={{ color: MUTED }}>
        {item.text}
        {/* a run of hard breaks: the browser drops the last one, so ask for
            one more than the number of blank lines the copy wants */}
        {item.pad
          ? Array.from({ length: item.pad + 1 }, (_, i) => <br key={i} />)
          : null}
      </p>
    </li>
  );
}

function Log({ release }: { release: Release }) {
  const slug = release.version.replace(/\./g, "-");
  return (
    <div className="cl-log">
      <div className="cl-left">
        <Edge />
        <div className="cl-sticky">
          <div className="cl-meta">
            <Edge />
            <div className="cl-ver">
              <p className="cl-ver-t" style={{ color: BRIGHT }}>
                {release.version}
              </p>
            </div>
            <div className="cl-date">
              <p className="t-xs" style={{ color: MUTED }}>
                <time dateTime={release.iso}>{release.date}</time>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cl-right">
        <div className="cl-body">
          <div className="cl-heading">
            <h2 className="t-h2" style={{ color: BRIGHT_2 }}>
              {release.title}
            </h2>
          </div>

          <div className="cl-rt">
            {release.image ? (
              <div className="cl-media">
                <div className="cl-media-dots">
                  <Dots id={`cl-dots-${slug}`} />
                </div>
                <div
                  className="cl-media-img"
                  style={{ aspectRatio: `${release.image.ratio} / 1` }}
                >
                  <span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={release.image.src}
                      width={release.image.width}
                      height={release.image.height}
                      alt=""
                      decoding="async"
                    />
                  </span>
                </div>
              </div>
            ) : null}

            {release.groups.map((group) => (
              <Fragment key={group.label}>
                <div className="cl-badge">
                  <p className="t-mono" style={{ color: group.color }}>
                    {group.label}
                  </p>
                </div>
                <ul className="cl-list">
                  {group.items.map((item) => (
                    <Bullet key={item.text} item={item} />
                  ))}
                </ul>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- block */
export function ChangelogBlock() {
  return (
    <div className="cl-root">
      <style>{CSS}</style>
      <div className="cl-container">
        <Edge />
        <div className="cl-strip">
          <Dots id="cl-dots-left" />
        </div>

        <div className="cl-content">
          <div className="cl-titlebar">
            <Edge />
            <div className="cl-title">
              <h1 className="cl-h1" style={{ color: BRIGHT }}>
                Changelog
              </h1>
            </div>
            <div className="cl-uptime">
              <Edge />
              <div className="cl-status">
                <div className="cl-ping">
                  <StatusPing />
                </div>
                <div className="cl-status-text">
                  <p className="t-micro" style={{ color: BRIGHT }}>
                    All systems operational
                  </p>
                </div>
              </div>
              <div className="cl-pill-rule">
                <Edge />
              </div>
              <div className="cl-uptime-val">
                <p className="t-mono" style={{ color: MUTED }}>
                  99.98% UPTIME
                </p>
              </div>
            </div>
          </div>

          <div className="cl-logs">
            <Edge />
            {RELEASES.map((release) => (
              <Log key={release.version} release={release} />
            ))}
            {/* the list keeps a zero height tail item, which the phone gap uses */}
            <div />
          </div>
        </div>

        <div className="cl-strip">
          <Dots id="cl-dots-right" />
        </div>
      </div>
    </div>
  );
}
