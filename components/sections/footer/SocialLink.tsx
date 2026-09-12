"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Sprite";
import { SPRING } from "@/lib/motion";

const ARROW = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(168, 162, 158))";
const ARROW_ON = "var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))";

/**
 * A social row in the footer's Connect column. Two copies of the same outbound
 * glyph live in a 16px clipped box: on hover the resting one flies out to the
 * top right while its twin arrives from the bottom left, so the arrow reads as
 * one mark travelling diagonally. Both halves ride the house spring.
 */
export function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a className="fc-social" href={href} initial="off" whileHover="on">
      <div className="fc-social-label">
        <p className="t-body">{label}</p>
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
