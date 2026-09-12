# capture: site-features-ask

Captured: 2026-09-12T12:20:45.996Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 4680 | 890 | scrollTo | 0 |
| tablet | 1024x900 | 5657 | 976 | scrollTo | 0 |
| tablet-810 | 810x900 | 5666 | 985 | scrollTo | 0 |
| mobile | 390x844 | 6525 | 956 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Hero | div | 68 | 886 | 68-954 |
| 1 | Bento | div | 954 | 638 | 954-1592 |
| 2 | Ask USPs | div | 1592 | 981 | 1592-2573 |
| 3 | Statistics | div | 2573 | 489 | 2573-3062 |
| 4 | Footer Container | div | 3062 | 1618 | 3062-4680 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 845 | 68-913 |
| 2 | Bento | div | 913 | 1506 | 913-2419 |
| 3 | Ask USPs | div | 2419 | 1029 | 2419-3448 |
| 4 | Statistics | div | 3448 | 585 | 3448-4033 |
| 5 | Footer Container | div | 4033 | 1624 | 4033-5657 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 869 | 68-937 |
| 2 | Bento | div | 937 | 1506 | 937-2443 |
| 3 | Ask USPs | div | 2443 | 1069 | 2443-3512 |
| 4 | Statistics | div | 3512 | 585 | 3512-4097 |
| 5 | Footer Container | div | 4097 | 1569 | 4097-5666 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Hero | div | 68 | 862 | 68-930 |
| 2 | Bento | div | 930 | 1800 | 930-2730 |
| 3 | Ask USPs | div | 2730 | 1437 | 2730-4167 |
| 4 | Statistics | div | 4167 | 643 | 4167-4810 |
| 5 | Footer Container | div | 4810 | 1715 | 4810-6525 |

Selection rule: the outermost visible elements that are >= 100px tall, >= 200px wide and <= 90% of the document height, not position:fixed. Name = own data-framer-name (unless generic), else a Footer / Navigation / Hero descendant name, else the first non-generic descendant name, id, aria-label or first heading.

## Frame scenarios (1440x900, CDP Page.startScreencast png everyFrame, frames at 1x, cap 400)

| scenario | frames | duration ms | motion first->last ms | motion ranges | notes |
|---|---|---|---|---|---|

Each `frames/<scenario>/` has `NNNNN.png`, `frames.json` (t = ms since Page.startScreencast; the compositor only emits a frame when something repainted, so gaps = nothing changed) and `motion-timeline.json` (per-frame changed-pixel fraction; `motion` flag + merged ranges). Contact sheets: `1to1 sheet <frames dir> <out.png>`.

Scroll scenarios: screencast starts, instant scrollTo(sectionTop - 85% vh), 400ms settle, rAF ease-in-out scroll to (sectionTop - 15% vh) over 1500ms, 2500ms hold. Fresh page per scenario so appear animations replay.

## Unrevealed elements

None. Every element with data-framer-appear-id ended at computed opacity >= 0.9 in every viewport.

## Assets

13 unique URLs intercepted -> `assets/<img|vid|font|audio|data>-<sha1(url)[0:10]>.<ext>` (content addressed: the origin's own filenames are dropped), map in `assets/manifest.json` (analytics excluded; bytes=-1 had no readable body).

## Caveats

- Full pages are scroll-and-stitch. captureBeyondViewport resizes the viewport to the content height, which re-lays-out vh sections and fires IntersectionObservers, so it is not used. Sticky / scroll-linked sections show the state at each chunk's scroll offset; use the scroll-* frame sequences for their true motion.
- Screencast frames are 1x (--frame-dsf). PNG at 1440x900 yields ~30-60 fps of changed frames.
- Hover scenarios diff only inside the target rect (+40px) so animated textures elsewhere do not count as motion.
- `--only rediff` recomputes every motion-timeline.json from frames on disk; `--only static` / `--only frames` restrict the run. report.json is merged across runs.

## Errors

None.
