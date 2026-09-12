"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The one-line looping announcement label.
 *
 * Mirrors the reference component exactly: a single copy of the text sits in a
 * `width: max-content` track; if that copy is wider than the visible window a
 * second copy is appended, both translate 0% -> -100% linearly on repeat, and
 * the window gets a soft edge mask. When it fits, nothing scrolls and there is
 * no mask at all (which is the desktop rest state).
 */

/** px/s. The reference reads this off a component prop that the capture did not record. */
// TODO(spec): ticker speed is not in the spec dump; 50px/s matches the page's other ticker velocity.
const SPEED = 50;
/** the gap after each copy, from `padding: 0px 40px 0px 0px` in the tree */
const GAP = 40;
const MASK = "linear-gradient(90deg, #0000, #000 7%, #000 93%, #0000)";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function AnnouncementTicker({ text }: { text: string }) {
  const windowRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [duration, setDuration] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const win = windowRef.current;
    const copy = copyRef.current;
    if (!win || !copy) return;
    const measure = () => {
      const inner = copy.scrollWidth;
      setOverflows(inner > win.offsetWidth);
      setDuration(inner / SPEED);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(win);
    ro.observe(copy);
    return () => ro.disconnect();
  }, [text]);

  const copyStyle = {
    padding: `0px ${GAP}px 0px 0px`,
    margin: 0,
    animationDuration: `${duration}s`,
  } as const;

  return (
    <div
      ref={windowRef}
      className="hero-ticker"
      style={{
        display: "flex",
        overflow: "hidden",
        WebkitMaskImage: overflows ? MASK : "none",
        maskImage: overflows ? MASK : "none",
      }}
    >
      <div
        className="hero-ticker-track"
        style={{ flexShrink: 0, color: "white", width: "max-content", display: "flex" }}
      >
        <p
          ref={copyRef}
          className={`t-sm${overflows ? " hero-ticker-run" : ""}`}
          style={copyStyle}
        >
          {text}
        </p>
        {overflows ? (
          <p className="t-sm hero-ticker-run" style={copyStyle} aria-hidden>
            {text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
