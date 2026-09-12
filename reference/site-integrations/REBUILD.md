# REBUILD: site-integrations

> Captured 2026-09-12T12:28:58.174Z by 1to1. Everything in this folder is measured from a live page. Build from it; never eyeball a number.

## Origin blackout (not optional)

Nothing you write may say where this came from. The source url lives in `reference/site-integrations/.origin.json` and nowhere else: it is there so the rigs can re-measure, not for you to read out. These are your own components and your own assets.

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

Stack: framer (Framer) + Lenis. Built with Framer: appear ids, data-framer-name, framerusercontent modules. Use `1to1 prep` + `1to1 rip`. Lenis smooth scroll present: window.scrollTo may be overridden, rigs fall back to wheel events. 1 canvas element(s): WebGL / 2D drawing to port (find the module that draws it).

## Page heights (must match to the pixel)

| viewport | width | doc height | sections |
|---|---|---|---|
| desktop | 1440 | 3554 | 3 |
| tablet | 1024 | 3932 | 4 |
| tablet-810 | 810 | 3901 | 4 |
| mobile | 390 | 5471 | 4 |

### sections @ desktop

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Hero | 68 | 396 | spec/sections/00-hero.txt | capture/desktop/sections/00-hero.png |
| 1 | Integrations | 540 | 1396 | spec/sections/01-integrations.txt | capture/desktop/sections/01-integrations.png |
| 2 | Footer Container | 1936 | 1618 | spec/sections/02-footer-container.txt | capture/desktop/sections/02-footer-container.png |

### sections @ tablet

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 264 | spec/sections/01-hero.txt | capture/tablet/sections/01-hero.png |
| 2 | Integrations | 408 | 1900 | spec/sections/02-integrations.txt | capture/tablet/sections/02-integrations.png |
| 3 | Footer Container | 2308 | 1624 | spec/sections/03-footer-container.txt | capture/tablet/sections/03-footer-container.png |

### sections @ tablet-810

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet-810/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 288 | spec/sections/01-hero.txt | capture/tablet-810/sections/01-hero.png |
| 2 | Integrations | 432 | 1900 | spec/sections/02-integrations.txt | capture/tablet-810/sections/02-integrations.png |
| 3 | Footer Container | 2332 | 1569 | spec/sections/03-footer-container.txt | capture/tablet-810/sections/03-footer-container.png |

### sections @ mobile

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -776 | 844 | spec/sections/00-tablet-mobile-menu.txt | capture/mobile/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 392 | spec/sections/01-hero.txt | capture/mobile/sections/01-hero.png |
| 2 | Integrations | 536 | 3220 | spec/sections/02-integrations.txt | capture/mobile/sections/02-integrations.png |
| 3 | Footer Container | 3756 | 1715 | spec/sections/03-footer-container.txt | capture/mobile/sections/03-footer-container.png |

## The loop

```bash
# build one section, then compare
1to1 shot "http://localhost:3777/?only=<section>" reference/site-integrations/build/<section>.png --w 1440
1to1 heights http://localhost:3777/ "$(1to1 origin reference/site-integrations --url)"          # page + section heights at all 4 widths
1to1 boxes http://localhost:3777/ 1440 <yFrom> <yTo>                       # your boxes
1to1 refboxes reference/site-integrations desktop <yFrom> <yTo>                                # reference boxes (same columns)
1to1 diff reference/site-integrations/build/desktop-full.png reference/site-integrations/capture/desktop/full.png reference/site-integrations/build/diff --ref reference/site-integrations
1to1 frames http://localhost:3777/ reference/site-integrations/build/frames/load --ms 6000 --start-before-nav && 1to1 sheet reference/site-integrations/build/frames/load reference/site-integrations/build/load-sheet.png
1to1 sheet reference/site-integrations/capture/frames/load reference/site-integrations/build/ref-load-sheet.png    # same time steps, compare side by side
1to1 verify http://localhost:3777/ reference/site-integrations --diff                          # the gate: PASS at every width or keep going
1to1 blackout .                                                            # no mention of the origin anywhere in the project
```

Rules for builders are in `CONVENTIONS.md` (project root `reference/`), method in the 1to1 skill docs (`docs/METHOD.md`, `docs/FRAMER.md`, `docs/VERIFY.md`).
