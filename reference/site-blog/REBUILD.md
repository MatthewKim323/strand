# REBUILD: site-blog

> Captured 2026-09-12T12:35:36.590Z by 1to1. Everything in this folder is measured from a live page. Build from it; never eyeball a number.

## Origin blackout (not optional)

Nothing you write may say where this came from. The source url lives in `reference/site-blog/.origin.json` and nowhere else: it is there so the rigs can re-measure, not for you to read out. These are your own components and your own assets.

- Never put the origin's name, host, brand, logo filename or a link to it in a component, file name, class name, comment, commit message, alt text or doc. Do not write "cloned from", "based on", "like <site>", or the origin's name in any form.
- The spec trees, the modules and the harvested assets in this folder are already scrubbed: the origin's words read as `Nordwell` and its links are route-relative. Copy text verbatim from `spec/` and you stay clean; copy it from a browser tab and you do not.
- Assets are content addressed (`img-<hash>.webp`, `font-<hash>.woff2`). Keep those names when you copy them into `public/`. A logo or wordmark asset still carries the origin visually: flag it for replacement rather than shipping it.
- `1to1 blackout .` scans the project for anything that slipped through; `1to1 verify` runs it as part of the gate and FAILs on a hit.

## Ground truth in this folder

- `spec/page.txt`: DOM tree (framer names, appear ids, classes, layout inline styles, text) + every CSS rule for those classes per breakpoint (`@base` = desktop >= 1200, `(min-width:810px) and (max-width:1199.98px)` = tablet, `(max-width:809.98px)` = phone). `spec/sections/NN-*.txt` = the same sliced per section.
- `capture/<vp>/layout.json`: every visible element with its page rect and computed styles at 1440 / 1024 / 810 / 390. This is the box truth; `1to1 refboxes` reads it.
- `capture/<vp>/full.png` + `capture/<vp>/sections/`: revealed screenshots (2x). `capture/frames/<scenario>/`: 60fps frame sequences (load, per-section scroll, hovers, clicks, loops) with motion timelines.
- `motion/framer-appear.json` (+ `appear-by-name.json`): on-mount appear springs per element. `motion/rip.md` + `constants.json`: transition constants and scroll / text / ticker / drag effect windows from the page modules. `motion/observed.md`: what the browser reported.
- `modules/*.mjs`: the source page's modules, scrubbed. The biggest one is the page. `assets/`, `assets/svg/`: every image / font / sprite def.
- `dom/full.html`, `dom/styles.css`, `dom/tree.txt`: raw material for `1to1 cssq` and grep.

Stack: framer (Framer) + Lenis. Built with Framer: appear ids, data-framer-name, framerusercontent modules. Use `1to1 prep` + `1to1 rip`. Lenis smooth scroll present: window.scrollTo may be overridden, rigs fall back to wheel events.

## Page heights (must match to the pixel)

| viewport | width | doc height | sections |
|---|---|---|---|
| desktop | 1440 | 2813 | 5 |
| tablet | 1024 | 2942 | 6 |
| tablet-810 | 810 | 2806 | 6 |
| mobile | 390 | 3156 | 5 |

### sections @ desktop

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Title | 68 | 120 | spec/sections/00-title.txt | capture/desktop/sections/00-title.png |
| 1 | Featured Articles | 188 | 850 | spec/sections/01-featured-articles.txt | capture/desktop/sections/01-featured-articles.png |
| 2 | Latest | 1118 | 114 | spec/sections/02-latest.txt | capture/desktop/sections/02-latest.png |
| 3 | Latest Articles | 1232 | 640 | spec/sections/03-latest-articles.txt | capture/desktop/sections/03-latest-articles.png |
| 4 | Footer Container | 1872 | 941 | spec/sections/04-footer-container.txt | capture/desktop/sections/04-footer-container.png |

### sections @ tablet

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet/sections/00-tablet-mobile-menu.png |
| 1 | Title | 68 | 114 | spec/sections/01-title.txt | capture/tablet/sections/01-title.png |
| 2 | Featured Articles | 182 | 703 | spec/sections/02-featured-articles.txt | capture/tablet/sections/02-featured-articles.png |
| 3 | Latest | 965 | 110 | spec/sections/03-latest.txt | capture/tablet/sections/03-latest.png |
| 4 | Latest Articles | 1075 | 920 | spec/sections/04-latest-articles.txt | capture/tablet/sections/04-latest-articles.png |
| 5 | Footer Container | 1995 | 947 | spec/sections/05-footer-container.txt | capture/tablet/sections/05-footer-container.png |

### sections @ tablet-810

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet-810/sections/00-tablet-mobile-menu.png |
| 1 | Title | 68 | 114 | spec/sections/01-title.txt | capture/tablet-810/sections/01-title.png |
| 2 | Featured Articles | 182 | 622 | spec/sections/02-featured-articles.txt | capture/tablet-810/sections/02-featured-articles.png |
| 3 | Latest | 884 | 110 | spec/sections/03-latest.txt | capture/tablet-810/sections/03-latest.png |
| 4 | Latest Articles | 994 | 920 | spec/sections/04-latest-articles.txt | capture/tablet-810/sections/04-latest-articles.png |
| 5 | Footer Container | 1914 | 892 | spec/sections/05-footer-container.txt | capture/tablet-810/sections/05-footer-container.png |

### sections @ mobile

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -776 | 844 | spec/sections/00-tablet-mobile-menu.txt | capture/mobile/sections/00-tablet-mobile-menu.png |
| 1 | Featured Articles | 142 | 554 | spec/sections/01-featured-articles.txt | capture/mobile/sections/01-featured-articles.png |
| 2 | Latest | 776 | 110 | spec/sections/02-latest.txt | capture/mobile/sections/02-latest.png |
| 3 | Latest Articles | 886 | 1232 | spec/sections/03-latest-articles.txt | capture/mobile/sections/03-latest-articles.png |
| 4 | Footer Container | 2118 | 1038 | spec/sections/04-footer-container.txt | capture/mobile/sections/04-footer-container.png |

## The loop

```bash
# build one section, then compare
1to1 shot "http://localhost:3777/?only=<section>" reference/site-blog/build/<section>.png --w 1440
1to1 heights http://localhost:3777/ "$(1to1 origin reference/site-blog --url)"          # page + section heights at all 4 widths
1to1 boxes http://localhost:3777/ 1440 <yFrom> <yTo>                       # your boxes
1to1 refboxes reference/site-blog desktop <yFrom> <yTo>                                # reference boxes (same columns)
1to1 diff reference/site-blog/build/desktop-full.png reference/site-blog/capture/desktop/full.png reference/site-blog/build/diff --ref reference/site-blog
1to1 frames http://localhost:3777/ reference/site-blog/build/frames/load --ms 6000 --start-before-nav && 1to1 sheet reference/site-blog/build/frames/load reference/site-blog/build/load-sheet.png
1to1 sheet reference/site-blog/capture/frames/load reference/site-blog/build/ref-load-sheet.png    # same time steps, compare side by side
1to1 verify http://localhost:3777/ reference/site-blog --diff                          # the gate: PASS at every width or keep going
1to1 blackout .                                                            # no mention of the origin anywhere in the project
```

Rules for builders are in `CONVENTIONS.md` (project root `reference/`), method in the 1to1 skill docs (`docs/METHOD.md`, `docs/FRAMER.md`, `docs/VERIFY.md`).
