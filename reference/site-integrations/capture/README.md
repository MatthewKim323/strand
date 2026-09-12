# capture: site-integrations

Captured: 2026-09-12T12:30:51.865Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 3554 | 742 | scrollTo | 0 |
| tablet | 1024x900 | 3932 | 818 | scrollTo | 0 |
| tablet-810 | 810x900 | 3901 | 818 | scrollTo | 0 |
| mobile | 390x844 | 5471 | 801 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Hero | div | 68 | 396 | 68-464 |
| 1 | Integrations | div | 540 | 1396 | 540-1936 |
| 2 | Footer Container | div | 1936 | 1618 | 1936-3554 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 264 | 68-332 |
| 2 | Integrations | div | 408 | 1900 | 408-2308 |
| 3 | Footer Container | div | 2308 | 1624 | 2308-3932 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 288 | 68-356 |
| 2 | Integrations | div | 432 | 1900 | 432-2332 |
| 3 | Footer Container | div | 2332 | 1569 | 2332-3901 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Hero | div | 68 | 392 | 68-460 |
| 2 | Integrations | div | 536 | 3220 | 536-3756 |
| 3 | Footer Container | div | 3756 | 1715 | 3756-5471 |

Selection rule: the outermost visible elements that are >= 100px tall, >= 200px wide and <= 90% of the document height, not position:fixed. Name = own data-framer-name (unless generic), else a Footer / Navigation / Hero descendant name, else the first non-generic descendant name, id, aria-label or first heading.

## Frame scenarios (1440x900, CDP Page.startScreencast png everyFrame, frames at 1x, cap 400)

| scenario | frames | duration ms | motion first->last ms | motion ranges | notes |
|---|---|---|---|---|---|

Each `frames/<scenario>/` has `NNNNN.png`, `frames.json` (t = ms since Page.startScreencast; the compositor only emits a frame when something repainted, so gaps = nothing changed) and `motion-timeline.json` (per-frame changed-pixel fraction; `motion` flag + merged ranges). Contact sheets: `1to1 sheet <frames dir> <out.png>`.

Scroll scenarios: screencast starts, instant scrollTo(sectionTop - 85% vh), 400ms settle, rAF ease-in-out scroll to (sectionTop - 15% vh) over 1500ms, 2500ms hold. Fresh page per scenario so appear animations replay.

## Unrevealed elements

None. Every element with data-framer-appear-id ended at computed opacity >= 0.9 in every viewport.

## Assets

10 unique URLs intercepted -> `assets/<img|vid|font|audio|data>-<sha1(url)[0:10]>.<ext>` (content addressed: the origin's own filenames are dropped), map in `assets/manifest.json` (analytics excluded; bytes=-1 had no readable body).

## Caveats

- Full pages are scroll-and-stitch. captureBeyondViewport resizes the viewport to the content height, which re-lays-out vh sections and fires IntersectionObservers, so it is not used. Sticky / scroll-linked sections show the state at each chunk's scroll offset; use the scroll-* frame sequences for their true motion.
- Screencast frames are 1x (--frame-dsf). PNG at 1440x900 yields ~30-60 fps of changed frames.
- Hover scenarios diff only inside the target rect (+40px) so animated textures elsewhere do not count as motion.
- `--only rediff` recomputes every motion-timeline.json from frames on disk; `--only static` / `--only frames` restrict the run. report.json is merged across runs.

## Errors

None.
