"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform, type Transition } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Sprite";
import { ChromaticRule } from "./testimonials/ChromaticRule";
import { IG_MARKS } from "./integrations/marks";

/* ----------------------------------------------------------------- motion */

/** The house tween. Everything in this section that is not a spring uses it. */
const TWEEN: Transition = { type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1] };
/** The house spring. */
const SPRING: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };

/* ------------------------------------------------------------------ colour */

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))";
const PANEL_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const HEAD = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(166, 160, 155))";
const DIM = "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(87, 83, 78))";
const STAT = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(121, 113, 107))";
const ACCENT = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const CHIP_BG = "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(41, 37, 36))";
/* Button colours, copied from the two button components' own variant maps. */
const ICON = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";
/** Circular Button, Light family: hover then press. */
const BTN_LIGHT_HOVER = "var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))";
const BTN_LIGHT_PRESS = "var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))";
/** Circular Button With Text: the same two tokens, inverted. */
const LINK_CIRCLE_HOVER = BTN_LIGHT_PRESS;
const LINK_CIRCLE_PRESS = BTN_LIGHT_HOVER;
const LINK_LABEL = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const LINK_LABEL_HOVER = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";

/* ------------------------------------------------------------------- data */

type Source = {
  name: string;
  main: string;
  secondary: string;
  mark: string;
};

/* The feed order the panel ships with. */
const SOURCES: readonly Source[] = [
  { name: "ThreadBase", main: "42 channels", secondary: "alerts enabled", mark: IG_MARKS.petal },
  { name: "Pipecloud", main: "874 accounts", secondary: "12,400 records", mark: IG_MARKS.weave },
  { name: "Chatdock", main: "9.841 conversations", secondary: "204 open", mark: IG_MARKS.wave },
  { name: "VaultDB", main: "38 schemes", secondary: "6.4M rows", mark: IG_MARKS.prism },
  { name: "Stride", main: "$2.4 MMR", secondary: "1,204 subscriptions", mark: IG_MARKS.orbit },
];

/* The right hand wall of marks, in the order the panel lists them. */
const GRID_MARKS: readonly string[] = [
  IG_MARKS.ledger,
  IG_MARKS.bloom,
  IG_MARKS.petal,
  IG_MARKS.slant,
  IG_MARKS.wave,
  IG_MARKS.notch,
  IG_MARKS.orbit,
  IG_MARKS.crest,
  IG_MARKS.lens,
  IG_MARKS.wave,
  IG_MARKS.knot,
  IG_MARKS.prism,
  IG_MARKS.knot,
  IG_MARKS.knot,
  IG_MARKS.knot,
];

/**
 * Feed slots rendered at once, and the seconds between advances. Both are the
 * panel's own props: ten slots, and a three second interval that the phone
 * layout overrides to four.
 */
const SLOTS = 10;
const INTERVAL = 3;
const INTERVAL_PHONE = 4;
const PHONE_QUERY = "(max-width: 809.98px)";

/** Layout effect in the browser, plain effect on the server, so SSR stays quiet. */
const useMeasureEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ------------------------------------------------------------------ pieces */

function SourceRow({ source }: { source: Source }) {
  return (
    <div className="ig-row">
      <div className="ig-row-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ig-mark" src={source.mark} alt="" width={32} height={32} />
      </div>
      <div className="ig-row-body">
        <div className="ig-row-name">
          <p className="t-body" style={{ color: HEAD }}>
            {source.name}
          </p>
        </div>
        <div className="ig-row-info">
          <div className="ig-row-main">
            <p className="t-mono-s" style={{ color: ACCENT }}>
              {source.main}
            </p>
          </div>
          <div className="ig-row-dot" />
          <div className="ig-row-secondary">
            <p className="t-mono-s" style={{ color: DIM }}>
              {source.secondary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The feed. Ten slots are mounted at once, bottom anchored inside a clipped
 * box, and every interval the window advances by one source: each row keeps its
 * identity and slides up a slot, a fresh one enters at the bottom and the top
 * one leaves under the fade.
 *
 * The rows carry no transition of their own, so both the enter and the layout
 * shift run on the panel's own MotionConfig, which is the house tween: 0.4s on
 * [0.12, 0.23, 0.5, 1]. There is no exit.
 */
function Feed() {
  const [offset, setOffset] = useState(0);
  const [interval, setIntervalSeconds] = useState(INTERVAL);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const sync = () => setIntervalSeconds(mq.matches ? INTERVAL_PHONE : INTERVAL);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setOffset((v) => v + 1), interval * 1000);
    return () => window.clearInterval(id);
  }, [interval]);

  return (
    <div className="ig-feed">
      <AnimatePresence initial={false}>
        {Array.from({ length: SLOTS }, (_, slot) => {
          const key = offset + slot;
          const source = SOURCES[key % SOURCES.length];
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "0%" }}
              transition={TWEEN}
              style={{ width: "100%" }}
            >
              <SourceRow source={source} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ig-stat">
      <div className="ig-stat-v">
        <p className="t-mono-s" style={{ color: STAT }}>
          {value}
        </p>
      </div>
      <div className="ig-stat-l">
        <p className="t-mono-s" style={{ color: DIM }}>
          {label}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- section */

export function Integrations() {
  /* The page's one scroll-target effect, and it lives here. The marker is this
     section itself; the effect maps window scrollY across
     [sectionTop - 1 - viewportHeight, that + sectionHeight] onto x 120 -> 0,
     clamped. There is no chase spring on it: the transform follows the scroll
     one to one, so the panel is exactly where the scroll position says it is.
     The range is measured rather than hardcoded, because it moves with the
     viewport height and with every breakpoint. */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useMeasureEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      let top = 0;
      let n: HTMLElement | null = el;
      while (n) {
        top += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      const start = Math.max(top - 1 - window.innerHeight, 0);
      const end = Math.max(start + el.clientHeight, 0);
      setRange([start, end === start ? start + 1 : end]);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const panelX = useTransform(scrollY, range, [120, 0], { clamp: true });

  /* The one in-view style appear on the page: the visual column resets to
     opacity 0 and fades to 1 on the house spring the first time half of it is
     inside the viewport. Nothing else in the object differs from rest, so
     opacity is all that moves. */
  const visualRef = useRef<HTMLDivElement>(null);
  const visualShown = useInView(visualRef, { once: true, amount: 0.5 });

  return (
    <section id="integrations" className="ig-section" ref={sectionRef}>
      <div className="ig-container">
        <div className="ig-end-c">
          <ChromaticRule />
        </div>

        <div className="ig-context">
          <div className="ig-copy">
            <div className="ig-title">
              <h2 className="t-h2" style={{ color: HEAD }}>
                Connect your stack
              </h2>
            </div>
            <div className="ig-desc">
              <p className="t-body" style={{ color: MUTED }}>
                Monitoring, code, observability, cloud, CI/CD systems, messaging, and even homegrown
                tooling.
              </p>
            </div>
          </div>
          <div className="ig-link-c">
            <a className="ig-link" href="/integrations">
              <div className="ig-link-t">
                <p className="t-label">View integrations</p>
              </div>
              <button className="ig-circle" type="button" tabIndex={-1} aria-hidden="true">
                <Icon id="2903821725" size={14} color={ICON} strokeWidth={2} />
              </button>
            </a>
          </div>
        </div>

        <motion.div
          className="ig-visual"
          ref={visualRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: visualShown ? 1 : 0 }}
          transition={SPRING}
        >
          <div className="ig-panel-w">
            <motion.div className="ig-panel-c" style={{ x: panelX }}>
              <div className="ig-panel">
                <div className="ig-top">
                  <div className="ig-top-t">
                    <p className="t-nano" style={{ color: DIM }}>
                      Connected sources
                    </p>
                  </div>
                </div>

                <div className="ig-content">
                  <div className="ig-feed-c">
                    <Feed />
                  </div>
                  <div className="ig-grid">
                    {GRID_MARKS.map((mark, i) => (
                      <div className="ig-tile-c" key={i}>
                        <div className="ig-tile">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="ig-tile-mark"
                            src={mark}
                            alt=""
                            width={32}
                            height={32}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ig-bottom">
                  <div className="ig-stats">
                    <Stat value="41.2M" label="records indexed" />
                    <Stat value="0" label="errors" />
                  </div>
                  <div className="ig-spacer" />
                  <div className="ig-add">
                    <div className="ig-add-t">
                      {/* This is the only text node in the block that sets no
                          text colour of its own, so it takes its 12/16/500
                          preset's default, which is literally #666. */}
                      <p className="t-micro" style={{ color: "#666" }}>
                        Add integration
                      </p>
                    </div>
                    {/* Light / XS circular button: background only, on the
                        house spring, and the icon tint never moves. */}
                    <motion.a
                      className="ig-add-btn"
                      href="/integrations"
                      initial={false}
                      whileHover={{ backgroundColor: BTN_LIGHT_HOVER }}
                      whileTap={{ backgroundColor: BTN_LIGHT_PRESS }}
                      transition={SPRING}
                    >
                      <Icon id="3356954461" size={12} color={ICON} strokeWidth={2} />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{IG_CSS}</style>
    </section>
  );
}

/* -------------------------------------------------------------------- css */

const IG_CSS = `
.ig-section {
  position: relative;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  height: min-content;
  padding: 0 64px;
  overflow: clip;
}
.ig-container {
  position: relative;
  display: grid;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(5, minmax(135px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center;
  gap: 0;
  flex: none;
  width: 100%;
  max-width: 1400px;
  height: min-content;
  padding: 0;
  overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}

/* the chromatic hairline across the top edge; the rule itself carries its
   own box styles, this is only the sizing wrapper */
.ig-end-c {
  position: absolute;
  z-index: 1;
  flex: none;
  height: auto;
  top: 0;
  left: 0;
  right: 0;
}

/* left column */
.ig-context {
  position: relative;
  display: flex;
  flex-flow: column;
  flex: none;
  grid-column: span 2;
  place-content: flex-start center;
  place-self: center start;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  height: 100%;
  padding: 40px;
  overflow: clip;
}
.ig-copy {
  position: relative;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: flex-start center;
  align-items: flex-start;
  gap: 22px;
  width: 100%;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-title,
.ig-desc {
  position: relative;
  flex: none;
  width: 100%;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.ig-link-c {
  position: relative;
  flex: none;
  width: auto;
  height: auto;
}
.ig-link {
  position: relative;
  display: flex;
  flex-flow: row;
  place-content: center;
  align-items: center;
  gap: 12px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: clip;
  cursor: pointer;
  text-decoration: none;
}
.ig-link-t {
  position: relative;
  flex: none;
  width: auto;
  height: auto;
  white-space: pre;
  -webkit-user-select: none;
  user-select: none;
}
/* This is the one link whose label colour moves, and the one button on the
   page that is not on the house spring: label and circle change together over
   0.1s on the sine curve [0.44, 0, 0.56, 1]. The captured hover run measures
   537 to 635ms in and 2055 to 2156ms out, i.e. 0.1s both ways.
   Its hover and press circle colours are inverted relative to the standalone
   Light button: hover is the lighter grey, press the darker one. Transcribed
   as found, not normalised. */
.ig-link-t p {
  color: ${LINK_LABEL};
  transition: color 0.1s cubic-bezier(0.44, 0, 0.56, 1);
}
.ig-circle {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 4px;
  width: 26px;
  height: auto;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  overflow: clip;
  cursor: pointer;
  border-radius: 52px;
  background-color: ${CHIP_BG};
  transition: background-color 0.1s cubic-bezier(0.44, 0, 0.56, 1);
}
.ig-link:hover .ig-link-t p { color: ${LINK_LABEL_HOVER}; }
.ig-link:hover .ig-circle { background-color: ${LINK_CIRCLE_HOVER}; }
.ig-link:active .ig-link-t p { color: ${LINK_LABEL}; }
.ig-link:active .ig-circle { background-color: ${LINK_CIRCLE_PRESS}; }

/* right column */
.ig-visual {
  position: relative;
  display: flex;
  flex-flow: column;
  flex: none;
  grid-column: span 3;
  place-content: flex-start center;
  place-self: start;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  height: 723px;
  padding: 40px;
  overflow: clip;
  -webkit-mask-image: linear-gradient(270deg, rgba(0, 0, 0, 0) 12%, rgb(0, 0, 0) 61%);
  mask-image: linear-gradient(270deg, rgba(0, 0, 0, 0) 12%, rgb(0, 0, 0) 61%);
}
.ig-panel-w { width: 100%; }
.ig-panel-c {
  position: relative;
  flex: none;
  width: 642px;
  height: 474px;
}
.ig-panel {
  position: relative;
  display: flex;
  flex-flow: column;
  place-content: center;
  align-items: center;
  gap: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: clip;
  border-radius: 16px;
  background-color: ${PANEL_BG};
  box-shadow: inset 0 0 0 1px ${LINE};
}
.ig-top {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: min-content;
  padding: 16px 20px;
  overflow: clip;
  box-shadow: inset 0 -1px 0 0 ${LINE};
}
.ig-top-t {
  position: relative;
  flex: 1 0 0;
  width: 1px;
  height: auto;
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}
.ig-content {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: 1 0 0;
  place-content: flex-start center;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  height: 1px;
  padding: 0;
  overflow: clip;
}

/* the feed */
.ig-feed-c {
  position: relative;
  flex: 1 0 0;
  width: 1px;
  height: 100%;
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 22.0721%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 22.0721%);
}
.ig-feed {
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 100%;
  height: 100%;
  overflow: clip;
}
.ig-row {
  position: relative;
  display: flex;
  flex-flow: row;
  place-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: min-content;
  padding: 16px;
  overflow: clip;
  background-color: ${PANEL_BG};
  box-shadow: inset 0 1px 0 0 ${LINE};
}
.ig-row-mark {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 40px;
  height: 40px;
  padding: 0;
  overflow: visible;
}
.ig-mark {
  position: relative;
  display: block;
  flex: none;
  width: 32px;
  height: 32px;
  aspect-ratio: 1;
  -webkit-user-select: none;
  user-select: none;
}
.ig-row-body {
  position: relative;
  display: flex;
  flex-flow: column;
  flex: 1 0 0;
  place-content: flex-start center;
  align-items: flex-start;
  gap: 0;
  width: 1px;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-row-name,
.ig-row-main,
.ig-row-secondary {
  position: relative;
  flex: none;
  width: auto;
  height: auto;
  white-space: pre;
}
.ig-row-info {
  position: relative;
  display: flex;
  flex-flow: wrap;
  flex: none;
  place-content: center flex-start;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-row-dot {
  position: relative;
  flex: none;
  width: 4px;
  height: 4px;
  overflow: clip;
  border-radius: 96px;
  background-color: ${DIM};
}

/* the wall of marks */
.ig-grid {
  position: relative;
  display: grid;
  flex: none;
  grid-template-rows: repeat(4, 90px);
  grid-template-columns: repeat(3, 90px);
  grid-auto-rows: 90px;
  justify-content: center;
  gap: 8px;
  width: min-content;
  height: min-content;
  padding: 20px;
  overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE};
}
.ig-tile-c {
  position: relative;
  flex: none;
  place-self: start;
  width: 100%;
  height: 100%;
}
.ig-tile {
  position: relative;
  display: flex;
  flex-flow: row;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: clip;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px ${LINE};
}
.ig-tile-mark {
  position: relative;
  display: block;
  flex: none;
  width: 32px;
  height: 32px;
  filter: grayscale(1);
  opacity: 0.5;
  -webkit-user-select: none;
  user-select: none;
}

/* the footer strip */
.ig-bottom {
  position: relative;
  display: flex;
  flex-flow: wrap;
  flex: none;
  place-content: center flex-start;
  align-items: center;
  gap: 8px 0;
  width: 100%;
  height: min-content;
  padding: 12px 20px;
  overflow: clip;
  box-shadow: inset 0 1px 0 0 ${LINE};
}
.ig-stats {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 18px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-stat {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-stat-v,
.ig-stat-l,
.ig-add-t {
  position: relative;
  flex: none;
  width: auto;
  height: auto;
  white-space: pre;
}
.ig-spacer {
  position: relative;
  flex: 1 0 0;
  min-width: 24px;
  width: 1px;
  height: 18px;
  overflow: clip;
}
.ig-add {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 12px;
  width: min-content;
  height: min-content;
  padding: 0;
  overflow: clip;
}
.ig-add-btn {
  position: relative;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 4px;
  width: 20px;
  height: 20px;
  padding: 0;
  overflow: clip;
  cursor: pointer;
  text-decoration: none;
  border-radius: 52px;
  background-color: ${CHIP_BG};
}

@media (max-width: 1199.98px) {
  .ig-section { padding: 0; }
  .ig-container { box-shadow: none; }
  .ig-visual { height: min-content; }
}

@media (max-width: 809.98px) {
  .ig-container {
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: center;
  }
  .ig-end-c { order: 0; }
  .ig-context {
    align-self: unset;
    order: 2;
    height: min-content;
    padding: 40px 20px;
  }
  .ig-visual {
    -webkit-mask-image: none;
    mask-image: none;
    align-self: unset;
    order: 1;
    height: min-content;
    padding: 32px 16px 16px;
  }
  .ig-panel-c { width: 100%; height: 360px; }
  .ig-top,
  .ig-bottom { padding: 12px 16px; }
  .ig-grid,
  .ig-spacer,
  .ig-add { display: none; }
}
`;
