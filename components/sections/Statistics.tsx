import { StatLottie } from "./statistics/StatLottie";
import { ChromaticBorder } from "./statistics/ChromaticBorder";

const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, #222222)";

const STATS = [
  { name: "Stat1 Animation", src: "/data/data-7f9fb6fad9.json", value: "16x", caption: "Faster time-to-answer" },
  { name: "Stat2 Animation", src: "/data/data-9d28062afd.json", value: "47%", caption: "Fewer tools needed" },
  { name: "Stat3 Animation", src: "/data/data-a2b925075b.json", value: "80%", caption: "Less time building reports" },
  { name: "Stat4 Animation", src: "/data/data-45f72f035b.json", value: "4.2hrs", caption: "Saved per team per week" },
];

const CSS = `
.sx-section {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.sx-container {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${HAIRLINE}, inset -1px 0 0 0 ${HAIRLINE};
}
.sx-head {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 80px 40px 40px; overflow: clip;
}
.sx-head-text {
  position: relative; flex: 0.5 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.sx-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, min-content);
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  grid-auto-rows: min-content; justify-content: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.sx-stat {
  position: relative; display: flex; flex: none; place-self: start;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 40px; width: 100%; height: min-content; padding: 60px 40px; overflow: clip;
}
.sx-anim { position: relative; flex: none; width: 64px; height: 64px; }
.sx-info {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.sx-text {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.sx-text > * { margin: 0; }
.sx-end { width: 100%; }
.sx-end-inner { position: relative; flex: none; width: 100%; height: auto; }

.sx-cb {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.sx-cb-half { position: relative; flex: 1 0 0; width: 1px; height: 1px; overflow: clip; }
.sx-cb-bar {
  position: absolute; z-index: 1; flex: none;
  top: 0; bottom: 0; width: 100%; overflow: visible;
}

@media (max-width: 1199.98px) {
  .sx-section { padding: 0; }
  .sx-container { box-shadow: none; }
  .sx-head { padding: 40px; }
  .sx-head-text { flex: 0.66 0 0; }
  .sx-grid { grid-template-columns: repeat(2, minmax(315px, 1fr)); }
  .sx-stat { padding: 20px 40px; }
}
@media (max-width: 809.98px) {
  .sx-section { padding: 0; }
  .sx-container { box-shadow: none; }
  .sx-head { padding: 40px 20px; }
  .sx-head-text { flex: 1 0 0; }
  .sx-grid {
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, minmax(100px, 1fr));
    padding: 0 0 20px;
  }
  .sx-stat { padding: 20px; }
}
`;

export function Statistics() {
  return (
    <section id="statistics" data-section="Statistics" className="sx-section">
      <style>{CSS}</style>
      <div className="sx-container">
        <div className="sx-head">
          <div className="sx-head-text">
            <h2 className="t-h2" style={{ textAlign: "start" }}>
              <span style={{ color: MUTED }}>Your team already has the data.</span>{" "}
              <span style={{ color: BRIGHT }}>Nordwell gives you the answers.</span>
            </h2>
          </div>
        </div>

        <div className="sx-grid">
          {STATS.map((s) => (
            <div className="sx-stat" key={s.value}>
              <div className="sx-anim">
                <StatLottie src={s.src} name={s.name} />
              </div>
              <div className="sx-info">
                <div className="sx-text">
                  <h3 className="t-d3" style={{ color: BRIGHT }}>
                    {s.value}
                  </h3>
                </div>
                <div className="sx-text">
                  <p className="t-body" style={{ color: MUTED }}>
                    {s.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sx-end">
          <div className="sx-end-inner">
            <ChromaticBorder />
          </div>
        </div>
      </div>
    </section>
  );
}
