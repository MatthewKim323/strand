"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_ASPECT, LOGO_MASKS } from "./logos";

const ITEM_W = 137;
const GAP = 46;
const STEP = ITEM_W + GAP; // 183
const GROUP_LEN =
  LOGO_ASPECT.length * ITEM_W + (LOGO_ASPECT.length - 1) * GAP; // 1052
const PERIOD = GROUP_LEN + GAP; // 1098
const PX_PER_SEC = 50;

const LOGO_FILL =
  "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";

/* How many copies of the mark list the track needs so the loop never shows a
   hole. Mirrors the reference runtime: keep adding groups until
   (groupLength + gap) * (n + 1) - widestItem covers the visible length. */
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

const HALF: React.CSSProperties = {
  height: 1,
  overflow: "clip",
  flex: "1 0 0",
  width: 1,
  position: "relative",
  opacity: 1,
};

const BAR_R: React.CSSProperties = {
  zIndex: 1,
  flex: "none",
  width: "100%",
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 0,
  overflow: "visible",
};

const BAR_L: React.CSSProperties = { ...BAR_R, right: "auto", left: 0 };

/**
 * The partner ticker: one row of wordmarks sliding left at 50px/s, cloned as
 * many times as the viewport needs, with a one pixel additive rule underneath.
 */
export function Ticker() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [groups, setGroups] = useState(2);
  const groupsRef = useRef(groups);
  groupsRef.current = groups;

  /* group count follows the viewport width, same rule as the reference */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setGroups(cloneGroups(el.clientWidth) + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* the loop: 50px/s to the left, offset wrapped into one group period, and
     any mark that has left the viewport jumps a whole list length ahead. */
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
          base + ITEM_W + wrapped < 0
            ? "translateX(" + listSize + "px)"
            : "none";
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

  const marks: React.ReactNode[] = [];
  for (let g = 0; g < groups; g++) {
    for (let i = 0; i < LOGO_MASKS.length; i++) {
      marks.push(
        <li
          key={g + "-" + i}
          style={{
            flexGrow: 0,
            flexShrink: 0,
            position: "relative",
            height: "fit-content",
            width: "fit-content",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: ITEM_W,
              height: "auto",
              aspectRatio: LOGO_ASPECT[i],
              flex: "none",
              position: "relative",
              backgroundColor: LOGO_FILL,
              maskImage: LOGO_MASKS[i],
              WebkitMaskImage: LOGO_MASKS[i],
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
    <>
      <div
        className="pr-viewport"
        ref={viewportRef}
        style={{
          height: "min-content",
          overflow: "clip",
          overflowX: "clip",
          borderRadius: 10,
          display: "flex",
          flexFlow: "row",
          flex: "none",
          placeContent: "center flex-start",
          alignItems: "center",
          gap: GAP,
          width: "100%",
          padding: 0,
          position: "relative",
        }}
      >
        <ul
          ref={trackRef}
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            listStyleType: "none",
            margin: 0,
            padding: 0,
            gap: GAP,
            opacity: 1,
            width: "100%",
            height: "100%",
            willChange: "transform",
          }}
        >
          {marks}
        </ul>
      </div>

      <div style={{ width: "100%" }}>
        <div
          style={{
            flex: "none",
            width: "100%",
            height: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "min-content",
              overflow: "clip",
              display: "flex",
              flexFlow: "row",
              placeContent: "center",
              alignItems: "center",
              gap: 0,
              width: "100%",
              padding: 0,
              position: "relative",
              opacity: 1,
            }}
          >
            <div style={HALF}>
              <div style={{ ...BAR_R, backgroundColor: "rgb(0, 0, 36)" }} />
              <div
                style={{
                  ...BAR_R,
                  mixBlendMode: "screen",
                  backgroundColor: "rgb(0, 37, 0)",
                }}
              />
              <div
                style={{
                  ...BAR_R,
                  mixBlendMode: "screen",
                  backgroundColor: "rgb(41, 0, 0)",
                }}
              />
            </div>
            <div style={HALF}>
              <div style={{ ...BAR_L, backgroundColor: "rgb(0, 0, 36)" }} />
              <div
                style={{
                  ...BAR_L,
                  mixBlendMode: "screen",
                  backgroundColor: "rgb(0, 37, 0)",
                }}
              />
              <div
                style={{
                  ...BAR_L,
                  mixBlendMode: "screen",
                  backgroundColor: "rgb(41, 0, 0)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
