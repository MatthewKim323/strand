"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * The reference page hands scroll to Lenis. Scroll-linked motion reads window.scrollY,
 * which Lenis keeps in sync, so nothing else has to know it is here.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The reference mounts Lenis with { smooth: true, infinite: false,
    // intensity: 12, orientation: 'vertical' }, which the wrapper expands into
    // exactly this: duration is intensity / 10, syncTouch is !!infinite, and
    // Lenis drives its own rAF.
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
