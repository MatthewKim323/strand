"use client";

import { useRef } from "react";
import { motion, useInView, type Transition } from "motion/react";

/**
 * The 1px rule that closes a block. Three additively blended channel bars per
 * half grow out from the centre, decaying from pure primaries to the near-black
 * values that sum to the page's hairline colour.
 *
 * Each bar runs 0.4s on the house ease with a 0 / 0.02 / 0.04s stagger,
 * mirrored between the halves, so blue trails on the left and red trails on the
 * right. Triggered by a plain in-view observer on the rule itself, threshold 1
 * and animate-once, so it plays exactly once per page load.
 *
 * Self contained (no external class names) because this route owns only the
 * `ak-` prefix and the rule appears in three of its blocks.
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
    <div
      style={{
        position: "relative",
        flex: "1 0 0",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      {CHANNELS.map((c, i) => (
        <motion.div
          key={c.key}
          style={{
            position: "absolute",
            zIndex: 1,
            flex: "none",
            top: 0,
            bottom: 0,
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

export function AkEndRule() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 1 });

  return (
    <div style={{ position: "relative", flex: "none", width: "100%", height: "auto" }}>
      <div
        ref={ref}
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "row nowrap",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          height: "min-content",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Half side="left" shown={shown} />
        <Half side="right" shown={shown} />
      </div>
    </div>
  );
}
