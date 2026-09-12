"use client";

import { useEffect, useRef } from "react";

type AnimationItem = {
  destroy: () => void;
  setDirection: (d: number) => void;
  setSpeed: (s: number) => void;
};

/**
 * One 64x64 vector loop. The reference drives these with the SVG renderer,
 * `xMidYMid slice`, medium quality, forwards, 1x speed, looping forever, and
 * fetches the animation document at runtime rather than inlining it.
 */
export function StatLottie({ src, name }: { src: string; name: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_svg"),
        fetch(src, { method: "GET", credentials: "omit", redirect: "follow" }).then((r) =>
          r.json(),
        ),
      ]);
      if (cancelled || !host.current) return;

      lottie.setQuality("medium");
      anim = lottie.loadAnimation({
        container: host.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      }) as unknown as AnimationItem;
      anim.setDirection(1);
      anim.setSpeed(1);
    })();

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src]);

  return <div ref={host} aria-label={name} style={{ height: "100%", width: "100%" }} />;
}
