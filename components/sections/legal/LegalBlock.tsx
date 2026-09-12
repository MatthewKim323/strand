import Link from "next/link";

import type { LegalDoc } from "./content";

/* ------------------------------------------------------------------ tokens */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const DOT = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";

/** The 96px dotted rail either side of the content column (widest width only). */
function PatternRail({ id }: { id: string }) {
  return (
    <div className="lg-rail" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
            <rect x="4" y="4" width="1.5" height="1.5" fill={DOT} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/**
 * The long-form legal document block: a sticky left rail carrying the heading,
 * revision date and a numbered index, beside a right column of numbered
 * sections. Both policy routes render this with different copy.
 */
export function LegalBlock({ doc }: { doc: LegalDoc }) {
  const key = doc.route.replace(/[^a-z]/g, "");

  return (
    <div className="lg-block" data-section={doc.heading}>
      <style>{CSS}</style>

      <div className="lg-container">
        <PatternRail id={`lg-dots-l-${key}`} />

        <div className="lg-content">
          {/* --------------------------------------------------- left rail */}
          <div className="lg-left">
            <div className="lg-sticky">
              <div className="lg-titleblock">
                <div className="lg-h1wrap">
                  <h1 className="lg-h1">{doc.heading}</h1>
                </div>

                <div className="lg-updated">
                  <div className="lg-updated-label">
                    <p className="t-mono" style={{ color: DIM }}>
                      Last updated:
                    </p>
                  </div>
                  <div className="lg-updated-col">
                    <div className="lg-updated-row">
                      <div className="lg-date">
                        <p className="t-mono" style={{ color: DIM }}>
                          <time dateTime={doc.updatedISO}>{doc.updated}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="lg-index" aria-label={`${doc.heading} contents`}>
                {doc.sections.map((s) => (
                  <div className="lg-index-row" key={s.id}>
                    <div className="lg-index-num">
                      <p className="t-mono" style={{ color: MUTED }}>
                        {s.num}
                      </p>
                    </div>
                    <div className="lg-index-title">
                      <p className="t-mono" style={{ color: MUTED }}>
                        <Link className="lg-link" href={`${doc.route}#${s.id}`}>
                          {s.title}
                        </Link>
                      </p>
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* ------------------------------------------------ right column */}
          <div className="lg-right">
            <div className="lg-sections">
              {doc.sections.map((s) => (
                <div className="lg-section" id={s.id} key={s.id}>
                  <div className="lg-section-head">
                    <div className="lg-section-num">
                      <h3 className="t-h3" style={{ color: BRIGHT }}>
                        {s.num}
                      </h3>
                    </div>
                    <div className="lg-section-name">
                      <h3 className="t-h3" style={{ color: BRIGHT }}>
                        {s.title}
                      </h3>
                    </div>
                  </div>
                  <div className="lg-section-body">
                    <p className="t-sm" style={{ color: MUTED }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PatternRail id={`lg-dots-r-${key}`} />
      </div>
    </div>
  );
}

const CSS = `
.lg-block {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px; width: 100%; padding: 0 64px; position: relative;
}
.lg-block p, .lg-block h1, .lg-block h3 { margin: 0; }

.lg-container {
  max-width: 1400px; height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 0; width: 100%; padding: 0; position: relative;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}

.lg-rail { flex: none; align-self: stretch; width: 96px; height: auto; position: relative; }
.lg-rail svg { display: block; width: 100%; height: 100%; }

.lg-content {
  height: min-content; overflow: clip; display: grid; flex: 1 0 0;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(12, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center; gap: 0; width: 1px; padding: 0; position: relative;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}

/* ------------------------------------------------------------- left rail */
.lg-left {
  height: 100%; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  grid-column: span 4; place-content: center flex-start; place-self: start; align-items: center;
  gap: 16px; width: 100%; padding: 32px; position: relative;
  box-shadow: inset -1px 0 0 0 ${LINE};
}
.lg-sticky {
  height: 1px; overflow: clip; z-index: 1; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center flex-start; align-items: center; gap: 32px; width: 100%; padding: 0; position: relative;
}
.lg-titleblock {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start; align-items: flex-start; gap: 8px; width: 100%; padding: 0; position: relative;
}
.lg-h1wrap {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: none; width: 100%; height: auto; position: relative;
}
.lg-h1 {
  font-family: var(--font-body); font-weight: 600; font-size: 24px; line-height: 28px;
  letter-spacing: 0.005em; text-align: start; color: ${BRIGHT};
}
.lg-updated {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 4px; width: 100%; padding: 0; position: relative;
}
.lg-updated-label { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.lg-updated-col {
  display: flex; flex-flow: column nowrap; flex: 1 0 0; place-content: flex-start center;
  align-items: flex-start; gap: 12px; width: 1px; height: min-content; padding: 0; position: relative;
}
.lg-updated-row {
  display: flex; flex-flow: row nowrap; flex: none; place-content: flex-start; align-items: flex-start;
  gap: 10px; width: 100%; height: min-content; padding: 0; position: relative;
}
.lg-date {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
}

.lg-index {
  z-index: 1; display: flex; flex-flow: column nowrap; flex: none; place-content: flex-start center;
  align-items: flex-start; gap: 12px; width: 100%; height: min-content; padding: 0;
  position: sticky; top: 108px;
}
.lg-index-row {
  display: flex; flex-flow: row nowrap; flex: none; place-content: flex-start; align-items: flex-start;
  gap: 10px; width: 100%; height: min-content; padding: 0; position: relative;
}
.lg-index-num { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.lg-index-title {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
}
.lg-link {
  color: inherit; text-decoration: none;
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.lg-link:hover { color: ${BRIGHT}; text-decoration: underline; }

/* ---------------------------------------------------------- right column */
.lg-right {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  grid-column: span 8; place-content: center; place-self: start; align-items: center;
  gap: 0; width: 100%; padding: 0; position: relative;
}
.lg-sections {
  display: flex; flex-flow: column nowrap; flex: none; place-content: flex-start center;
  align-items: flex-start; gap: 32px; width: 100%; height: min-content; padding: 32px; position: relative;
}
.lg-section {
  display: flex; flex-flow: column nowrap; flex: none; place-content: flex-start; align-items: flex-start;
  gap: 12px; width: 100%; height: min-content; padding: 0; scroll-margin-top: 108px; position: relative;
}
.lg-section-head {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 4px; width: 100%; padding: 0; position: relative;
}
.lg-section-num { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.lg-section-name {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
}
.lg-section-body {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: none; width: 100%; height: auto; position: relative;
}

/* ------------------------------------------------------------- <= 1199px */
@media (max-width: 1199.98px) {
  .lg-block { padding: 0; }
  .lg-container { box-shadow: none; }
  .lg-rail { display: none; }
  .lg-content { box-shadow: none; grid-template-columns: repeat(8, minmax(50px, 1fr)); }
  .lg-left { grid-column: span 3; }
  .lg-sticky { align-content: flex-start; align-items: flex-start; }
  .lg-right { grid-column: span 5; }
}

/* -------------------------------------------------------------- <= 809px */
@media (max-width: 809.98px) {
  .lg-content {
    grid-template-rows: repeat(1, min-content);
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-auto-rows: min-content;
  }
  .lg-left {
    z-index: 1; order: 0; grid-column: span 1; height: min-content; padding: 32px 20px;
    box-shadow: inset 0 -1px 0 0 ${LINE};
  }
  .lg-sticky { flex: none; height: min-content; }
  .lg-index { display: none; }
  .lg-right { order: 1; grid-column: span 1; }
  .lg-sections { padding: 20px; }
}
`;
