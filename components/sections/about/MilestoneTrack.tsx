"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/ui/Sprite";
import { SPRING, TWEEN } from "@/lib/motion";

const TICK_ON = "var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(245, 245, 244))";
const TICK_OFF = "var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";

const BTN_BG = "var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))";
const BTN_HOVER = "var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))";
const BTN_PRESS = "var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))";
const BTN_ICON = "var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))";

/** ticks, date, label. The first tick of every stop is lit, the rest are dim. */
const STOPS = [
  { ticks: 10, time: "January 2023", label: "Nordwell founded" },
  { ticks: 17, time: "June 2023", label: "Cortex v1 shipped" },
  { ticks: 28, time: "September 2023", label: "First 100 teams onboarded" },
  { ticks: 43, time: "The future", label: "Help shape the future of Nordwell" },
] as const;

/** authored left offset of the strip per stop, straight out of the variants */
const LEFT = [32, -193, -578, -1214];

export function MilestoneTrack() {
  const [stop, setStop] = useState(0);

  return (
    <div className="ab-mile-slot">
      <div className="ab-mile">
        <motion.div
          className="ab-mile-track"
          animate={{ left: LEFT[stop] }}
          // TODO(spec): the stop-to-stop transition is not in this route's
          // motion capture; TWEEN is the page-wide default.
          transition={TWEEN}
          style={{ left: LEFT[0] }}
        >
          {STOPS.map((s, si) => (
            <div className="ab-mile-item" key={si}>
              <div className="ab-mile-line">
                {Array.from({ length: s.ticks }, (_, i) => (
                  <div
                    key={i}
                    className="ab-tick"
                    style={{ backgroundColor: i === 0 ? TICK_ON : TICK_OFF }}
                  />
                ))}
              </div>
              <div className="ab-mile-text">
                <div>
                  <p className="t-micro" style={{ color: MUTED }}>
                    {s.time}
                  </p>
                </div>
                <div>
                  <p className="t-sm" style={{ color: BRIGHT }}>
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="ab-mile-btns">
          <div className="ab-mile-btn-slot">
            <motion.button
              type="button"
              className="ab-mile-btn"
              aria-label="Previous milestone"
              onClick={() => setStop((v) => Math.max(0, v - 1))}
              style={{ backgroundColor: BTN_BG }}
              whileHover={{ backgroundColor: BTN_HOVER }}
              whileTap={{ backgroundColor: BTN_PRESS }}
              transition={SPRING}
            >
              <Icon id="3938257237" size={14} color={BTN_ICON} strokeWidth={2} />
            </motion.button>
          </div>
          <div className="ab-mile-btn-slot">
            <motion.button
              type="button"
              className="ab-mile-btn"
              aria-label="Next milestone"
              onClick={() => setStop((v) => Math.min(STOPS.length - 1, v + 1))}
              style={{ backgroundColor: BTN_BG }}
              whileHover={{ backgroundColor: BTN_HOVER }}
              whileTap={{ backgroundColor: BTN_PRESS }}
              transition={SPRING}
            >
              <Icon id="2903821725" size={14} color={BTN_ICON} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
