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

/**
 * Colours are the source tokens, copied verbatim so they resolve out of the one
 * token map rather than out of an inlined fallback. Only `backgroundColor`
 * animates (plus `--border-color` on Secondary); nothing scales, translates,
 * shadows or changes radius, and no label or icon colour ever moves.
 */
const T = {
  primaryBg: "var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))",
  primaryHover: "var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))",
  primaryPress: "var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))",
  primaryLabel: "var(--token-52462940-c15c-4103-9816-370bb3c11bfa, rgb(23, 23, 23))",

  secondaryBg: "var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))",
  secondaryLine: "var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(34, 34, 34))",
  secondaryHover: "var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))",
  secondaryHoverLine: "var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))",
  secondaryPress: "var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))",
  secondaryLabel: "var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))",

  ghostHover: "var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))",
  ghostPress: "var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))",
  ghostLabel: "var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))",

  lightBg: "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))",
  lightHover: "var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))",
  lightPress: "var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))",
  lightLabel: "var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))",
} as const;

const PALETTE: Record<ButtonVariant, Palette> = {
  primary: {
    bg: T.primaryBg,
    color: T.primaryLabel,
    hover: { backgroundColor: T.primaryHover },
    press: { backgroundColor: T.primaryPress },
  },
  secondary: {
    bg: T.secondaryBg,
    color: T.secondaryLabel,
    border: T.secondaryLine,
    hover: { backgroundColor: T.secondaryHover, "--bd-c": T.secondaryHoverLine },
    // The pressed map does not restate the border colour, so the press reverts
    // it to rest. Written out because a bare press map would inherit the hover
    // colour instead.
    press: { backgroundColor: T.secondaryPress, "--bd-c": T.secondaryLine },
  },
  ghost: {
    bg: "rgba(0, 0, 0, 0)",
    color: T.ghostLabel,
    hover: { backgroundColor: T.ghostHover },
    press: { backgroundColor: T.ghostPress },
  },
  light: {
    bg: T.lightBg,
    color: T.lightLabel,
    hover: { backgroundColor: T.lightHover },
    press: { backgroundColor: T.lightPress },
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
