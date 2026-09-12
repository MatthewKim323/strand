"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Sprite";
import { TWEEN_XFAST } from "@/lib/motion";
import type { LinkItem, ProductItem, RowItem } from "./data";

/**
 * The three row shapes the menus are built from. All three animate
 * `backgroundColor` and nothing else: transparent at rest, rgb(41,37,36) on
 * hover, rgb(28,25,23) while pressed, 8px radius, and a 0.1s tween on the house
 * curve. No icon tint change, no text colour change, no offset, no scale.
 */

const REST = "rgba(0, 0, 0, 0)";
const HOVER = { backgroundColor: "var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))" };
const PRESS = { backgroundColor: "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))" };

const linkBase: CSSProperties = {
  cursor: "pointer",
  position: "relative",
  textDecoration: "none",
  backgroundColor: REST,
  borderRadius: 8,
};

/** `X`: the close glyph on the tablet / phone bar. Not in the sprite sheet. */
export function CloseGlyph({ size = 24, color, strokeWidth = 2 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="presentation"
      style={{ display: "block", width: size, height: size, aspectRatio: 1 }}
    >
      <path d="M 12 0 L 0 12" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} stroke={color ?? "currentColor"} transform="translate(6 6)" />
      <path d="M 0 0 L 12 12" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} stroke={color ?? "currentColor"} transform="translate(6 6)" />
    </svg>
  );
}

/**
 * Product card. Vertical in the desktop "Features" panel, horizontal in the
 * tablet / phone menu; only the flex direction and the content fill change.
 */
export function ProductCard({ item, horizontal = false, onNavigate }: { item: ProductItem; horizontal?: boolean; onNavigate?: () => void }) {
  return (
    <motion.a
      href={item.href}
      onClick={onNavigate}
      whileHover={HOVER}
      whileTap={PRESS}
      transition={TWEEN_XFAST}
      style={{
        ...linkBase,
        display: "flex",
        flexFlow: horizontal ? "row" : "column",
        alignItems: horizontal ? "center" : "flex-start",
        placeContent: "flex-start",
        gap: 12,
        width: "100%",
        height: "min-content",
        padding: 12,
        overflow: "hidden",
      }}
    >
      <Icon id={item.icon} size={40} viewBox="0 0 32 32" style={{ flex: "none", width: 40, height: 40 }} />
      <span
        style={{
          display: "flex",
          flexFlow: "column",
          flex: horizontal ? "1 0 0" : "none",
          width: horizontal ? 1 : "100%",
          alignItems: "center",
          placeContent: "center",
          gap: 4,
          height: "min-content",
          overflow: "hidden",
        }}
      >
        <span
          className="t-label"
          style={{ width: "100%", color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))", wordBreak: "break-word" }}
        >
          {item.label}
        </span>
        <span
          className="t-xs"
          style={{ width: "100%", color: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(166, 160, 155))", wordBreak: "break-word" }}
        >
          {item.description}
        </span>
      </span>
    </motion.a>
  );
}

/** Icon + title + blurb row, used by the "SUPPORT" column in both menus. */
export function MenuRow({ item, onNavigate }: { item: RowItem; onNavigate?: () => void }) {
  return (
    <motion.a
      {...(item.href ? { href: item.href } : {})}
      onClick={onNavigate}
      whileHover={{ backgroundColor: "var(--token-efb6b80c-ff66-4fd5-b06e-7af1e4433402, rgb(41, 37, 36))" }}
      whileTap={PRESS}
      transition={TWEEN_XFAST}
      style={{
        ...linkBase,
        display: "flex",
        flexFlow: "row",
        alignItems: "flex-start",
        placeContent: "flex-start",
        gap: 12,
        width: "100%",
        height: "min-content",
        padding: 8,
      }}
    >
      <span
        style={{
          display: "flex",
          flexFlow: "row",
          flex: "none",
          alignItems: "center",
          placeContent: "center",
          gap: 16,
          width: 40,
          height: 40,
          aspectRatio: "1 / 1",
          overflow: "hidden",
          borderRadius: 8,
          backgroundColor: "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))",
          boxShadow: "inset 0 0 0 1px var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))",
        }}
      >
        <Icon
          id={item.icon}
          size={16}
          color="var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(168, 162, 158))"
          strokeWidth={2}
        />
      </span>
      <span style={{ display: "flex", flexFlow: "column", flex: "1 0 0", width: 1, alignItems: "flex-start", placeContent: "flex-start", gap: 4, height: "min-content" }}>
        <span
          className="t-label"
          style={{ width: "100%", color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))", wordBreak: "break-word" }}
        >
          {item.label}
        </span>
        <span
          className="t-xs"
          style={{ width: "100%", color: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))", wordBreak: "break-word" }}
        >
          {item.description}
        </span>
      </span>
    </motion.a>
  );
}

/** Bare label row, used by the "COMPANY" column in both menus. */
export function PlainLink({ item, onNavigate }: { item: LinkItem; onNavigate?: () => void }) {
  return (
    <motion.a
      href={item.href}
      onClick={onNavigate}
      whileHover={{ backgroundColor: "var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(41, 37, 36))" }}
      whileTap={PRESS}
      transition={TWEEN_XFAST}
      style={{
        ...linkBase,
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        placeContent: "flex-start",
        gap: 4,
        width: "100%",
        height: "min-content",
        padding: "8px 12px",
        overflow: "hidden",
      }}
    >
      <span
        className="t-label"
        style={{ flex: "none", whiteSpace: "pre", color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))" }}
      >
        {item.label}
      </span>
    </motion.a>
  );
}

/** The small uppercase column heading above SUPPORT / COMPANY. */
export function ColumnTitle({ children, padding }: { children: string; padding: string }) {
  return (
    <div style={{ display: "flex", flexFlow: "row", flex: "none", alignItems: "center", placeContent: "flex-start", gap: 10, width: "100%", height: "min-content", padding }}>
      <span className="t-mono" style={{ whiteSpace: "pre", color: "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108))" }}>
        {children}
      </span>
    </div>
  );
}
