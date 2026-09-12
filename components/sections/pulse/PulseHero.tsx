"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { C_LINE_2, C_MUTED, C_MUTED_2, C_TEXT, C_WELL, CrumbDots, overlay } from "./parts";
import { PULSE_FILAMENT_POINTS } from "./filament-points";

/**
 * The hero graphic. Loaded lazily and falling back to nothing so the section's
 * boxes (and therefore its height) are identical whether or not it is present.
 */
const FilamentField = dynamic(
  () =>
    import("@/components/webgl/FilamentField")
      .then((m) => m.FilamentField)
      .catch(() => () => null),
  { ssr: false },
);

/* The graphic's own scale, and the one value the reference overrides on the
   tablet breakpoint. Every other prop on this instance is the component's
   default, so only `points`, `scale` and the two textures are passed. */
const SCALE_BASE = 0.95;
const SCALE_TABLET = 0.87;
const TIP_TEXTURE = "/img/img-80a453f3fb.png";
const FALLBACK_IMAGE = "/img/img-a40016bcd7.png";

function useGraphicScale() {
  const [scale, setScale] = useState(SCALE_BASE);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 810px) and (max-width: 1199.98px)");
    const sync = () => setScale(query.matches ? SCALE_TABLET : SCALE_BASE);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return scale;
}

const CSS = `
.pu-hero {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.pu-hero-container {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 0;
  max-width: 1400px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-crumbs {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 12px;
  width: 50%; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-crumbs-scroll {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  place-content: center flex-start; align-items: center; gap: 16px;
  width: 1px; height: min-content; padding: 20px 40px; overflow: auto;
  scrollbar-width: none;
}
.pu-hero-crumbs-scroll::-webkit-scrollbar { width: 0; height: 0; }
.pu-hero-crumb-row {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-crumb { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.pu-hero-content {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center;
  gap: 0; width: 100%; height: 640px; padding: 0; overflow: clip;
}
.pu-hero-title {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start center; place-self: start; align-items: flex-start;
  gap: 0; width: 100%; height: 100%; padding: 40px 40px 80px; overflow: clip;
}
.pu-hero-stack {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 40px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-badge {
  position: relative; display: flex; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: min-content; height: min-content; padding: 4px 16px;
  border-radius: 321px; overflow: clip;
}
.pu-hero-copy {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 20px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-text {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.pu-hero-ctas {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center flex-start; align-items: center; gap: 12px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-hero-graphic {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; place-self: start; align-items: center; gap: 16px;
  width: 100%; height: 100%; padding: 0; overflow: clip;
}
.pu-hero-canvas { position: relative; flex: none; width: 536px; height: 554px; }

@media (max-width: 1199.98px) {
  .pu-hero { padding: 0; }
  .pu-hero-line-x { display: none; }
  .pu-hero-content { height: min-content; }
  .pu-hero-title { padding: 80px 40px; }
  .pu-hero-stack { gap: 32px; }
  .pu-hero-canvas { width: 414px; height: 464px; }
}
@media (max-width: 809.98px) {
  .pu-hero-crumbs { width: 100%; }
  .pu-hero-crumbs-scroll { padding: 20px; }
  .pu-hero-content {
    display: flex; flex-flow: column nowrap;
    align-content: center; align-items: center; height: min-content;
  }
  .pu-hero-title { align-self: unset; order: 1; height: min-content; padding: 40px 20px 60px; }
  .pu-hero-stack { align-content: center; align-items: center; gap: 32px; }
  .pu-hero-copy { gap: 12px; }
  .pu-hero-copy h1, .pu-hero-copy p { text-align: center; }
  .pu-hero-ctas { justify-content: center; }
  .pu-hero-graphic { align-self: unset; order: 0; height: 419px; }
  .pu-hero-canvas { width: 389px; height: 409px; }
}
`;

export function PulseHero() {
  const scale = useGraphicScale();

  return (
    <div className="pu-hero" id="pulse-hero">
      <style>{CSS}</style>

      <div className="pu-hero-container">
        <span
          className="pu-hero-line-x"
          style={overlay({
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(34, 34, 34))",
          })}
        />
        <span
          style={overlay({
            borderBottomWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(34, 34, 34))",
          })}
        />

        {/* Breadcrumbs */}
        <div className="pu-hero-crumbs">
          <span
            style={overlay({
              borderBottomWidth: 1,
              borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))",
            })}
          />
          <div className="pu-hero-crumbs-scroll">
            <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
              <div className="pu-hero-crumb-row">
                <div className="pu-hero-crumb">
                  <p className="t-sm" style={{ color: C_MUTED }}>
                    <Link className="t-link" href="/#features-pulse" style={{ color: C_TEXT }}>
                      Features
                    </Link>
                  </p>
                </div>
                <div style={{ flex: "none", width: 16, height: 16, position: "relative" }}>
                  <CrumbDots />
                </div>
                <div className="pu-hero-crumb">
                  <p className="t-sm" style={{ color: C_MUTED_2 }}>
                    Pulse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pu-hero-content">
          <div className="pu-hero-title">
            <div className="pu-hero-stack">
              <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                <div className="pu-hero-badge" style={{ backgroundColor: C_WELL }}>
                  <span style={overlay({ borderWidth: 1, borderColor: C_LINE_2 })} />
                  <div style={{ whiteSpace: "pre", flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <p className="t-micro" style={{ color: C_TEXT }}>
                      Pulse
                    </p>
                  </div>
                </div>
              </div>

              <div className="pu-hero-copy">
                <div className="pu-hero-text">
                  <h1 className="t-d1" style={{ color: C_TEXT }}>
                    Less noise.
                    <br />
                    The alerts that matter.
                  </h1>
                </div>
                <div className="pu-hero-text">
                  <p className="t-body" style={{ color: C_MUTED }}>
                    Pulse learns what normal looks like for your business and only fires when
                    something genuinely deviates. No more alert fatigue.
                  </p>
                </div>
              </div>

              <div className="pu-hero-ctas">
                <div style={{ flex: "none", width: "auto", height: 40, position: "relative" }}>
                  <Button variant="primary" size="xl" href="/contact-us" height="100%">
                    Get started
                  </Button>
                </div>
                <div style={{ flex: "none", width: "auto", height: 40, position: "relative" }}>
                  <Button variant="secondary" size="xl" href="/pricing" height="100%">
                    View prices
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="pu-hero-graphic">
            <div className="pu-hero-canvas">
              <FilamentField
                points={PULSE_FILAMENT_POINTS}
                scale={scale}
                tipTexture={TIP_TEXTURE}
                fallbackImage={FALLBACK_IMAGE}
                fallbackFit="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
