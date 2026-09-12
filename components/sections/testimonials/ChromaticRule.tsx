"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView, type Transition } from "motion/react";

/**
 * The 1px chromatic rule. Three additively blended channel bars per half grow
 * out from the centre and decay from pure primaries to the near-black values
 * that sum to the hairline colour.
 *
 * Motion, verbatim from the component's variant map: it is a variant switch on
 * scroll, not a scroll-progress link. A plain in-view observer with
 * `threshold: 1` (the whole 1px element inside the viewport) and
 * `animateOnce: true` flips it from the "Start" variant (`width: 0%`, pure
 * primaries) to the "End" variant (`width: 100%`, the decayed values), once per
 * page load. Every bar is 0.4s on the house ease with a 0 / 0.02 / 0.04s delay,
 * mirrored between the halves: blue is slowest on the left, red on the right,
 * which is what splits the two halves chromatically as they grow outward.
 *
 * Four sections mount this: Partners, Integrations, Testimonials and
 * Statistics. It carries its own box styles inline so it renders correctly
 * wherever it is dropped; the caller only supplies the sizing wrapper.
 */
const BAR: Transition = { type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1] };
const T_0: Transition = { ...BAR, delay: 0 };
const T_02: Transition = { ...BAR, delay: 0.02 };
const T_04: Transition = { ...BAR, delay: 0.04 };

type Channel = { key: string; from: string; to: string; blend: boolean };

const CHANNELS: Channel[] = [
  { key: "b", from: "rgb(0, 0, 255)", to: "rgb(0, 0, 36)", blend: false },
  { key: "g", from: "rgb(0, 255, 0)", to: "rgb(0, 37, 0)", blend: true },
  { key: "r", from: "rgb(255, 0, 0)", to: "rgb(41, 0, 0)", blend: true },
];

const LEFT_DELAYS: Transition[] = [T_04, T_02, T_0];
const RIGHT_DELAYS: Transition[] = [T_0, T_02, T_04];

const ROOT: CSSProperties = {
  position: "relative",
  display: "flex",
  flexFlow: "row nowrap",
  placeContent: "center",
  alignItems: "center",
  gap: 0,
  width: "100%",
  height: "min-content",
  padding: 0,
  overflow: "clip",
};

const HALF: CSSProperties = {
  position: "relative",
  flex: "1 0 0",
  width: 1,
  height: 1,
  overflow: "clip",
};

const BAR_BOX: CSSProperties = {
  position: "absolute",
  zIndex: 1,
  flex: "none",
  top: 0,
  bottom: 0,
  overflow: "visible",
};

function Half({ side, shown }: { side: "left" | "right"; shown: boolean }) {
  const delays = side === "left" ? LEFT_DELAYS : RIGHT_DELAYS;
  return (
    <div className="tm-rule-half" style={HALF}>
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c.key}
          className="tm-rule-bar"
          style={{
            ...BAR_BOX,
            [side === "left" ? "right" : "left"]: 0,
            mixBlendMode: c.blend ? "screen" : "normal",
          }}
          initial={{ width: "0%", backgroundColor: c.from }}
          animate={shown ? { width: "100%", backgroundColor: c.to } : { width: "0%", backgroundColor: c.from }}
          transition={delays[i]}
        />
      ))}
    </div>
  );
}

export function ChromaticRule({ className, style }: { className?: string; style?: CSSProperties } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  /* threshold 1 + animateOnce: the whole hairline has to be inside the
     viewport, and once it has fired it never flips back. */
  const shown = useInView(ref, { once: true, amount: 1 });

  return (
    <div className={className ? `tm-rule ${className}` : "tm-rule"} style={{ ...ROOT, ...style }} ref={ref}>
      <Half side="left" shown={shown} />
      <Half side="right" shown={shown} />
    </div>
  );
}
