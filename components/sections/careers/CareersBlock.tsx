"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Sprite";
import { EASE } from "@/lib/motion";

const C_ACCENT = "var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))";
const C_DOTS = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";
const C_BTN_ICON = "var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))";
const C_ROUND_ICON = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";

/* -------------------------------------------------------------------- data */

/**
 * Every open role, in tree order. The list is inline content in the reference
 * tree (there is no external dataset), so it is transcribed verbatim here.
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

/** The 96px dotted rail either side of the content column (widest width only). */
function PatternRail() {
  return (
    <div className="cr-rail" aria-hidden="true">
      <svg width="100%" height="100%">
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

/** 6px live dot with the expanding ring loop: 0.3s out, 1s idle, forever. */
function LiveDot() {
  return (
    <div className="cr-ping">
      <div className="cr-ping-dot">
        <motion.div
          className="cr-ping-ring"
          initial={{ width: 2, height: 2, opacity: 1 }}
          animate={{ width: 18, height: 18, opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: [0.44, 0, 0.56, 1], repeat: Infinity, repeatDelay: 1 }}
          style={{ x: "-50%", y: "-50%" }}
        />
      </div>
    </div>
  );
}

/** Arrow-down glyph. Not in the shared sheet, so its path data lives here. */
function ArrowDown({ size = 14, color = C_BTN_ICON }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ width: size, height: size, flexShrink: 0, display: "block" }}>
      <path d="M 0 0 L 0 14" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke={color} transform="translate(12 5)" />
      <path d="M 14 0 L 7 7 L 0 0" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke={color} transform="translate(5 12)" />
    </svg>
  );
}

/**
 * The six-dot arrow. Only the first set is visible in the rest state; the other
 * three dots are the authored second pose and sit at opacity 0.
 * TODO(spec): the second pose is never triggered in the capture, so no trigger
 * is wired here either.
 */
function DotArrow() {
  return (
    <div className="cr-arrowwrap">
      <div className="cr-arrow">
        <i style={{ top: 4, left: -10, opacity: 0 }} />
        <i style={{ top: 10, left: -10, opacity: 0 }} />
        <i style={{ top: 7, left: -7, opacity: 0 }} />
        <i style={{ top: 4, left: 6, opacity: 1 }} />
        <i style={{ top: 10, left: 6, opacity: 1 }} />
        <i style={{ top: 7, left: 9, opacity: 1 }} />
      </div>
    </div>
  );
}

const BAR: CSSProperties = { zIndex: 1, flex: "none", width: "100%", position: "absolute", top: 0, bottom: 0, overflow: "visible" };
const SCREEN: CSSProperties = { ...BAR, mixBlendMode: "screen" };

/**
 * The 1px chromatic rule. Six bars grow out from the centre with mirrored
 * per-channel delays, once, when the whole 1px element is inside the viewport.
 */
function ChromaticRule() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 1, once: true });
  const bar = (delay: number, end: string, start: string) => ({
    animate: inView ? { width: "100%", backgroundColor: end } : { width: "0%", backgroundColor: start },
    transition: { type: "tween" as const, duration: 0.4, ease: EASE, delay },
  });
  const B = ["rgb(0, 0, 36)", "rgb(0, 0, 255)"] as const;
  const G = ["rgb(0, 37, 0)", "rgb(0, 255, 0)"] as const;
  const R = ["rgb(41, 0, 0)", "rgb(255, 0, 0)"] as const;

  return (
    <div className="cr-rulewrap">
      <div className="cr-rule" ref={ref}>
        <div className="cr-rule-half">
          <motion.div style={{ ...BAR, right: 0 }} {...bar(0.04, B[0], B[1])} />
          <motion.div style={{ ...SCREEN, right: 0 }} {...bar(0.02, G[0], G[1])} />
          <motion.div style={{ ...SCREEN, right: 0 }} {...bar(0, R[0], R[1])} />
        </div>
        <div className="cr-rule-half">
          <motion.div style={{ ...BAR, left: 0 }} {...bar(0, B[0], B[1])} />
          <motion.div style={{ ...SCREEN, left: 0 }} {...bar(0.02, G[0], G[1])} />
          <motion.div style={{ ...SCREEN, left: 0 }} {...bar(0.04, R[0], R[1])} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- block */

export function CareersBlock() {
  return (
    <div className="cr-root" data-section="Careers">
      <style>{CSS}</style>

      <div className="cr-container">
        <PatternRail />

        <div className="cr-col">
          {/* ------------------------------------------------ title row */}
          <div className="cr-titlerow">
            <div className="cr-title">
              <h1 className="cr-h1">Careers</h1>
            </div>

            <div className="cr-pillcol">
              <div className="cr-pill">
                <LiveDot />
                <div className="cr-pilltext">
                  <div>
                    <p className="t-micro">9</p>
                  </div>
                  <div>
                    <p className="t-micro">open</p>
                  </div>
                  <div>
                    <p className="t-micro">positions</p>
                  </div>
                </div>
                <div className="cr-jumpwrap">
                  <Link href="/careers#job-applications" className="cr-jump" aria-label="Jump to the open positions">
                    <ArrowDown />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------- hero image */}
          <div className="cr-hero">
            <div className="cr-heroimg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/img-958dd1645f.png" alt="Colleagues working together." width={1587} height={1058} />
            </div>
          </div>

          {/* ---------------------------------------------- mid two-up */}
          <div className="cr-mid">
            <div className="cr-team">
              <div className="cr-rt">
                <h2 className="t-h2 cr-h2">Build the intelligence layer for every company.</h2>
              </div>

              <div className="cr-people">
                <div className="cr-peopletext">
                  <div className="cr-rt">
                    <p className="t-xs cr-people-a">The people behind Nordwell</p>
                  </div>
                  <div className="cr-rt">
                    <p className="t-xs cr-people-b">Different backgrounds, one problem worth solving</p>
                  </div>
                </div>

                <div className="cr-faces">
                  {PEOPLE.map((p) => (
                    <div className="cr-face" key={p.src}>
                      <div className="cr-face-in">
                        <div className="cr-face-img">
                          <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.src} alt={p.alt} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cr-desc">
              <div className="cr-rt">
                <p className="t-body cr-copy">
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

              <div className="cr-morewrap">
                <Link href="/about-us" className="cr-more">
                  <div className="cr-more-t">
                    <p className="t-label">More about us</p>
                  </div>
                  <span className="cr-round">
                    <Icon id="2903821725" size={14} color={C_ROUND_ICON} strokeWidth={2} />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <ChromaticRule />

          {/* -------------------------------------------- jobs heading */}
          <div className="cr-jobshead" id="job-applications">
            <div className="cr-jobstitle">
              <div className="cr-rt">
                <h2 className="t-h2 cr-h2">We&apos;re hiring across the stack.</h2>
              </div>
              <div className="cr-rt">
                <p className="t-body cr-copy">All roles are remote unless noted. We care about the work, not the timezone.</p>
              </div>
            </div>

            <div className="cr-searchwrap">
              <label className="cr-label">
                <div className="cr-input">
                  {/* TODO(spec): the reference input is inert in the capture; no filter behaviour was observable. */}
                  <input type="text" placeholder="Search applications..." defaultValue="" aria-label="Search applications" />
                </div>
              </label>
            </div>
          </div>

          {/* ------------------------------------------------ job rows */}
          <div className="cr-jobs">
            {ROLES.map((r) => (
              <div className="cr-rowwrap" key={r.href}>
                <Link href={r.href} className="cr-row">
                  <div className="cr-row-details">
                    <div className="cr-row-title">
                      <p className="t-label">{r.title}</p>
                    </div>
                    <div className="cr-row-meta">
                      <div className="cr-row-loc">
                        <p className="t-label">{r.location}</p>
                      </div>
                      <div className="cr-row-type">
                        <p className="t-label">{r.type}</p>
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
    </div>
  );
}

/* --------------------------------------------------------------------- css */

const CSS = `
.cr-root {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px; width: 100%; padding: 0 64px; position: relative;
}
.cr-root p, .cr-root h1, .cr-root h2 { margin: 0; }

.cr-container {
  max-width: 1400px; height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 0; width: 100%; padding: 0; position: relative;
  box-shadow: inset 1px 0 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)),
              inset -1px 0 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}

.cr-rail { flex: none; align-self: stretch; width: 96px; height: auto; position: relative; }
.cr-rail svg { display: block; width: 100%; height: 100%; }

.cr-col {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: flex-start center; align-items: flex-start; gap: 0; width: 1px; padding: 0; position: relative;
  box-shadow: inset 1px 0 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)),
              inset -1px 0 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}

/* title row */
.cr-titlerow {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px; width: 100%; padding: 40px; position: relative;
}
.cr-title {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
}
.cr-h1 {
  font-family: var(--font-body); font-weight: 600; font-size: 40px; line-height: 40px;
  letter-spacing: -0.01em; text-align: start;
  color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250));
}
.cr-pillcol {
  display: flex; flex-flow: column nowrap; flex: none; place-content: flex-start center; align-items: flex-start;
  gap: 20px; width: min-content; height: min-content; padding: 0; position: relative;
}
.cr-pill {
  background-color: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10));
  height: min-content; overflow: clip; border-radius: 113px; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 12px; width: min-content; padding: 4px 4px 4px 12px; position: relative;
  box-shadow: inset 0 0 0 1px var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}
.cr-ping { z-index: 1; flex: none; width: auto; height: auto; position: relative; }
.cr-ping-dot {
  width: 6px; height: 6px; border-radius: 9999px; position: relative;
  background-color: var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144));
}
.cr-ping-ring {
  border-radius: 9999px; position: absolute; top: 50%; left: 50%;
  outline: 2px solid var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144));
}
.cr-pilltext {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 4px; width: min-content; padding: 0; position: relative;
}
.cr-pilltext > div { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.cr-pilltext p { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }
.cr-jumpwrap { flex: none; width: auto; height: auto; position: relative; }
.cr-jump {
  cursor: pointer; height: 26px; width: 26px; overflow: clip; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 4px; padding: 0; text-decoration: none; position: relative;
  background-color: var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38));
  border-radius: 52px;
  box-shadow: inset 0 0 0 1px var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(82, 82, 82));
}

/* hero */
.cr-hero {
  height: auto; aspect-ratio: 1.5; overflow: clip; flex: none; width: 100%; position: relative;
  box-shadow: inset 0 0 0 1px var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}
.cr-heroimg { position: absolute; border-radius: inherit; top: 0; right: 0; bottom: 0; left: 0; }
.cr-heroimg img {
  display: block; width: 100%; height: 100%; border-radius: inherit; object-position: center; object-fit: cover;
}

/* mid two-up */
.cr-mid {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 32px; width: 100%; padding: 40px; position: relative;
}
.cr-team {
  height: auto; overflow: clip; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center space-between; align-self: stretch; align-items: center; width: 1px; padding: 0; position: relative;
}
.cr-rt {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: none; width: 100%; height: auto; position: relative;
}
.cr-h2 { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }
.cr-copy { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161)); }
.cr-people {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center flex-end; align-items: center; gap: 8px; width: 100%; padding: 0; position: relative;
}
.cr-peopletext {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 2px; width: 100%; padding: 0; position: relative;
}
.cr-people-a { text-align: start; color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249)); }
.cr-people-b { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)); }
.cr-faces {
  flex: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center; gap: 0; width: 100%; height: 40px; padding: 0; position: relative;
}
.cr-face { flex: none; place-self: end start; width: 100%; height: 32px; position: relative; }
.cr-face-in {
  cursor: pointer; display: flex; flex-flow: row nowrap; place-content: center flex-start; align-items: center;
  gap: 10px; width: 100%; height: 100%; padding: 0; position: relative;
}
.cr-face-img {
  flex: none; width: 32px; height: 32px; position: relative; border-radius: 249px;
  box-shadow: inset 0 0 0 2px var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9));
}
.cr-face-img > div { position: absolute; border-radius: inherit; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; }
.cr-face-img img {
  display: block; width: 100%; height: 100%; border-radius: inherit; object-position: center; object-fit: cover;
}

.cr-desc {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: flex-start center; align-items: flex-start; gap: 32px; width: 1px; padding: 0; position: relative;
}
.cr-morewrap { flex: none; width: auto; height: auto; position: relative; }
.cr-more {
  cursor: pointer; height: min-content; overflow: clip; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 12px; width: min-content; padding: 0;
  text-decoration: none; position: relative;
}
.cr-more-t { user-select: none; white-space: pre; flex: none; width: auto; height: auto; position: relative; }
.cr-more-t p { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)); }
.cr-round {
  aspect-ratio: 1; height: auto; overflow: clip; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 4px; width: 26px; padding: 0; position: relative;
  background-color: var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38)); border-radius: 52px;
}

/* chromatic rule */
.cr-rulewrap { flex: none; width: 100%; height: auto; position: relative; }
.cr-rule {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; place-content: center;
  align-items: center; gap: 0; width: 100%; padding: 0; position: relative;
}
.cr-rule-half { height: 1px; overflow: clip; flex: 1 0 0; width: 1px; position: relative; }

/* jobs heading */
.cr-jobshead {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 40px; width: 100%;
  padding: 60px 40px 40px; scroll-margin-top: 68px; position: relative;
}
.cr-jobstitle {
  height: min-content; overflow: clip; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px; width: 100%; padding: 0; position: relative;
}
.cr-searchwrap { flex: none; width: 400px; height: auto; position: relative; }
.cr-label {
  cursor: pointer; display: flex; flex-flow: column nowrap; place-content: flex-start; align-items: flex-start;
  gap: 8px; width: 100%; height: min-content; padding: 0; position: relative;
}
.cr-input {
  flex: none; width: 100%; height: 40px; position: relative; display: flex; align-items: center;
  padding: 12px; border-radius: 12px; overflow: hidden;
  background: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
}
.cr-input::before {
  content: ""; display: block; flex-shrink: 0; width: 16px; height: 16px; margin-right: 8px;
  background-color: rgb(153, 153, 153);
  -webkit-mask-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22><path d=%22M7 2.5a5 5 0 0 1 4.13 7.82l2.03 2.03a.75.75 0 0 1-1.06 1.06l-2-2A5 5 0 1 1 7 2.5Zm-3.5 5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z%22 fill=%22%23999%22/></svg>');
  mask-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22><path d=%22M7 2.5a5 5 0 0 1 4.13 7.82l2.03 2.03a.75.75 0 0 1-1.06 1.06l-2-2A5 5 0 1 1 7 2.5Zm-3.5 5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z%22 fill=%22%23999%22/></svg>');
  -webkit-mask-size: 16px; mask-size: 16px;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: 50%; mask-position: 50%;
}
.cr-input::after {
  content: ""; pointer-events: none; box-sizing: border-box; position: absolute; top: 0; left: 0;
  width: 100%; height: 100%; border-radius: 12px;
  border: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
  transition: border-color 0.2s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.cr-input:focus-within::after { border-color: var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60)); }
.cr-input input {
  flex: 1; width: auto; min-width: 0; padding: 0; height: 100%; background: none; border: none; outline: none;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: var(--font-body); font-weight: 500; font-size: 14px; line-height: 20px; letter-spacing: 0em;
  color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250));
}
.cr-input input::placeholder { color: var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115)); }

/* job rows */
.cr-jobs {
  display: flex; flex-flow: column nowrap; flex: none; place-content: flex-start center; align-items: flex-start;
  gap: 0; width: 100%; height: min-content; padding: 0 0 60px; position: relative;
}
.cr-rowwrap { flex: none; width: 100%; height: auto; position: relative; }
.cr-row {
  cursor: pointer; display: flex; flex-flow: row nowrap; place-content: center flex-start; align-items: center;
  gap: 10px; width: 100%; height: min-content; padding: 20px 40px; text-decoration: none; position: relative;
  background-color: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10));
  box-shadow: inset 0 -1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
}
.cr-row-details {
  height: min-content; overflow: clip; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  place-content: center flex-start; align-items: center; gap: 16px; width: 1px; padding: 0; position: relative;
  transition: padding 0.2s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.cr-row:hover .cr-row-details { padding: 0 0 0 10px; }
.cr-row-title, .cr-row-type {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 0.8 0 0; width: 1px; height: auto; position: relative;
}
.cr-row-meta {
  display: flex; flex-flow: row nowrap; flex: 1 0 0; place-content: center flex-start; align-items: center;
  gap: 16px; width: 1px; height: min-content; padding: 0; position: relative; overflow: visible;
}
.cr-row-loc {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
}
.cr-row-title p { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161)); }
.cr-row-loc p { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }
.cr-row-type p { color: var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115)); }

.cr-arrowwrap { flex: none; width: 16px; height: 16px; position: relative; }
.cr-arrow {
  width: 16px; height: 16px; position: relative; overflow: visible;
  -webkit-mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%);
}
.cr-arrow i {
  height: 2px; width: 2px; overflow: clip; flex: none; position: absolute; border-radius: 36px;
  background-color: var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161));
}

@media (max-width: 1199.98px) {
  .cr-root { padding: 0; }
  .cr-container, .cr-col, .cr-hero { box-shadow: none; }
  .cr-rail { display: none; }
  .cr-h1 { font-size: 32px; line-height: 34px; }
}

@media (max-width: 809.98px) {
  .cr-hero {
    box-shadow: inset 0 1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38)),
                inset 0 -1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));
  }
  .cr-titlerow { flex-direction: column; align-content: flex-start; align-items: flex-start; padding: 32px 20px; }
  .cr-title { flex: none; width: 100%; }
  .cr-mid { flex-direction: column; gap: 40px 16px; padding: 40px 20px; }
  .cr-team { align-self: unset; flex: none; order: 0; justify-content: flex-start; gap: 40px; width: 100%; height: min-content; }
  .cr-desc { flex: none; order: 1; width: 100%; }
  .cr-jobshead { padding: 60px 20px 40px; }
  .cr-searchwrap { width: 100%; }
  .cr-row { padding: 12px 20px; }
  .cr-row-details { flex-direction: column; align-content: flex-start; align-items: flex-start; gap: 4px; }
  .cr-row-title { flex: none; order: 0; width: 100%; }
  .cr-row-meta { flex-wrap: wrap; flex: none; order: 1; gap: 4px 16px; width: 100%; }
  .cr-row-loc, .cr-row-type { white-space: pre; flex: none; width: auto; }
  .cr-row-title p { color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250)); }
  .cr-row-loc p { color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158)); }
  .cr-row-type p { font-size: 12px; line-height: 16px; }
}
`;
