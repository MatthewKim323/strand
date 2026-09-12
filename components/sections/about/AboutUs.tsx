import Link from "next/link";
import { ChromaticEnd } from "./ChromaticEnd";
import { DotGrid } from "./DotGrid";
import { MilestoneTrack } from "./MilestoneTrack";
import { PartnerTicker } from "./PartnerTicker";

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const LINK = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(121, 113, 107))";

const TEAM = [
  {
    img: "img-eeffc55e3d.png",
    alt: "Headshot of Marcus Webb, transparent background.",
    name: "Marcus Webb",
    role: "Backend Engineer",
  },
  {
    img: "img-73cf820a26.png",
    alt: "Headshot of Claire Fontaine, transparent background.",
    name: "Claire Fontaine",
    role: "Customer Success",
  },
  {
    img: "img-aad323263e.png",
    alt: "Headshot of Daniel Reyes, transparent background.",
    name: "Daniel Reyes",
    role: "Product Designer",
  },
  {
    img: "img-e2eef03b26.png",
    alt: "Headshot of Jordan Osei, transparent background.",
    name: "Jordan Osei",
    role: "Machine Learning",
  },
  {
    img: "img-7ed500de7d.png",
    alt: "Headshot of Ravi Menon, transparent background.",
    name: "Ravi Menon",
    role: "Full Stack Engineer",
  },
  {
    img: "img-e0eff11450.png",
    alt: "Headshot of Kevin Liang, transparent background.",
    name: "Kevin Liang",
    role: "Developer Relations",
  },
  {
    img: "img-f6c002843c.png",
    alt: "Headshot of Zara Mitchell, transparent background.",
    name: "Zara Mitchell",
    role: "Sales",
  },
  {
    img: "img-6ca518e678.png",
    alt: "",
    name: "Could be you",
    role: "View careers",
    href: "/careers",
  },
] as const;

const CSS = `
.ab-root {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ab-container {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}
.ab-edge { position: relative; flex: 1 0 0; align-self: stretch; width: 1px; height: auto; }
.ab-content {
  position: relative; display: flex; flex: 1 0 0; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 1px; min-width: 920px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}

/* --- page title ------------------------------------------------------- */
.ab-titlerow {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 40px; overflow: clip;
  box-shadow: inset 0 -1px 0 0 ${LINE};
}
.ab-h1 {
  font-family: var(--font-body); font-weight: 600;
  font-size: 40px; line-height: 40px; letter-spacing: -0.01em; text-align: start;
}
.ab-fill, .ab-fill-title {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}

/* --- the three lettered blocks ---------------------------------------- */
.ab-block {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 0; width: 100%; height: min-content; padding: 40px 0; overflow: clip;
}
.ab-eyebrow {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 40%; height: min-content; padding: 16px 0 16px 40px;
  box-shadow: inset 0 -1px 0 0 ${LINE};
}

/* --- origins ---------------------------------------------------------- */
.ab-origins-text {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(12, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center; gap: 0;
  width: 100%; height: min-content; padding: 40px;
}
.ab-origins-copy {
  position: relative; flex: none; grid-column: span 8; place-self: start;
  width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}
.ab-origins-copy p + p { margin-top: 20px; }

/* --- stats ------------------------------------------------------------ */
.ab-stats {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 16px; width: 100%; height: min-content; padding: 40px;
}
.ab-stat {
  position: relative; display: flex; flex: 1 0 0; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: 1px; height: min-content; padding: 0; overflow: clip;
}
.ab-stat > * {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}
.ab-facts {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: flex-end; justify-content: center; align-items: flex-end;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ab-fact {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ab-fact > * { position: relative; flex: none; width: auto; height: auto; white-space: pre; }

/* --- partners --------------------------------------------------------- */
.ab-partners {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0 32px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}
.ab-partners-head {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ab-partners-title {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: min-content; height: min-content; padding: 40px 40px 0; overflow: clip;
  box-shadow: inset 0 1px 0 0 ${LINE};
}
.ab-partners-title-text { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ab-ticker-wrap {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 40px;
  width: 100%; height: min-content; padding: 40px 0 0; overflow: clip;
  box-shadow: inset 0 -1px 0 0 ${LINE};
}
.ab-ticker {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 46px; width: 100%; height: min-content; padding: 0;
  overflow-x: clip; border-radius: 10px;
}
.ab-ticker-track {
  position: relative; display: flex; flex-flow: row nowrap; gap: 46px;
  width: 100%; height: 100%; padding: 0; margin: 0; list-style: none;
  will-change: transform;
}

/* --- milestones ------------------------------------------------------- */
.ab-mile-row {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 40px 0 0;
}
.ab-mile-slot { position: relative; flex: 1 0 0; width: 1px; height: auto; }
.ab-mile {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: flex-end; justify-content: flex-start; align-items: flex-end;
  gap: 0; width: 100%; height: 152px; padding: 0 0 0 32px;
}
.ab-mile-track {
  position: absolute; top: 0; z-index: 1; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start;
  align-items: center; gap: 16px;
  width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ab-mile-item {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 24px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ab-mile-line {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 22px;
  width: min-content; height: 20px; padding: 0; overflow: clip;
}
.ab-tick { position: relative; flex: none; width: 1px; height: 100%; overflow: clip; }
.ab-mile-text {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-self: stretch; align-items: center; gap: 2px;
  width: auto; height: min-content; padding: 0; overflow: clip;
}
.ab-mile-text > * {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  -webkit-user-select: none; user-select: none;
}
.ab-mile-btns {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ab-mile-btn-slot { position: relative; flex: none; width: 55px; height: auto; }
.ab-mile-btn {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 4px;
  width: 100%; height: 26px; padding: 0; overflow: clip;
  cursor: pointer; text-decoration: none; border-radius: 52px;
}

/* --- team ------------------------------------------------------------- */
.ab-team-grid {
  position: relative; display: grid; flex: none;
  grid-template-columns: repeat(4, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center; gap: 40px 12px;
  width: 100%; height: min-content; padding: 40px;
}
.ab-team-cell { position: relative; flex: none; place-self: start; width: 100%; height: auto; }
.ab-team-cell-tail { height: 100%; }
.ab-card {
  position: relative; display: flex; flex-flow: column nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 10px; width: 100%; height: min-content; padding: 0;
}
.ab-card-img {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 16px 0 0; overflow: clip;
  box-shadow: inset 0 1px 0 0 ${LINE}, inset 0 -1px 0 0 ${LINE};
}
.ab-card-bg { position: absolute; inset: 0; flex: none; }
.ab-card-photo {
  position: relative; flex: none; width: 100%; height: auto;
  aspect-ratio: 1 / 1; border-radius: 8px;
}
.ab-card-photo > div { position: absolute; inset: 0; border-radius: inherit; }
.ab-card-photo img { width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
.ab-card-meta {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 2px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ab-card-meta > * { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ab-role { color: ${LINK}; transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1); }
a.ab-role:hover { color: ${BRIGHT}; }

/* --- tablet ----------------------------------------------------------- */
@media (min-width: 810px) and (max-width: 1199.98px) {
  .ab-root { padding: 0; }
  .ab-content { min-width: 800px; box-shadow: none; }
  .ab-origins-text { grid-template-columns: repeat(8, minmax(50px, 1fr)); }
  .ab-origins-copy { grid-column: span 6; }
  .ab-partners { box-shadow: none; }
}
@media (max-width: 1199.98px) {
  .ab-h1 { font-size: 32px; line-height: 34px; }
}

/* --- phone ------------------------------------------------------------ */
@media (max-width: 809.98px) {
  .ab-root { padding: 0; }
  .ab-container, .ab-partners, .ab-content { box-shadow: none; }
  .ab-content { min-width: 0; }
  .ab-edge { display: none; }
  .ab-titlerow {
    flex-direction: column; align-content: flex-start; align-items: flex-start;
    padding: 32px 20px;
  }
  .ab-fill-title, .ab-stat { flex: none; width: 100%; }
  .ab-eyebrow { width: 50%; padding: 16px 0 16px 20px; }
  .ab-origins-text { grid-template-columns: repeat(4, minmax(50px, 1fr)); padding: 20px; }
  .ab-origins-copy { grid-column: span 4; }
  .ab-stats { flex-direction: column; gap: 24px; padding: 20px; }
  .ab-facts { align-content: flex-start; align-items: flex-start; width: 100%; }
  .ab-fact { width: 100%; }
  .ab-partners-title { flex: 1 0 0; width: 1px; padding: 40px 20px 0; }
  .ab-partners-title-text {
    white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; width: 100%;
  }
  .ab-mile-row { padding: 20px 0 0; }
  .ab-team-grid { grid-template-columns: repeat(2, minmax(50px, 1fr)); padding: 20px; }
}
`;

export function AboutUs() {
  return (
    <section className="ab-root" data-section="About us">
      <style>{CSS}</style>

      <div className="ab-container">
        <div className="ab-edge">
          <DotGrid id="ab-dots-l" />
        </div>

        <div className="ab-content">
          {/* page title */}
          <div className="ab-titlerow">
            <div className="ab-fill-title">
              <h1 className="ab-h1" style={{ color: BRIGHT }}>
                About us
              </h1>
            </div>
          </div>

          {/* origins */}
          <div className="ab-block">
            <div className="ab-eyebrow">
              <div className="ab-fill">
                <p className="t-label" style={{ color: MUTED }}>
                  Origins
                </p>
              </div>
            </div>

            <div className="ab-origins-text">
              <div className="ab-origins-copy">
                <p className="t-lead" style={{ color: BRIGHT, textAlign: "start" }}>
                  We came from companies where the data existed but the answers did
                  not. Brilliant people spending half their week pulling exports,
                  merging spreadsheets, and rebuilding context that should have been
                  instant. The problem was never the data. It was the distance
                  between the data and the person who needed it.
                </p>
                <p className="t-lead" style={{ color: BRIGHT, textAlign: "start" }}>
                  We built Nordwell to close that distance. One graph. Every source.
                  Anyone on the team can ask a question and get an answer in seconds,
                  not days. Two years in, 2,400 teams have made that switch.
                </p>
              </div>
            </div>

            <div className="ab-stats">
              <div className="ab-stat">
                <div>
                  <h3 className="t-d3" style={{ color: BRIGHT }}>
                    $12M
                  </h3>
                </div>
                <div>
                  <p className="t-body" style={{ color: BRIGHT }}>
                    Funding raised
                  </p>
                </div>
              </div>

              <div className="ab-facts">
                <div className="ab-fact">
                  <div>
                    <p className="t-mono" style={{ color: MUTED }}>
                      Founded:
                    </p>
                  </div>
                  <div>
                    <p className="t-micro" style={{ color: BRIGHT }}>
                      2025
                    </p>
                  </div>
                </div>
                <div className="ab-fact">
                  <div>
                    <p className="t-mono" style={{ color: MUTED }}>
                      Location:
                    </p>
                  </div>
                  <div>
                    <p className="t-micro" style={{ color: BRIGHT }}>
                      San Francisco, CA
                    </p>
                  </div>
                </div>
                <div className="ab-fact">
                  <div>
                    <p className="t-mono" style={{ color: MUTED }}>
                      Team size:
                    </p>
                  </div>
                  <div>
                    <p className="t-micro" style={{ color: BRIGHT }}>
                      7 people
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* partners */}
          <div className="ab-partners">
            <div className="ab-partners-head">
              <div className="ab-partners-title">
                <div className="ab-partners-title-text">
                  <p className="t-label" style={{ color: MUTED }}>
                    Trusted by 56+ teams who are tired of tab-switching
                  </p>
                </div>
              </div>
            </div>
            <div className="ab-ticker-wrap">
              <PartnerTicker />
              <ChromaticEnd />
            </div>
          </div>

          {/* milestones */}
          <div className="ab-block">
            <div className="ab-eyebrow">
              <div className="ab-fill">
                <p className="t-label" style={{ color: MUTED }}>
                  Milestones
                </p>
              </div>
            </div>
            <div className="ab-mile-row">
              <MilestoneTrack />
            </div>
          </div>

          {/* the team */}
          <div className="ab-block">
            <div className="ab-eyebrow">
              <div className="ab-fill">
                <p className="t-label" style={{ color: MUTED }}>
                  The team
                </p>
              </div>
            </div>

            <div className="ab-team-grid">
              {TEAM.map((m, i) => (
                <div
                  key={m.name}
                  className={
                    i === TEAM.length - 1
                      ? "ab-team-cell ab-team-cell-tail"
                      : "ab-team-cell"
                  }
                >
                  <div className="ab-card">
                    <div className="ab-card-img">
                      <div className="ab-card-bg">
                        <DotGrid id={`ab-dots-m${i}`} />
                      </div>
                      <div className="ab-card-photo">
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/img/${m.img}`} alt={m.alt} />
                        </div>
                      </div>
                    </div>
                    <div className="ab-card-meta">
                      <div>
                        <p className="t-body" style={{ color: BRIGHT }}>
                          {m.name}
                        </p>
                      </div>
                      <div>
                        <p className="t-micro" style={{ color: MUTED }}>
                          {"href" in m && m.href ? (
                            <Link className="ab-role" href={m.href}>
                              {m.role}
                            </Link>
                          ) : (
                            <span className="ab-role">{m.role}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ab-edge">
          <DotGrid id="ab-dots-r" />
        </div>
      </div>
    </section>
  );
}
