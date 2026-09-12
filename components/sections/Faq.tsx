"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SPRING } from "@/lib/motion";

/*
 * FAQ
 *
 * Two columns: a label stack on the left, a four row accordion on the right.
 * Structure, paddings and sizes come straight out of the spec slice
 * (reference/site/spec/sections/08-faq.txt) and the page module.
 *
 * Accordion behaviour, read off the "FAQ" list component in the page module:
 * its variants are Closed / First / Second / Third / Fourth, so exactly ONE row
 * can be open at a time, and clicking the open row returns the list to Closed.
 * Every transition in that component (row, list and glyph) is the same spring:
 *   {bounce: .2, delay: 0, duration: .4, type: "spring"}   === lib/motion SPRING
 *
 * Row geometry:
 *   closed: fixed height 88px, inner column gap 22px, answer opacity 0 (the row
 *           is overflow:clip so the answer sits just below the clip line).
 *   open:   height = 16 + questionStack + answerStack + 16, column gap 0px.
 * The open height is measured rather than guessed so `height: auto` never jumps.
 */

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const QUESTION_DIMMED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const DOT = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";

const ROW_CLOSED_HEIGHT = 88;
const ROW_PADDING_Y = 32; // 16px top + 16px bottom
const GAP_CLOSED = 22;
const GAP_OPEN = 0;
/* Written with units: `gap` is not one of the keys the animation runtime
   auto-suffixes, so a bare number lands in the style attribute unitless and is
   dropped, leaving the row stuck at whatever it last held. */
const GAP_CLOSED_CSS = `${GAP_CLOSED}px`;
const GAP_OPEN_CSS = `${GAP_OPEN}px`;

/** "Vertical Dot Arrow": five 2x2 dots. Neutral = flat, Down = chevron. */
const DOT_LEFT = [7, 11, 15, 19, 23];
// Neutral (closed): every dot at top:50% with translateY(-50%) inside a 32px box.
const DOT_TOP_NEUTRAL = [15, 15, 15, 15, 15];
// Down (open): dot 2 bottom:13px (no translate), dot 3 top:63%, dot 4 top:56%.
const DOT_TOP_DOWN = [15, 17, 19.16, 16.92, 15];

const ANSWER =
  "An AI Agent is a task-specific assistant that automates workflows like scheduling, content creation, data processing, and more—without requiring any code.";

const QUESTIONS = [
  "What is an AI Agent?",
  "Can I use multiple agents at the same time?",
  "How customizable are the agents?",
  "What tools do the agents integrate with?",
];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Glyph({ open }: { open: boolean }) {
  return (
    <div className="fq-glyph">
      {DOT_LEFT.map((left, i) => (
        <motion.div
          key={left}
          className="fq-dot"
          style={{ left }}
          initial={{ top: DOT_TOP_NEUTRAL[i] }}
          animate={{ top: open ? DOT_TOP_DOWN[i] : DOT_TOP_NEUTRAL[i] }}
          transition={SPRING}
        />
      ))}
    </div>
  );
}

function Row({
  question,
  open,
  dimmed,
  onToggle,
}: {
  question: string;
  open: boolean;
  dimmed: boolean;
  onToggle: () => void;
}) {
  const questionStackRef = useRef<HTMLDivElement>(null);
  const answerStackRef = useRef<HTMLDivElement>(null);
  const [openHeight, setOpenHeight] = useState(ROW_CLOSED_HEIGHT + 56);
  const [hover, setHover] = useState(false);

  useIsoLayoutEffect(() => {
    const q = questionStackRef.current;
    const a = answerStackRef.current;
    if (!q || !a) return;
    const measure = () => {
      setOpenHeight(
        ROW_PADDING_Y +
          q.getBoundingClientRect().height +
          GAP_OPEN +
          a.getBoundingClientRect().height,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(q);
    ro.observe(a);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      className="fq-row"
      data-border
      initial={{ height: ROW_CLOSED_HEIGHT }}
      animate={{ height: open ? openHeight : ROW_CLOSED_HEIGHT }}
      transition={SPRING}
    >
      <motion.div
        className="fq-inner"
        initial={{ gap: GAP_CLOSED_CSS }}
        animate={{ gap: open ? GAP_OPEN_CSS : GAP_CLOSED_CSS }}
        transition={SPRING}
      >
        <motion.div
          ref={questionStackRef}
          className="fq-qstack"
          data-highlight
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          initial={{ paddingLeft: 0 }}
          animate={{ paddingLeft: !open && hover ? 12 : 0 }}
          transition={SPRING}
        >
          <div className="fq-center">
            <div className="fq-qtext">
              <motion.h3
                className="t-h3"
                initial={{ color: TEXT }}
                animate={{ color: dimmed ? QUESTION_DIMMED : TEXT }}
                transition={SPRING}
              >
                {question}
              </motion.h3>
            </div>
          </div>
          <Glyph open={open} />
        </motion.div>

        <div ref={answerStackRef} className="fq-astack">
          <motion.div
            className="fq-atext"
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={SPRING}
          >
            <p className="t-body" style={{ color: MUTED }}>
              {ANSWER}
            </p>
          </motion.div>
        </div>
      </motion.div>
      <div className="fq-rp" />
    </motion.div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = useCallback(
    (i: number) => setOpenIndex((cur) => (cur === i ? null : i)),
    [],
  );

  return (
    <section className="fq-root" data-section="Faq">
      <div className="fq-container">
        <div className="fq-labels">
          <div className="fq-textblock">
            <h2 className="t-h2" style={{ color: TEXT }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="fq-textblock">
            <p className="t-body" style={{ color: MUTED }}>
              Do you want to learn more about us, let&rsquo;s go the blog page.
            </p>
          </div>
        </div>

        <div className="fq-cell">
          <div className="fq-list">
            {/* Layout Jump Preventer: present in the tree, zero sized. */}
            <div className="fq-jump">
              <div />
            </div>
            {QUESTIONS.map((q, i) => (
              <div className="fq-rowc" key={q}>
                <Row
                  question={q}
                  open={openIndex === i}
                  dimmed={openIndex !== null && openIndex !== i}
                  onToggle={() => toggle(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
.fq-root {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 0 64px;
  overflow: clip;
}
.fq-container {
  position: relative;
  display: grid;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center;
  gap: 0;
  flex: none;
  width: 100%;
  max-width: 1400px;
  height: min-content;
  padding: 80px 0;
  overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}
.fq-labels {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex: none;
  align-content: center;
  align-items: center;
  justify-content: flex-start;
  align-self: start;
  justify-self: start;
  gap: 24px;
  width: 100%;
  height: 100%;
  padding: 40px;
  overflow: clip;
}
.fq-textblock {
  position: relative;
  flex: none;
  width: 100%;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.fq-cell {
  position: relative;
  flex: none;
  align-self: start;
  justify-self: start;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
}
.fq-list {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.fq-jump { position: relative; flex: none; width: auto; height: auto; }
.fq-rowc { position: relative; flex: none; width: 100%; height: auto; }

.fq-row {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  align-content: flex-start;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding: 16px 0;
  overflow: clip;
  cursor: pointer;
  box-shadow: inset 0 -1px 0 0 ${LINE};
}
.fq-inner {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex: 1 0 0;
  align-items: center;
  justify-content: flex-start;
  width: 1px;
  height: min-content;
  padding: 0;
  overflow: visible;
}
.fq-qstack {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  flex: none;
  align-content: flex-start;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
  width: 100%;
  height: min-content;
  padding: 12px 0;
  overflow: visible;
  cursor: pointer;
  outline: none;
}
.fq-center {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  flex: 1 0 0;
  align-content: center;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  gap: 16px;
  width: 1px;
  height: auto;
  overflow: visible;
}
.fq-qtext, .fq-atext {
  position: relative;
  flex: 1 0 0;
  width: 1px;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.fq-astack {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: min-content;
  padding: 4px 0;
  overflow: visible;
}
.fq-rp {
  position: relative;
  flex: none;
  align-self: stretch;
  width: 40px;
  height: auto;
  overflow: visible;
}
.fq-glyph {
  position: relative;
  flex: none;
  width: 32px;
  height: 32px;
  overflow: clip;
}
.fq-dot {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 1px;
  background-color: ${DOT};
  overflow: visible;
}

@media (max-width: 1199.98px) {
  .fq-root { padding: 0; }
  .fq-container {
    display: flex;
    flex-flow: column nowrap;
    align-content: center;
    align-items: center;
    padding: 40px;
  }
  .fq-labels { align-self: unset; height: min-content; padding: 40px 0; }
  .fq-cell { align-self: unset; height: auto; }
}

@media (max-width: 809.98px) {
  .fq-container {
    gap: 20px;
    padding: 40px 20px;
    box-shadow: none;
  }
  .fq-labels { align-self: unset; gap: 12px; height: min-content; padding: 0; }
  .fq-cell { align-self: unset; height: auto; }
  .fq-rp { display: none; }
}
      `}</style>
    </section>
  );
}
