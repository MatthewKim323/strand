"use client";

import { useRef } from "react";
import { motion, useInView, type Transition } from "motion/react";

/**
 * The 1px rule that closes the section. Three additively blended channel bars
 * per half grow out from the centre, decaying from pure primaries to the
 * near-black values that sum to the page's hairline colour.
 *
 * Values are the component's own: each bar 0.4s on the house ease with a
 * 0 / 0.02 / 0.04s stagger, mirrored between the halves, so blue trails on the
 * left and red trails on the right. The root declares a 0.6s transition on
 * cubic-bezier(0.44, 0, 0.56, 1) but nothing on the root or the two halves
 * animates, so it never applies.
 *
 * Trigger: a plain in-view observer on the rule itself, threshold 1 (the whole
 * 1px-tall element inside the viewport) and animate-once, so it plays exactly
 * once per page load. It is not scroll-progress linked and it never flips back.
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

function Half({ side, shown }: { side: "left" | "right"; shown: boolean }) {
  const delays = side === "left" ? LEFT_DELAYS : RIGHT_DELAYS;
  return (
    <div className="sx-cb-half">
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c.key}
          className="sx-cb-bar"
          style={{
            [side === "left" ? "right" : "left"]: 0,
            mixBlendMode: c.blend ? "screen" : "normal",
          }}
          initial={{ width: "0%", backgroundColor: c.from }}
          animate={
            shown
              ? { width: "100%", backgroundColor: c.to }
              : { width: "0%", backgroundColor: c.from }
          }
          transition={delays[i]}
        />
      ))}
    </div>
  );
}

export function ChromaticBorder() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 1 });

  return (
    <div className="sx-cb" ref={ref}>
      <Half side="left" shown={shown} />
      <Half side="right" shown={shown} />
    </div>
  );
}
