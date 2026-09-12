"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import { Border, DotPattern, T } from "./ui";
import { QueryVisual, RelationshipVisual, SourcesVisual } from "./visuals";

/** How long one entry holds before the next takes over, in seconds. */
const INTERVAL = 8;

const ENTRIES = [
  {
    title: "Connect your stack",
    description:
      "Plug in 240+ tools in minutes. Cortex ingests every source and starts mapping immediately.",
  },
  {
    title: "Map relationships automatically",
    description:
      "Cortex finds connections across your data you didn't know existed. No manual schema work required.",
  },
  {
    title: "Query everything, instantly",
    description:
      "Once mapped, every relationship in your graph is queryable in plain language through Ask.",
  },
] as const;

const VISUALS = [SourcesVisual, RelationshipVisual, QueryVisual];

/** The panel swap: a short blurred scale-in, a shorter blurred scale-out. */
const SWAP = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(8px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.1,
      ease: "easeOut" as const,
      filter: { duration: 0.3, ease: "easeOut" as const },
      scale: { duration: 0.3, ease: "easeOut" as const },
    },
  },
};

const CSS = `
.cx-acc {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.cx-acc-frame {
  --cx-bt: 0px; --cx-br: 1px; --cx-bb: 0px; --cx-bl: 1px;
  --cx-bc: ${T.line};
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
}
.cx-acc-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.cx-acc-left {
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 80px 40px; gap: 96px;
}
.cx-acc-title { margin: 0; font-family: var(--font-body); font-weight: 600;
  font-size: 36px; line-height: 40px; letter-spacing: 0.1px; text-align: left; }
.cx-acc-list { display: flex; flex-direction: column; gap: 32px; }
.cx-acc-item { display: flex; flex-direction: column; gap: 8px; position: relative; overflow: clip; }
.cx-acc-entry-title { margin: 0; font-family: var(--font-body); font-weight: 600;
  font-size: 18px; line-height: 24px; letter-spacing: 0.1px; text-align: left; color: ${T.bright}; }
.cx-acc-entry-body { margin: 0; font-family: var(--font-body); font-weight: 400;
  font-size: 14px; line-height: 20px; letter-spacing: 0.1px; text-align: left; color: ${T.muted}; }
.cx-acc-right { display: block; padding: 60px 40px; align-items: center; width: 100%; }
.cx-acc-stage { position: relative; width: 100%; height: 520px; }
.cx-acc-phone { display: none; flex-direction: column; gap: 16px; }
@media (min-width: 810px) and (max-width: 1199.98px) {
  .cx-acc { padding: 0; }
  .cx-acc-frame { --cx-bt: unset; --cx-br: unset; --cx-bb: unset; --cx-bl: unset; }
  .cx-acc-left { padding: 80px 32px; }
  .cx-acc-right { padding: 60px 32px; }
}
@media (max-width: 809.98px) {
  .cx-acc { padding: 0; }
  .cx-acc-frame { --cx-bt: unset; --cx-br: unset; --cx-bb: unset; --cx-bl: unset; }
  .cx-acc-grid { display: flex; flex-direction: column; }
  .cx-acc-left { padding: 40px 20px; gap: 40px; justify-content: flex-start; }
  .cx-acc-list { display: none; }
  .cx-acc-right { display: none; }
  .cx-acc-phone { display: flex; }
}
`;

/**
 * The bar under an entry. It fills left to right over the interval for the
 * open entry, sits full for entries already shown and empty for the rest.
 */
function Timer({
  index,
  current,
  progress,
  weight = 2,
  style,
}: {
  index: number;
  current: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  weight?: number;
  style?: React.CSSProperties;
}) {
  const offset = useTransform(progress, (p) => p + current - index);
  const x = useSpring(useTransform(offset, [0, 1], ["-103%", "0%"]), {
    stiffness: 500,
    damping: 40,
    mass: 1,
  });
  return (
    <div style={style}>
      <div style={{ backgroundColor: T.timerBg, overflow: "hidden", height: weight }}>
        <motion.div style={{ backgroundColor: T.timerFill, height: "100%", x }} />
      </div>
    </div>
  );
}

export function CortexAccordion() {
  const [index, setIndex] = useState(0);
  const progress = useMotionValue(0);
  const run = useRef<AnimationPlaybackControls | null>(null);
  const active = ((index % ENTRIES.length) + ENTRIES.length) % ENTRIES.length;

  useEffect(() => {
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: INTERVAL,
      ease: "linear",
      onComplete: () => setIndex((i) => i + 1),
    });
    run.current = controls;
    return () => controls.stop();
  }, [index, progress]);

  const Visual = VISUALS[active];

  return (
    <>
      <style>{CSS}</style>
      <div className="cx-acc" data-cx-block="accordion">
        <div className="cx-acc-frame">
          <Border />
          <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
            <div className="cx-acc-grid">
              <div className="cx-acc-left">
                <p className="cx-acc-title">
                  <span style={{ color: T.muted }}>Every relationship in your stack, </span>
                  <span style={{ color: T.bright }}>mapped and queryable.</span>
                </p>

                <div className="cx-acc-phone">
                  <div style={{ position: "relative", width: "100%", height: 500 }}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={active}
                        variants={SWAP}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        style={{ height: "100%", width: "100%", zIndex: 2, position: "absolute" }}
                      >
                        <div
                          style={{
                            pointerEvents: "none",
                            userSelect: "none",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px 12px",
                          }}
                        >
                          <Visual />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                      <DotPattern id="cx-dots-acc-phone" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {ENTRIES.map((e, i) => (
                      <Timer
                        key={e.title}
                        index={i}
                        current={active}
                        progress={progress}
                        style={{ flex: 1, padding: "16px 0px" }}
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={index}
                      variants={SWAP}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        position: "relative",
                        overflow: "clip",
                      }}
                    >
                      <p className="cx-acc-entry-title">{ENTRIES[active].title}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <p className="cx-acc-entry-body">{ENTRIES[active].description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="cx-acc-list">
                  {ENTRIES.map((e, i) => {
                    const open = i === active;
                    return (
                      <motion.div
                        key={e.title}
                        className="cx-acc-item"
                        initial={false}
                        animate={{ height: open ? "auto" : 24 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p
                          className="cx-acc-entry-title"
                          onClick={() => setIndex(i)}
                          style={{ cursor: open ? "auto" : "pointer" }}
                        >
                          {e.title}
                        </p>
                        <motion.div
                          style={{ display: "flex", flexDirection: "column", gap: 20 }}
                          animate={{ opacity: open ? 1 : 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          <p className="cx-acc-entry-body">{e.description}</p>
                          <Timer index={i} current={active} progress={progress} />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="cx-acc-right">
                <div className="cx-acc-stage">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      variants={SWAP}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      style={{ width: "100%", height: "100%", zIndex: 2, position: "relative" }}
                    >
                      <div
                        style={{
                          pointerEvents: "none",
                          userSelect: "none",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "0px 12px",
                        }}
                      >
                        <Visual />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                    <DotPattern id="cx-dots-acc" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
