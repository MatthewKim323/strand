"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";

/**
 * The thin numbered rail down the right edge of the section.
 *
 * Ported from the reference's own implementation: the whole column is
 * translated from 50% to -50% across the scroll progress of the element whose
 * id is `sectionName`, measured over ['start start', 'end start'] and chased by
 * a { stiffness: 300, damping: 30 } spring. Each step's number and its tick
 * marks interpolate between the secondary and primary colour as the progress
 * crosses that step's range, with `fade` as the half width of the crossfade.
 * Deliberately not whileInView.
 */

const FADE_TOP = "10%";
const FADE_BOTTOM = "90%";
const TRANSPARENT = "#0000";
const OPAQUE = "#000";

export type ProgressRailProps = {
  sections?: number;
  sectionName: string;
  numLines?: number;
  lineGap?: number;
  lineWeight?: number;
  primaryColor?: string;
  secondaryColor?: string;
  fade?: number;
  font?: CSSProperties;
};

export function ProgressRail({
  sections = 3,
  sectionName,
  numLines = 8,
  lineGap = 10,
  lineWeight = 1,
  primaryColor = "rgb(250, 250, 250)",
  secondaryColor = "rgb(115, 115, 115)",
  fade = 0.05,
  font,
}: ProgressRailProps) {
  const target = useRef<HTMLElement | null>(null);
  // The rail lives inside the sticky column, so it cannot simply measure its
  // own parent: it reads the scroll progress of a named section instead.
  // Resolved during render so the scroll listener sees it on the first pass.
  if (typeof document !== "undefined" && !target.current) {
    target.current = document.getElementById(sectionName);
  }

  const { scrollYProgress } = useScroll({
    target: target as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
  const y = useTransform(progress, [0, 1], ["50%", "-50%"]);

  return (
    <div
      style={{
        height: "100%",
        WebkitMaskImage: `linear-gradient(0deg, ${TRANSPARENT}, ${OPAQUE} ${FADE_TOP}, ${OPAQUE} ${FADE_BOTTOM}, ${TRANSPARENT})`,
        maskImage: `linear-gradient(0deg, ${TRANSPARENT}, ${OPAQUE} ${FADE_TOP}, ${OPAQUE} ${FADE_BOTTOM}, ${TRANSPARENT})`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginBottom: `calc(${font?.lineHeight ?? 0})`,
          y,
        }}
      >
        {Array.from({ length: sections }, (_, i) => {
          const isLast = i === sections - 1;
          const from = i * (1 / (sections - 1));
          const to = (i + 1) * (1 / (sections - 1));
          return (
            <Step
              key={`section-${i}`}
              index={i + 1}
              range={[from, to]}
              progress={progress}
              isLast={isLast}
              fade={fade}
              numLines={numLines}
              lineGap={lineGap}
              lineWeight={lineWeight}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              font={font}
            />
          );
        })}
      </motion.div>
      <div
        style={{
          width: 5,
          height: lineWeight,
          marginLeft: 4,
          borderTopLeftRadius: 9999,
          borderBottomLeftRadius: 9999,
          backgroundColor: primaryColor,
        }}
      />
    </div>
  );
}

type StepProps = {
  index: number;
  range: [number, number];
  progress: MotionValue<number>;
  isLast: boolean;
  fade: number;
  numLines: number;
  lineGap: number;
  lineWeight: number;
  primaryColor: string;
  secondaryColor: string;
  font?: CSSProperties;
};

function Step({
  index,
  range,
  progress,
  isLast,
  fade,
  numLines,
  lineGap,
  lineWeight,
  primaryColor,
  secondaryColor,
  font,
}: StepProps) {
  const color = useTransform(
    progress,
    [range[0] - fade * 2, range[0] - fade, range[0], range[0] + fade, range[0] + fade * 2],
    [secondaryColor, primaryColor, primaryColor, primaryColor, secondaryColor],
  );
  return (
    // `top: 100%` resolves against an auto height for the in-flow steps, so it
    // only moves the last one, which is the absolutely positioned step.
    <div style={{ position: isLast ? "absolute" : "relative", top: "100%" }}>
      <motion.p style={{ ...font, margin: 0, marginBottom: 0, color }}>
        {index.toString().padStart(2, "0")}
      </motion.p>
      <div style={{ display: "flex", flexDirection: "column", gap: lineGap, alignItems: "end" }}>
        {!isLast &&
          Array.from({ length: numLines }, (_, i) => (
            <Tick
              key={i}
              progress={progress}
              fade={fade}
              position={((range[1] - range[0]) / (numLines + 1)) * (i + 1) + range[0]}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              lineWeight={lineWeight}
            />
          ))}
      </div>
    </div>
  );
}

function Tick({
  lineWeight,
  position,
  progress,
  fade,
  primaryColor,
  secondaryColor,
}: {
  lineWeight: number;
  position: number;
  progress: MotionValue<number>;
  fade: number;
  primaryColor: string;
  secondaryColor: string;
}) {
  const stops = [position - fade * 2, position - fade, position, position + fade, position + fade * 2];
  const background = useTransform(progress, stops, [
    secondaryColor,
    primaryColor,
    primaryColor,
    primaryColor,
    secondaryColor,
  ]);
  const width = useTransform(progress, stops, ["40%", "65%", "65%", "65%", "40%"]);
  return (
    <motion.div
      style={{ width, height: lineWeight, borderRadius: 9999, backgroundColor: background }}
    />
  );
}
