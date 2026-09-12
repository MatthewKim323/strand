# capture: site-features-pulse

Captured: 2026-09-12T12:26:24.304Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 3994 | 602 | scrollTo | 0 |
| tablet | 1024x900 | 3998 | 962 | scrollTo | 0 |
| tablet-810 | 810x900 | 3967 | 962 | scrollTo | 0 |
| mobile | 390x844 | 5035 | 949 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Hero | div | 68 | 700 | 68-768 |
| 1 | Bento | div | 768 | 640 | 768-1408 |
| 2 | Accordion | div | 1408 | 390 | 1408-1798 |
| 3 | Accordion | div | 1798 | 578 | 1798-2376 |
| 4 | Footer Container | div | 2376 | 1618 | 2376-3994 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 560 | 68-628 |
| 2 | Bento | div | 628 | 624 | 628-1252 |
| 3 | Accordion | div | 1252 | 302 | 1252-1554 |
| 4 | Accordion | div | 1554 | 820 | 1554-2374 |
| 5 | Footer Container | div | 2374 | 1624 | 2374-3998 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 560 | 68-628 |
| 2 | Bento | div | 628 | 648 | 628-1276 |
| 3 | Accordion | div | 1276 | 302 | 1276-1578 |
| 4 | Accordion | div | 1578 | 820 | 1578-2398 |
| 5 | Footer Container | div | 2398 | 1569 | 2398-3967 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Hero | div | 68 | 911 | 68-979 |
| 2 | Bento | div | 979 | 1239 | 979-2218 |
| 3 | Accordion | div | 2218 | 282 | 2218-2500 |
| 4 | Accordion | div | 2500 | 820 | 2500-3320 |
| 5 | Footer Container | div | 3320 | 1715 | 3320-5035 |

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
