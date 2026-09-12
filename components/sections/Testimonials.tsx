"use client";

import { useState } from "react";
import { MotionConfig, motion } from "motion/react";

import { Icon } from "@/components/ui/Sprite";
import { ChromaticRule } from "./testimonials/ChromaticRule";

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const PANEL = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(17, 15, 13))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";

/** Arrow button palette, straight off the button component's variant table. */
const BTN_LIGHT = "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))";
const BTN_LIGHT_HOVER = "var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))";
const BTN_LIGHT_PRESSED = "var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))";
const BTN_LIGHT_ICON = "var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))";
const BTN_OFF = "var(--token-5f5af133-2080-4ffb-a775-1ed7714f667c, rgb(68, 64, 59))";
const BTN_OFF_ICON = "var(--token-4a066b0b-c929-4483-845f-f6c69bce15cb, rgb(121, 113, 107))";

/**
 * The carousel's own transition constant, quoted from the slide component:
 * a spring with bounce 0.2 over 0.4s, no delay. The arrow button component
 * declares the identical constant for its hover and press states.
 */
const SLIDE = { type: "spring" as const, bounce: 0.2, duration: 0.4, delay: 0 };

type Slide = {
  stat: string;
  statLabel: string;
  quote: string;
  name: string;
  role: string;
  image: string;
  alt: string;
};

/** Three slides, exactly as the page hands them to the carousel. */
const SLIDES: Slide[] = [
  {
    stat: "12 hours",
    statLabel: "saved per week across the ops team",
    quote:
      '"Pulse caught a churn spike three weeks before our dashboards would have shown it. That gap used to cost us accounts."',
    name: "Priya Nair",
    role: "Head of Customer Success @ Fieldstone",
    image: "/img/img-3142d1b742.png",
    alt: "Picture of Priya Nair for their testimonial.",
  },
  {
    stat: "3 tools",
    statLabel: "replaced with a single graph",
    quote:
      '"Our analysts stopped exporting CSVs and started asking questions. That shift alone paid for the platform."',
    name: "Marcus Webb",
    role: "Director of Data @ Northlane",
    image: "/img/img-261c2354ba.png",
    alt: "Picture of Marcus Webb for their testimonial.",
  },
  {
    stat: "80%",
    statLabel: "less time spent building reports",
    quote:
      '"We used to stitch together Salesforce, Stripe, and Postgres by hand every Monday. Now it\'s one conversation."',
    name: "Jordan Keller",
    role: "VP of Operations @ Luminous",
    image: "/img/img-e258a9344b.png",
    alt: "Picture of Jordan Keller for their testimonial.",
  },
];

const CSS = `
.tm-section {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.tm-container {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${HAIRLINE}, inset -1px 0 0 0 ${HAIRLINE};
}
.tm-slot { position: relative; flex: none; width: 100%; max-width: 1400px; height: auto; }
.tm-slot-rule { z-index: 1; }

.tm-slide {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: flex-end; justify-content: center; align-items: flex-end;
  gap: 0; width: 100%; max-width: 100%; height: min-content; padding: 0; overflow: clip;
  background-color: ${PANEL};
}
.tm-content {
  position: relative; display: flex; flex: 1 0 0;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 0; overflow: visible;
}
.tm-headline {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: flex-start; align-items: flex-start;
  gap: 12px; width: 100%; height: min-content; padding: 40px 0 40px 40px; overflow: clip;
  box-shadow: inset 0 1px 0 0 ${HAIRLINE};
}
.tm-text {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.tm-text > *, .tm-line > * { margin: 0; }

.tm-tn {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: flex-end; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.tm-portrait-fill {
  position: absolute; z-index: 0; flex: none; inset: 0; overflow: clip; display: none;
}
.tm-quote-grid {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(3, minmax(50px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.tm-filler { position: relative; flex: none; place-self: start; width: 100%; height: 100%; overflow: visible; }
.tm-quote-box {
  position: relative; display: flex; flex: none; grid-column: span 2;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  place-self: start; gap: 32px; width: 100%; height: min-content; padding: 40px 0; overflow: visible;
  box-shadow: inset 0 1px 0 0 ${HAIRLINE};
}
.tm-quote {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.tm-quote-text { text-align: right; }

.tm-nav-name {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 0 0 40px 40px; overflow: clip;
  -webkit-user-select: none; user-select: none;
}
.tm-nav {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.tm-nav-slot { position: relative; flex: none; width: auto; height: auto; }
.tm-name {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: flex-end; justify-content: center; align-items: flex-end;
  gap: 4px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.tm-line { position: relative; flex: none; width: auto; height: auto; white-space: pre; }

.tm-btn {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: 26px; height: 26px; padding: 0; overflow: clip;
  border: 0; border-radius: 52px; text-decoration: none; cursor: pointer;
  -webkit-appearance: none; appearance: none;
}
.tm-btn[disabled] { cursor: not-allowed; }

.tm-portrait { position: relative; flex: none; width: 500px; height: 600px; overflow: clip; }
.tm-portrait-inner { position: absolute; inset: 0; border-radius: inherit; }
.tm-portrait-inner > img { width: 100%; height: 100%; border-radius: inherit; object-fit: contain; }

.tm-rule {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.tm-rule-half { position: relative; flex: 1 0 0; width: 1px; height: 1px; overflow: clip; }
.tm-rule-bar { position: absolute; z-index: 1; flex: none; top: 0; bottom: 0; width: 100%; overflow: visible; }

/* The stat caption and the pull quote drop from the 20/28 preset to the
   16/24 one below 1200, exactly as .t-body declares them. */
@media (max-width: 1199.98px) {
  .tm-section { padding: 0; }
  .tm-container { box-shadow: none; }
  .tm-tswap { font-size: 16px; line-height: 24px; }
  .tm-filler { display: none; }
  .tm-quote-box { grid-column: span 3; padding: 40px 0 40px 80px; }
  .tm-portrait { width: 400px; height: 500px; }
}
@media (max-width: 809.98px) {
  .tm-slide { flex-direction: column; }
  .tm-content { flex: none; order: 1; width: 100%; }
  .tm-headline { padding: 40px 20px 0; }
  .tm-tn { height: 600px; }
  .tm-portrait-fill { display: block; }
  .tm-portrait { display: none; }
  .tm-quote-box { grid-column: span 3; padding: 40px 20px 20px; box-shadow: none; }
  .tm-quote-text { text-align: start; }
  .tm-nav-name { align-content: flex-end; align-items: flex-end; padding: 0 20px 40px; }
  .tm-nav { order: 1; }
  .tm-name { order: 0; align-content: flex-start; align-items: flex-start; }
}
`;

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const iconId = dir === "prev" ? "3938257237" : "2903821725";
  const label = dir === "prev" ? "Previous testimonial" : "Next testimonial";
  /* Captured once so the server paint is right without React rewriting the
     inline value later, which would cut the spring short. */
  const [mountTint] = useState(disabled ? BTN_OFF_ICON : BTN_LIGHT_ICON);

  return (
    <div className="tm-nav-slot">
      <motion.button
        type="button"
        className="tm-btn"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        initial={false}
        style={{ ["--tm-ic" as string]: mountTint }}
        animate={{
          backgroundColor: disabled ? BTN_OFF : BTN_LIGHT,
          /* The icon node carries rest-state tints only, so the tint never moves
             on hover or press; it moves only when the arrow crosses between the
             Light and Disabled variants, and then on the same spring. */
          ["--tm-ic" as string]: disabled ? BTN_OFF_ICON : BTN_LIGHT_ICON,
        }}
        whileHover={disabled ? undefined : { backgroundColor: BTN_LIGHT_HOVER }}
        whileTap={disabled ? undefined : { backgroundColor: BTN_LIGHT_PRESSED }}
        transition={SLIDE}
      >
        <Icon id={iconId} size={14} color="var(--tm-ic)" strokeWidth={2} />
      </motion.button>
    </div>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  return (
    <section id="testimonials" data-section="Testimonials" className="tm-section">
      <style>{CSS}</style>
      <div className="tm-container">
        <div className="tm-slot">
          <MotionConfig transition={SLIDE}>
          <motion.div className="tm-slide" layout>
            <motion.div className="tm-content" layout>
              <motion.div className="tm-headline" layout>
                <div className="tm-text">
                  <h2 className="t-d2" style={{ color: BRIGHT }}>
                    {slide.stat}
                  </h2>
                </div>
                <div className="tm-text">
                  <p className="t-lead tm-tswap" style={{ color: MUTED }}>
                    {slide.statLabel}
                  </p>
                </div>
              </motion.div>

              <motion.div className="tm-tn" layout>
                {/* Below 810 the portrait fills the quote block instead of sitting beside it. */}
                <div className="tm-portrait-fill">
                  <div className="tm-portrait-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.image} alt={slide.alt} width={560} height={620} />
                  </div>
                </div>

                <motion.div className="tm-quote-grid" layout>
                  <div className="tm-filler" />
                  <motion.div className="tm-quote-box" layout>
                    <div className="tm-quote">
                      <p className="t-lead tm-tswap tm-quote-text" style={{ color: BRIGHT }}>
                        {slide.quote}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div className="tm-nav-name" layout>
                  <div className="tm-nav">
                    <Arrow dir="prev" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} />
                    <Arrow
                      dir="next"
                      disabled={index === SLIDES.length - 1}
                      onClick={() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1))}
                    />
                  </div>
                  <motion.div className="tm-name" layout>
                    <div className="tm-line">
                      <p className="t-body" style={{ color: BRIGHT }}>
                        {slide.name}
                      </p>
                    </div>
                    <div className="tm-line">
                      <p className="t-xs" style={{ color: MUTED }}>
                        {slide.role}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="tm-portrait">
              <div className="tm-portrait-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt={slide.alt} width={560} height={620} />
              </div>
            </div>
          </motion.div>
          </MotionConfig>
        </div>

        <div className="tm-slot tm-slot-rule">
          <ChromaticRule />
        </div>
      </div>
    </section>
  );
}
