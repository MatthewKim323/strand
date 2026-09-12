"use client";

import { useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type RefObject } from "react";

export type SpringCfg = { damping: number; stiffness: number; mass?: number };

/**
 * Scroll-progress-linked reveal, the way the page does it: progress across
 * ['start end','end end'] drives each property from its `from` value to its
 * rest value, chased by a spring. Reversible, replays on every pass. This is
 * NOT whileInView and must never be replaced with it.
 *
 * Call `map` at the top level of the component, once per property, so the
 * hooks inside it keep a stable order.
 */
export function useScrollFx<T extends HTMLElement = HTMLDivElement>(
  cfg: SpringCfg = { damping: 60, stiffness: 500, mass: 1 },
): {
  ref: RefObject<T | null>;
  progress: MotionValue<number>;
  map: (from: number, to: number) => MotionValue<number>;
} {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const map = (from: number, to: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSpring(useTransform(scrollYProgress, [0, 1], [from, to]), cfg);
  return { ref, progress: scrollYProgress, map };
}

/**
 * Scroll position mapped through a fixed input range of window scrollY, which
 * is what the page's one "scroll target" effect uses (a marker element's top
 * and height define the range).
 */
export function useScrollTargetFx(
  inputRange: [number, number],
  outputRange: [number, number],
  cfg: SpringCfg = { damping: 60, stiffness: 500, mass: 1 },
) {
  const { scrollY } = useScroll();
  return useSpring(useTransform(scrollY, inputRange, outputRange, { clamp: true }), cfg);
}
