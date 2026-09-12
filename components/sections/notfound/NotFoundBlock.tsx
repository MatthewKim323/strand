"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { NOT_FOUND_POINTS, NOT_FOUND_POINTS_PHONE } from "./not-found-points";

/**
 * The graphic is owned by another module. Load it lazily and fall back to
 * nothing so the block's boxes (and therefore its height) are identical
 * whether or not the graphic is present.
 */
const FilamentField = dynamic(
  () =>
    import("@/components/webgl/FilamentField")
      .then((m) => m.FilamentField)
      .catch(() => () => null),
  { ssr: false },
);

/* ------------------------------------------------------------------ tokens */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const PAGE_BG = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";

const PHONE = "(max-width: 809.98px)";

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(PHONE);
    const update = () => setPhone(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return phone;
}

/**
 * The not-found block. One full viewport-height stage: the particle graphic
 * sits underneath at its own fixed box, and the message plate is absolutely
 * centred over it with a radial fade that punches the graphic out behind the
 * type. Height is `100vh`, never a hard-coded number, which is why it measures
 * 900 at the three wider capture viewports and 844 on the phone one.
 *
 * The source route ships no on-mount appear animation for any of this content,
 * so nothing here fades or rises in: the only two appear ids on the captured
 * page belong to floating badges this rebuild does not carry.
 */
export function NotFoundBlock() {
  const phone = useIsPhone();

  return (
    <section className="nf-root" data-block="Not Found">
      <style>{CSS}</style>

      <div className="nf-stage">
        <div className="nf-canvas">
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 1,
              }}
            >
              <FilamentField
                points={phone ? NOT_FOUND_POINTS_PHONE : NOT_FOUND_POINTS}
                scale={phone ? 1 : 1.6}
                threshold={0.65}
                extrudeScale={1}
                extrudeOffset={{ x: 0, y: 0.05, z: 0.15 }}
                randomOffset={{ x: 0.4, y: 0.2, z: 0.2 }}
                steps={16}
                tubeRadius={0.0013}
                tipLayers={8}
                tipRadius={0.0035}
                noiseStrength={0.06}
                noiseScale={9.6}
                cameraFov={36}
                cameraPosition={{ x: 0, y: 0, z: 1.8 }}
                cameraRotationX={0}
                cameraRotationY={0}
                sizeVariance={0.49}
                dispersionOffset={0.05}
                dispersionBand={0.9}
                dispersion={0.8}
                simRadius={0.1}
                simStrength={6}
                simSpring={21.1}
                simDamping={4}
                simMaxVelocity={2.7}
                opacitySpeed={2}
                maxDelay={1}
                highlightRadius={0.3}
                highlightStrength={2}
                highlightSpeed={10}
                filamentOpacity={0.25}
                pulseStrength={1}
                pulseSpeedBase={0.1}
                pulseSpeedRandomMax={0.1}
                fallbackFit="cover"
                fallbackAlt=""
                /* This route declares no phone-only opacity or tip size: it
                   swaps the point set and the scale instead, above. */
                phoneOverrides={{}}
              />
            </div>
          </div>
        </div>

        <div className="nf-plate">
          <div className="nf-lines">
            <div className="nf-line">
              <h3 className="t-h3" style={{ color: BRIGHT }}>
                This page got lost in the graph.
              </h3>
            </div>
            <div className="nf-line">
              <p className="t-sm" style={{ color: MUTED }}>
                Let&#39;s get you back to somewhere that exists.
              </p>
            </div>
          </div>

          <div className="nf-cta">
            <Button href="/" variant="light" size="md" height={32}>
              Back to homepage
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.nf-root {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; padding: 0; overflow: clip;
  background-color: ${PAGE_BG};
}
.nf-stage {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: 100vh; padding: 0; overflow: clip;
}
.nf-canvas { position: relative; z-index: 0; flex: none; width: 838px; height: 518px; }
.nf-plate {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  z-index: 1; pointer-events: none;
  display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 20px; width: min-content; height: min-content; padding: 20px 40px; overflow: clip;
  background: radial-gradient(50% 50% at 50% 50%, ${PAGE_BG} 72.4138%, #0c0a0900 100%);
}
.nf-lines {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.nf-line { position: relative; z-index: 1; flex: none; width: auto; height: auto; white-space: pre; }
.nf-cta { position: relative; pointer-events: auto; flex: none; width: auto; height: auto; }

@media (max-width: 809.98px) {
  .nf-canvas { width: 100%; height: 812px; }
  .nf-plate { width: unset; left: 0; right: 0; transform: translateY(-50%); }
}
`;
