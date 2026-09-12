"use client";

import type { CSSProperties, ReactNode } from "react";
import { CX_ICONS } from "./icon-paths";

/** Tokens this route reaches for repeatedly, copied verbatim out of the spec. */
export const T = {
  bright: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))",
  muted: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))",
  dim: "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))",
  dimmer: "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))",
  icon: "var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(115, 115, 115))",
  line: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))",
  line2: "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))",
  panel: "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))",
  raised: "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))",
  raised2: "var(--token-efb6b80c-ff66-4fd5-b06e-7af1e4433402, rgb(38, 38, 38))",
  accent: "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))",
  accentSoft: "var(--token-5ede7ff4-9baf-4919-b9da-b4753e2a0dcd, rgba(16, 236, 144, 0.2))",
  red: "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))",
  amber: "var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))",
  ring: "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(64, 64, 64))",
  dot: "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))",
  tint: "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))",
  timerBg: "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(23, 23, 23))",
  timerFill: "var(--token-ba35e0ab-850d-49cf-be59-934f032ab5a0, rgb(245, 245, 245))",
} as const;

/**
 * The reference's `data-border` overlay, drawn as an absolutely positioned
 * inset span so it never grows the box. Widths come from the inherited
 * `--cx-b*` custom properties, which is what lets a breakpoint set one to
 * `unset` and fall back to the ancestor's value, exactly as the source does.
 */
export function Border({ radius }: { radius?: number | string }) {
  return (
    <span
      aria-hidden
      style={{
        content: '""',
        position: "absolute",
        inset: 0,
        boxSizing: "border-box",
        borderStyle: "solid",
        borderColor: "var(--cx-bc, transparent)",
        borderWidth:
          "var(--cx-bt, 0) var(--cx-br, 0) var(--cx-bb, 0) var(--cx-bl, 0)",
        borderRadius: radius ?? "inherit",
        pointerEvents: "none",
      }}
    />
  );
}

/** A four-sided 1px overlay border in one call, for the many small cards. */
export function Hairline({
  color = T.line,
  radius,
}: {
  color?: string;
  radius?: number | string;
}) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        boxSizing: "border-box",
        border: `1px solid ${color}`,
        borderRadius: radius ?? "inherit",
        pointerEvents: "none",
      }}
    />
  );
}

type IconProps = {
  id: keyof typeof CX_ICONS | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

/**
 * The line icons this route needs that the shared sheet does not carry. Path
 * data lives in `icon-paths.ts`; colour and stroke width ride on two custom
 * properties, the same way the shared `Icon` does.
 */
export function CxIcon({ id, size = 24, color = "currentColor", strokeWidth = 2, style }: IconProps) {
  const d = CX_ICONS[id as string];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "block",
        ["--cx-ic" as string]: color,
        ["--cx-sw" as string]: strokeWidth,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

/**
 * The page's dot texture: a `space * 2` tile carrying one `weight`-sized square
 * at its centre, tiled over the box. Plain SVG, no canvas.
 */
export function DotPattern({
  space = 4,
  weight = 2,
  tint = T.tint,
  style,
  id = "cx-dots",
}: {
  space?: number;
  weight?: number;
  tint?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <svg width="100%" height="100%" style={style} aria-hidden focusable="false">
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width={space * 2} height={space * 2}>
          <rect x={space} y={space} width={weight} height={weight} fill={tint} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** The small pill used for section eyebrows and in-visual chips. */
export function Pill({
  children,
  padding = "4px 8px",
  className = "t-nano",
  style,
}: {
  children: ReactNode;
  padding?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexFlow: "column nowrap",
        placeContent: "center",
        alignItems: "center",
        gap: 16,
        width: "min-content",
        height: "min-content",
        padding,
        borderRadius: 321,
        backgroundColor: T.raised,
        overflow: "hidden",
        ...style,
      }}
    >
      <Hairline color={T.line2} />
      <p className={className} style={{ whiteSpace: "pre", color: T.bright, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

/** The 6px live dot with its halo, as used inside the visuals. */
export function LiveDot({ size = 6 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: T.accent,
        position: "relative",
        flex: "none",
      }}
    />
  );
}
