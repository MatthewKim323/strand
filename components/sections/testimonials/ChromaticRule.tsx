"use client";

import { useRef } from "react";
import { motion, useInView, type Transition } from "motion/react";

/**
 * The 1px rule that closes the section. Three additively blended channel bars
 * per half grow out from the centre and decay from pure primaries to the
 * near-black values that sum to the hairline colour.
 *
 * Every value here is the component's own: each bar is 0.4s on the house ease
 * with a 0 / 0.02 / 0.04s stagger, mirrored between the two halves, and it
 * plays once, when the rule is fully in view.
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
    <div className="tm-rule-half">
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c.key}
          className="tm-rule-bar"
          style={{
            [side === "left" ? "right" : "left"]: 0,
            mixBlendMode: c.blend ? "screen" : "normal",
          }}
          initial={{ width: "0%", backgroundColor: c.from }}
          animate={shown ? { width: "100%", backgroundColor: c.to } : undefined}
          transition={delays[i]}
        />
      ))}
    </div>
  );
}

export function ChromaticRule() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: "all" });

  return (
    <div className="tm-rule" ref={ref}>
      <Half side="left" shown={shown} />
      <Half side="right" shown={shown} />
    </div>
  );
}
