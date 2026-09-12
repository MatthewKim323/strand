"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type Transition,
} from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type RefObject } from "react";

import { Icon } from "@/components/ui/Sprite";
import { PANEL_WAVE_PHASES } from "@/components/webgl/WaveGridField";

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

/* ------------------------------------------------------------------ loop */

export type Phase = "primary" | "chatStart" | "thinking" | "results" | "loopReset";

/**
 * Phase order and dwell time, straight out of the source component's own
 * variant change handlers: Primary holds 2s before the question lands, the
 * question holds 2s, Thinking holds 4s, Results holds 3.5s and the reset frame
 * holds 0.5s, for a twelve second loop.
 */
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
const T_LETTER: Transition = { type: "tween", duration: 0.2, ease: EASE };
const LETTER_STAGGER = 0.02;

const HIDDEN = 0.001;

/* Palette tokens, copied verbatim so they resolve with no translation. */
const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const PANEL = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const WELL = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))";
const PLACEHOLDER = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const ICON_DIM = "var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(115, 115, 115))";
const SEND = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 250))";
const RED = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";
const RED_20 = "var(--token-3a95eaa6-e51b-4092-9cd6-e78e24a17dd1, rgba(229, 72, 77, 0.2))";
const AMBER = "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))";
const AMBER_20 = "var(--token-aace3d5f-06f1-4eda-b5c4-3a57d2e8e178, rgba(249, 171, 0, 0.2))";

const RING = `inset 0 0 0 1px ${HAIRLINE}`;

const MESSAGE = "Which accounts are at risk this quarter?";
const STATUS_LINES = ["Scanning Salesforce", "Scoring by churn signal weight", "3 accounts flagged"];
/** Seconds the readout holds each line before advancing. */
const READOUT_INTERVAL = 2;
/**
 * The readout's per-letter colour loop: a value runs 0 -> 100 every second,
 * linear, forever, and these six stops turn it into a chromatic sweep across
 * the line. The input stops are `50 - range + k / 5 * range * 2` for a range
 * of 25.
 */
const SWEEP_STOPS = [25, 35, 45, 55, 65, 75];
const SWEEP_COLORS = [
  "rgb(115, 115, 115)",
  "rgb(0, 238, 255)",
  "rgb(0, 14, 221)",
  "rgb(245, 29, 0)",
  "rgb(255, 187, 0)",
  "rgb(115, 115, 115)",
];
const SWEEP_REST = SWEEP_COLORS[0];

/**
 * The three accounts. The third row's company reads "Acme Corp" only while the
 * sheet is open on Results; the reset frame falls back to the base value.
 */
const ROWS = [
  { company: "Meridian Corp", risk: "High risk", reason: "No login in 30d", tint: RED, fill: RED_20 },
  { company: "Apex Systems", risk: "Medium", reason: "Usage -40%", tint: AMBER, fill: AMBER_20 },
  { company: "Lumen Health", risk: "High Risk", reason: "Ticket spike", tint: RED, fill: RED_20 },
];
const ROW_3_RESULTS = "Acme Corp";

/** The quick action pills. Four at desktop and tablet, three at phone. */
const PILLS: Array<{ id: string; label: string }> = [
  { id: "89488612", label: "Analyze" },
  { id: "3092554709", label: "Compare" },
  { id: "3261614140", label: "Monitor" },
  { id: "2932616460", label: "Report" },
];

/** Which field phase override set each loop phase selects. */
const FIELD_PHASE: Record<Phase, keyof typeof PANEL_WAVE_PHASES> = {
  primary: "base",
  chatStart: "chatStart",
  thinking: "thinking",
  results: "results",
  loopReset: "base",
};

/**
 * The panel's twelve second loop. Two runtime details from the source that
 * have to be reproduced: every pending timer is cleared on each phase change,
 * so only one is ever live; and the change itself waits until the tab is
 * visible AND the panel is on screen, so the loop pauses and resumes from
 * where it stopped rather than catching up.
 */
function usePhase(hostRef: RefObject<HTMLDivElement | null>): Phase {
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState<Phase | null>(null);
  const [awake, setAwake] = useState(true);
  const [due, setDue] = useState(false);

  // `?phase=results` pins one phase, which is how the loop gets measured.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("phase");
    if (p && SEQUENCE.some((s) => s.phase === p)) setPinned(p as Phase);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    let onScreen = true;
    const sync = () => setAwake(!document.hidden && onScreen);
    const io =
      el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            onScreen = entries.some((e) => e.isIntersecting);
            sync();
          })
        : null;
    io?.observe(el as Element);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [hostRef]);

  useEffect(() => {
    if (pinned || due) return;
    const t = window.setTimeout(() => setDue(true), SEQUENCE[step].ms);
    return () => window.clearTimeout(t);
  }, [step, pinned, due]);

  useEffect(() => {
    if (!due || !awake) return;
    setDue(false);
    setStep((s) => (s + 1) % SEQUENCE.length);
  }, [due, awake]);

  return pinned ?? SEQUENCE[step].phase;
}

/* ---------------------------------------------------------------- pieces */

/** The account-row mark. A radial burst, drawn from the reference vector set. */
function RowMark() {
  return (
    <svg className="ak-chat-mark" viewBox="0 0 33.121 33" aria-hidden="true" focusable="false">
      <path
        fill={ICON_DIM}
        transform="translate(0.256 0.743)"
        d="M 20.27 0.848 L 17.093 0 L 14.416 9.956 L 11.998 0.968 L 8.821 1.816 L 11.433 11.527 L 4.928 5.047 L 2.602 7.363 L 9.737 14.473 L 0.851 12.1 L 0 15.266 L 9.709 17.857 C 9.596 17.369 9.539 16.871 9.539 16.37 C 9.539 12.75 12.484 9.815 16.118 9.815 C 19.751 9.815 22.696 12.75 22.696 16.37 C 22.696 16.878 22.638 17.373 22.528 17.848 L 31.352 20.203 L 32.203 17.038 L 22.456 14.436 L 31.342 12.063 L 30.491 8.898 L 20.744 11.501 L 27.249 5.019 L 24.923 2.702 L 17.886 9.712 Z"
      />
      <path
        fill={ICON_DIM}
        transform="translate(1.117 18.62)"
        d="M 21.658 0.009 C 21.389 1.138 20.824 2.175 20.021 3.013 L 26.414 9.382 L 28.74 7.065 Z M 19.957 3.08 C 19.146 3.905 18.132 4.503 17.017 4.811 L 19.343 13.461 L 22.52 12.612 L 19.957 3.079 Z M 16.898 4.843 C 16.361 4.98 15.81 5.049 15.256 5.049 C 14.663 5.049 14.073 4.97 13.501 4.813 L 11.173 13.47 L 14.35 14.318 Z M 13.389 4.781 C 12.29 4.457 11.294 3.851 10.501 3.024 L 4.093 9.408 L 6.419 11.726 Z M 10.448 2.967 C 9.666 2.135 9.115 1.112 8.852 0 L 0 2.364 L 0.851 5.529 Z"
      />
    </svg>
  );
}

/** The microphone glyph, which only shows while the panel is idle. */
function MicIcon() {
  const p = {
    fill: "transparent",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    stroke: SEND,
  };
  return (
    <svg viewBox="0 0 24 24" className="ak-chat-btn-icon" aria-hidden="true" focusable="false">
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
    <div className="ak-chat-chip" style={{ boxShadow: RING, backgroundColor: PANEL }}>
      <p className="t-micro ak-chat-chip-l" style={{ color: MUTED }}>
        {label}
      </p>
    </div>
  );
}

function ActionChip({ id, label }: { id: string; label: string }) {
  return (
    <div className="ak-chat-pill" style={{ boxShadow: RING, backgroundColor: PANEL }}>
      <Icon id={id} size={14} color={ICON_DIM} strokeWidth={2} />
      <p className="t-micro ak-chat-pill-l" style={{ color: MUTED }}>
        {label}
      </p>
    </div>
  );
}

/**
 * One letter of the readout. It flips in on X, flips out the same way, and
 * carries its own infinite colour sweep while the line it belongs to is still
 * being read; the last line settles to flat grey instead.
 */
function ReadoutLetter({ char, index, sweep }: { char: string; index: number; sweep: boolean }) {
  const v = useMotionValue(0);
  const color = useTransform(v, SWEEP_STOPS, SWEEP_COLORS);

  useEffect(() => {
    if (!sweep) {
      v.set(0);
      return;
    }
    const controls = animate(v, 100, {
      delay: index * LETTER_STAGGER,
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [sweep, index, v]);

  return (
    <motion.span
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      exit={{ rotateX: 90, opacity: 0 }}
      transition={{ ...T_LETTER, delay: index * LETTER_STAGGER }}
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        transformOrigin: "center center -5px",
        color: sweep ? color : SWEEP_REST,
      }}
    >
      {char}
    </motion.span>
  );
}

/**
 * The status readout. It walks the three lines at a two second interval and
 * stops on the last one, restarting from the first every time the panel enters
 * Thinking.
 */
function Readout({ play }: { play: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!play) return;
    const id = window.setInterval(
      () => setIndex((i) => (i >= STATUS_LINES.length - 1 ? i : i + 1)),
      READOUT_INTERVAL * 1000,
    );
    return () => window.clearInterval(id);
  }, [play]);

  const text = STATUS_LINES[index];
  const sweep = play && index < STATUS_LINES.length - 1;
  const letters = Array.from(text);

  return (
    <p className="t-mono ak-chat-readout-text">
      <AnimatePresence mode="popLayout" initial={false}>
        {letters.map((ch, i) => (
          <ReadoutLetter
            key={`${i}:${letters[i - 1] ?? ""}${ch}${letters[i + 1] ?? ""}`}
            char={ch}
            index={i}
            sweep={sweep}
          />
        ))}
      </AnimatePresence>
    </p>
  );
}

function ResultRow({
  company,
  risk,
  reason,
  tint,
  fill,
}: {
  company: string;
  risk: string;
  reason: string;
  tint: string;
  fill: string;
}) {
  return (
    <div className="ak-chat-row">
      <div className="ak-chat-row-info">
        <div className="ak-chat-row-logo" style={{ backgroundColor: WELL }}>
          <RowMark />
        </div>
        <p className="t-label ak-chat-nowrap" style={{ color: BRIGHT }}>
          {company}
        </p>
        <div className="ak-chat-row-risk">
          <span className="ak-chat-dot" style={{ backgroundColor: tint }} />
          <p className="t-micro ak-chat-nowrap" style={{ color: tint }}>
            {risk}
          </p>
        </div>
      </div>
      <div className="ak-chat-tag" style={{ backgroundColor: fill }}>
        <p className="t-micro ak-chat-nowrap" style={{ color: tint }}>
          {reason}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- panel */

export function ChatPanel({ phone }: { phone: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const phase = usePhase(hostRef);

  const asked = phase === "chatStart" || phase === "thinking" || phase === "results";
  const panelOpen = phase === "thinking" || phase === "results";
  const rowsOpen = phase === "results" || phase === "loopReset";
  const shareBarMounted = phase === "thinking" || phase === "results" || phase === "loopReset";

  const pills = phone ? PILLS.slice(0, 3) : PILLS;
  const rows = ROWS.map((r, i) =>
    i === 2 && phase === "results" ? { ...r, company: ROW_3_RESULTS } : r,
  );

  return (
    <div className="ak-chat" data-phase={phase} ref={hostRef}>
      <div className="ak-chat-stack">
        {/* Query bar */}
        <motion.div layout className="ak-chat-card" transition={T_CHAT}>
          <div className="ak-chat-inner">
            <div className="ak-chat-top">
              <div className="ak-chat-msg-wrap">
                <div className="ak-chat-msg">
                  {!asked && (
                    <motion.p
                      className="t-body"
                      style={{ color: PLACEHOLDER, margin: 0 }}
                      initial={{ opacity: HIDDEN }}
                      animate={{ opacity: 1 }}
                      transition={T_TEXT}
                    >
                      How can I help today?
                    </motion.p>
                  )}
                  {asked && (
                    <p className="t-body" style={{ color: BRIGHT, margin: 0 }}>
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
              </div>

              <div className="ak-chat-status">
                {/* Both chips sit on a 0.4s tween with their own delay, except
                    in Results, where they fall back to the card's own 0.3s. */}
                <motion.div
                  className="ak-chat-chip-slot ak-chat-chip-thinking"
                  animate={{ opacity: phase === "thinking" ? 1 : 0 }}
                  transition={
                    phase === "thinking" ? T_CHIP_B : phase === "results" ? T_CHAT : T_CHIP_A
                  }
                >
                  <StatusChip label="Thinking" />
                </motion.div>
                <motion.div
                  className="ak-chat-chip-slot ak-chat-chip-results"
                  animate={{ opacity: phase === "results" ? 1 : 0 }}
                  transition={phase === "results" ? T_CHAT : T_CHIP_C}
                >
                  <StatusChip label="3 Results" />
                </motion.div>
              </div>
            </div>

            {/* Everything inside the card inherits its own 0.3s tween. */}
            <motion.div
              className="ak-chat-buttons"
              animate={{ opacity: panelOpen ? 0 : 1 }}
              transition={T_CHAT}
            >
              <div className="ak-chat-btn">
                <Icon id="3356954461" size={20} color={ICON_DIM} strokeWidth={2} />
              </div>
              <motion.div
                className="ak-chat-btn ak-chat-btn-send"
                animate={{
                  backgroundColor:
                    phase === "thinking"
                      ? "rgb(38, 38, 38)"
                      : phase === "chatStart"
                        ? WELL
                        : "rgba(38, 38, 38, 0)",
                }}
                transition={T_CHAT}
              >
                {phase === "primary" || phase === "loopReset" ? (
                  <MicIcon />
                ) : (
                  <Icon id="2903821725" size={20} color={SEND} strokeWidth={2} />
                )}
              </motion.div>
            </motion.div>
          </div>
          <div className="ak-chat-bg" />
        </motion.div>

        {/* Quick actions */}
        <motion.div
          className="ak-chat-actions"
          animate={{ opacity: panelOpen ? 0 : 1 }}
          transition={phase === "loopReset" ? SPRING_D2 : SPRING}
        >
          {pills.map((p) => (
            <div className="ak-chat-pill-slot" key={p.label}>
              <ActionChip id={p.id} label={p.label} />
            </div>
          ))}
        </motion.div>

        {/* Export / share */}
        {shareBarMounted && (
          <motion.div
            className="ak-chat-share"
            animate={{ opacity: phase === "results" ? 1 : 0 }}
            transition={SPRING}
          >
            <motion.div
              className="ak-chat-pill-slot"
              initial={{ opacity: HIDDEN, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "tween", duration: 0.2, ease: EASE, delay: 0 }}
            >
              <ActionChip id="1683057900" label="Export CSV" />
            </motion.div>
            <motion.div
              className="ak-chat-pill-slot"
              initial={{ opacity: HIDDEN, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "tween", duration: 0.2, ease: EASE, delay: 0.1 }}
            >
              <ActionChip id="3129714398" label="Share with team" />
            </motion.div>
          </motion.div>
        )}

        {/* Results sheet */}
        <motion.div
          className="ak-chat-results"
          animate={{ opacity: panelOpen ? 1 : 0 }}
          transition={phase === "thinking" ? SPRING_D2 : SPRING}
        >
          <motion.div
            className="ak-chat-readout"
            animate={{ opacity: panelOpen ? 1 : 0 }}
            transition={SPRING}
          >
            <Readout play={panelOpen} />
          </motion.div>

          {rowsOpen && (
            <div className="ak-chat-rows">
              <motion.div
                className="ak-chat-rowwrap"
                initial={{ opacity: HIDDEN, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.1 }}
              >
                <ResultRow {...rows[0]} />
              </motion.div>
              <motion.div
                className="ak-chat-divider"
                initial={{ opacity: HIDDEN, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.15 }}
              />
              <motion.div
                className="ak-chat-rowwrap"
                initial={{ opacity: HIDDEN, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.2 }}
              >
                <ResultRow {...rows[1]} />
              </motion.div>
              <motion.div
                className="ak-chat-divider"
                initial={{ opacity: HIDDEN, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.25 }}
              />
              <motion.div
                className="ak-chat-rowwrap"
                initial={{ opacity: HIDDEN, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "tween", duration: 0.2, ease: EASE_IO, delay: 0.3 }}
              >
                <ResultRow {...rows[2]} />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/*
        The particle grid behind the panel. The container carries the 0.3
        opacity and the bottom-out mask; the field supplies its own relative,
        clipped box. It is out of flow, so it cannot move the stage height.
      */}
      <div className="ak-chat-field" style={{ order: phase === "results" ? 1 : undefined }}>
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
            timeScale={0.05}
            waveHeightScale={0.1}
            {...PANEL_WAVE_PHASES[FIELD_PHASE[phase]]}
            pointSize={phone ? 4 : 3.5}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- css */

export const CHAT_CSS = `
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
.ak-chat-status {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 91px; height: 64px; padding: 0; overflow: clip;
  pointer-events: none; user-select: none; -webkit-user-select: none;
}
.ak-chat-chip-slot {
  position: absolute; z-index: 1; flex: none; width: auto; height: auto;
  bottom: -32px; left: 49%; transform: translateX(-50%);
}
.ak-chat[data-phase="thinking"] .ak-chat-chip-thinking,
.ak-chat[data-phase="results"] .ak-chat-chip-results {
  position: relative; bottom: unset; left: unset; transform: none;
}
.ak-chat[data-phase="results"] .ak-chat-chip-thinking,
.ak-chat[data-phase="loopReset"] .ak-chat-chip-results {
  bottom: unset; top: -32px;
}
.ak-chat-chip {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 4px 8px; overflow: clip;
  border-radius: 8px;
}
.ak-chat-chip-l {
  position: relative; margin: 0; flex: none; width: auto; height: auto; white-space: pre;
}
.ak-chat-buttons {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 0 12px 12px; overflow: visible;
}
.ak-chat[data-phase="thinking"] .ak-chat-buttons {
  position: absolute; bottom: -48px; left: 50%; transform: translateX(-50%);
  width: 460px; z-index: 1;
}
.ak-chat[data-phase="results"] .ak-chat-buttons {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 460px; z-index: 1;
}
.ak-chat-btn {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: min-content; height: min-content; padding: 8px; overflow: visible;
}
.ak-chat-btn-send { border-radius: 12px; }
.ak-chat-btn-icon { width: 20px; height: 20px; display: block; flex: none; }
.ak-chat-actions {
  position: relative; z-index: 1; display: flex; flex: none;
  flex-flow: row wrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: 100%; height: min-content; padding: 0 16px; overflow: visible; border-radius: 16px;
}
.ak-chat[data-phase="thinking"] .ak-chat-actions,
.ak-chat[data-phase="results"] .ak-chat-actions {
  position: absolute; top: 32px; left: 0; right: 0; width: unset;
}
.ak-chat-share {
  position: absolute; bottom: -44px; left: 0; right: 0; z-index: 1;
  display: flex; flex: none;
  flex-flow: row wrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; height: min-content; padding: 0 16px; overflow: visible; border-radius: 16px;
}
.ak-chat[data-phase="thinking"] .ak-chat-share { bottom: 6px; }
.ak-chat-pill-slot { position: relative; flex: none; width: auto; height: auto; }
.ak-chat-pill {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 8px; overflow: clip; border-radius: 8px;
}
.ak-chat-pill-l {
  position: relative; margin: 0; flex: none; width: auto; height: auto; white-space: pre;
}
.ak-chat-results {
  position: absolute; z-index: 3; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; bottom: -68px; left: 0; right: 0; height: min-content; padding: 20px; overflow: clip;
  border-radius: 16px; pointer-events: none;
  user-select: none; -webkit-user-select: none;
  background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
  box-shadow: ${RING};
}
.ak-chat[data-phase="thinking"] .ak-chat-results,
.ak-chat[data-phase="results"] .ak-chat-results {
  position: relative; bottom: unset; left: unset; right: unset; width: 100%;
}
.ak-chat[data-phase="loopReset"] .ak-chat-results { bottom: -233px; }
.ak-chat-readout { position: relative; flex: none; width: 100%; height: auto; }
.ak-chat-readout-text { margin: 0; line-height: 20px; color: rgb(115, 115, 115); }
.ak-chat-rows {
  position: absolute; bottom: -219px; left: 20px; right: 20px; z-index: 1;
  display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; height: min-content; padding: 0; overflow: visible;
}
.ak-chat[data-phase="results"] .ak-chat-rows {
  position: relative; bottom: unset; left: unset; right: unset; width: 100%;
}
.ak-chat[data-phase="loopReset"] .ak-chat-rows {
  position: relative; bottom: unset; left: unset; right: unset; width: 420px;
}
.ak-chat-rowwrap { position: relative; flex: none; width: 100%; height: auto; }
.ak-chat-divider {
  position: relative; flex: none; width: 100%; height: 1px; overflow: clip;
  background-color: var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}
.ak-chat-row {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ak-chat-row-info {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ak-chat-row-logo {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 28px; height: 28px; padding: 0; overflow: visible; border-radius: 8px;
}
.ak-chat-mark { position: relative; flex: none; width: 16px; height: 16px; display: block; }
.ak-chat-row-risk {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.ak-chat-dot { display: block; flex: none; width: 6px; height: 6px; border-radius: 9999px; }
.ak-chat-tag {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: min-content; height: min-content; padding: 4px 8px; overflow: visible;
  border-radius: 4px;
}
.ak-chat-nowrap { margin: 0; white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.ak-chat-field {
  position: absolute; z-index: 1; flex: none; inset: 0; opacity: 0.3;
  -webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%);
  mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%);
}

@media (max-width: 1199.98px) {
  .ak-chat { padding: 16px 16px 200px; }
}
@media (max-width: 809.98px) {
  .ak-chat { padding: 16px 16px 300px; }
  /* The phone instance turns the status container off through its own prop. */
  .ak-chat-status { display: none; }
  .ak-chat-row-risk { display: none; }
}
`;
