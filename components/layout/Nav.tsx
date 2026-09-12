"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Sprite";
import { TWEEN_FAST } from "@/lib/motion";
import { MENU_ID, PRICING_HREF, ABOUT_HREF } from "./nav/data";
import { FeaturesMenu, ResourcesMenu } from "./nav/Dropdown";
import { CloseGlyph } from "./nav/items";
import { MobileMenu } from "./nav/MobileMenu";

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))";
const SURFACE = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(17, 15, 13))";

/** The bar is exactly this tall at every width; everything downstream measures from it. */
const BAR_H = 68;

/** window.innerHeight, which is what the sheet's height is pinned to. */
function useViewportHeight() {
  const [h, setH] = useState(0);
  useEffect(() => {
    const read = () => setH(window.innerHeight);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return h;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const vh = useViewportHeight();

  // The sheet hangs off the top of the bar when closed and slides down over the
  // page when opened. Closed it sits fully above the fold, so it never needs a
  // scrim of its own.
  const closedY = vh ? BAR_H - vh : 0;

  return (
    <header
      className="nv-bar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: "flex",
        flexFlow: "row",
        flex: "none",
        placeContent: "center",
        alignItems: "center",
        gap: 16,
        height: "min-content",
        padding: "0 64px",
        overflow: "visible",
        backgroundColor: SURFACE,
        boxShadow: `inset 0 -1px 0 0 ${LINE}`,
      }}
    >
      <div
        className="nv-container"
        style={{
          display: "flex",
          flexFlow: "row",
          flex: "1 0 0",
          placeContent: "center",
          alignItems: "center",
          gap: 16,
          width: 1,
          maxWidth: 1400,
          height: "min-content",
          padding: 0,
          position: "relative",
          overflow: "visible",
        }}
      >
        <div style={{ zIndex: 10, flex: "1 0 0", width: 1, height: "auto", position: "sticky", top: 0 }}>
          <div className="nv-root" style={{ display: "flex", flexFlow: "row", placeContent: "center", alignItems: "center", gap: 0, width: "100%", height: "min-content", padding: 0, position: "relative", overflow: "visible" }}>
            {/* Tablet / phone sheet. Hidden outright on desktop. */}
            {vh > 0 && (
              <motion.div
                className="nv-sheet"
                animate={{ y: open ? 0 : closedY }}
                initial={false}
                transition={TWEEN_FAST}
                style={{
                  display: "none",
                  flexFlow: "column",
                  flex: "none",
                  placeContent: "flex-start",
                  alignItems: "center",
                  gap: 16,
                  height: vh,
                  padding: "88px 32px 40px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  overflow: "auto",
                  backgroundColor: SURFACE,
                  boxShadow: `inset 0 -1px 0 0 ${LINE}`,
                }}
              >
                <MobileMenu onNavigate={() => setOpen(false)} />
              </motion.div>
            )}

            <div
              className="nv-stack"
              style={{
                zIndex: 10,
                display: "flex",
                flexFlow: "row",
                flex: "1 0 0",
                placeContent: "center",
                alignItems: "center",
                gap: 16,
                width: 1,
                height: "min-content",
                padding: "16px 40px",
                position: "relative",
                overflow: "visible",
                backgroundColor: SURFACE,
                boxShadow: `inset 0 -1px 0 0 ${LINE}, inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE}`,
              }}
            >
              <div style={{ display: "flex", flexFlow: "row", flex: "1 0 0", placeContent: "flex-start", alignItems: "center", gap: 40, width: 1, height: "min-content", position: "relative", overflow: "visible" }}>
                <Logo />
                <nav className="nv-links" style={{ display: "flex", flexFlow: "row", flex: "none", placeContent: "center", alignItems: "center", gap: 4, width: "min-content", height: "min-content", position: "relative", overflow: "visible" }}>
                  <FeaturesMenu />
                  <ResourcesMenu />
                  <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <Button variant="ghost" size="lg" height={36} href={PRICING_HREF}>
                      Pricing
                    </Button>
                  </div>
                  <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <Button variant="ghost" size="lg" height={36} href={ABOUT_HREF}>
                      About
                    </Button>
                  </div>
                </nav>
              </div>

              <div style={{ display: "flex", flexFlow: "row", flex: "none", placeContent: "center", alignItems: "center", gap: 12, width: "min-content", height: "min-content", position: "relative", overflow: "visible" }}>
                <div className="nv-cta" style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                  <Button variant="primary" size="lg" height={36} href={PRICING_HREF}>
                    Get started
                  </Button>
                </div>
                <button
                  type="button"
                  className="nv-burger"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                  data-reset="button"
                  style={{
                    display: "none",
                    flexFlow: "row",
                    flex: "none",
                    placeContent: "center",
                    alignItems: "center",
                    gap: 16,
                    width: 36,
                    height: 36,
                    padding: 0,
                    position: "relative",
                    overflow: "visible",
                    cursor: "pointer",
                    background: "none",
                    border: 0,
                  }}
                >
                  {open ? (
                    <CloseGlyph size={24} color="var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(120, 113, 108))" strokeWidth={2} />
                  ) : (
                    <Icon id={MENU_ID} size={24} color="var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(120, 113, 108))" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .nv-bar a { text-decoration: none; }
        @media (max-width: 1199.98px) {
          .nv-bar { padding: 0; }
          .nv-stack { padding: 16px 30px 16px 40px !important; box-shadow: inset 0 -1px 0 0 ${LINE} !important; }
          .nv-links { display: none !important; }
          .nv-burger { display: flex !important; }
          .nv-sheet { display: flex !important; }
        }
        @media (max-width: 809.98px) {
          .nv-bar { flex-direction: column; padding: 0; }
          .nv-container { flex: none !important; width: 100% !important; }
          .nv-stack { padding: 16px 10px 16px 20px !important; }
          .nv-sheet { padding: 76px 8px 8px !important; }
          .nv-cta { display: none !important; }
        }
        @media (min-width: 810px) {
          .nv-sheet-cta { display: none !important; }
        }
      `}</style>
    </header>
  );
}
