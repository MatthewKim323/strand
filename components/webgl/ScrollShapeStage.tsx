"use client"

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react"
import {
  Children,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { PointMorphField, type PointMorphFieldProps } from "./PointMorphField"

/**
 * Drives a `PointMorphField` from a section's scroll progress and cross-fades
 * one child per shape on top of it.
 *
 * The section is split into as many equal slots as there are children. Scroll
 * progress through the section (measured from its start hitting the viewport
 * centre to its end hitting the viewport centre) picks the slot, which is both
 * the field's `currentShape` and the child that is shown. Near each slot
 * boundary the child fades out and back in, so the swap happens while the
 * particles are mid-morph rather than on top of a settled shape.
 */

export interface ScrollShapeStageProps
  extends Omit<PointMorphFieldProps, "currentShape" | "className" | "style"> {
  /**
   * `id` of the page section whose scroll progress drives the active slot.
   * The element is looked up by `document.getElementById` after mount, so the
   * section does not have to be an ancestor of this component.
   */
  sectionId: string
  /**
   * One element per shape, in order. The element matching the active slot is
   * rendered; the others are unmounted.
   */
  children?: ReactNode
  /**
   * Pins the stage to a fixed slot instead of following scroll. Useful for
   * previews and screenshots; leave unset in production.
   */
  previewShape?: number
  /** Class applied to the stage wrapper. */
  className?: string
  /** Style merged into the stage wrapper. */
  style?: CSSProperties
}

/** `Math.min(Math.max(value, min), max)`, argument order kept from the source. */
function clampRange(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Triangle wave. Returns -1 at every multiple of `1 / frequency` and +1
 * halfway between, which puts the troughs exactly on the slot boundaries.
 */
function triangleWave(value: number, frequency = 1, amplitude = 1, phase = 0) {
  const period = 1 / frequency
  const t =
    (((((value + phase / (2 * Math.PI * frequency)) % period) % period) +
      period) %
      period) /
    period
  return amplitude * (t < 0.5 ? 4 * t - 1 : 3 - 4 * t)
}

export function ScrollShapeStage({
  sectionId,
  children,
  previewShape,
  className,
  style,
  ...fieldProps
}: ScrollShapeStageProps) {
  const slots = Children.toArray(children)
  const slotCount = slots.length

  // Hydrated after mount; `useScroll` defers attaching until it resolves.
  const sectionRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!sectionId) return
    sectionRef.current = document.getElementById(sectionId) ?? null
  }, [sectionId])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const [index, setIndex] = useState(0)
  useEffect(
    () =>
      scrollYProgress.on("change", (progress) => {
        if (slotCount === 0) return
        const raw = Math.floor(progress * slotCount)
        setIndex(Math.min(Math.max(raw, 0), slotCount - 1))
      }),
    [scrollYProgress, slotCount],
  )

  // Half a slot of padding at each end, so the first and last slots do not
  // start or finish mid-fade.
  const pad = useMemo(() => 1 / (slotCount * 2), [slotCount])
  const padded = useTransform(scrollYProgress, (progress) =>
    clampRange(pad, 1 - pad, progress),
  )
  const shouldShow = useTransform(
    padded,
    (progress) => triangleWave(progress, slotCount) * 0.5 + 0.3 > 0,
  )

  const [visible, setVisible] = useState(true)
  useMotionValueEvent(shouldShow, "change", (value) => {
    setVisible(value)
  })

  const activeIndex = previewShape ?? index
  const activeSlot = slots[index]

  return (
    <div
      className={className(fieldProps)}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <PointMorphField
        {...fieldProps}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        currentShape={activeIndex}
      />
      <AnimatePresence mode="wait" initial={false}>
        {slotCount > 0 && visible && (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                duration: 0.1,
                ease: "easeOut",
                filter: { duration: 0.3, ease: "easeOut" },
                scale: { duration: 0.3, ease: "easeOut" },
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              filter: "blur(8px)",
              transition: { duration: 0.15, ease: "easeIn" },
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <div
              style={{
                pointerEvents: "none",
                userSelect: "none",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px 12px",
              }}
            >
              {activeSlot}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** The stage takes no class of its own; this keeps the JSX above readable. */
function className(_props: unknown): string | undefined {
  return undefined
}

export default ScrollShapeStage
