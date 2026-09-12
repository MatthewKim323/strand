"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { SPRING } from "@/lib/motion";

/**
 * The 1px rule between bento rows. Two halves, each stacking three additive
 * colour bars that grow out from the centre the first time the rule is fully
 * on screen, then stay. The bars are near-black and screen-blended, so the
 * line reads as a faint prism at the middle and plain grey at the ends.
 */
const BARS = [
  { color: "rgb(0, 0, 36)", blend: undefined },
  { color: "rgb(0, 37, 0)", blend: "screen" as const },
  { color: "rgb(41, 0, 0)", blend: "screen" as const },
];

function Half({ side, shown }: { side: "left" | "right"; shown: boolean }) {
  return (
    <div style={{ position: "relative", flex: "1 0 0", width: 1, height: 1, overflow: "hidden" }}>
      {BARS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [side === "left" ? "right" : "left"]: 0,
            zIndex: 1,
            flex: "none",
            backgroundColor: b.color,
            mixBlendMode: b.blend,
          }}
          initial={{ width: "0%" }}
          animate={{ width: shown ? "100%" : "0%" }}
          // TODO(spec): the variant transition is not in the ripped constants;
          // the house spring is used until it is.
          transition={SPRING}
        />
      ))}
    </div>
  );
}

export function EndDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { amount: 1, once: true });
  return (
    <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
      <div
        ref={ref}
        style={{
          position: "relative",
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
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
