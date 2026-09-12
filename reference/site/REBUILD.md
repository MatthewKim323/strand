# REBUILD: site

> Captured 2026-09-12T09:56:45.136Z by 1to1. Everything in this folder is measured from a live page. Build from it; never eyeball a number.

## Origin blackout (not optional)

Nothing you write may say where this came from. The source url lives in `reference/site/.origin.json` and nowhere else: it is there so the rigs can re-measure, not for you to read out. These are your own components and your own assets.

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

Stack: framer (Framer) + Lenis. Built with Framer: appear ids, data-framer-name, framerusercontent modules. Use `1to1 prep` + `1to1 rip`. Lenis smooth scroll present: window.scrollTo may be overridden, rigs fall back to wheel events. 4 canvas element(s): WebGL / 2D drawing to port (find the module that draws it).

## Page heights (must match to the pixel)

| viewport | width | doc height | sections |
|---|---|---|---|
| desktop | 1440 | 8470 | 10 |
| tablet | 1024 | 8279 | 11 |
| tablet-810 | 810 | 8254 | 11 |
| mobile | 390 | 7390 | 11 |

### sections @ desktop

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Hero | 68 | 642 | spec/sections/00-hero.txt | capture/desktop/sections/00-hero.png |
| 1 | Steps | 710 | 148 | spec/sections/01-steps.txt | capture/desktop/sections/01-steps.png |
| 2 | Partners | 858 | 220 | spec/sections/02-partners.txt | capture/desktop/sections/02-partners.png |
| 3 | Conversation | 1078 | 749 | spec/sections/03-conversation.txt | capture/desktop/sections/03-conversation.png |
| 4 | Features | 1827 | 2700 | spec/sections/04-features.txt | capture/desktop/sections/04-features.png |
| 5 | Integrations | 4527 | 723 | spec/sections/05-integrations.txt | capture/desktop/sections/05-integrations.png |
| 6 | Testimonials | 5250 | 601 | spec/sections/06-testimonials.txt | capture/desktop/sections/06-testimonials.png |
| 7 | Statistics | 5851 | 489 | spec/sections/07-statistics.txt | capture/desktop/sections/07-statistics.png |
| 8 | FAQ | 6340 | 512 | spec/sections/08-faq.txt | capture/desktop/sections/08-faq.png |
| 9 | Footer Container | 6852 | 1618 | spec/sections/09-footer-container.txt | capture/desktop/sections/09-footer-container.png |

### sections @ tablet

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 642 | spec/sections/01-hero.txt | capture/tablet/sections/01-hero.png |
| 2 | Steps | 710 | 148 | spec/sections/02-steps.txt | capture/tablet/sections/02-steps.png |
| 3 | Partners | 858 | 220 | spec/sections/03-partners.txt | capture/tablet/sections/03-partners.png |
| 4 | Conversation | 1078 | 667 | spec/sections/04-conversation.txt | capture/tablet/sections/04-conversation.png |
| 5 | Features | 1745 | 2700 | spec/sections/05-features.txt | capture/tablet/sections/05-features.png |
| 6 | Integrations | 4445 | 554 | spec/sections/06-integrations.txt | capture/tablet/sections/06-integrations.png |
| 7 | Testimonials | 4999 | 501 | spec/sections/07-testimonials.txt | capture/tablet/sections/07-testimonials.png |
| 8 | Statistics | 5500 | 565 | spec/sections/08-statistics.txt | capture/tablet/sections/08-statistics.png |
| 9 | FAQ | 6065 | 590 | spec/sections/09-faq.txt | capture/tablet/sections/09-faq.png |
| 10 | Footer Container | 6655 | 1624 | spec/sections/10-footer-container.txt | capture/tablet/sections/10-footer-container.png |

### sections @ tablet-810

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -832 | 900 | spec/sections/00-tablet-mobile-menu.txt | capture/tablet-810/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 642 | spec/sections/01-hero.txt | capture/tablet-810/sections/01-hero.png |
| 2 | Steps | 710 | 148 | spec/sections/02-steps.txt | capture/tablet-810/sections/02-steps.png |
| 3 | Partners | 858 | 220 | spec/sections/03-partners.txt | capture/tablet-810/sections/03-partners.png |
| 4 | Conversation | 1078 | 697 | spec/sections/04-conversation.txt | capture/tablet-810/sections/04-conversation.png |
| 5 | Features | 1775 | 2700 | spec/sections/05-features.txt | capture/tablet-810/sections/05-features.png |
| 6 | Integrations | 4475 | 554 | spec/sections/06-integrations.txt | capture/tablet-810/sections/06-integrations.png |
| 7 | Testimonials | 5029 | 501 | spec/sections/07-testimonials.txt | capture/tablet-810/sections/07-testimonials.png |
| 8 | Statistics | 5530 | 565 | spec/sections/08-statistics.txt | capture/tablet-810/sections/08-statistics.png |
| 9 | FAQ | 6095 | 590 | spec/sections/09-faq.txt | capture/tablet-810/sections/09-faq.png |
| 10 | Footer Container | 6685 | 1569 | spec/sections/10-footer-container.txt | capture/tablet-810/sections/10-footer-container.png |

### sections @ mobile

| # | name | y | h | spec | crop |
|---|---|---|---|---|---|
| 0 | Tablet / Mobile Menu | -776 | 844 | spec/sections/00-tablet-mobile-menu.txt | capture/mobile/sections/00-tablet-mobile-menu.png |
| 1 | Hero | 68 | 888 | spec/sections/01-hero.txt | capture/mobile/sections/01-hero.png |
| 2 | Steps | 956 | 272 | spec/sections/02-steps.txt | capture/mobile/sections/02-steps.png |
| 3 | Partners | 1228 | 180 | spec/sections/03-partners.txt | capture/mobile/sections/03-partners.png |
| 4 | Conversation | 1408 | 727 | spec/sections/04-conversation.txt | capture/mobile/sections/04-conversation.png |
| 5 | Features | 2135 | 918 | spec/sections/05-features.txt | capture/mobile/sections/05-features.png |
| 6 | Integrations | 3053 | 678 | spec/sections/06-integrations.txt | capture/mobile/sections/06-integrations.png |
| 7 | Testimonials | 3731 | 709 | spec/sections/07-testimonials.txt | capture/mobile/sections/07-testimonials.png |
| 8 | Statistics | 4440 | 663 | spec/sections/08-statistics.txt | capture/mobile/sections/08-statistics.png |
| 9 | FAQ | 5103 | 572 | spec/sections/09-faq.txt | capture/mobile/sections/09-faq.png |
| 10 | Footer Container | 5675 | 1715 | spec/sections/10-footer-container.txt | capture/mobile/sections/10-footer-container.png |

Frame scenarios (26): load, scroll-steps, scroll-partners, scroll-conversation, scroll-features, scroll-integrations, scroll-testimonials, scroll-statistics, scroll-faq, scroll-footer-container, hover-0-newintroducing-ask-query-your-, hover-1-primary-xl, hover-2-secondary-xl, hover-3-explore-more, hover-4-view-integrations, hover-5-primary-xl, hover-6-x, hover-7-cortex, hover-8-subscribe, hover-9-terms-and-conditions, loop-0-ticker-container, loop-1-content, loop-2-content, loop-3-content, loop-4-content, loop-5-content. Details in `capture/README.md`.

## The loop

```bash
# build one section, then compare
1to1 shot "http://localhost:3777/?only=<section>" reference/site/build/<section>.png --w 1440
1to1 heights http://localhost:3777/ "$(1to1 origin reference/site --url)"          # page + section heights at all 4 widths
1to1 boxes http://localhost:3777/ 1440 <yFrom> <yTo>                       # your boxes
1to1 refboxes reference/site desktop <yFrom> <yTo>                                # reference boxes (same columns)
1to1 diff reference/site/build/desktop-full.png reference/site/capture/desktop/full.png reference/site/build/diff --ref reference/site
1to1 frames http://localhost:3777/ reference/site/build/frames/load --ms 6000 --start-before-nav && 1to1 sheet reference/site/build/frames/load reference/site/build/load-sheet.png
1to1 sheet reference/site/capture/frames/load reference/site/build/ref-load-sheet.png    # same time steps, compare side by side
1to1 verify http://localhost:3777/ reference/site --diff                          # the gate: PASS at every width or keep going
1to1 blackout .                                                            # no mention of the origin anywhere in the project
```

Rules for builders are in `CONVENTIONS.md` (project root `reference/`), method in the 1to1 skill docs (`docs/METHOD.md`, `docs/FRAMER.md`, `docs/VERIFY.md`).
