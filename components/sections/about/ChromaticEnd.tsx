"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { CSSProperties } from "react";
import { EASE } from "@/lib/motion";

/**
 * The 1px chromatic rule that closes the partner ticker. Six bars, three per
 * half, grown outward from the centre. The g and r bars screen-blend over the
 * b bar so the three primaries land on one neutral hairline once they meet.
 *
 * Motion spec section D: plain in-view observer on the element itself,
 * `amount: 1` (the whole 1px box must be on screen), `once: true`, six tweens
 * of 0.4s on EASE with mirrored 0 / 0.02 / 0.04 delays.
 */

const HALF: CSSProperties = {
  height: 1,
  overflow: "clip",
  flex: "1 0 0",
  width: 1,
  position: "relative",
  opacity: 1,
};

const BAR: CSSProperties = {
  zIndex: 1,
  flex: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  overflow: "visible",
};

const T = (delay: number) =>
  ({ type: "tween", duration: 0.4, ease: EASE, delay }) as const;

type BarSpec = { from: string; to: string; delay: number; blend: boolean };

const LEFT: BarSpec[] = [
  { from: "rgb(0, 0, 255)", to: "rgb(0, 0, 36)", delay: 0.04, blend: false },
  { from: "rgb(0, 255, 0)", to: "rgb(0, 37, 0)", delay: 0.02, blend: true },
  { from: "rgb(255, 0, 0)", to: "rgb(41, 0, 0)", delay: 0, blend: true },
];

const RIGHT: BarSpec[] = [
  { from: "rgb(0, 0, 255)", to: "rgb(0, 0, 36)", delay: 0, blend: false },
  { from: "rgb(0, 255, 0)", to: "rgb(0, 37, 0)", delay: 0.02, blend: true },
  { from: "rgb(255, 0, 0)", to: "rgb(41, 0, 0)", delay: 0.04, blend: true },
];

function Half({ bars, side }: { bars: BarSpec[]; side: "left" | "right" }) {
  return (
    <div style={HALF}>
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ width: "0%", backgroundColor: b.from }}
          animate={{ width: "100%", backgroundColor: b.to }}
          transition={T(b.delay)}
          style={{
            ...BAR,
            [side === "left" ? "right" : "left"]: 0,
            mixBlendMode: b.blend ? "screen" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function ChromaticEnd({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        flex: "none",
        width: "100%",
        height: "auto",
      }}
    >
      <div
        style={{
          height: "min-content",
          overflow: "clip",
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          padding: 0,
          position: "relative",
          opacity: 1,
        }}
      >
        {inView ? (
          <>
            <Half bars={LEFT} side="left" />
            <Half bars={RIGHT} side="right" />
          </>
        ) : (
          <>
            <div style={HALF} />
            <div style={HALF} />
          </>
        )}
      </div>
    </div>
  );
}
