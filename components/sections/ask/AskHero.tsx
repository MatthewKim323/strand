"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/Button";
import { AkEndRule } from "./AkEndRule";
import { ASK_HERO_POINTS } from "./ask-hero-points";

/**
 * The hero graphic is a filament knot, the same ported field the home page
 * uses, driven by this route's own point set and props. Loaded lazily with a
 * null fallback so the block's boxes (and therefore its height) are identical
 * whether or not the graphic is present.
 */
const FilamentField = dynamic(
  () =>
    import("@/components/webgl/FilamentField")
      .then((m) => m.FilamentField)
      .catch(() => () => null),
  { ssr: false },
);

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const MUTED_2 = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const DOT = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";

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

/** Matches the phone breakpoint the reference overrides the graphic at. */
function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 809.98px)");
    const update = () => setPhone(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return phone;
}

/**
 * The breadcrumb separator's six dots, at the component's resting variant. The
 * other variant (the dots marching one box to the right) is authored in the
 * source but never triggered here, so three dots sit visible on the right and
 * three sit hidden on the left, and none of them move.
 */
const DOTS: Array<{ top: number; left: number; opacity: 0 | 1 }> = [
  { top: 4, left: -10, opacity: 0 },
  { top: 10, left: -10, opacity: 0 },
  { top: 7, left: -7, opacity: 0 },
  { top: 4, left: 6, opacity: 1 },
  { top: 10, left: 6, opacity: 1 },
  { top: 7, left: 9, opacity: 1 },
];

function DotArrow() {
  return (
    <div className="ak-dots">
      {DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: 2,
            height: 2,
            borderRadius: 36,
            opacity: d.opacity,
            overflow: "hidden",
            flex: "none",
            backgroundColor: DOT,
          }}
        />
      ))}
    </div>
  );
}

export function AskHero() {
  const phone = usePhone();

  return (
    <div className="ak-hero" id="ask-hero">
      <style>{CSS}</style>

      <div className="ak-hero-shell">
        <span
          className="ak-hero-edge"
          style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderColor: HAIRLINE })}
        />

        {/* Breadcrumbs */}
        <div className="ak-crumbs">
          <span style={overlay({ borderBottomWidth: 1, borderColor: HAIRLINE })} />
          <div className="ak-crumbs-stack">
            <div className="ak-crumb-row">
              <div className="ak-crumb">
                <p className="t-sm" style={{ color: MUTED }}>
                  <a className="t-link-u" href="/#features-ask" style={{ color: MUTED_2 }}>
                    Features
                  </a>
                </p>
              </div>
              <div className="ak-dots-slot">
                <DotArrow />
              </div>
              <div className="ak-crumb">
                <p className="t-sm" style={{ color: MUTED_2 }}>
                  Ask
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Graphic */}
        <div className="ak-graphic">
          <div className="ak-graphic-slot">
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              <FilamentField
                points={ASK_HERO_POINTS}
                threshold={0.4}
                scale={phone ? 0.89 : 0.95}
                extrudeScale={0.95}
                extrudeOffset={{ x: 0, y: 0.1, z: 0.4 }}
                randomOffset={{ x: 0.4, y: 0.2, z: 0.2 }}
                steps={32}
                tubeRadius={0.0012}
                tipLayers={8}
                tipRadius={0.0035}
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
                springSettings={{ bounce: 0.2, duration: 3000 }}
                tipTexture="/img/img-80a453f3fb.png"
                fallbackImage="/img/img-f848d78e59.png"
                fallbackFit="contain"
                fallbackAlt=""
                phoneOverrides={{ filamentOpacity: 0.26, tipRadius: 0.004 }}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Title Container */}
        <div className="ak-title">
          <div>
            <div className="ak-pill">
              <span
                style={overlay({
                  borderWidth: 1,
                  borderColor: "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))",
                })}
              />
              <div className="ak-pill-label">
                <p className="t-micro" style={{ color: BRIGHT }}>
                  Ask
                </p>
              </div>
            </div>
          </div>

          <div className="ak-title-stack">
            <div className="ak-tb">
              <h1 className="t-d1" style={{ textAlign: "center", color: BRIGHT }}>
                Ask anything.
                <br />
                Get answers quickly.
              </h1>
            </div>
            <div className="ak-tb">
              <p className="t-body" style={{ textAlign: "center", color: MUTED }}>
                Ask queries your entire data stack in plain language and returns precise answers in
                seconds.
              </p>
            </div>
          </div>

          <div className="ak-cta">
            <div>
              <Button variant="primary" size="xl" href="/contact-us">
                Get started
              </Button>
            </div>
            <div>
              <Button variant="secondary" size="xl" href="/pricing">
                View prices
              </Button>
            </div>
          </div>
        </div>

        <div>
          <AkEndRule />
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ak-hero {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ak-hero-shell {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.ak-crumbs {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 12px; width: 50%; height: min-content; padding: 0; overflow: clip;
}
.ak-crumbs-stack {
  position: relative; display: flex; flex: 1 0 0;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 16px; width: 1px; height: min-content; padding: 20px 40px; overflow: auto;
  scrollbar-width: none;
}
.ak-crumbs-stack::-webkit-scrollbar { display: none; }
.ak-crumb-row {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ak-crumb { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-crumb > p { margin: 0; }
.ak-crumb a { text-decoration: none; }
.ak-crumb a:hover { text-decoration: underline; }
.ak-dots-slot { position: relative; flex: none; width: 16px; height: 16px; }
.ak-dots {
  position: relative; width: 16px; height: 16px; overflow: visible;
  -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%);
}
.ak-graphic {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: 457px; padding: 0; overflow: clip;
}
.ak-graphic-slot { position: relative; flex: 1 0 0; width: 460px; height: 1px; }
.ak-title {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 40px; width: 100%; height: min-content; padding: 0 80px 60px; overflow: clip;
}
.ak-pill {
  position: relative; display: flex;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 4px 16px; overflow: clip;
  border-radius: 321px;
  background-color: var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23));
}
.ak-pill-label { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-pill-label > p { margin: 0; }
.ak-title-stack {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.ak-tb {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-tb > * { margin: 0; }
.ak-cta {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: min-content; height: min-content; padding: 0; overflow: clip;
}

@media (max-width: 1199.98px) {
  .ak-hero { padding: 0; }
  .ak-hero-edge { border-left-width: 0 !important; border-right-width: 0 !important; }
  .ak-graphic { height: 464px; }
  .ak-title { gap: 40px; padding: 0 80px 60px; }
}
@media (max-width: 809.98px) {
  .ak-crumbs { width: 100%; }
  .ak-crumbs-stack { padding: 20px; }
  .ak-graphic { height: 433px; }
  .ak-graphic-slot { width: 393px; }
  .ak-title { gap: 20px; padding: 0 20px 60px; }
}
`;
