"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Sprite";
import { SPRING } from "@/lib/motion";
import { CHEVRON_ID, COMPANY, PRODUCTS, SUPPORT } from "./data";
import { ColumnTitle, MenuRow, PlainLink, ProductCard } from "./items";

/**
 * Panel chrome shared by both menus. The 6px standoff below the trigger is
 * padding on the animated wrapper rather than an offset, so the pointer can
 * cross the gap without leaving the safe area.
 */
const PANEL_WRAP: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  paddingTop: 6,
  zIndex: 11,
};

const PANEL: React.CSSProperties = {
  display: "grid",
  gridTemplateRows: "repeat(1, minmax(0, 1fr))",
  gridAutoRows: "minmax(0, 1fr)",
  justifyContent: "center",
  gap: 0,
  height: "min-content",
  overflow: "hidden",
  borderRadius: 10,
  backgroundColor: "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))",
  boxShadow:
    "inset 0 0 0 1px var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36)), 0px 10px 20px 0px rgba(0, 0, 0, 0.05)",
};

/**
 * One bar item that owns a panel. The panel opens on **hover**: the trigger's
 * hover prop is wired to the overlay's show(), and there is no unhover and no
 * click binding, so closing is the popover's own dismiss, i.e. the pointer
 * leaving the safe area (trigger + standoff + panel) or a route change. Escape
 * is deliberately not bound (`dismissWithEsc: false`).
 */
function MenuButton({
  label,
  offsetX,
  panelStyle,
  panelInitial,
  children,
}: {
  label: string;
  offsetX: number;
  panelStyle: React.CSSProperties;
  /** Features fades only; Resources also drops 2px. */
  panelInitial: { opacity: number; y?: number };
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div
      ref={wrap}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}
    >
      <Button
        variant="ghost"
        size="lg"
        height={36}
        className={`nv-trigger nv-trigger-${label.toLowerCase()}`}
        icon={
          <Icon
            id={CHEVRON_ID}
            size={16}
            color="var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))"
            strokeWidth={2}
          />
        }
      >
        {label}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            initial={{ opacity: 0, y: panelInitial.y ?? 0 }}
            animate={{ opacity: 1, y: 0, transition: SPRING }}
            exit={{ opacity: 0, y: panelInitial.y ?? 0, transition: SPRING }}
            style={{ ...PANEL_WRAP, left: offsetX }}
          >
            <div style={{ ...PANEL, ...panelStyle }}>{children(() => setOpen(false))}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** "Features": three product cards side by side. */
export function FeaturesMenu() {
  return (
    <MenuButton
      label="Features"
      offsetX={0}
      panelInitial={{ opacity: 0 }}
      panelStyle={{ gridTemplateColumns: "repeat(3, minmax(166px, 1fr))", width: 534, padding: 4 }}
    >
      {(close) =>
        PRODUCTS.map((p) => (
          <div key={p.label} style={{ flex: "none", placeSelf: "start", width: "100%", height: "auto", position: "relative" }}>
            <ProductCard item={p} onNavigate={close} />
          </div>
        ))
      }
    </MenuButton>
  );
}

/** "Resources": a two-column support block and a one-column company block. */
export function ResourcesMenu() {
  return (
    <MenuButton
      label="Resources"
      offsetX={-105}
      panelInitial={{ opacity: 0, y: -2 }}
      panelStyle={{ gridTemplateColumns: "repeat(3, minmax(50px, 1fr))", width: 449, padding: 0 }}
    >
      {(close) => (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              flex: "none",
              gridColumn: "span 2",
              placeContent: "flex-start",
              placeSelf: "start",
              alignItems: "flex-start",
              gap: 4,
              width: "100%",
              height: "100%",
              padding: 8,
              position: "relative",
            }}
          >
            <ColumnTitle padding="6px 8px">SUPPORT</ColumnTitle>
            {SUPPORT.map((r) => (
              <div key={r.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <MenuRow item={r} onNavigate={close} />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              flex: "none",
              placeContent: "flex-start",
              placeSelf: "start",
              alignItems: "flex-start",
              gap: 4,
              width: "100%",
              height: "100%",
              padding: "8px 8px 12px",
              position: "relative",
              boxShadow: "inset 1px 0 0 0 rgb(41, 36, 35)",
            }}
          >
            <ColumnTitle padding="6px 12px">COMPANY</ColumnTitle>
            <div style={{ display: "flex", flexFlow: "column", flex: "none", alignItems: "flex-start", placeContent: "flex-start", gap: 0, width: "100%", height: "min-content" }}>
              {COMPANY.map((l) => (
                <div key={l.label} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
                  <PlainLink item={l} onNavigate={close} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </MenuButton>
  );
}
