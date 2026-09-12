"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";

import { Icon } from "@/components/ui/Sprite";
import { AkEndRule } from "./AkEndRule";

/**
 * The field behind the chat panel is the ported noise-displaced point grid,
 * with this block's own props. Lazy, with a null fallback, so the block's
 * boxes do not depend on it.
 */
const WaveGridField = dynamic(
  () =>
    import("@/components/webgl/WaveGridField")
      .then((m) => m.WaveGridField)
      .catch(() => () => null),
  { ssr: false },
);

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";

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
 * The quick action pills. Four at desktop and tablet, three at phone: the
 * source drops the fourth through its own count property at that breakpoint.
 */
const PILLS: Array<{ id: string; label: string }> = [
  { id: "89488612", label: "Analyze" },
  { id: "3092554709", label: "Compare" },
  { id: "3261614140", label: "Monitor" },
  { id: "2932616460", label: "Report" },
];

/** The two status chips. Both sit at rest opacity 0: the loop drives them. */
function StatusChip({ label }: { label: string }) {
  return (
    <div className="ak-chat-chip-slot">
      <div className="ak-chat-chip">
        {ring()}
        <div className="ak-chat-chip-l">
          <p className="t-micro" style={{ color: MUTED }}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The chat panel at its rest state, which is what the captured tree records:
 * the question typed out, the status chips and the results sheet at opacity 0,
 * the quick action bar showing.
 *
 * TODO(spec): the source cycles this through four further variants (thinking,
 * results, export bar) on a timed loop. This route's motion folder carries only
 * five appear ids, none of them the cycle, so the loop's durations, delays and
 * ordering are not pinned anywhere and nothing here drives it. The panel is a
 * fixed 500px box, so the block's height does not depend on it.
 */
function ChatStart({ phone }: { phone: boolean }) {
  const pills = phone ? PILLS.slice(0, 3) : PILLS;
  return (
    <div className="ak-chat">
      <div className="ak-chat-stack">
        <div className="ak-chat-card">
          <div className="ak-chat-inner">
            <div className="ak-chat-top">
              <div className="ak-chat-msg-wrap">
                <div className="ak-chat-msg">
                  <p className="t-body" style={{ color: BRIGHT }}>
                    Which accounts are at risk this quarter?
                  </p>
                </div>
              </div>
              <div className="ak-chat-status">
                <StatusChip label="Thinking" />
                <StatusChip label="3 Results" />
              </div>
            </div>

            <div className="ak-chat-buttons">
              <div className="ak-chat-btn">
                <Icon
                  id="3356954461"
                  size={20}
                  color="var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(115, 115, 115))"
                  strokeWidth={2}
                />
              </div>
              <div className="ak-chat-btn ak-chat-btn-send">
                <Icon
                  id="2903821725"
                  size={20}
                  color="var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 250))"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
          <div className="ak-chat-bg" />
        </div>

        <div className="ak-chat-actions">
          {pills.map((p) => (
            <div className="ak-chat-pill-slot" key={p.label}>
              <div className="ak-chat-pill">
                {ring()}
                <Icon id={p.id} size={14} color={MUTED} strokeWidth={2} />
                <div className="ak-chat-pill-l">
                  <p className="t-micro" style={{ color: MUTED }}>
                    {p.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ak-chat-results">{ring()}</div>
      </div>

      <div className="ak-chat-field">
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <WaveGridField
            ampWeight={0.5}
            blurStrength={5}
            cameraPositionX={-1}
            cameraPositionY={0.4}
            cameraPositionZ={1.3}
            cameraRotationX={-0.1}
            cameraRotationY={-0.5}
            cameraRotationZ={0.1}
            dispersionMap="/img/img-80a453f3fb.png"
            fallbackImage="/img/img-2edcd02d5d.png"
            fallbackFit="cover"
            fallbackAlt=""
            focalDistance={1.6}
            focalRange={0.54}
            intensity={10}
            layers={3}
            lightX={1}
            lightY={0.2}
            lightZ={0}
            noiseFrequency={2}
            noiseLayerSpread={0.005}
            noiseOffsetX={1.97}
            noiseOffsetY={0}
            noiseOffsetZ={0}
            octaves={2}
            pointSize={phone ? 4 : 3.5}
            timeScale={0.05}
            waveHeightScale={0.1}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

const USPS: Array<{ id: string; title: string; body: string }> = [
  {
    id: "264992356",
    title: "Plain language input",
    body: "No SQL, no syntax. Ask questions the way you'd phrase them to a colleague.",
  },
  {
    id: "213763526",
    title: "Relationship-aware",
    body: "Ask understands how your data connects - not just what's in a single table.",
  },
  {
    id: "884851057",
    title: "Time range context",
    body: 'Reference periods naturally. "Last quarter", "since onboarding", "before the outage" all work.',
  },
  {
    id: "53866765",
    title: "Suggested follow-ups",
    body: "Every answer surfaces the next logical question so you keep moving forward.",
  },
  {
    id: "1401005312",
    title: "One-click sharing",
    body: "Send results to your team chat or export as CSV and JSON without leaving the interface.",
  },
  {
    id: "3408069395",
    title: "Under 200ms",
    body: "Queries run against a live graph, not a slow warehouse. Answers arrive before the thought fades.",
  },
];

export function AskUsps() {
  const phone = usePhone();

  return (
    <div className="ak-usps" id="ask-usps">
      <style>{CSS}</style>
      <div className="ak-usps-shell">
        <span
          className="ak-usps-edge"
          style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderColor: HAIRLINE })}
        />

        <div>
          <AkEndRule />
        </div>

        <div className="ak-chat-slot">
          <ChatStart phone={phone} />
        </div>

        <div className="ak-usps-body">
          <div className="ak-usps-head">
            <h2 className="t-h2" style={{ textAlign: "start" }}>
              <span style={{ color: MUTED }}>Questions your whole team can ask.</span>
              <br />
              <span style={{ color: BRIGHT }}>Answers only Nordwell can give.</span>
            </h2>
          </div>

          <div className="ak-usp-grid">
            {USPS.map((u) => (
              <div className="ak-usp-slot" key={u.title}>
                <div className="ak-usp">
                  <div className="ak-usp-title">
                    <Icon id={u.id} size={20} color={BRIGHT} strokeWidth={2} />
                    <div className="ak-usp-h">
                      <h3 className="t-h4" style={{ color: BRIGHT }}>
                        {u.title}
                      </h3>
                    </div>
                  </div>
                  <div className="ak-usp-d">
                    <p className="t-sm" style={{ color: MUTED }}>
                      {u.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ak-usps {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ak-usps-shell {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.ak-chat-slot { position: relative; z-index: 1; flex: none; width: 100%; height: 500px; }
.ak-usps-body {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 80px; width: 100%; height: min-content; padding: 40px 40px 80px; overflow: clip;
}
.ak-usps-head {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-usps-head > h2 { margin: 0; }
.ak-usp-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(2, min-content);
  grid-template-columns: repeat(3, minmax(50px, 1fr));
  grid-auto-rows: min-content; justify-content: center;
  gap: 60px 80px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-usp-slot { position: relative; flex: none; place-self: start; width: 100%; height: auto; }
.ak-usp {
  position: relative; display: flex;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-usp-title {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: flex-start;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-usp-h {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-usp-d {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-usp-h > h3, .ak-usp-d > p { margin: 0; }

/* Chat panel */
.ak-chat {
  position: relative; display: flex;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: 100%; padding: 16px 16px 80px; overflow: visible;
}
.ak-chat-stack {
  position: relative; z-index: 2; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; max-width: 460px; height: min-content; padding: 0; overflow: visible;
  user-select: none; -webkit-user-select: none;
}
.ak-chat-card {
  position: relative; z-index: 2; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip; border-radius: 16px;
  background: linear-gradient(111deg,
    var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)) 0%,
    var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36)) 35.13513513513514%,
    var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)) 73%,
    var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)) 100%);
}
.ak-chat-bg {
  position: absolute; z-index: 1; flex: none; inset: 1px; overflow: visible; border-radius: 15px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(17, 15, 13));
}
.ak-chat-inner {
  position: relative; z-index: 2; display: flex; flex: 1 0 0;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 1px; height: min-content; padding: 0; overflow: clip;
}
.ak-chat-top {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 0 8px 0 20px; overflow: visible;
}
.ak-chat-msg-wrap {
  position: relative; display: flex; flex: 1 0 0;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: auto; align-self: stretch; padding: 20px 0; overflow: visible;
}
.ak-chat-msg {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ak-chat-msg > p { margin: 0; }
.ak-chat-status {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 91px; height: 64px; padding: 0; overflow: clip;
  pointer-events: none; user-select: none; -webkit-user-select: none;
}
.ak-chat-chip-slot {
  position: absolute; z-index: 1; flex: none; width: auto; height: auto;
  bottom: -32px; left: 49%; transform: translateX(-50%); opacity: 0;
}
.ak-chat-chip {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 4px 8px; overflow: clip;
  border-radius: 8px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.ak-chat-chip-l { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-chat-chip-l > p, .ak-chat-pill-l > p { margin: 0; }
.ak-chat-buttons {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 0 12px 12px; overflow: visible;
}
.ak-chat-btn {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 8px; overflow: visible;
}
.ak-chat-btn-send {
  border-radius: 12px;
  background-color: var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23));
}
.ak-chat-actions {
  position: relative; z-index: 1; display: flex; flex: none;
  flex-flow: row wrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: 100%; height: min-content; padding: 0 16px; overflow: visible; border-radius: 16px;
}
.ak-chat-pill-slot { position: relative; flex: none; width: auto; height: auto; }
.ak-chat-pill {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 8px; overflow: clip; border-radius: 8px;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.ak-chat-pill-l { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ak-chat-results {
  position: absolute; z-index: 3; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; bottom: -68px; left: 0; right: 0; height: min-content; padding: 20px; overflow: clip;
  border-radius: 16px; opacity: 0; pointer-events: none;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.ak-chat-field {
  position: absolute; z-index: 1; flex: none; inset: 0; opacity: 0.3;
  -webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%);
  mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%);
}

@media (max-width: 1199.98px) {
  .ak-usps { padding: 0; }
  .ak-usps-edge { border-left-width: 0; border-right-width: 0; }
  .ak-usps-body { gap: 60px; padding: 40px 40px 60px; }
  .ak-usp-grid { grid-template-columns: repeat(2, minmax(50px, 1fr)); gap: 40px 120px; }
  .ak-chat { padding: 16px 16px 200px; }
}
@media (max-width: 809.98px) {
  .ak-usps-body { gap: 60px; padding: 20px 20px 40px; }
  .ak-usp-grid { grid-template-columns: repeat(1, minmax(50px, 1fr)); gap: 48px 20px; }
  .ak-chat { padding: 16px 16px 300px; }
}
`;
