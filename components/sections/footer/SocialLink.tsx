"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Sprite";
import { SPRING } from "@/lib/motion";

const LABEL = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const LABEL_ON = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const ARROW = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(168, 162, 158))";
const ARROW_ON = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";

/**
 * A social row in the footer's Connect column. Two copies of the same outbound
 * glyph live in a 16px clipped box: on hover the resting one flies out to the
 * top right while its twin arrives from the bottom left, so the arrow reads as
 * one mark travelling diagonally.
 *
 * The source does this as a manual variant switch on mouse enter / leave, not
 * as a gesture variant, and every part of it (label colour and both arrows)
 * rides the house spring: {type: 'spring', bounce: 0.2, duration: 0.4}. Three
 * things change together, so they share one variant set rather than three.
 *
 * TODO(spec): the hovered arrow's own tint is listed as moving from
 * token-17151d22 to token-68852133. Both tokens resolve to #fafaf9 in the token
 * map, so the change is invisible and this keeps the hovered arrow static at
 * token-68852133 rather than animating a colour to itself.
 */
export function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a className="fc-social" href={href} initial="off" whileHover="on">
      <div className="fc-social-label">
        <motion.p
          className="t-body"
          variants={{ off: { color: LABEL }, on: { color: LABEL_ON } }}
          transition={SPRING}
          style={{ color: LABEL }}
        >
          {label}
        </motion.p>
      </div>
      <div className="fc-arrow">
        <motion.span
          className="fc-arrow-slot"
          variants={{ off: { x: -16, y: 16 }, on: { x: 0, y: 0 } }}
          transition={SPRING}
        >
          <Icon id="1475982494" size={16} color={ARROW_ON} strokeWidth={2} />
        </motion.span>
        <motion.span
          className="fc-arrow-slot"
          variants={{ off: { x: 0, y: 0 }, on: { x: 16, y: -16 } }}
          transition={SPRING}
        >
          <Icon id="1475982494" size={16} color={ARROW} strokeWidth={2} />
        </motion.span>
      </div>
    </motion.a>
  );
}
