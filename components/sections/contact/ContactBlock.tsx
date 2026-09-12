"use client";

import { useId } from "react";
import { motion } from "motion/react";

import { SPRING } from "@/lib/motion";
import { ContactForm } from "./ContactForm";

/* ------------------------------------------------------------------ tokens */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const FORM_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const DOT = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";
const BTN_BG = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const BTN_BG_HOVER = "var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))";

/* -------------------------------------------------------------------- data */
const DEPARTMENTS = ["Sales:", "Support:", "Partnerships:"];
const EMAILS = ["sales@nordwell.io", "support@nordwell.io", "partnerships@nordwell.io"];

/** Outbound marks, drawn inline: these ids are not on the shared sprite sheet. */
const GLYPHS: { label: string; href: string; path: string }[] = [
  {
    label: "X",
    href: "https://x.com/",
    path:
      "M 19.043 13.55 L 30.958 0 L 28.135 0 L 17.79 11.766 L 9.529 0 L 0 0 L 12.493 17.79 L 0 32 " +
      "L 2.823 32 L 13.746 19.576 L 22.471 32 L 32 32 Z M 15.178 17.948 L 13.911 16.176 L 3.843 2.08 " +
      "L 8.176 2.08 L 16.305 13.456 L 17.57 15.228 L 28.137 30.014 L 23.8 30.014 Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    path:
      "M 32 2.352 L 32 29.646 C 32.001 30.27 31.753 30.87 31.311 31.311 C 30.87 31.753 30.27 32.001 29.646 32 " +
      "L 2.352 32 C 1.728 32 1.129 31.752 0.688 31.31 C 0.247 30.869 -0.001 30.27 0 29.646 L 0 2.352 " +
      "C 0 1.053 1.053 0 2.352 0 L 29.646 0 C 30.27 -0.001 30.869 0.247 31.31 0.688 C 31.752 1.129 32 1.728 32 2.352 Z " +
      "M 9.412 12.236 L 4.706 12.236 L 4.706 27.296 L 9.412 27.296 Z M 9.836 7.058 C 9.841 6.339 9.56 5.648 9.055 5.136 " +
      "C 8.55 4.625 7.863 4.335 7.144 4.33 L 7.058 4.33 C 5.55 4.33 4.328 5.552 4.328 7.06 C 4.328 8.568 5.55 9.79 7.058 9.79 " +
      "C 7.777 9.808 8.475 9.54 8.996 9.043 C 9.517 8.547 9.819 7.864 9.836 7.144 Z M 27.296 18.146 " +
      "C 27.296 13.618 24.416 11.858 21.554 11.858 C 19.647 11.762 17.832 12.688 16.79 14.288 L 16.66 14.288 " +
      "L 16.66 12.236 L 12.236 12.236 L 12.236 27.296 L 16.94 27.296 L 16.94 19.282 C 16.799 17.576 18.057 16.074 19.762 15.914 " +
      "L 19.942 15.914 C 21.438 15.914 22.548 16.854 22.548 19.226 L 22.548 27.292 L 27.254 27.292 L 27.294 18.144 Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    path:
      "M 16 0 C 7.163 0 0 7.345 0 16.406 C -0.001 23.469 4.406 29.739 10.94 31.972 C 11.74 32.126 12.034 31.619 12.034 31.182 " +
      "C 12.034 30.793 12.02 29.761 12.014 28.393 C 7.562 29.384 6.624 26.193 6.624 26.193 C 5.896 24.3 4.844 23.793 4.844 23.793 " +
      "C 3.394 22.776 4.956 22.797 4.956 22.797 C 6.562 22.911 7.406 24.486 7.406 24.486 C 8.834 26.995 11.152 26.271 12.066 25.85 " +
      "C 12.21 24.79 12.622 24.066 13.08 23.656 C 9.526 23.246 5.792 21.835 5.792 15.549 C 5.792 13.759 6.412 12.294 7.438 11.146 " +
      "C 7.258 10.732 6.718 9.065 7.578 6.805 C 7.578 6.805 8.918 6.364 11.978 8.486 C 13.282 8.122 14.627 7.936 15.978 7.932 " +
      "C 17.329 7.936 18.674 8.122 19.978 8.486 C 23.018 6.364 24.358 6.805 24.358 6.805 C 25.218 9.065 24.678 10.732 24.518 11.146 " +
      "C 25.595 12.344 26.182 13.92 26.158 15.549 C 26.158 21.851 22.418 23.24 18.858 23.644 C 19.418 24.136 19.938 25.141 19.938 26.679 " +
      "C 19.938 28.873 19.918 30.637 19.918 31.17 C 19.918 31.601 20.198 32.113 21.018 31.949 C 27.571 29.749 32.002 23.477 32 16.406 " +
      "C 32 7.345 24.837 0 16 0 Z",
  },
];

function Dots({ patternId }: { patternId: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ height: "100%", width: "100%" }}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect x="4" y="4" width="1.5" height="1.5" fill={DOT} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/** A 32px outbound square. Only the background moves, on the house spring. */
function GlyphLink({ label, href, path }: { label: string; href: string; path: string }) {
  return (
    <motion.a
      className="ct-glyph"
      href={href}
      aria-label={label}
      initial={false}
      style={{ backgroundColor: BTN_BG }}
      whileHover={{ backgroundColor: BTN_BG_HOVER }}
      transition={SPRING}
    >
      <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true" focusable="false">
        <path d={path} fill={BRIGHT} />
      </svg>
    </motion.a>
  );
}

/**
 * The contact block. Two stacked rows inside one bordered column: the form row,
 * a two-up grid of copy and fields that collapses to one column under 1200 and
 * stacks entirely under 810, and the contacts row beneath it.
 *
 * Every hairline here is an overlay: an inset shadow or an absolutely
 * positioned span, never a real border, because the block's height is exact at
 * all four widths (712 / 804 / 812 / 1048) and a real border would add 2px per
 * edge to boxes that are measured.
 *
 * The dotted gutters either side are hidden below 1200, which is also where the
 * block loses its 64px page padding and goes full bleed.
 */
export function ContactBlock() {
  const uid = useId().replace(/:/g, "");

  return (
    <section className="ct-root" data-block="Contact Us">
      <style>{CSS}</style>

      <div className="ct-container">
        <div className="ct-pattern">
          <Dots patternId={`ct-dots-l-${uid}`} />
        </div>

        <div className="ct-inner">
          {/* ------------------------------------------------------ form row */}
          <div className="ct-formrow">
            <div className="ct-split">
              <div className="ct-title">
                <div className="ct-title-stack">
                  <div className="ct-rt">
                    <h1 className="ct-t-title" style={{ color: BRIGHT }}>
                      Let&#39;s connect the dots.
                    </h1>
                  </div>
                  <div className="ct-rt">
                    <p className="t-body" style={{ textAlign: "start", color: MUTED }}>
                      Questions about Nordwell, pricing, or your data setup? Reach the right team in
                      under a minute.
                    </p>
                  </div>
                </div>
                <div className="ct-rt">
                  <p className="t-xs" style={{ textAlign: "start", color: MUTED }}>
                    You can also email us at sales@nordwell.io
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>

          {/* -------------------------------------------------- contacts row */}
          <div className="ct-contactsrow">
            <div className="ct-contacts">
              <div className="ct-cols">
                <div className="ct-depts">
                  {DEPARTMENTS.map((d) => (
                    <div className="ct-dept" key={d}>
                      <p className="t-mono" style={{ color: MUTED }}>
                        {d}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="ct-emails">
                  {EMAILS.map((e) => (
                    <div className="ct-email" key={e}>
                      <p className="t-mono" style={{ color: BRIGHT }}>
                        <a className="ct-mail" href={`mailto:${e}`}>
                          {e}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ct-external">
                {GLYPHS.map((g) => (
                  <GlyphLink key={g.label} {...g} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ct-pattern">
          <Dots patternId={`ct-dots-r-${uid}`} />
        </div>
      </div>
    </section>
  );
}

const CSS = `
/* ------------------------------------------------------------- block shell */
.ct-root {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ct-container {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}
.ct-pattern { position: relative; flex: none; align-self: stretch; width: 96px; height: auto; }
.ct-inner {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE};
}

/* ---------------------------------------------------------------- form row */
.ct-formrow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 40px 0; overflow: clip;
}
.ct-split {
  position: relative; display: grid; flex: 1 0 0;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center; gap: 0; width: 1px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 0 1px 0 0 ${LINE}, inset 0 -1px 0 0 ${LINE};
}
.ct-title {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: space-between; align-items: center;
  place-self: start; width: 100%; height: 100%; padding: 32px; overflow: clip;
  box-shadow: inset -1px 0 0 0 ${LINE};
}
.ct-title-stack {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ct-rt {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ct-t-title {
  font-family: var(--font-body); font-weight: 600; font-size: 24px; line-height: 28px;
  letter-spacing: 0.005em; text-align: start;
}

/* -------------------------------------------------------------------- form */
.ct-form {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  place-self: start; gap: 24px; width: 100%; height: min-content; padding: 32px; overflow: visible;
  background-color: ${FORM_BG};
  box-shadow: inset 0 1px 0 0 ${LINE};
}
.ct-inputs {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ct-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(2, min-content);
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: min-content;
  justify-content: center; gap: 12px 20px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ct-cell { position: relative; flex: none; place-self: start; width: 100%; height: auto; }
.ct-cell--wide { grid-column: span 2; }
.ct-cell--tall { height: 160px; }

/* ------------------------------------------------------------------- field */
.ct-field {
  position: relative; display: flex; flex-flow: column nowrap;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 4px; width: 100%; height: 84px; padding: 0; cursor: pointer;
}
.ct-field--fill { height: 100%; }
.ct-label-stack {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 8px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.ct-label-text {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ct-input-wrap {
  position: relative; display: flex; flex: none; align-items: center;
  width: 100%; height: auto; padding: 10px 12px; border-radius: 8px; overflow: hidden;
}
.ct-field--fill .ct-input-wrap { flex: 1 0 0; height: 1px; }
.ct-input-wrap--area { padding: 0; }
.ct-input {
  flex: 1; width: auto; min-width: 0; padding: 0; margin: 0;
  font-family: var(--font-sans), sans-serif; font-weight: 400; font-size: 14px;
  line-height: 20px; letter-spacing: 0em;
  color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250));
  background: none; border: none; outline: none; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}
.ct-input::placeholder {
  color: var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108));
}
.ct-input-wrap--area textarea.ct-input {
  width: 100%; height: 100%; padding: 10px 12px; resize: none;
  white-space: break-spaces; overflow-y: auto; display: flex;
}
.ct-error {
  position: relative; flex: none; width: 100%; height: auto; pointer-events: none;
  -webkit-user-select: none; user-select: none;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}

/* --------------------------------------------------------- consent + submit */
.ct-footrow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 24px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ct-consent {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 1px; height: min-content; padding: 0; overflow: clip;
}
.ct-consent-box {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; cursor: pointer; overflow: visible;
}
.ct-checkbox {
  --ct-check-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M 4 8 L 6.5 10.5 L 11.5 5.5' fill='transparent' stroke-width='2' stroke='rgb(255,255,255)' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  position: relative; flex: none; width: 16px; height: 16px; margin: 0;
  -webkit-appearance: none; appearance: none; border: none; border-radius: 4px;
  display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
}
.ct-checkbox::before {
  content: ""; position: absolute; inset: 0; opacity: 0;
  background-color: rgb(255, 255, 255);
  -webkit-mask-image: var(--ct-check-mask); mask-image: var(--ct-check-mask);
  -webkit-mask-position: 50%; mask-position: 50%;
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  transition: opacity 0.15s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.ct-checkbox:checked::before { opacity: 1; }
.ct-consent-text {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ct-policy {
  color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249));
  text-decoration: underline;
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1),
    text-decoration-color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1),
    text-decoration-thickness 0.15s cubic-bezier(0.12, 0.23, 0.5, 1),
    text-underline-offset 0.15s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.ct-submit-slot { position: relative; flex: none; width: auto; height: auto; }
.ct-submit {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100px; height: 32px; padding: 0 12px; overflow: visible;
  border: 0; border-radius: 8px; cursor: pointer;
  -webkit-appearance: none; appearance: none;
}
.ct-submit-label {
  position: relative; flex: none; width: auto; height: auto; white-space: pre;
  -webkit-user-select: none; user-select: none;
}

/* ------------------------------------------------------------ contacts row */
.ct-contactsrow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 0 40px; overflow: clip;
}
.ct-contacts {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: flex-end; justify-content: space-between; align-items: flex-end;
  width: 1px; height: min-content; padding: 32px; overflow: clip;
  box-shadow: inset 0 1px 0 0 ${LINE}, inset 0 -1px 0 0 ${LINE};
}
.ct-cols {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ct-depts, .ct-emails {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 4px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ct-dept, .ct-email { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ct-mail {
  text-decoration: none;
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.ct-mail:hover { text-decoration: underline; }
.ct-external {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ct-glyph {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 32px; height: 32px; padding: 0; overflow: visible;
  text-decoration: none; cursor: pointer; border-radius: 6px;
  box-shadow: inset 0 0 0 1px ${LINE}, 0 1px 2px 0 rgba(0, 0, 0, 0.25);
}

/* --------------------------------------------------------------- <= 1199px */
@media (max-width: 1199.98px) {
  .ct-root { padding: 0; }
  .ct-container { box-shadow: none; }
  .ct-inner { box-shadow: none; }
  .ct-pattern { display: none; }
  .ct-grid { grid-template-columns: repeat(1, minmax(50px, 1fr)); }
  .ct-cell--wide { grid-column: span 1; }
}
@media (min-width: 810px) and (max-width: 1199.98px) {
  .ct-title, .ct-contacts { padding: 30px; }
}

/* ---------------------------------------------------------------- <= 809px */
@media (max-width: 809.98px) {
  .ct-split {
    grid-template-rows: repeat(1, min-content);
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-auto-rows: min-content;
  }
  .ct-title { justify-content: flex-start; gap: 20px; height: min-content; padding: 32px 20px; }
  .ct-form { padding: 20px; }
  .ct-footrow { flex-direction: column; align-content: flex-start; align-items: flex-start; }
  .ct-consent { flex: none; width: 100%; }
  .ct-submit-slot { width: 100%; }
  .ct-submit { width: 100%; }
  .ct-contacts {
    flex-direction: column; align-content: flex-start; justify-content: flex-start;
    align-items: flex-start; gap: 24px; padding: 20px;
  }
  .ct-cols { gap: 0; justify-content: space-between; width: 100%; }
  .ct-emails { flex: 1 0 0; width: 1px; }
  .ct-email {
    white-space: pre-wrap; word-break: break-word; word-wrap: break-word; width: 100%;
  }
  .ct-email p { text-align: right; }
}
`;
