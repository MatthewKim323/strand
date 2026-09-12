"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { Icon } from "@/components/ui/Sprite";
import { AkEndRule } from "./AkEndRule";
import { CHAT_CSS, ChatPanel } from "./ChatPanel";

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
      <style>{CSS + CHAT_CSS}</style>
      <div className="ak-usps-shell">
        <span
          className="ak-usps-edge"
          style={overlay({ borderLeftWidth: 1, borderRightWidth: 1, borderColor: HAIRLINE })}
        />

        <div>
          <AkEndRule />
        </div>

        <div className="ak-chat-slot">
          <ChatPanel phone={phone} />
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

@media (max-width: 1199.98px) {
  .ak-usps { padding: 0; }
  .ak-usps-edge { border-left-width: 0; border-right-width: 0; }
  .ak-usps-body { gap: 60px; padding: 40px 40px 60px; }
  .ak-usp-grid { grid-template-columns: repeat(2, minmax(50px, 1fr)); gap: 40px 120px; }
}
@media (max-width: 809.98px) {
  .ak-usps-body { gap: 60px; padding: 20px 20px 40px; }
  .ak-usp-grid { grid-template-columns: repeat(1, minmax(50px, 1fr)); gap: 48px 20px; }
}
`;
