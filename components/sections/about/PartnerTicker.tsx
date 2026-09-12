"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { MARK_ASPECT, MARK_MASKS } from "./marks";

/**
 * The partner wordmark marquee. Motion spec section 2.3: 50 px/s to the left,
 * constant, no fade edges, no hover change, not draggable, seamless loop built
 * from cloned groups.
 */

const ITEM_W = 137;
const GAP = 46;
const STEP = ITEM_W + GAP;
const GROUP_LEN = MARK_ASPECT.length * ITEM_W + (MARK_ASPECT.length - 1) * GAP;
const PERIOD = GROUP_LEN + GAP;
const PX_PER_SEC = 50;

const FILL = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";

/** Enough clone groups that the strip never shows a hole at this width. */
function cloneGroups(visible: number): number {
  let n = 0;
  let covered = 0;
  while (covered < visible) {
    covered = PERIOD * (n + 1) - ITEM_W;
    n++;
    if (n > 24) break;
  }
  return Math.max(n - 1, 0);
}

const ITEM: CSSProperties = {
  flexGrow: 0,
  flexShrink: 0,
  position: "relative",
  height: "fit-content",
  width: "fit-content",
};

export function PartnerTicker() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [groups, setGroups] = useState(2);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setGroups(cloneGroups(el.clientWidth) + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let inView = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView = e.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    io.observe(viewport);

    let raf = 0;
    let last = 0;
    let offset = 0;

    const paint = () => {
      const wrapped = -((((-offset) % PERIOD) + PERIOD) % PERIOD);
      const listSize = PERIOD * groupsRef.current;
      track.style.transform = "translateX(" + wrapped + "px)";
      const items = track.children;
      for (let i = 0; i < items.length; i++) {
        const base = i * STEP;
        (items[i] as HTMLElement).style.transform =
          base + ITEM_W + wrapped < 0 ? "translateX(" + listSize + "px)" : "none";
      }
    };

    const frame = (t: number) => {
      if (last && inView) offset -= ((t - last) / 1000) * PX_PER_SEC;
      last = t;
      paint();
      raf = requestAnimationFrame(frame);
    };

    paint();
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const items: ReactNode[] = [];
  for (let g = 0; g < groups; g++) {
    for (let i = 0; i < MARK_MASKS.length; i++) {
      items.push(
        <li key={g + "-" + i} style={ITEM}>
          <div
            aria-hidden="true"
            style={{
              width: ITEM_W,
              height: "auto",
              aspectRatio: MARK_ASPECT[i],
              flex: "none",
              position: "relative",
              backgroundColor: FILL,
              maskImage: MARK_MASKS[i],
              WebkitMaskImage: MARK_MASKS[i],
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "auto",
              WebkitMaskSize: "auto",
              maskMode: "alpha",
            }}
          />
        </li>,
      );
    }
  }

  return (
    <div ref={viewportRef} className="ab-ticker">
      <ul ref={trackRef} className="ab-ticker-track">
        {items}
      </ul>
    </div>
  );
}
