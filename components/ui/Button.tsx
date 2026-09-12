"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { SPRING } from "@/lib/motion";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light";
export type ButtonSize = "xl" | "lg" | "md";

type Palette = {
  bg: string;
  color: string;
  border?: string;
  hover: { backgroundColor: string; "--bd-c"?: string };
  press: { backgroundColor: string; "--bd-c"?: string };
};

const PALETTE: Record<ButtonVariant, Palette> = {
  primary: {
    bg: "#f5f5f4",
    color: "#1c1917",
    hover: { backgroundColor: "#d6d3d1" },
    press: { backgroundColor: "#a6a09b" },
  },
  secondary: {
    bg: "#1c1917",
    color: "#f5f5f4",
    border: "#292524",
    hover: { backgroundColor: "#292524", "--bd-c": "#44403b" },
    press: { backgroundColor: "#44403b", "--bd-c": "#292524" },
  },
  ghost: {
    bg: "rgba(0, 0, 0, 0)",
    color: "#f5f5f4",
    hover: { backgroundColor: "#292524" },
    press: { backgroundColor: "#44403c" },
  },
  light: {
    bg: "#1c1917",
    color: "#f5f5f4",
    border: "#292524",
    hover: { backgroundColor: "#292524", "--bd-c": "#44403b" },
    press: { backgroundColor: "#44403b", "--bd-c": "#292524" },
  },
};

/** Outer padding per size. The label block adds its own 0 6px. */
const PAD: Record<ButtonSize, number> = { xl: 10, lg: 8, md: 6 };

export type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** rendered after the label, inside the same label row */
  icon?: ReactNode;
  /** rendered before the label */
  leading?: ReactNode;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  type?: "button" | "submit";
};

/**
 * The page's one button. Twelve variants in the source (four looks x three
 * sizes); everything differs only in padding and colour. The border is drawn
 * as an inset shadow, never a real border, so it never grows the box.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "xl",
  icon,
  leading,
  height = 40,
  className,
  style,
  onClick,
  type = "button",
}: ButtonProps) {
  const p = PALETTE[variant];
  const base: CSSProperties = {
    ["--bd-c" as string]: p.border ?? "rgba(0, 0, 0, 0)",
    cursor: "pointer",
    height,
    overflow: "hidden",
    display: "flex",
    flexFlow: "row",
    placeContent: "center",
    alignItems: "center",
    gap: 4,
    width: "min-content",
    padding: PAD[size],
    textDecoration: "none",
    position: "relative",
    borderRadius: 8,
    backgroundColor: p.bg,
    color: p.color,
    boxShadow: p.border ? "inset 0 0 0 1px var(--bd-c)" : undefined,
    ...style,
  };

  const inner = (
    <>
      <span
        style={{
          display: "flex",
          flexFlow: "row",
          flex: "none",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: "min-content",
          height: "min-content",
          padding: "0 6px",
          position: "relative",
        }}
      >
        {leading}
        <span
          className="t-label"
          style={{ userSelect: "none", whiteSpace: "pre", flex: "none", color: p.color }}
        >
          {children}
        </span>
      </span>
      {icon}
    </>
  );

  const motionProps = {
    style: base,
    className,
    whileHover: p.hover,
    whileTap: p.press,
    transition: SPRING,
  } as const;

  if (href) {
    return (
      <motion.a {...motionProps} href={href} onClick={onClick} data-reset="button">
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button {...motionProps} type={type} onClick={onClick} data-reset="button">
      {inner}
    </motion.button>
  );
}

/** Same component but routed through next/link, for internal hrefs. */
export function ButtonLink(props: ButtonProps & { href: string }) {
  const { href, ...rest } = props;
  return (
    <Link href={href} style={{ display: "contents" }}>
      <Button {...rest} />
    </Link>
  );
}
