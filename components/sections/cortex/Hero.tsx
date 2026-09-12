"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Border, Pill, T } from "./ui";
import { CORTEX_HERO_POINTS } from "./hero-points";

const FilamentField = dynamic(
  () =>
    import("@/components/webgl/FilamentField")
      .then((m) => m.FilamentField)
      .catch(() => () => null),
  { ssr: false },
);

/**
 * The breadcrumb separator: six 2px dots in a 16px box, three visible on the
 * right and three hidden on the left, behind a horizontal fade. It has a second
 * variant in the source where the dots march one box across, but nothing on
 * this page ever triggers it, so they sit still.
 */
const DOTS: Array<{ top: number; left: number; opacity: 0 | 1 }> = [
  { top: 4, left: -10, opacity: 0 },
  { top: 10, left: -10, opacity: 0 },
  { top: 7, left: -7, opacity: 0 },
  { top: 4, left: 6, opacity: 1 },
  { top: 10, left: 6, opacity: 1 },
  { top: 7, left: 9, opacity: 1 },
];

const FADE = "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)";

const CSS = `
.cx-hero {
  --cx-bt: 0px; --cx-br: 0px; --cx-bb: 1px; --cx-bl: 0px;
  --cx-bc: ${T.line};
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.cx-hero-frame {
  --cx-bt: 0px; --cx-br: 1px; --cx-bb: 0px; --cx-bl: 1px;
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.cx-hero-upper {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.cx-hero-left {
  position: relative; display: flex; flex: 1 0 0; width: 1px;
  flex-flow: row nowrap; place-content: flex-start; align-self: stretch;
  align-items: flex-start; gap: 0; height: auto; padding: 0; overflow: clip;
}
.cx-crumbs {
  --cx-bt: 0px; --cx-br: 0px; --cx-bb: 1px; --cx-bl: 0px;
  position: relative; display: flex; flex: 1 0 0; width: 1px;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start;
  align-items: center; gap: 12px; height: min-content; padding: 0; overflow: clip;
}
.cx-crumb-stack {
  position: relative; display: flex; flex: 1 0 0; width: 1px;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start;
  align-items: center; gap: 16px; height: min-content; padding: 20px 40px; overflow: clip;
}
.cx-crumb-row {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.cx-crumb-link { color: ${T.dim}; text-decoration: none; transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1); }
.cx-crumb-link:hover { text-decoration: underline; }
.cx-graphic {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 480px; height: 480px; padding: 0; overflow: clip;
}
.cx-title-container {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: flex-start; justify-content: center; align-items: flex-start; gap: 40px;
  width: 100%; height: min-content; padding: 20px 40px 40px; overflow: clip;
}
.cx-title-stack {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0; overflow: visible;
}
.cx-title-stack h1 {
  margin: 0; width: 100%; height: auto; position: relative; flex: none;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
  color: ${T.bright};
}
@media (max-width: 1199.98px) {
  .cx-hero { padding: 0; }
  .cx-hero-frame { --cx-bt: unset; --cx-br: unset; --cx-bb: unset; --cx-bl: unset; }
  .cx-hero-upper { align-content: flex-start; align-items: flex-start; }
  .cx-graphic { width: 400px; height: 400px; }
}
@media (max-width: 809.98px) {
  .cx-hero-left { flex-direction: column; }
  .cx-crumbs { flex: none; width: 100%; }
  .cx-crumb-stack { padding: 20px; }
  .cx-graphic { width: 100%; height: 400px; }
  .cx-title-container { align-content: center; align-items: center; gap: 20px; }
  .cx-title-stack h1 { text-align: center; }
}
`;

export function CortexHero() {
  return (
    <>
      <style>{CSS}</style>
      <div className="cx-hero" data-cx-block="hero">
        <Border />
        <div className="cx-hero-frame">
          <Border />
          <div className="cx-hero-upper">
            <div className="cx-hero-left">
              <div className="cx-crumbs">
                <Border />
                <div className="cx-crumb-stack">
                  <div className="cx-crumb-row">
                    <div style={{ whiteSpace: "pre", flex: "none", width: "auto", position: "relative" }}>
                      <p className="t-sm" style={{ margin: 0, color: T.dim }}>
                        <Link href="/#features-cortex" className="cx-crumb-link t-sm">
                          Features
                        </Link>
                      </p>
                    </div>
                    <div style={{ flex: "none", width: 16, height: 16, position: "relative" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          overflow: "visible",
                          WebkitMaskImage: FADE,
                          maskImage: FADE,
                        }}
                      >
                        {DOTS.map((d, i) => (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              top: d.top,
                              left: d.left,
                              width: 2,
                              height: 2,
                              overflow: "hidden",
                              backgroundColor: T.dot,
                              opacity: d.opacity,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div style={{ whiteSpace: "pre", flex: "none", width: "auto", position: "relative" }}>
                      <p className="t-sm" style={{ margin: 0, color: T.dim }}>
                        Cortex
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cx-graphic">
                <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                  <FilamentField
                    points={CORTEX_HERO_POINTS}
                    threshold={0.4}
                    scale={0.95}
                    extrudeScale={0.95}
                    extrudeOffset={{ x: 0, y: 0.1, z: 0.4 }}
                    randomOffset={{ x: 0.4, y: 0.2, z: 0.2 }}
                    steps={32}
                    tubeRadius={0.0012}
                    tipLayers={8}
                    tipRadius={0.0035}
                    springSettings={{ bounce: 0.2, duration: 3000 }}
                    noiseStrength={0.15}
                    noiseScale={5}
                    cameraFov={36}
                    cameraPosition={{ x: 0, y: 0, z: 1.8 }}
                    cameraRotationX={2}
                    cameraRotationY={0}
                    sizeVariance={0.49}
                    dispersionOffset={0.05}
                    dispersionBand={0.9}
                    dispersion={0.8}
                    simRadius={0.15}
                    simStrength={8}
                    simSpring={60}
                    simDamping={6}
                    simMaxVelocity={5}
                    opacitySpeed={2}
                    maxDelay={1}
                    highlightRadius={0.3}
                    highlightStrength={2}
                    highlightSpeed={10}
                    filamentOpacity={0.2}
                    pulseStrength={1}
                    pulseSpeedBase={0.1}
                    pulseSpeedRandomMax={0.1}
                    tipTexture="/img/img-80a453f3fb.png"
                    fallbackImage="/img/img-b9d52b3055.png"
                    fallbackFit="cover"
                    fallbackAlt=""
                    phoneOverrides={{ filamentOpacity: 0.26, tipRadius: 0.004 }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="cx-title-container">
            <Pill padding="4px 16px" className="t-micro">
              Cortex
            </Pill>
            <div className="cx-title-stack">
              <div style={{ width: "100%" }}>
                <h1 className="t-d1">Connect every data source.</h1>
              </div>
              <div style={{ width: "100%" }}>
                <h1 className="t-d1">Zero manual mapping.</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
