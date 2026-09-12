# capture: site

Captured: 2026-09-12T10:23:01.899Z (source url in ../.origin.json; never repeat it in the rebuild)
Rig: 1to1 capture (Playwright 1.63.0, headless Chromium, UA spoofed, reducedMotion=no-preference)

## Viewports (deviceScaleFactor 2)

| name | size | doc height | layout elements | reveal method | unrevealed |
|---|---|---|---|---|---|
| desktop | 1440x900 | 8470 | 1263 | scrollTo+wheel+scrollIntoView | 0 |
| tablet | 1024x900 | 8279 | 1308 | scrollTo+wheel+scrollIntoView | 0 |
| tablet-810 | 810x900 | 8254 | 1307 | scrollTo+wheel+scrollIntoView | 0 |
| mobile | 390x844 | 7390 | 1339 | scrollTo | 0 |

Per viewport: `<vp>/full.png` (revealed full page), `<vp>/layout.json` (flat array: path/tag/class/framerName/appearId/text/rect(page coords)/computed styles/media), `<vp>/unrevealed.json`, `<vp>/sections/NN-<name>.png`.

## Sections detected

### desktop

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Hero | div | 68 | 642 | 68-710 |
| 1 | Steps | div | 710 | 148 | 710-858 |
| 2 | Partners | div | 858 | 220 | 858-1078 |
| 3 | Conversation | div | 1078 | 749 | 1078-1827 |
| 4 | Features | div | 1827 | 2700 | 1827-4527 |
| 5 | Integrations | div | 4527 | 723 | 4527-5250 |
| 6 | Testimonials | div | 5250 | 601 | 5250-5851 |
| 7 | Statistics | div | 5851 | 489 | 5851-6340 |
| 8 | FAQ | div | 6340 | 512 | 6340-6852 |
| 9 | Footer Container | div | 6852 | 1618 | 6852-8470 |

### tablet

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 642 | 68-710 |
| 2 | Steps | div | 710 | 148 | 710-858 |
| 3 | Partners | div | 858 | 220 | 858-1078 |
| 4 | Conversation | div | 1078 | 667 | 1078-1745 |
| 5 | Features | div | 1745 | 2700 | 1745-4445 |
| 6 | Integrations | div | 4445 | 554 | 4445-4999 |
| 7 | Testimonials | div | 4999 | 501 | 4999-5500 |
| 8 | Statistics | div | 5500 | 565 | 5500-6065 |
| 9 | FAQ | div | 6065 | 590 | 6065-6655 |
| 10 | Footer Container | div | 6655 | 1624 | 6655-8279 |

### tablet-810

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -832 | 900 | -832-68 |
| 1 | Hero | div | 68 | 642 | 68-710 |
| 2 | Steps | div | 710 | 148 | 710-858 |
| 3 | Partners | div | 858 | 220 | 858-1078 |
| 4 | Conversation | div | 1078 | 697 | 1078-1775 |
| 5 | Features | div | 1775 | 2700 | 1775-4475 |
| 6 | Integrations | div | 4475 | 554 | 4475-5029 |
| 7 | Testimonials | div | 5029 | 501 | 5029-5530 |
| 8 | Statistics | div | 5530 | 565 | 5530-6095 |
| 9 | FAQ | div | 6095 | 590 | 6095-6685 |
| 10 | Footer Container | div | 6685 | 1569 | 6685-8254 |

### mobile

| # | name | tag | y | h | y-range |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | div | -776 | 844 | -776-68 |
| 1 | Hero | div | 68 | 888 | 68-956 |
| 2 | Steps | div | 956 | 272 | 956-1228 |
| 3 | Partners | div | 1228 | 180 | 1228-1408 |
| 4 | Conversation | div | 1408 | 727 | 1408-2135 |
| 5 | Features | div | 2135 | 918 | 2135-3053 |
| 6 | Integrations | div | 3053 | 678 | 3053-3731 |
| 7 | Testimonials | div | 3731 | 709 | 3731-4440 |
| 8 | Statistics | div | 4440 | 663 | 4440-5103 |
| 9 | FAQ | div | 5103 | 572 | 5103-5675 |
| 10 | Footer Container | div | 5675 | 1715 | 5675-7390 |

Selection rule: the outermost visible elements that are >= 100px tall, >= 200px wide and <= 90% of the document height, not position:fixed. Name = own data-framer-name (unless generic), else a Footer / Navigation / Hero descendant name, else the first non-generic descendant name, id, aria-label or first heading.

## Frame scenarios (1440x900, CDP Page.startScreencast png everyFrame, frames at 1x, cap 400)

| scenario | frames | duration ms | motion first->last ms | motion ranges | notes |
|---|---|---|---|---|---|
| load | 75 | 5933 | 471->5774 | 471-1561, 2148-2181, 3996-5774 | fresh page; screencast started before navigation; 6s |
| scroll-steps | 50 | 4453 | 625->4453 | 625-1590, 1902-1902, 2039-2039, 2161-2161, 2289-2289, 2415-2415, 2546-2546, 2680-2680, 2830-2830, 2969-2969, 3109-3109, 3249-3249, 3382-3382, 3512-3512, 3649-3649, 3785-3785, 3915-3915, 4047-4047, 4179-4179, 4311-4311, 4453-4453 | section "Steps" top -55->575 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-partners | 60 | 4459 | 168->4389 | 168-168, 667-1421, 1730-1730, 1878-1878, 2113-2113, 2298-4260, 4389-4389 | section "Partners" top 93->723 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-conversation | 68 | 4374 | 144->4374 | 144-1007, 1288-1288, 1415-1415, 1612-4374 | section "Conversation" top 313->943 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-features | 75 | 4408 | 1787->3167 | 1787-1845, 2088-2088, 3167-3167 | section "Features" top -749->-119 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-integrations | 39 | 4894 | 188->4894 | 188-301, 510-510, 634-706, 1008-2579, 4465-4894 | section "Integrations" top 3762->4392 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-testimonials | 31 | 2782 | 213->2471 | 213-213, 346-346, 574-574, 907-2471 | section "Testimonials" top 4485->5115 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-statistics | 57 | 4704 | 414->3939 | 414-414, 650-802, 1032-2368, 2623-2623, 2776-2852, 3167-3396, 3706-3939 | section "Statistics" top 5086->5716 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-faq | 29 | 4537 | 472->2786 | 472-472, 629-1736, 2424-2424, 2786-2786 | section "FAQ" top 5575->6205 (85%->15% vh) over 1500ms, then 2500ms hold |
| scroll-footer-container | 12 | 5451 | 201->5451 | 201-201, 423-423, 1668-1668, 2344-2344, 3004-3004, 3599-3599, 4227-4227, 4851-4851, 5451-5451 | section "Footer Container" top 6087->6717 (85%->15% vh) over 1500ms, then 2500ms hold |
| hover-0-newintroducing-ask-query-your- | 50 | 4288 | 1171->3109 | 1171-1251, 3029-3109 | hover 0-newintroducing-ask-query-your-; marks: {"moveOnStart":313,"moveOnEnd":1017,"moveOffStart":2522,"moveOffEnd":3268} |
| hover-1-primary-xl | 55 | 4226 | 1495->3095 | 1495-1567, 2953-3095 | hover 1-primary-xl; marks: {"moveOnStart":284,"moveOnEnd":976,"moveOffStart":2526,"moveOffEnd":3171} |
| hover-2-secondary-xl | 50 | 4345 | 1640->3201 | 1640-1640, 3201-3201 | hover 2-secondary-xl; marks: {"moveOnStart":337,"moveOnEnd":1058,"moveOffStart":2542,"moveOffEnd":3360} |
| hover-3-explore-more | 72 | 3671 | 1003->2581 | 1003-1108, 2581-2581 | hover 3-explore-more; marks: {"moveOnStart":247,"moveOnEnd":790,"moveOffStart":2295,"moveOffEnd":2675} |
| hover-4-view-integrations | 23 | 2156 | 537->2156 | 537-635, 2055-2156 | hover 4-view-integrations; marks: {"moveOnStart":43,"moveOnEnd":43,"moveOffStart":1133,"moveOffEnd":2156} |
| hover-5-primary-xl | 28 | 8091 | 364->8091 | 364-364, 636-636, 930-930, 1224-1224, 1505-1505, 1780-1780, 2056-2056, 2341-2341, 2620-2620, 2895-2895, 3182-3182, 3476-3476, 3767-3767, 4086-4086, 4393-4393, 4690-4690, 4985-4985, 5284-5284, 5590-5590, 5889-5889, 6181-6181, 6469-6469, 6749-6749, 7041-7041, 7341-7341, 7662-7662, 8091-8091 | hover 5-primary-xl; marks: {"moveOnStart":364,"moveOnEnd":3182,"moveOffStart":4690,"moveOffEnd":7341} |
| hover-6-x | 68 | 3717 | 1112->2591 | 1112-1173, 2591-2591 | hover 6-x; marks: {"moveOnStart":266,"moveOnEnd":809,"moveOffStart":2348,"moveOffEnd":2696} |
| hover-7-cortex | 31 | 8735 | 4158->5866 | 4158-4158, 5866-5866 | hover 7-cortex; marks: {"moveOnStart":385,"moveOnEnd":3239,"moveOffStart":4715,"moveOffEnd":7591} |
| hover-8-subscribe | 30 | 8429 | 4445->6136 | 4445-4445, 6136-6136 | hover 8-subscribe; marks: {"moveOnStart":377,"moveOnEnd":3179,"moveOffStart":4728,"moveOffEnd":7275} |
| hover-9-terms-and-conditions | 37 | 2698 | 520->2187 | 520-670, 2042-2187 | hover 9-terms-and-conditions; marks: {"moveOnStart":116,"moveOnEnd":116,"moveOffStart":1408,"moveOffEnd":2187} |
| loop-0-ticker-container | 39 | 8281 | 291->8281 | 291-291, 510-510, 710-710, 912-912, 1135-1135, 1355-1355, 1573-1573, 1801-1801, 2016-2016, 2248-2248, 2448-2448, 2663-2663, 2887-2887, 3088-3088, 3290-3290, 3495-3495, 3713-3713, 3944-3944, 4191-4191, 4430-4430, 4670-4670, 4925-4925, 5153-5153, 5376-5376, 5585-5585, 5810-5810, 6024-6024, 6240-6240, 6482-6482, 6707-6707, 6936-6936, 7154-7154, 7367-7367, 7576-7576, 7800-7800, 8044-8044, 8281-8281 | 4s unhovered, then hover 2s (self-animating element); hover: no change on hover (pre 6.89011@4.3fps -> post 6.14644@4.7fps) |
| loop-1-content | 0 | 0 | -->- |  | ERROR loop target lost |
| loop-2-content | 0 | 0 | -->- |  | ERROR loop target lost |
| loop-3-content | 0 | 0 | -->- |  | ERROR loop target lost |
| loop-4-content | 0 | 0 | -->- |  | ERROR loop target lost |
| loop-5-content | 0 | 0 | -->- |  | ERROR loop target lost |

Each `frames/<scenario>/` has `NNNNN.png`, `frames.json` (t = ms since Page.startScreencast; the compositor only emits a frame when something repainted, so gaps = nothing changed) and `motion-timeline.json` (per-frame changed-pixel fraction; `motion` flag + merged ranges). Contact sheets: `1to1 sheet <frames dir> <out.png>`.

Scroll scenarios: screencast starts, instant scrollTo(sectionTop - 85% vh), 400ms settle, rAF ease-in-out scroll to (sectionTop - 15% vh) over 1500ms, 2500ms hold. Fresh page per scenario so appear animations replay.

## Unrevealed elements

None. Every element with data-framer-appear-id ended at computed opacity >= 0.9 in every viewport.

## Assets

15 unique URLs intercepted -> `assets/<img|vid|font|audio|data>-<sha1(url)[0:10]>.<ext>` (content addressed: the origin's own filenames are dropped), map in `assets/manifest.json` (analytics excluded; bytes=-1 had no readable body).

## Caveats

- Full pages are scroll-and-stitch. captureBeyondViewport resizes the viewport to the content height, which re-lays-out vh sections and fires IntersectionObservers, so it is not used. Sticky / scroll-linked sections show the state at each chunk's scroll offset; use the scroll-* frame sequences for their true motion.
- Screencast frames are 1x (--frame-dsf). PNG at 1440x900 yields ~30-60 fps of changed frames.
- Hover scenarios diff only inside the target rect (+40px) so animated textures elsewhere do not count as motion.
- `--only rediff` recomputes every motion-timeline.json from frames on disk; `--only static` / `--only frames` restrict the run. report.json is merged across runs.

## Errors

- [loop-1-content] loop target lost
- [loop-2-content] loop target lost
- [loop-3-content] loop target lost
- [loop-4-content] loop target lost
- [loop-5-content] loop target lost
