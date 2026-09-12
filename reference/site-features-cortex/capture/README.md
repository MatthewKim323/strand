# capture: site-features-cortex

Captured: 2026-09-12T12:17:31.353Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 4434 | 726 | scrollTo | 0 |
| tablet | 1024x900 | 4280 | 764 | scrollTo | 0 |
| tablet-810 | 810x900 | 4249 | 764 | scrollTo | 0 |
| mobile | 390x844 | 5553 | 742 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Hero | div | 68 | 732 | 68-800 |
| 1 | CTA | div | 800 | 168 | 800-968 |
| 2 | Bento | div | 968 | 1208 | 968-2176 |
| 3 | Accordion | div | 2176 | 640 | 2176-2816 |
| 4 | Footer Container | div | 2816 | 1618 | 2816-4434 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 604 | 68-672 |
| 2 | CTA | div | 672 | 168 | 672-840 |
| 3 | Bento | div | 840 | 1176 | 840-2016 |
| 4 | Accordion | div | 2016 | 640 | 2016-2656 |
| 5 | Footer Container | div | 2656 | 1624 | 2656-4280 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 604 | 68-672 |
| 2 | CTA | div | 672 | 168 | 672-840 |
| 3 | Bento | div | 840 | 1200 | 840-2040 |
| 4 | Accordion | div | 2040 | 640 | 2040-2680 |
| 5 | Footer Container | div | 2680 | 1569 | 2680-4249 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Hero | div | 68 | 724 | 68-792 |
| 2 | CTA | div | 792 | 212 | 792-1004 |
| 3 | Bento | div | 1004 | 1916 | 1004-2920 |
| 4 | Accordion | div | 2920 | 918 | 2920-3838 |
| 5 | Footer Container | div | 3838 | 1715 | 3838-5553 |

Selection rule: the outermost visible elements that are >= 100px tall, >= 200px wide and <= 90% of the document height, not position:fixed. Name = own data-framer-name (unless generic), else a Footer / Navigation / Hero descendant name, else the first non-generic descendant name, id, aria-label or first heading.

## Frame scenarios (1440x900, CDP Page.startScreencast png everyFrame, frames at 1x, cap 400)

| scenario | frames | duration ms | motion first->last ms | motion ranges | notes |
|---|---|---|---|---|---|

Each `frames/<scenario>/` has `NNNNN.png`, `frames.json` (t = ms since Page.startScreencast; the compositor only emits a frame when something repainted, so gaps = nothing changed) and `motion-timeline.json` (per-frame changed-pixel fraction; `motion` flag + merged ranges). Contact sheets: `1to1 sheet <frames dir> <out.png>`.

Scroll scenarios: screencast starts, instant scrollTo(sectionTop - 85% vh), 400ms settle, rAF ease-in-out scroll to (sectionTop - 15% vh) over 1500ms, 2500ms hold. Fresh page per scenario so appear animations replay.

## Unrevealed elements

None. Every element with data-framer-appear-id ended at computed opacity >= 0.9 in every viewport.

## Assets

12 unique URLs intercepted -> `assets/<img|vid|font|audio|data>-<sha1(url)[0:10]>.<ext>` (content addressed: the origin's own filenames are dropped), map in `assets/manifest.json` (analytics excluded; bytes=-1 had no readable body).

## Caveats

- Full pages are scroll-and-stitch. captureBeyondViewport resizes the viewport to the content height, which re-lays-out vh sections and fires IntersectionObservers, so it is not used. Sticky / scroll-linked sections show the state at each chunk's scroll offset; use the scroll-* frame sequences for their true motion.
- Screencast frames are 1x (--frame-dsf). PNG at 1440x900 yields ~30-60 fps of changed frames.
- Hover scenarios diff only inside the target rect (+40px) so animated textures elsewhere do not count as motion.
- `--only rediff` recomputes every motion-timeline.json from frames on disk; `--only static` / `--only frames` restrict the run. report.json is merged across runs.

## Errors

None.
