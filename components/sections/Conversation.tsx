"use client";

import { motion, type Transition } from "motion/react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Sprite";

/* ------------------------------------------------------------------------- *
 * Conversation
 *
 * Two-tone headline over a 517px tall stage holding the mock product card.
 * The card is a looping demo: it walks Primary -> Chat start -> Thinking ->
 * Results -> Loop Reset and back, exactly like the reference component, so the
 * stage height never changes no matter which phase you catch it in.
 * ------------------------------------------------------------------------- */

type Phase = "primary" | "chatStart" | "thinking" | "results" | "loopReset";

/** Phase order and dwell time, straight out of the reference component. */
const SEQUENCE: { phase: Phase; ms: number }[] = [
  { phase: "primary", ms: 2000 },
  { phase: "chatStart", ms: 2000 },
  { phase: "thinking", ms: 4000 },
  { phase: "results", ms: 3500 },
  { phase: "loopReset", ms: 500 },
];

const EASE: [number, number, number, number] = [0.12, 0.23, 0.5, 1];
const EASE_IO: [number, number, number, number] = [0.44, 0, 0.56, 1];

const SPRING: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };
const SPRING_D2: Transition = { type: "spring", bounce: 0.2, duration: 0.4, delay: 0.2 };
const T_CHAT: Transition = { type: "tween", duration: 0.3, ease: EASE, delay: 0 };
const T_TEXT: Transition = { type: "tween", duration: 0.2, ease: EASE, delay: 0.3 };
const T_CHIP_A: Transition = { type: "tween", duration: 0.4, ease: EASE, delay: 0.3 };
const T_CHIP_B: Transition = { type: "tween", duration: 0.4, ease: EASE, delay: 0.2 };
const T_CHIP_C: Transition = { type: "tween", duration: 0.4, ease: EASE, delay: 0 };

const HIDDEN = 0.001;

/* Palette tokens, copied verbatim so they resolve with no translation. */
const C_PANEL = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const C_LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const C_LOGO_BG = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const C_MUTED = "var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(115, 115, 115))";
const C_PLACEHOLDER = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const C_DIM = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const C_SEND = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 250))";
const C_RED = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";
const C_RED_20 = "var(--token-3a95eaa6-e51b-4092-9cd6-e78e24a17dd1, rgba(229, 72, 77, 0.2))";
const C_AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";
const C_AMBER_20 = "var(--token-aace3d5f-06f1-4eda-b5c4-3a57d2e8e178, rgba(249, 171, 0, 0.2))";

const CHAT_GRADIENT =
  "linear-gradient(111deg, var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)) 0%," +
  " var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36)) 35.13513513513514%," +
  " var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)) 73%," +
  " var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)) 100%)";

const RING = `inset 0 0 0 1px ${C_LINE}`;

const MESSAGE = "Which accounts are at risk this quarter?";
const STATUS_LINES = ["Scanning Salesforce", "Scoring by churn signal weight", "3 accounts flagged"];

const ROWS = [
  { company: "Meridian Corp", risk: "High risk", reason: "No login in 30d", tint: C_RED, fill: C_RED_20 },
  { company: "Apex Systems", risk: "Medium", reason: "Usage -40%", tint: C_AMBER, fill: C_AMBER_20 },
  { company: "Acme Corp", risk: "High Risk", reason: "Ticket spike", tint: C_RED, fill: C_RED_20 },
];

/* The quick action chips, in order. The fourth is dropped below 810. */
const QUICK_ACTIONS = [
  { id: "89488612", label: "Analyze ", delay: 0.1 },
  { id: "3092554709", label: "Compare", delay: 0.2 },
  { id: "3261614140", label: "Monitor", delay: 0.3 },
  { id: "2932616460", label: "Report", delay: 0.4 },
];

/* --------------------------------------------------------------------- */

function usePhase(): Phase {
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState<Phase | null>(null);

  // `?phase=results` pins one phase, which is how the loop gets measured.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("phase");
    if (p && SEQUENCE.some((s) => s.phase === p)) setPinned(p as Phase);
  }, []);

  useEffect(() => {
    if (pinned) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % SEQUENCE.length), SEQUENCE[step].ms);
    return () => window.clearTimeout(t);
  }, [step, pinned]);

  return pinned ?? SEQUENCE[step].phase;
}

/** The account-row mark. A radial burst, drawn from the reference vector set. */
function RowMark() {
  return (
    <svg className="cv-mark" viewBox="0 0 33.121 33" aria-hidden="true" focusable="false">
      <path
        fill={C_MUTED}
        transform="translate(0.256 0.743)"
        d="M 20.27 0.848 L 17.093 0 L 14.416 9.956 L 11.998 0.968 L 8.821 1.816 L 11.433 11.527 L 4.928 5.047 L 2.602 7.363 L 9.737 14.473 L 0.851 12.1 L 0 15.266 L 9.709 17.857 C 9.596 17.369 9.539 16.871 9.539 16.37 C 9.539 12.75 12.484 9.815 16.118 9.815 C 19.751 9.815 22.696 12.75 22.696 16.37 C 22.696 16.878 22.638 17.373 22.528 17.848 L 31.352 20.203 L 32.203 17.038 L 22.456 14.436 L 31.342 12.063 L 30.491 8.898 L 20.744 11.501 L 27.249 5.019 L 24.923 2.702 L 17.886 9.712 Z"
      />
      <path
        fill={C_MUTED}
        transform="translate(1.117 18.62)"
        d="M 21.658 0.009 C 21.389 1.138 20.824 2.175 20.021 3.013 L 26.414 9.382 L 28.74 7.065 Z M 19.957 3.08 C 19.146 3.905 18.132 4.503 17.017 4.811 L 19.343 13.461 L 22.52 12.612 L 19.957 3.079 Z M 16.898 4.843 C 16.361 4.98 15.81 5.049 15.256 5.049 C 14.663 5.049 14.073 4.97 13.501 4.813 L 11.173 13.47 L 14.35 14.318 Z M 13.389 4.781 C 12.29 4.457 11.294 3.851 10.501 3.024 L 4.093 9.408 L 6.419 11.726 Z M 10.448 2.967 C 9.666 2.135 9.115 1.112 8.852 0 L 0 2.364 L 0.851 5.529 Z"
      />
    </svg>
  );
}

/** The microphone glyph, which only shows while the card is idle. */
function MicIcon() {
  const p = {
    fill: "transparent",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    stroke: C_SEND,
  };
  return (
    <svg viewBox="0 0 24 24" className="cv-btn-icon" aria-hidden="true" focusable="false">
      <path {...p} d="M 0 0 L 0 3" transform="translate(12 19)" />
      <path {...p} d="M 14 0 L 14 2 C 14 5.866 10.866 9 7 9 C 3.134 9 0 5.866 0 2 L 0 0" transform="translate(5 10)" />
      <path
        {...p}
        d="M 3 13 C 1.343 13 0 11.657 0 10 L 0 3 C 0 1.343 1.343 0 3 0 L 3 0 C 4.657 0 6 1.343 6 3 L 6 10 C 6 11.657 4.657 13 3 13 Z"
        transform="translate(9 2)"
      />
    </svg>
  );
}

function StatusChip({ label }: { label: string }) {
  return (
    <div className="cv-chip" style={{ boxShadow: RING, backgroundColor: C_PANEL }}>
      <p className="t-micro cv-chip-text" style={{ color: C_DIM }}>
        {label}
      </p>
    </div>
  );
}

function ActionChip({ id, label }: { id: string; label: string }) {
  return (
    <div className="cv-action" style={{ boxShadow: RING, backgroundColor: C_PANEL }}>
      <Icon id={id} size={14} color={C_MUTED} strokeWidth={2} />
      <p className="t-micro cv-chip-text" style={{ color: C_DIM }}>
        {label}
      </p>
    </div>
  );
}

function ResultRow({
  company,
  risk,
  reason,
  tint,
  fill,
  showRisk,
}: (typeof ROWS)[number] & { showRisk: boolean }) {
  return (
    <div className="cv-row">
      <div className="cv-row-info">
        <div className="cv-row-logo" style={{ backgroundColor: C_LOGO_BG }}>
          <RowMark />
        </div>
        <p className="t-label cv-nowrap" style={{ color: C_TEXT }}>
          {company}
        </p>
        {showRisk && (
          <div className="cv-row-risk">
            <span className="cv-dot" style={{ backgroundColor: tint }} />
            <p className="t-micro cv-nowrap" style={{ color: tint }}>
              {risk}
            </p>
          </div>
        )}
      </div>
      <div className="cv-tag" style={{ backgroundColor: fill }}>
        <p className="t-micro cv-nowrap" style={{ color: tint }}>
          {reason}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */

export function Conversation() {
  const phase = usePhase();

  const asked = phase === "chatStart" || phase === "thinking" || phase === "results";
  const panelOpen = phase === "thinking" || phase === "results";
  const rowsOpen = phase === "results" || phase === "loopReset";
  const shareBarMounted = phase === "thinking" || phase === "results" || phase === "loopReset";

  /* Which of the three status lines the panel is reading out. */
  const [line, setLine] = useState(0);
  useEffect(() => {
    if (!panelOpen) {
      setLine(0);
      return;
    }
    if (line >= STATUS_LINES.length - 1) return;
    const t = window.setTimeout(() => setLine((n) => n + 1), 2000);
    return () => window.clearTimeout(t);
  }, [panelOpen, line]);

  return (
    <section className="cv-section" data-section="Conversation">
      <div className="cv-container">
        <div className="cv-tagline">
          <div className="cv-headline-wrap">
            <h2 className="t-h2 cv-headline" style={{ color: C_DIM, textAlign: "start" }}>
              {"Your team wastes hours pulling data from scattered tools. "}
              <span style={{ color: C_TEXT }}>Nordwell turns that into one conversation.</span>
            </h2>
          </div>
        </div>

        <div className="cv-example">
          <div className="cv-mock" data-phase={phase}>
            <div className="cv-stack">
              {/* Query bar */}
              <motion.div
                layout
                className="cv-chat"
                style={{ background: CHAT_GRADIENT, borderRadius: 16 }}
                transition={T_CHAT}
              >
                <div className="cv-chat-col">
                  <div className="cv-top">
                    <div className="cv-msgwrap">
                      {!asked && (
                        <motion.p
                          className="t-body cv-msg"
                          style={{ color: C_PLACEHOLDER }}
                          initial={{ opacity: HIDDEN }}
                          animate={{ opacity: 1 }}
                          transition={T_TEXT}
                        >
                          How can I help today?
                        </motion.p>
                      )}
                      {asked && (
                        <p className="t-body cv-msg" style={{ color: C_TEXT }}>
                          {MESSAGE.split("").map((ch, i) => (
                            <motion.span
                              key={`${i}-${ch}`}
                              initial={{ opacity: HIDDEN }}
                              animate={{ opacity: 1 }}
                              transition={{ type: "tween", duration: 0.01, ease: EASE, delay: i * 0.025 }}
                              style={{ whiteSpace: "pre" }}
                            >
                              {ch}
                            </motion.span>
                          ))}
                        </p>
                      )}
                    </div>

                    <div className="cv-status">
                      <motion.div
                        className="cv-chipwrap cv-chip-thinking"
                        animate={{ opacity: phase === "thinking" ? 1 : 0 }}
                        transition={phase === "thinking" ? T_CHIP_B : phase === "results" ? SPRING : T_CHIP_A}
                      >
                        <StatusChip label="Thinking" />
                      </motion.div>
                      <motion.div
                        className="cv-chipwrap cv-chip-results"
                        animate={{ opacity: phase === "results" ? 1 : 0 }}
                        transition={phase === "results" ? SPRING : T_CHIP_C}
                      >
                        <StatusChip label="3 Results" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="cv-buttons"
                    animate={{ opacity: panelOpen ? 0 : 1 }}
                    transition={SPRING}
                  >
                    <div className="cv-btn">
                      <Icon id="3356954461" size={20} color={C_MUTED} strokeWidth={2} />
                    </div>
                    <motion.div
                      className="cv-btn cv-btn-send"
                      style={{ borderRadius: 12 }}
                      animate={{
                        backgroundColor:
                          phase === "thinking"
                            ? "rgb(38, 38, 38)"
                            : phase === "chatStart"
                              ? "rgb(28, 25, 23)"
                              : "rgba(38, 38, 38, 0)",
                      }}
                      transition={SPRING}
                    >
                      {phase === "primary" || phase === "loopReset" ? (
                        <MicIcon />
                      ) : (
                        <Icon id="2903821725" size={20} color={C_SEND} strokeWidth={2} />
                      )}
                    </motion.div>
                  </motion.div>
                </div>
                <div className="cv-chat-bg" style={{ backgroundColor: C_PANEL, borderRadius: 15 }} />
              </motion.div>

              {/* Quick actions */}
              <motion.div
                className="cv-quickbar"
                style={{ borderRadius: 16 }}
                animate={{ opacity: panelOpen ? 0 : 1 }}
                transition={phase === "loopReset" ? SPRING_D2 : SPRING}
              >
                {QUICK_ACTIONS.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className={`cv-actionwrap${i === 3 ? " cv-action-4" : ""}`}
                    initial={{ opacity: HIDDEN, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: 0.2, ease: EASE, delay: a.delay }}
                  >
                    <ActionChip id={a.id} label={a.label} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Export / share */}
              {shareBarMounted && (
                <motion.div
                  className="cv-sharebar"
                  style={{ borderRadius: 16 }}
                  animate={{ opacity: phase === "results" ? 1 : 0 }}
                  transition={SPRING}
                >
                  <motion.div
                    className="cv-actionwrap"
                    initial={{ opacity: HIDDEN, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: 0.2, ease: EASE, delay: 0 }}
                  >
                    <ActionChip id="1683057900" label="Export CSV" />
                  </motion.div>
                  <motion.div
                    className="cv-actionwrap"
                    initial={{ opacity: HIDDEN, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "tween", duration: 0.2, ease: EASE, delay: 0.1 }}
                  >
                    <ActionChip id="3129714398" label="Share with team" />
                  </motion.div>
                </motion.div>
              )}

              {/* Results panel */}
              <motion.div
                className="cv-results"
                style={{ backgroundColor: C_PANEL, borderRadius: 16, boxShadow: RING }}
                animate={{ opacity: panelOpen ? 1 : 0 }}
                transition={phase === "thinking" ? SPRING_D2 : SPRING}
              >
                <motion.div
                  className="cv-readout"
                  animate={{ opacity: panelOpen ? 1 : 0 }}
                  transition={SPRING}
                >
                  <p key={line} className="t-mono cv-readout-text">
                    {STATUS_LINES[line]}
                  </p>
                </motion.div>

                {rowsOpen && (
                  <div className="cv-rows">
                    <motion.div
                      className="cv-rowwrap"
                      initial={{ opacity: HIDDEN, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.1 }}
                    >
                      <ResultRow {...ROWS[0]} showRisk />
                    </motion.div>
                    <motion.div
                      className="cv-divider"
                      style={{ backgroundColor: C_LINE }}
                      initial={{ opacity: HIDDEN, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.15 }}
                    />
                    <motion.div
                      className="cv-rowwrap"
                      initial={{ opacity: HIDDEN, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.2 }}
                    >
                      <ResultRow {...ROWS[1]} showRisk />
                    </motion.div>
                    <motion.div
                      className="cv-divider"
                      style={{ backgroundColor: C_LINE }}
                      initial={{ opacity: HIDDEN, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.25 }}
                    />
                    <motion.div
                      className="cv-rowwrap"
                      initial={{ opacity: HIDDEN, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.3 }}
                    >
                      <ResultRow {...ROWS[2]} showRisk />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
            {/* TODO(spec): the masked particle-grid canvas that sits behind the card
                (absolute inset 0, opacity .3, mask linear-gradient(0deg, transparent 0%,
                black 22%)) is a WebGL component this section does not own. */}
          </div>
        </div>
      </div>

      <style>{CSS}</style>
    </section>
  );
}

/* --------------------------------------------------------------------- */

const CSS = `
.cv-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  gap: 16px;
  width: 100%;
  height: min-content;
  padding: 0 64px;
  overflow: clip;
  flex: none;
}
.cv-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  gap: 0 32px;
  width: 100%;
  max-width: 1400px;
  height: min-content;
  padding: 0;
  overflow: clip;
  flex: none;
  box-shadow: inset 1px 0 0 0 ${C_LINE}, inset -1px 0 0 0 ${C_LINE};
}
.cv-tagline {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: flex-start;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 80px 40px 50px;
  overflow: clip;
  flex: none;
}
.cv-headline-wrap {
  position: relative;
  flex: 0.5 0 0;
  width: 1px;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.cv-headline { margin: 0; }

.cv-example {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  height: 517px;
  padding: 0;
  overflow: clip;
  flex: none;
}
.cv-mock {
  position: relative;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 16px 16px 80px;
  overflow: visible;
}
.cv-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 460px;
  height: min-content;
  padding: 0;
  overflow: visible;
  flex: none;
  user-select: none;
  -webkit-user-select: none;
}

/* Query bar -------------------------------------------------------------- */
.cv-chat {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: min-content;
  padding: 0;
  overflow: clip;
  flex: none;
}
.cv-chat-col {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
  width: 1px;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.cv-chat-bg { position: absolute; inset: 1px; z-index: 1; flex: none; }
.cv-top {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: min-content;
  padding: 0 8px 0 20px;
  overflow: visible;
  flex: none;
}
.cv-msgwrap {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  align-self: stretch;
  gap: 0;
  flex: 1 0 0;
  width: 1px;
  height: auto;
  padding: 20px 0;
  overflow: visible;
}
.cv-msg {
  position: relative;
  margin: 0;
  flex: 1 0 0;
  width: 1px;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.cv-status {
  position: relative;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 91px;
  height: 64px;
  padding: 0;
  overflow: clip;
  flex: none;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}
.cv-chipwrap {
  position: absolute;
  bottom: -32px;
  left: 49%;
  transform: translateX(-50%);
  z-index: 1;
  flex: none;
  width: auto;
  height: auto;
}
.cv-mock[data-phase="thinking"] .cv-chip-thinking,
.cv-mock[data-phase="results"] .cv-chip-results {
  position: relative;
  bottom: unset;
  left: unset;
  transform: none;
}
.cv-mock[data-phase="results"] .cv-chip-thinking,
.cv-mock[data-phase="loopReset"] .cv-chip-results {
  bottom: unset;
  top: -32px;
}

.cv-chip {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: min-content;
  height: min-content;
  padding: 4px 8px;
  overflow: clip;
  border-radius: 8px;
}
.cv-chip-text { margin: 0; white-space: pre; flex: none; width: auto; height: auto; position: relative; }

.cv-buttons {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center space-between;
  align-items: center;
  width: 100%;
  height: min-content;
  padding: 0 12px 12px;
  overflow: visible;
  flex: none;
}
.cv-mock[data-phase="thinking"] .cv-buttons {
  position: absolute;
  bottom: -48px;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  z-index: 1;
}
.cv-mock[data-phase="results"] .cv-buttons {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  z-index: 1;
}
.cv-btn {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: min-content;
  height: min-content;
  padding: 8px;
  overflow: visible;
  flex: none;
}
.cv-btn-icon { width: 20px; height: 20px; display: block; flex: none; }

/* Quick action bars ------------------------------------------------------ */
.cv-quickbar {
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row wrap;
  place-content: center;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: min-content;
  padding: 0 16px;
  overflow: visible;
  flex: none;
}
.cv-mock[data-phase="thinking"] .cv-quickbar,
.cv-mock[data-phase="results"] .cv-quickbar {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  width: unset;
}
.cv-sharebar {
  position: absolute;
  bottom: -44px;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-flow: row wrap;
  place-content: center;
  align-items: center;
  gap: 4px;
  height: min-content;
  padding: 0 16px;
  overflow: visible;
  flex: none;
}
.cv-mock[data-phase="thinking"] .cv-sharebar { bottom: 6px; }
.cv-actionwrap { position: relative; flex: none; width: auto; height: auto; }
.cv-action {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: min-content;
  height: min-content;
  padding: 8px;
  overflow: clip;
  border-radius: 8px;
}

/* Results panel ---------------------------------------------------------- */
.cv-results {
  position: absolute;
  bottom: -68px;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  height: min-content;
  padding: 20px;
  overflow: clip;
  flex: none;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}
.cv-mock[data-phase="thinking"] .cv-results,
.cv-mock[data-phase="results"] .cv-results {
  position: relative;
  bottom: unset;
  left: unset;
  right: unset;
  width: 100%;
}
.cv-mock[data-phase="loopReset"] .cv-results { bottom: -233px; }
.cv-readout { position: relative; flex: none; width: 100%; height: auto; }
.cv-readout-text {
  margin: 0;
  line-height: 20px;
  color: rgb(115, 115, 115);
  background-image: linear-gradient(
    90deg,
    rgb(115, 115, 115) 0%,
    rgb(115, 115, 115) 42%,
    rgb(0, 238, 255) 46%,
    rgb(0, 14, 221) 49.5%,
    rgb(245, 29, 0) 53%,
    rgb(255, 187, 0) 56.5%,
    rgb(115, 115, 115) 60%,
    rgb(115, 115, 115) 100%
  );
  background-size: 300% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: cv-sweep 1s linear both;
}
@keyframes cv-sweep {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}
.cv-rows {
  position: absolute;
  bottom: -219px;
  left: 20px;
  right: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  height: min-content;
  padding: 0;
  overflow: visible;
  flex: none;
}
.cv-mock[data-phase="results"] .cv-rows {
  position: relative;
  bottom: unset;
  left: unset;
  right: unset;
  width: 100%;
}
.cv-mock[data-phase="loopReset"] .cv-rows {
  position: relative;
  bottom: unset;
  left: unset;
  right: unset;
  width: 420px;
}
.cv-rowwrap { position: relative; flex: none; width: 100%; height: auto; }
.cv-divider { position: relative; flex: none; width: 100%; height: 1px; overflow: clip; }
.cv-row {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center space-between;
  align-items: center;
  width: 100%;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.cv-row-info {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: visible;
  flex: none;
}
.cv-row-logo {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 28px;
  height: 28px;
  padding: 0;
  overflow: visible;
  flex: none;
  border-radius: 8px;
}
.cv-mark { position: relative; flex: none; width: 16px; height: 16px; display: block; }
.cv-row-risk {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 4px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: visible;
  flex: none;
}
.cv-dot { display: block; flex: none; width: 6px; height: 6px; border-radius: 9999px; }
.cv-tag {
  position: relative;
  display: flex;
  flex-direction: row;
  place-content: center;
  align-items: center;
  gap: 0;
  width: min-content;
  height: min-content;
  padding: 4px 8px;
  overflow: visible;
  flex: none;
  border-radius: 4px;
}
.cv-nowrap { margin: 0; white-space: pre; flex: none; width: auto; height: auto; position: relative; }

/* Breakpoints ------------------------------------------------------------ */
@media (max-width: 1199.98px) {
  .cv-section { padding: 0; }
  .cv-container { box-shadow: none; }
  .cv-tagline { padding: 60px 40px 0; }
}
@media (max-width: 809.98px) {
  .cv-section { padding: 0; }
  .cv-container { box-shadow: none; }
  .cv-tagline { padding: 40px 20px 20px; }
  .cv-headline-wrap { flex: 1 0 0; }
  .cv-mock { padding: 16px 16px 200px; }
  .cv-action-4 { display: none; }
  .cv-status { display: none; }
  .cv-row-risk { display: none; }
}
`;
