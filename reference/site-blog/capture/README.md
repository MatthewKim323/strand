# capture: site-blog

Captured: 2026-09-12T12:36:33.192Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 2813 | 504 | scrollTo | 0 |
| tablet | 1024x900 | 2942 | 583 | scrollTo | 0 |
| tablet-810 | 810x900 | 2806 | 583 | scrollTo | 0 |
| mobile | 390x844 | 3156 | 532 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Title | div | 68 | 120 | 68-188 |
| 1 | Featured Articles | div | 188 | 850 | 188-1038 |
| 2 | Latest | div | 1118 | 114 | 1118-1232 |
| 3 | Latest Articles | div | 1232 | 640 | 1232-1872 |
| 4 | Footer Container | div | 1872 | 941 | 1872-2813 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Title | div | 68 | 114 | 68-182 |
| 2 | Featured Articles | div | 182 | 703 | 182-885 |
| 3 | Latest | div | 965 | 110 | 965-1075 |
| 4 | Latest Articles | div | 1075 | 920 | 1075-1995 |
| 5 | Footer Container | div | 1995 | 947 | 1995-2942 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Title | div | 68 | 114 | 68-182 |
| 2 | Featured Articles | div | 182 | 622 | 182-804 |
| 3 | Latest | div | 884 | 110 | 884-994 |
| 4 | Latest Articles | div | 994 | 920 | 994-1914 |
| 5 | Footer Container | div | 1914 | 892 | 1914-2806 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Featured Articles | div | 142 | 554 | 142-696 |
| 2 | Latest | div | 776 | 110 | 776-886 |
| 3 | Latest Articles | div | 886 | 1232 | 886-2118 |
| 4 | Footer Container | div | 2118 | 1038 | 2118-3156 |

Selection rule: the outermost visible elements that are >= 100px tall, >= 200px wide and <= 90% of the document height, not position:fixed. Name = own data-framer-name (unless generic), else a Footer / Navigation / Hero descendant name, else the first non-generic descendant name, id, aria-label or first heading.

## Frame scenarios (1440x900, CDP Page.startScreencast png everyFrame, frames at 1x, cap 400)

| scenario | frames | duration ms | motion first->last ms | motion ranges | notes |
|---|---|---|---|---|---|

Each `frames/<scenario>/` has `NNNNN.png`, `frames.json` (t = ms since Page.startScreencast; the compositor only emits a frame when something repainted, so gaps = nothing changed) and `motion-timeline.json` (per-frame changed-pixel fraction; `motion` flag + merged ranges). Contact sheets: `1to1 sheet <frames dir> <out.png>`.

Scroll scenarios: screencast starts, instant scrollTo(sectionTop - 85% vh), 400ms settle, rAF ease-in-out scroll to (sectionTop - 15% vh) over 1500ms, 2500ms hold. Fresh page per scenario so appear animations replay.

## Unrevealed elements

None. Every element with data-framer-appear-id ended at computed opacity >= 0.9 in every viewport.

## Assets

14 unique URLs intercepted -> `assets/<img|vid|font|audio|data>-<sha1(url)[0:10]>.<ext>` (content addressed: the origin's own filenames are dropped), map in `assets/manifest.json` (analytics excluded; bytes=-1 had no readable body).

## Caveats

- Full pages are scroll-and-stitch. captureBeyondViewport resizes the viewport to the content height, which re-lays-out vh sections and fires IntersectionObservers, so it is not used. Sticky / scroll-linked sections show the state at each chunk's scroll offset; use the scroll-* frame sequences for their true motion.
- Screencast frames are 1x (--frame-dsf). PNG at 1440x900 yields ~30-60 fps of changed frames.
- Hover scenarios diff only inside the target rect (+40px) so animated textures elsewhere do not count as motion.
- `--only rediff` recomputes every motion-timeline.json from frames on disk; `--only static` / `--only frames` restrict the run. report.json is merged across runs.

## Errors

None.
