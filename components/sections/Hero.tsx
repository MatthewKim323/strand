"use client";

import dynamic from "next/dynamic";
import { motion, type Transition } from "motion/react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/Button";
import { AnnouncementTicker } from "./hero/AnnouncementTicker";

/**
 * The hero graphic is owned by another module. Load it lazily and fall back to
 * nothing so the section's boxes (and therefore its height) are identical
 * whether or not the graphic is present.
 */
const FilamentField = dynamic(
  () =>
    import("@/components/webgl/FilamentField")
      .then((m) => m.FilamentField)
      .catch(() => () => null),
  { ssr: false },
);

/** An overlay border: never a real border, which would grow the box. */
const overlay = (style: CSSProperties): CSSProperties => ({
  content: '""',
  position: "absolute",
  inset: 0,
  boxSizing: "border-box",
  borderStyle: "solid",
  borderRadius: "inherit",
  pointerEvents: "none",
  borderWidth: 0,
  ...style,
});

/**
 * The announcement strip's own transition, and the pill's. Hovering the strip
 * changes exactly two things: the pill's background, on the pill's spring, and
 * the dot row's offset, on the strip's 0.3s tween. Nothing else moves: the
 * strip keeps its background, the dot arrow keeps its variant, no scale, no
 * shadow.
 */
const STRIP_TWEEN: Transition = { type: "tween", duration: 0.3, ease: [0.12, 0.23, 0.5, 1], delay: 0 };
const STRIP_SPRING: Transition = { type: "spring", bounce: 0.2, duration: 0.4, delay: 0 };

const PILL = {
  rest: { backgroundColor: "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))" },
  hover: { backgroundColor: "var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))" },
};

/** `left: 0 -> 4px` in the source; written here as the equivalent x offset. */
const DOT_ROW = {
  rest: { x: 0, y: "-50%" },
  hover: { x: 4, y: "-50%" },
};

/**
 * The dot arrow's six dots, at the component's resting variant. The other
 * variant (the dots marching one box to the right) is authored in the source
 * but never triggered on this page, so three dots sit visible on the right and
 * three sit hidden on the left, and none of them ever move or loop.
 */
const DOTS: Array<{ top: number; left: number; opacity: 0 | 1 }> = [
  { top: 4, left: -10, opacity: 0 },
  { top: 10, left: -10, opacity: 0 },
  { top: 7, left: -7, opacity: 0 },
  { top: 4, left: 6, opacity: 1 },
  { top: 10, left: 6, opacity: 1 },
  { top: 7, left: 9, opacity: 1 },
];

function DotArrow() {
  return (
    <div className="hero-dots">
      {DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: 2,
            height: 2,
            borderRadius: 36,
            opacity: d.opacity,
            overflow: "hidden",
            flex: "none",
            backgroundColor:
              "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <div className="hero-root" id="hero">
      <style>{CSS}</style>

      <div className="hero-container">
        <span
          className="hero-container-line"
          style={overlay({
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(34, 34, 34))",
          })}
        />

        {/* New Container */}
        <motion.div
          className="hero-announce"
          initial={{ opacity: 0.001 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0 }}
        >
          <span
            style={overlay({
              borderBottomWidth: 1,
              borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))",
            })}
          />
          <motion.a
            className="hero-announce-link"
            href="/blog/introducing-ask-query-your-entire-stack-in-plain-language"
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            {/* the "New" pill: swaps to its hover variant on the strip's spring */}
            <motion.div className="hero-pill" variants={PILL} transition={STRIP_SPRING}>
              <span
                style={overlay({
                  borderWidth: 1,
                  borderColor:
                    "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))",
                })}
              />
              <p
                className="t-micro"
                style={{
                  whiteSpace: "pre",
                  flex: "none",
                  color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))",
                }}
              >
                New
              </p>
            </motion.div>

            {/* Message */}
            <div className="hero-message">
              <motion.div className="hero-dots-holder" variants={DOT_ROW} transition={STRIP_TWEEN}>
                <DotArrow />
              </motion.div>
              <div className="hero-ticker-holder">
                <AnnouncementTicker text="Introducing Ask: Query your entire stack in plain language" />
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* Content */}
        <div className="hero-content">
          <div className="hero-title-col">
            <span className="hero-title-line" style={overlay({ borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))" })} />
            <div className="hero-title-wrap">
              <div className="hero-title-inner">
                <motion.div
                  className="hero-text-block"
                  initial={{ opacity: 0.001, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0.1 }}
                >
                  <h1
                    className="t-d1"
                    style={{
                      color: "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))",
                    }}
                  >
                    The missing connection layer
                  </h1>
                </motion.div>
                <motion.div
                  className="hero-text-block"
                  initial={{ opacity: 0.001, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0.2 }}
                >
                  <p
                    className="t-body"
                    style={{
                      color: "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))",
                    }}
                  >
                    Nordwell builds a living knowledge graph across every tool in your stack. Ask
                    questions in plain language. Get answers no single source could provide alone.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="hero-ctas"
                initial={{ opacity: 0.001, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "tween", duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0.3 }}
              >
                <div className="hero-cta-slot">
                  <Button href="/pricing" variant="primary" size="xl" height="100%">
                    Connect a source
                  </Button>
                </div>
                <div className="hero-cta-slot">
                  <Button href="/contact-us" variant="secondary" size="xl" height="100%">
                    Book a demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Main Graphic */}
          <div className="hero-graphic">
            <div className="hero-graphic-box">
              <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 1 }}>
                  <FilamentField />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.hero-root {
  height: min-content;
  overflow: clip;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 64px;
  position: relative;
}
.hero-container {
  max-width: 1400px;
  height: min-content;
  overflow: clip;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: flex-start;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  padding: 0;
  position: relative;
}
.hero-announce {
  height: min-content;
  overflow: clip;
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center flex-start;
  align-items: center;
  gap: 0;
  width: 50%;
  padding: 0;
  position: relative;
}
.hero-announce-link {
  cursor: pointer;
  height: min-content;
  overflow: clip;
  padding: 20px 0 20px 40px;
  display: flex;
  flex-flow: row;
  place-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-decoration: none;
  position: relative;
  flex: 1 0 0;
}
.hero-pill {
  height: min-content;
  overflow: clip;
  display: flex;
  flex-flow: column;
  place-content: center;
  align-items: center;
  gap: 16px;
  width: min-content;
  padding: 4px 8px;
  position: relative;
  flex: none;
  border-radius: 321px;
  background-color: var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23));
}
.hero-message {
  display: flex;
  flex-flow: row;
  flex: 1 0 0;
  place-content: center flex-start;
  align-items: center;
  gap: 8px;
  width: 1px;
  height: 24px;
  padding: 0 0 0 24px;
  position: relative;
  overflow: visible;
}
/* The offset and the -50% centring are both motion values; see DOT_ROW. */
.hero-dots-holder {
  z-index: 1;
  flex: none;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 0;
}
.hero-dots {
  width: 16px;
  height: 16px;
  position: relative;
  overflow: visible;
  -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%);
  mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%);
}
.hero-ticker-holder {
  flex: 1 0 0;
  width: 1px;
  height: auto;
  position: relative;
}
.hero-ticker-run { animation: hero-ticker-slide linear infinite; }
@keyframes hero-ticker-slide {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}
.hero-content {
  flex: none;
  display: grid;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  justify-content: center;
  gap: 0;
  width: 100%;
  height: 578px;
  padding: 0;
  position: relative;
  overflow: visible;
}
.hero-title-col {
  height: 100%;
  overflow: clip;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center;
  place-self: start;
  align-items: center;
  gap: 0;
  width: 100%;
  padding: 40px;
  position: relative;
}
.hero-title-line { display: none; }
.hero-title-wrap {
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 40px;
  width: 100%;
  height: min-content;
  padding: 0;
  position: relative;
  overflow: visible;
}
.hero-title-inner {
  height: min-content;
  overflow: clip;
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 0;
  position: relative;
}
.hero-text-block {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  flex: none;
  width: 100%;
  height: auto;
  position: relative;
  text-align: start;
}
.hero-ctas {
  display: flex;
  flex-flow: row;
  flex: none;
  place-content: center flex-start;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: min-content;
  padding: 0;
  position: relative;
  overflow: visible;
}
.hero-cta-slot { flex: none; width: auto; height: 40px; position: relative; }
.hero-graphic {
  display: flex;
  flex-flow: column;
  flex: none;
  place-content: center flex-end;
  place-self: start;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  overflow: visible;
}
.hero-graphic-box { flex: none; width: 562px; height: 643px; position: relative; }

@media (max-width: 1199.98px) {
  .hero-root { padding: 0; }
  .hero-container-line { display: none; }
  .hero-title-wrap { gap: 32px; }
  .hero-graphic { justify-content: center; }
  .hero-graphic-box { width: 405px; height: 500px; }
}

@media (max-width: 809.98px) {
  .hero-announce { width: 100%; }
  /* The link's padding is a per-breakpoint component prop: it computes to
     20px 0 20px 40px at 1440 / 1024 / 810 and to 20px at 390. */
  .hero-announce-link { padding: 20px; }
  .hero-content {
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: center;
    height: min-content;
  }
  .hero-title-col {
    align-self: unset;
    order: 1;
    height: min-content;
    padding: 40px 20px;
  }
  .hero-title-line { display: block; border-bottom-width: 1px; }
  .hero-title-inner { gap: 12px; }
  .hero-text-block { text-align: center; }
  .hero-ctas { justify-content: center; }
  .hero-graphic {
    align-self: unset;
    order: 0;
    justify-content: center;
    height: 484px;
  }
  .hero-graphic-box { width: 379px; height: 462px; }
}
`;
