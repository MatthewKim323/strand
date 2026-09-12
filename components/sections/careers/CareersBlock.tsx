"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Sprite";
import { EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ tokens */

const C_TEXT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const C_MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const C_DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const C_LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const C_SURFACE = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";
const C_DOTS = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";
const C_ACCENT = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const C_BTN_BG = "var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))";
const C_BTN_LINE = "var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(82, 82, 82))";
const C_BTN_ICON = "var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))";
const C_ROUND_BG = "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))";
const C_ROUND_ICON = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";
const C_INPUT_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const C_ARROW_DOT = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";

/* -------------------------------------------------------------------- data */

/**
 * Every open role, in tree order. The list is inline content in the reference
 * tree (no external dataset), so it is transcribed verbatim here.
 */
const ROLES = [
  { title: "Senior Backend Engineer", location: "Remote", type: "Full-time", href: "/careers/senior-backend-engineer" },
  { title: "ML Engineer", location: "Remote", type: "Full-time", href: "/careers/ml-engineer" },
  { title: "Product Designer", location: "Remote", type: "Full-time", href: "/careers/product-designer" },
  { title: "Developer Relations Lead", location: "Remote or San Francisco", type: "Part-time", href: "/careers/developer-relations-lead" },
  { title: "Account Executive", location: "New York", type: "Full-time", href: "/careers/account-executive" },
  { title: "Data Infrastructure Engineer", location: "Remote", type: "Full-time", href: "/careers/data-infrastructure-engineer" },
  { title: "Technical Writer", location: "Remote", type: "Internship", href: "/careers/technical-writer" },
  { title: "Growth Marketing Manager", location: "Remote or New York", type: "Part-time", href: "/careers/growth-marketing-manager" },
  { title: "Open Application", location: "Remote", type: "Varies", href: "/careers/open-application" },
] as const;

const PEOPLE = [
  { src: "/img/img-829145cc50.png", alt: "Headshot of Marcus Webb, office background." },
  { src: "/img/img-aee68dc73f.png", alt: "Headshot of Claire Fontaine, office background." },
  { src: "/img/img-de26d567ca.png", alt: "Headshot of Daniel Reyes, office background." },
  { src: "/img/img-b281312059.png", alt: "Headshot of Jordan Osei, office background." },
  { src: "/img/img-2d2df2f87d.png", alt: "Headshot of Ravi Menon, office background." },
  { src: "/img/img-0f7330a807.png", alt: "Headshot of Kevin Liang, office background." },
  { src: "/img/img-17bce2f0bf.png", alt: "Headshot of Zara Mitchell, office background." },
] as const;

/* --------------------------------------------------------------- fragments */

/** The 96px dotted rail either side of the content column (desktop only). */
function PatternRail() {
  return (
    <div className="cr-rail" style={{ flex: "none", alignSelf: "stretch", width: 96, height: "auto", position: "relative" }}>
      <svg width="100%" height="100%" style={{ height: "100%", width: "100%" }} aria-hidden="true">
        <defs>
          <pattern id="cr-dot-grid" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect x="4" y="4" width="1.5" height="1.5" fill={C_DOTS} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cr-dot-grid)" />
      </svg>
    </div>
  );
}

/** 6px live dot with the expanding ring loop. */
function LiveDot() {
  return (
    <div style={{ zIndex: 1, flex: "none", width: "auto", height: "auto", position: "relative" }}>
      <div style={{ width: 6, height: 6, borderRadius: 9999, backgroundColor: C_ACCENT, position: "relative" }}>
        <motion.div
          initial={{ width: 2, height: 2, opacity: 1 }}
          animate={{ width: 18, height: 18, opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: [0.44, 0, 0.56, 1], repeat: Infinity, repeatDelay: 1 }}
          style={{
            borderRadius: 9999,
            outline: `2px solid ${C_ACCENT}`,
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
        />
      </div>
    </div>
  );
}

/** Arrow-down glyph. Not in the shared sheet, so its path data lives here. */
function ArrowDown({ size = 14, color = C_BTN_ICON }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ width: size, height: size, flexShrink: 0, display: "block" }}
    >
      <path d="M 0 0 L 0 14" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke={color} transform="translate(12 5)" />
      <path d="M 14 0 L 7 7 L 0 0" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke={color} transform="translate(5 12)" />
    </svg>
  );
}

const DOT: CSSProperties = {
  height: 2,
  width: 2,
  overflow: "clip",
  flex: "none",
  position: "absolute",
  borderRadius: 36,
  backgroundColor: C_ARROW_DOT,
};

/**
 * The six-dot arrow. Only the first set is visible in the rest state; the
 * second and third sets are the authored "next" pose and stay at opacity 0.
 */
function DotArrow() {
  const mask = "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)";
  return (
    <div style={{ flex: "none", width: 16, height: 16, position: "relative" }}>
      <div
        style={{
          width: 16,
          height: 16,
          position: "relative",
          overflow: "visible",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <div style={{ ...DOT, top: 4, left: -10, opacity: 0 }} />
        <div style={{ ...DOT, top: 10, left: -10, opacity: 0 }} />
        <div style={{ ...DOT, top: 7, left: -7, opacity: 0 }} />
        <div style={{ ...DOT, top: 4, left: 6, opacity: 1 }} />
        <div style={{ ...DOT, top: 10, left: 6, opacity: 1 }} />
        <div style={{ ...DOT, top: 7, left: 9, opacity: 1 }} />
      </div>
    </div>
  );
}

const BAR_BASE: CSSProperties = {
  zIndex: 1,
  flex: "none",
  width: "100%",
  position: "absolute",
  top: 0,
  bottom: 0,
  overflow: "visible",
};

/**
 * The 1px chromatic rule. Six bars grow out from the centre with mirrored
 * per-channel delays, once, when the whole 1px element is in view.
 */
function ChromaticRule() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });
  const to = (delay: number, end: string, start: string) => ({
    animate: inView ? { width: "100%", backgroundColor: end } : { width: "0%", backgroundColor: start },
    transition: { type: "tween" as const, duration: 0.4, ease: EASE, delay },
  });
  const b = ["rgb(0, 0, 36)", "rgb(0, 0, 255)"] as const;
  const g = ["rgb(0, 37, 0)", "rgb(0, 255, 0)"] as const;
  const r = ["rgb(41, 0, 0)", "rgb(255, 0, 0)"] as const;

  return (
    <div style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
      <div
        ref={ref}
        style={{
          height: "min-content",
          overflow: "clip",
          display: "flex",
          flexFlow: "row nowrap",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          padding: 0,
          position: "relative",
        }}
      >
        <div style={{ height: 1, overflow: "clip", flex: "1 0 0", width: 1, position: "relative" }}>
          <motion.div style={{ ...BAR_BASE, right: 0 }} {...to(0.04, b[0], b[1])} />
          <motion.div style={{ ...BAR_BASE, right: 0, mixBlendMode: "screen" }} {...to(0.02, g[0], g[1])} />
          <motion.div style={{ ...BAR_BASE, right: 0, mixBlendMode: "screen" }} {...to(0, r[0], r[1])} />
        </div>
        <div style={{ height: 1, overflow: "clip", flex: "1 0 0", width: 1, position: "relative" }}>
          <motion.div style={{ ...BAR_BASE, left: 0 }} {...to(0, b[0], b[1])} />
          <motion.div style={{ ...BAR_BASE, left: 0, mixBlendMode: "screen" }} {...to(0.02, g[0], g[1])} />
          <motion.div style={{ ...BAR_BASE, left: 0, mixBlendMode: "screen" }} {...to(0.04, r[0], r[1])} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- block */

export function CareersBlock() {
  return (
    <div
      className="cr-root"
      style={{
        height: "min-content",
        overflow: "clip",
        display: "flex",
        flexFlow: "column nowrap",
        flex: "none",
        placeContent: "center",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "0 64px",
        position: "relative",
      }}
    >
      <div
        className="cr-container"
        style={{
          maxWidth: 1400,
          height: "min-content",
          overflow: "clip",
          display: "flex",
          flexFlow: "row nowrap",
          flex: "none",
          placeContent: "center",
          alignItems: "center",
          gap: 0,
          width: "100%",
          padding: 0,
          position: "relative",
          boxShadow: `inset 1px 0 0 0 ${C_LINE}, inset -1px 0 0 0 ${C_LINE}`,
        }}
      >
        <PatternRail />

        <div
          className="cr-col"
          style={{
            height: "min-content",
            overflow: "clip",
            display: "flex",
            flexFlow: "column nowrap",
            flex: "1 0 0",
            placeContent: "flex-start center",
            alignItems: "flex-start",
            gap: 0,
            width: 1,
            padding: 0,
            position: "relative",
            boxShadow: `inset 1px 0 0 0 ${C_LINE}, inset -1px 0 0 0 ${C_LINE}`,
          }}
        >
          {/* ------------------------------------------------ title row */}
          <div
            className="cr-titlerow"
            style={{
              height: "min-content",
              overflow: "clip",
              display: "flex",
              flexFlow: "row nowrap",
              flex: "none",
              placeContent: "center",
              alignItems: "center",
              gap: 16,
              width: "100%",
              padding: 40,
              position: "relative",
            }}
          >
            <div
              className="cr-title"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "1 0 0", width: 1, height: "auto", position: "relative" }}
            >
              <h1 className="cr-h1" style={{ color: C_TEXT }}>
                Careers
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                flexFlow: "column nowrap",
                flex: "none",
                placeContent: "flex-start center",
                alignItems: "flex-start",
                gap: 20,
                width: "min-content",
                height: "min-content",
                padding: 0,
                position: "relative",
              }}
            >
              <div
                style={{
                  backgroundColor: C_SURFACE,
                  height: "min-content",
                  overflow: "clip",
                  borderRadius: 113,
                  display: "flex",
                  flexFlow: "row nowrap",
                  flex: "none",
                  placeContent: "center",
                  alignItems: "center",
                  gap: 12,
                  width: "min-content",
                  padding: "4px 4px 4px 12px",
                  position: "relative",
                  boxShadow: `inset 0 0 0 1px ${C_LINE}`,
                }}
              >
                <LiveDot />
                <div
                  style={{
                    height: "min-content",
                    overflow: "clip",
                    display: "flex",
                    flexFlow: "row nowrap",
                    flex: "none",
                    placeContent: "center",
                    alignItems: "center",
                    gap: 4,
                    width: "min-content",
                    padding: 0,
                    position: "relative",
                  }}
                >
                  <div style={{ whiteSpace: "pre", flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <p className="t-micro" style={{ color: C_TEXT }}>9</p>
                  </div>
                  <div style={{ whiteSpace: "pre", flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <p className="t-micro" style={{ color: C_TEXT }}>open</p>
                  </div>
                  <div style={{ whiteSpace: "pre", flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <p className="t-micro" style={{ color: C_TEXT }}>positions</p>
                  </div>
                </div>
                <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                  <Link
                    href="/careers#job-applications"
                    aria-label="Jump to the open positions"
                    className="cr-jump"
                    style={{
                      cursor: "pointer",
                      height: 26,
                      width: 26,
                      overflow: "clip",
                      display: "flex",
                      flexFlow: "row nowrap",
                      placeContent: "center",
                      alignItems: "center",
                      gap: 4,
                      padding: 0,
                      textDecoration: "none",
                      position: "relative",
                      backgroundColor: C_BTN_BG,
                      borderRadius: 52,
                      boxShadow: `inset 0 0 0 1px ${C_BTN_LINE}`,
                    }}
                  >
                    <ArrowDown />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------- hero image */}
          <div
            className="cr-hero"
            style={{
              height: "auto",
              aspectRatio: "1.5",
              overflow: "clip",
              flex: "none",
              width: "100%",
              position: "relative",
              boxShadow: `inset 0 0 0 1px ${C_LINE}`,
            }}
          >
            <div style={{ position: "absolute", borderRadius: "inherit", inset: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/img-958dd1645f.png"
                alt="Colleagues working together."
                width={1587}
                height={1058}
                style={{ display: "block", width: "100%", height: "100%", borderRadius: "inherit", objectPosition: "center", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* -------------------------------------------- mid two-up */}
          <div
            className="cr-mid"
            style={{
              height: "min-content",
              overflow: "clip",
              display: "flex",
              flexFlow: "row nowrap",
              flex: "none",
              placeContent: "center",
              alignItems: "center",
              gap: 32,
              width: "100%",
              padding: 40,
              position: "relative",
            }}
          >
            <div
              className="cr-team"
              style={{
                height: "auto",
                overflow: "clip",
                display: "flex",
                flexFlow: "column nowrap",
                flex: "1 0 0",
                placeContent: "center space-between",
                alignSelf: "stretch",
                alignItems: "center",
                width: 1,
                padding: 0,
                position: "relative",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <h2 className="t-h2" style={{ color: C_TEXT }}>
                  Build the intelligence layer for every company.
                </h2>
              </div>

              <div
                style={{
                  height: "min-content",
                  overflow: "clip",
                  display: "flex",
                  flexFlow: "column nowrap",
                  flex: "none",
                  placeContent: "center flex-end",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: 0,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "min-content",
                    overflow: "clip",
                    display: "flex",
                    flexFlow: "column nowrap",
                    flex: "none",
                    placeContent: "center",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                    padding: 0,
                    position: "relative",
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                    <p className="t-xs" style={{ textAlign: "start", color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))" }}>
                      The people behind Nordwell
                    </p>
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                    <p className="t-xs" style={{ color: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))" }}>
                      Different backgrounds, one problem worth solving
                    </p>
                  </div>
                </div>

                <div
                  className="cr-faces"
                  style={{
                    flex: "none",
                    gridTemplateColumns: "repeat(auto-fill, minmax(28px, 1fr))",
                    gridAutoRows: "minmax(0, 1fr)",
                    justifyContent: "center",
                    gap: 0,
                    width: "100%",
                    height: 40,
                    padding: 0,
                    display: "grid",
                    position: "relative",
                  }}
                >
                  {PEOPLE.map((p) => (
                    <div key={p.src} style={{ flex: "none", placeSelf: "end start", width: "100%", height: 32, position: "relative" }}>
                      <div
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          flexFlow: "row nowrap",
                          placeContent: "center flex-start",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                          height: "100%",
                          padding: 0,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            flex: "none",
                            width: 32,
                            height: 32,
                            position: "relative",
                            borderRadius: 249,
                            boxShadow: "inset 0 0 0 2px var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9))",
                          }}
                        >
                          <div style={{ position: "absolute", borderRadius: "inherit", inset: 0, overflow: "hidden" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.src}
                              alt={p.alt}
                              style={{ display: "block", width: "100%", height: "100%", borderRadius: "inherit", objectPosition: "center", objectFit: "cover" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="cr-desc"
              style={{
                height: "min-content",
                overflow: "clip",
                display: "flex",
                flexFlow: "column nowrap",
                flex: "1 0 0",
                placeContent: "flex-start center",
                alignItems: "flex-start",
                gap: 32,
                width: 1,
                padding: 0,
                position: "relative",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <p className="t-body" style={{ textAlign: "start", color: C_MUTED }}>
                  We are a small team solving a massive problem. Nordwell exists because data shouldn&rsquo;t require a dedicated
                  analyst, a three-day sprint, or six open browser tabs to be useful. We built the thing we always wished existed:
                  one place where every question about your business gets a real answer, instantly.
                  <br />
                  <br />
                  Most companies aren&rsquo;t losing to competitors. They&rsquo;re losing to their own blind spots. Data sitting in
                  disconnected tools, insights buried in exports nobody reads, decisions made on gut feel because the truth takes
                  too long to find. We think that&rsquo;s a solvable problem. And we&rsquo;re solving it.
                  <br />
                  <br />
                  If you care deeply about the work, go deep on hard problems, and believe that good infrastructure should be
                  invisible and intelligence should be accessible to everyone, we would like to talk.
                </p>
              </div>

              <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
                <Link
                  href="/about-us"
                  className="cr-more"
                  style={{
                    cursor: "pointer",
                    height: "min-content",
                    overflow: "clip",
                    display: "flex",
                    flexFlow: "row nowrap",
                    placeContent: "center",
                    alignItems: "center",
                    gap: 12,
                    width: "min-content",
                    padding: 0,
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  <div style={{ userSelect: "none", whiteSpace: "pre", flex: "none", width: "auto", height: "auto", position: "relative" }}>
                    <p className="t-label" style={{ color: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))" }}>
                      More about us
                    </p>
                  </div>
                  <span
                    style={{
                      aspectRatio: "1",
                      height: "auto",
                      overflow: "clip",
                      display: "flex",
                      flexFlow: "row nowrap",
                      flex: "none",
                      placeContent: "center",
                      alignItems: "center",
                      gap: 4,
                      width: 26,
                      padding: 0,
                      position: "relative",
                      backgroundColor: C_ROUND_BG,
                      borderRadius: 52,
                    }}
                  >
                    <Icon id="2903821725" size={14} color={C_ROUND_ICON} strokeWidth={2} />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <ChromaticRule />

          {/* -------------------------------------------- jobs heading */}
          <div
            id="job-applications"
            className="cr-jobshead"
            style={{
              height: "min-content",
              overflow: "clip",
              display: "flex",
              flexFlow: "column nowrap",
              flex: "none",
              placeContent: "flex-start center",
              alignItems: "flex-start",
              gap: 40,
              width: "100%",
              padding: "60px 40px 40px",
              scrollMarginTop: 68,
              position: "relative",
            }}
          >
            <div
              style={{
                height: "min-content",
                overflow: "clip",
                display: "flex",
                flexFlow: "column nowrap",
                flex: "none",
                placeContent: "center",
                alignItems: "center",
                gap: 16,
                width: "100%",
                padding: 0,
                position: "relative",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <h2 className="t-h2" style={{ color: C_TEXT }}>
                  We&apos;re hiring across the stack.
                </h2>
              </div>
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <p className="t-body" style={{ color: C_MUTED }}>
                  All roles are remote unless noted. We care about the work, not the timezone.
                </p>
              </div>
            </div>

            <div className="cr-searchwrap" style={{ flex: "none", width: 400, height: "auto", position: "relative" }}>
              <label
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexFlow: "column nowrap",
                  placeContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 8,
                  width: "100%",
                  height: "min-content",
                  padding: 0,
                  position: "relative",
                }}
              >
                <div
                  className="cr-input"
                  style={{
                    flex: "none",
                    width: "100%",
                    height: 40,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 12,
                    background: C_INPUT_BG,
                    overflow: "hidden",
                  }}
                >
                  {/* TODO(spec): the reference input is inert in the capture; no filter behaviour was observable. */}
                  <input type="text" placeholder="Search applications..." defaultValue="" aria-label="Search applications" />
                </div>
              </label>
            </div>
          </div>

          {/* ------------------------------------------------ job rows */}
          <div
            style={{
              display: "flex",
              flexFlow: "column nowrap",
              flex: "none",
              placeContent: "flex-start center",
              alignItems: "flex-start",
              gap: 0,
              width: "100%",
              height: "min-content",
              padding: "0 0 60px",
              position: "relative",
            }}
          >
            {ROLES.map((r) => (
              <div key={r.href} style={{ flex: "none", width: "100%", height: "auto", position: "relative" }}>
                <Link
                  href={r.href}
                  className="cr-row"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexFlow: "row nowrap",
                    placeContent: "center flex-start",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    height: "min-content",
                    padding: "20px 40px",
                    textDecoration: "none",
                    position: "relative",
                    backgroundColor: C_SURFACE,
                    boxShadow: `inset 0 -1px 0 0 ${C_LINE}`,
                  }}
                >
                  <div
                    className="cr-row-details"
                    style={{
                      height: "min-content",
                      overflow: "clip",
                      display: "flex",
                      flexFlow: "row nowrap",
                      flex: "1 0 0",
                      placeContent: "center flex-start",
                      alignItems: "center",
                      gap: 16,
                      width: 1,
                      padding: 0,
                      position: "relative",
                    }}
                  >
                    <div
                      className="cr-row-title"
                      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "0.8 0 0", width: 1, height: "auto", position: "relative" }}
                    >
                      <p className="t-label">{r.title}</p>
                    </div>
                    <div
                      className="cr-row-meta"
                      style={{
                        display: "flex",
                        flexFlow: "row nowrap",
                        flex: "1 0 0",
                        placeContent: "center flex-start",
                        alignItems: "center",
                        gap: 16,
                        width: 1,
                        height: "min-content",
                        padding: 0,
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <div
                        className="cr-row-loc"
                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "1 0 0", width: 1, height: "auto", position: "relative" }}
                      >
                        <p className="t-label">{r.location}</p>
                      </div>
                      <div
                        className="cr-row-type"
                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", flex: "0.8 0 0", width: 1, height: "auto", position: "relative" }}
                      >
                        <p className="t-label" style={{ color: C_DIM }}>{r.type}</p>
                      </div>
                    </div>
                  </div>
                  <DotArrow />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <PatternRail />
      </div>

      <style>{`
        .cr-root p, .cr-root h1, .cr-root h2 { margin: 0; }
        .cr-h1 {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 40px;
          line-height: 40px;
          letter-spacing: -0.01em;
          text-align: start;
          margin: 0;
        }

        .cr-row-title p { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161)); }
        .cr-row-loc p { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }

        .cr-row .cr-row-details { transition: padding 0.2s cubic-bezier(0.12, 0.23, 0.5, 1); }
        .cr-row:hover .cr-row-details { padding: 0 0 0 10px; }

        .cr-input::before {
          content: "";
          display: block;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          background-color: rgb(153, 153, 153);
          -webkit-mask-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22><path d=%22M7 2.5a5 5 0 0 1 4.13 7.82l2.03 2.03a.75.75 0 0 1-1.06 1.06l-2-2A5 5 0 1 1 7 2.5Zm-3.5 5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z%22 fill=%22%23999%22/></svg>');
          mask-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22><path d=%22M7 2.5a5 5 0 0 1 4.13 7.82l2.03 2.03a.75.75 0 0 1-1.06 1.06l-2-2A5 5 0 1 1 7 2.5Zm-3.5 5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z%22 fill=%22%23999%22/></svg>');
          -webkit-mask-size: 16px;
          mask-size: 16px;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: 50%;
          mask-position: 50%;
        }
        .cr-input::after {
          content: "";
          pointer-events: none;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          border: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
          transition: border-color 0.2s cubic-bezier(0.12, 0.23, 0.5, 1);
        }
        .cr-input:focus-within::after { border-color: var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)); }
        .cr-input input {
          flex: 1;
          width: auto;
          min-width: 0;
          padding: 0;
          height: 100%;
          background: none;
          border: none;
          outline: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0em;
          color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250));
        }
        .cr-input input::placeholder { color: var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115)); }

        @media (max-width: 1199.98px) {
          .cr-root { padding: 0; }
          .cr-container, .cr-col, .cr-hero { box-shadow: none; }
          .cr-rail { display: none; }
          .cr-h1 { font-size: 32px; line-height: 34px; }
        }

        @media (max-width: 809.98px) {
          .cr-hero { box-shadow: inset 0 1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)), inset 0 -1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)); }
          .cr-titlerow { flex-direction: column; align-content: flex-start; align-items: flex-start; padding: 32px 20px; }
          .cr-title { flex: none; width: 100%; }
          .cr-mid { flex-direction: column; gap: 40px 16px; padding: 40px 20px; }
          .cr-team { align-self: unset; flex: none; order: 0; justify-content: flex-start; gap: 40px; width: 100%; height: min-content; }
          .cr-desc { flex: none; order: 1; width: 100%; }
          .cr-jobshead { padding: 60px 20px 40px; }
          .cr-searchwrap { width: 100%; }

          .cr-row { padding: 12px 20px; }
          .cr-row-details { flex-direction: column; align-content: flex-start; align-items: flex-start; gap: 4px; }
          .cr-row:hover .cr-row-details { padding: 0 0 0 10px; }
          .cr-row-title { flex: none; order: 0; width: 100%; }
          .cr-row-meta { flex-wrap: wrap; flex: none; order: 1; gap: 4px 16px; width: 100%; }
          .cr-row-loc, .cr-row-type { white-space: pre; flex: none; width: auto; }
          .cr-row-title p { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }
          .cr-row-loc p { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)); }
          .cr-row-type p { font-size: 12px; line-height: 16px; }
        }
      `}</style>
    </div>
  );
}
