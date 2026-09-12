"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Sprite";
import { SPRING, TWEEN_FAST } from "@/lib/motion";
import { ABOUT_HREF, CHEVRON_ID, COMPANY, PRICING_HREF, PRODUCTS, SUPPORT } from "./data";
import { ColumnTitle, MenuRow, PlainLink, ProductCard } from "./items";

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))";
const HEAD_COLOR = "var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(245, 245, 244))";

type Panel = "features" | "resources" | null;

/**
 * A full-width heading row: label, optional chevron that flips when open. The
 * row is press-only (no hover state), and the chevron rotates 0 -> -180 on the
 * house spring. That rotation is the one rotate on the whole page.
 */
function HeadRow({
  label,
  href,
  chevron,
  open,
  rule,
  onClick,
}: {
  label: string;
  href?: string;
  chevron?: boolean;
  open?: boolean;
  /** the reference puts the rule on the section for the two accordions, and on the row itself for the plain links */
  rule?: boolean;
  onClick?: () => void;
}) {
  const Tag = href ? motion.a : motion.div;
  return (
    <Tag
      className={`nv-head nv-head-${label.split(" ")[0].toLowerCase()}`}
      {...(href ? { href } : {})}
      onClick={onClick}
      whileTap={{ backgroundColor: "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))" }}
      transition={SPRING}
      style={{
        display: "flex",
        flexFlow: "row",
        flex: "none",
        alignItems: "center",
        placeContent: "center",
        gap: 16,
        width: "100%",
        height: "min-content",
        padding: 12,
        position: "relative",
        cursor: "pointer",
        textDecoration: "none",
        backgroundColor: "rgba(0, 0, 0, 0)",
        boxShadow: rule ? `inset 0 -1px 0 0 ${LINE}` : undefined,
      }}
    >
      <h3 className="t-h4" style={{ flex: "1 0 0", width: 1, color: HEAD_COLOR, wordBreak: "break-word" }}>
        {label}
      </h3>
      {chevron && (
        <motion.span
          animate={{ rotate: open ? -180 : 0 }}
          transition={SPRING}
          style={{ flex: "none", width: 16, height: 16, display: "block" }}
        >
          <Icon id={CHEVRON_ID} size={16} color={HEAD_COLOR} strokeWidth={2} />
        </motion.span>
      )}
    </Tag>
  );
}

/** One accordion: heading plus a body that is 1px tall until it is opened. */
function Section({ label, open, openPad, onToggle, children }: { label: string; open: boolean; openPad: number; onToggle: () => void; children: ReactNode }) {
  return (
    <motion.div
      animate={{ paddingBottom: open ? openPad : 0 }}
      transition={TWEEN_FAST}
      style={{
        display: "flex",
        flexFlow: "column",
        flex: "none",
        alignItems: "center",
        placeContent: "center",
        gap: 0,
        width: "100%",
        height: "min-content",
        overflow: "hidden",
        position: "relative",
        boxShadow: `inset 0 -1px 0 0 ${LINE}`,
      }}
    >
      <div style={{ display: "flex", flexFlow: "row", flex: "none", alignItems: "center", placeContent: "center", gap: 16, width: "100%", height: "min-content", cursor: "pointer" }}>
        <div style={{ flex: "1 0 0", width: 1, height: "auto", position: "relative" }}>
          <HeadRow label={label} chevron open={open} onClick={onToggle} />
        </div>
      </div>
      <motion.div
        animate={{ height: open ? "auto" : 1 }}
        transition={TWEEN_FAST}
        style={{
          display: "flex",
          flexFlow: "column",
          flex: "none",
          alignItems: "center",
          placeContent: "flex-start",
          gap: 0,
          width: "100%",
          height: 1,
          overflow: "visible",
          position: "relative",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const COL: React.CSSProperties = {
  display: "flex",
  flexFlow: "column",
  flex: "none",
  alignItems: "flex-start",
  placeContent: "flex-start",
  gap: 4,
  width: "100%",
  height: "min-content",
  padding: 4,
  position: "relative",
};

/**
 * The contents of the tablet / phone menu: two accordions, two plain links,
 * and (phone only) a full-width primary button.
 */
export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const [panel, setPanel] = useState<Panel>(null);
  const toggle = (p: Exclude<Panel, null>) => setPanel((v) => (v === p ? null : p));

  return (
    <>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          flex: "none",
          alignItems: "center",
          placeContent: "center",
          gap: 0,
          width: "100%",
          height: "min-content",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Section label="Features" open={panel === "features"} openPad={20} onToggle={() => toggle("features")}>
          {PRODUCTS.map((p) => (
            <div key={p.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
              <ProductCard item={p} horizontal onNavigate={onNavigate} />
            </div>
          ))}
        </Section>

        <Section label="Resources" open={panel === "resources"} openPad={12} onToggle={() => toggle("resources")}>
          <div style={COL}>
            <ColumnTitle padding="6px 8px">SUPPORT</ColumnTitle>
            {SUPPORT.map((r) => (
              <div key={r.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <MenuRow item={r} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
          <div style={COL}>
            <ColumnTitle padding="6px 12px">COMPANY</ColumnTitle>
            <div style={{ display: "flex", flexFlow: "column", flex: "none", alignItems: "flex-start", placeContent: "flex-start", gap: 0, width: "100%", height: "min-content" }}>
              {COMPANY.map((l) => (
                <div key={l.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
                  <PlainLink item={l} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
          <HeadRow label="Pricing" href={PRICING_HREF} rule onClick={onNavigate} />
        </div>
        <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
          <HeadRow label="About us" href={ABOUT_HREF} rule onClick={onNavigate} />
        </div>
      </div>

      <div
        className="nv-sheet-cta"
        style={{
          display: "flex",
          flexFlow: "column",
          flex: "none",
          alignItems: "center",
          placeContent: "flex-start",
          gap: 12,
          width: "100%",
          height: "min-content",
          padding: 12,
          position: "relative",
        }}
      >
        <Button variant="primary" size="lg" height={36} href={PRICING_HREF} onClick={onNavigate} style={{ width: "100%" }}>
          Sign up
        </Button>
      </div>
    </>
  );
}
