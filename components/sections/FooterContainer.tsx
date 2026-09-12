"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";

const FilamentBurst = dynamic(
  () =>
    import("@/components/webgl/FilamentBurst")
      .then((m) => m.FilamentBurst)
      .catch(() => () => null),
  { ssr: false },
);

const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const GROUND = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, #110f0d)";

const CSS = `
.fc-root {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: visible;
  box-shadow: inset 0 1px 0 0 ${HAIRLINE};
}
.fc-cta {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.fc-cta-frame {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: 677px; padding: 0; overflow: clip;
}
.fc-burst {
  position: absolute; inset: 0; flex: none; z-index: 1; opacity: 0.85;
  -webkit-mask-image: linear-gradient(#0000 0%, #000 17.5676%, #000 86%, #0000 100%);
  mask-image: linear-gradient(#0000 0%, #000 17.5676%, #000 86%, #0000 100%);
}
.fc-burst-row {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: 100%; padding: 0; overflow: clip;
}
.fc-burst-slot { position: relative; flex: 1 0 0; width: 1px; height: 100%; }
.fc-cta-copy {
  position: relative; z-index: 2; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 20px; width: 600px; height: min-content; padding: 40px; overflow: clip;
  pointer-events: none;
  background: radial-gradient(50% 50% at 50% 50%, ${GROUND} 0%, #110f0d80 63.3621%, #110f0d00 100%);
}
.fc-cta-title {
  position: relative; flex: none; width: 100%; height: auto;
  -webkit-user-select: none; user-select: none; pointer-events: none;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.fc-cta-btn { position: relative; flex: none; width: auto; height: auto; pointer-events: auto; }

@media (max-width: 809.98px) {
  .fc-cta-copy { width: 100%; padding: 14px; }
}
`;

/**
 * The page's closing block: a tall CTA panel with the filament burst behind
 * the headline, then the site footer. The burst is revealed by a scroll
 * switch rather than on mount, and it re-runs every time the panel leaves and
 * re-enters view, which is what the reference does.
 */
export function FooterContainer() {
  const frame = useRef<HTMLDivElement>(null);
  const shown = useInView(frame, { amount: 0.5 });

  return (
    <section id="footer-container" data-section="FooterContainer" className="fc-root">
      <style>{CSS}</style>

      <div className="fc-cta">
        <div className="fc-cta-frame" ref={frame}>
          <div className="fc-burst">
            <div className="fc-burst-row">
              <div className="fc-burst-slot">
                <FilamentBurst
                  introProgress={shown ? 1.1 : 0}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="fc-cta-copy">
            <div className="fc-cta-title">
              <h2 className="t-d2" style={{ textAlign: "center", color: BRIGHT }}>
                Your data, finally connected
              </h2>
            </div>
            <div className="fc-cta-btn">
              <Button href="/pricing" variant="primary" size="xl">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
