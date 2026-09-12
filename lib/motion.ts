import type { Transition } from "motion/react";

/**
 * The page's two house transitions. Everything animated on the page uses one of
 * these unless the motion spec says otherwise for a specific element.
 */
export const EASE: [number, number, number, number] = [0.12, 0.23, 0.5, 1];

export const TWEEN: Transition = { type: "tween", duration: 0.4, ease: EASE };
export const TWEEN_FAST: Transition = { type: "tween", duration: 0.2, ease: EASE };
export const TWEEN_XFAST: Transition = { type: "tween", duration: 0.1, ease: EASE };
export const TWEEN_MED: Transition = { type: "tween", duration: 0.3, ease: EASE };
export const SPRING: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };

export const tween = (duration: number, delay = 0): Transition => ({
  type: "tween",
  duration,
  delay,
  ease: EASE,
});

export const spring = (delay = 0): Transition => ({ type: "spring", bounce: 0.2, duration: 0.4, delay });

/** The initial opacity the page uses for mount animations. Not 0: 0.001. */
export const HIDDEN = 0.001;
