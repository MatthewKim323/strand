"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode, CSSProperties } from "react";
import { HIDDEN, tween } from "./motion";

type AppearProps = {
  children: ReactNode;
  /** vertical offset the element starts at, in px */
  y?: number;
  x?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "li" | "section" | "header" | "footer";
};

/**
 * An on-mount reveal. The page animates these the moment the document is ready,
 * not when they scroll into view, so this deliberately does not use whileInView.
 */
export function Appear({
  children,
  y = 0,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.4,
  transition,
  className,
  style,
  as = "div",
}: AppearProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: HIDDEN, y, x, scale }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={transition ?? tween(duration, delay)}
    >
      {children}
    </Tag>
  );
}
