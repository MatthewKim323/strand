"use client";

import { useEffect, useRef } from "react";

type AnimationItem = {
  destroy: () => void;
  setDirection: (d: number) => void;
  setSpeed: (s: number) => void;
};

/**
 * One 64x64 vector loop, and one of the four continuous loops in this section.
 *
 * Player settings, quoted from the four instances (identical except the source
 * document): loop true, playing true, speed 1, forwards direction. Nothing
 * gates them: they run continuously, they do not pause off-screen, and they do
 * not react to hover. The SVG renderer writes `preserveAspectRatio="xMidYMid
 * slice"`, which is what the captured markup carries. The document is fetched
 * at runtime rather than inlined, as in the source.
 *
 * `pauseOnCanvas: true` is an editor-only flag and has no runtime effect.
 *
 * TODO(spec): renderer quality is not pinned anywhere in the spec or the
 * capture. Using `medium`, which is the middle of the three the runtime
 * exposes; `high` would only change curve segmentation on a 64px glyph.
 *
 * TODO(spec): the fourth instance is authored with `progress: 62` while the
 * other three are `progress: 0`. `progress` is the scrub position and is read
 * only while `playing` is false, so with `playing: true` it has no effect and
 * every player starts at frame 0 here. The spec's own rebuild note asks for
 * plain `loop: true, autoplay: true` with no seek, so nothing seeks.
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
