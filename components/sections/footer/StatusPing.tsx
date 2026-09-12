"use client";

import { motion } from "motion/react";

/**
 * The uptime dot in the footer pill, and the page's only status ping outside
 * the feature cards.
 *
 * The source component is passed size 6, pingSize 16, pingWeight 2 and
 * repeatDelay 1, which resolve to a ring that starts at
 * max(size - 2 * weight, 1) = 2px and ends at 2 + 16 = 18px. The ring is a 2px
 * outline drawn outside the animated box, so it keeps its weight while the box
 * grows. 0.3s expand-and-fade on cubic-bezier(0.44, 0, 0.56, 1), then 1s idle,
 * forever.
 */
const TINT = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";

export function StatusPing() {
  return (
    <div
      style={{
        position: "relative",
        width: 6,
        height: 6,
        borderRadius: 9999,
        backgroundColor: TINT,
      }}
    >
      <motion.div
        initial={{ width: 2, height: 2, opacity: 1 }}
        animate={{ width: 18, height: 18, opacity: 0 }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: [0.44, 0, 0.56, 1],
          delay: 0,
          repeat: Infinity,
          repeatDelay: 1,
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          borderRadius: 9999,
          outline: `2px solid ${TINT}`,
        }}
      />
    </div>
  );
}
