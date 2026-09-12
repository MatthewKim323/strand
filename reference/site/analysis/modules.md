# Modules

One line per module in `reference/site/modules/`. "Exports" lists the Framer `displayName` of each
component plus its CSS scope class (`framer-XXXXX`, the `withCSS` serialization hash). "Used by" is
derived by matching every scope class against the rendered tree in `spec/page.txt` (desktop capture)
and the raw DOM in `dom/full.html`.

Sections are numbered as in `motion/component-specs.md`:
0 Hero, 1 Steps, 2 Partners, 3 Conversation, 4 Features, 5 Integrations, 6 Testimonials,
7 Statistics, 8 FAQ, 9 Footer Container (CTA + Footer), plus Navigation (fixed shell) and
Template overlay (the marketplace promo card injected above `#main`, not part of the rebuild).

## Runtime and vendor

| module | KB | what it is | exports | used by |
|---|---|---|---|---|
| `framer.Dy0MSJwM.mjs` | 506 | Framer runtime. Holds `withFX` (scroll transform / style appear), `withVariantAppearEffect`, `withTicker`, `withOptimizedAppearEffect`, `useVariantState`, the text-effect tokenizer, the Ticker engine (`rg`), scroll-range math (`Ul`, `Kl`, `Zl`), Lenis wrapper. | runtime only | everything. Read for prop semantics only. |
| `motion.CaYsD5Db.mjs` | 148 | Framer's bundled Motion (`motion`, `useMotionValue`, `useSpring`, `useTransform`, `animate`, `AnimatePresence`, `LayoutGroup`, `MotionConfigContext`). | vendor | everything |
| `react.BpkJvQWg.mjs` | 141 | React 18 + jsx-runtime shim. | vendor | everything |
| `rolldown-runtime.Dh6celcD.mjs` | 0.6 | module-init helper (`e(fn)` lazy init wrapper used by every module). | vendor | everything |
| `three.module.BQ2sF8ia.mjs` | 536 | three.js r136. Only pulled in by the two WebGL code components. | vendor | 0 Hero, 4 Features, 9 Footer Container (CTA) |
| `WebGLGuard.Cz0BfuzQ.mjs` | 4 | capability guard that decides whether to mount a WebGL canvas or the fallback image. | guard helper | 0 Hero, 4 Features, 9 Footer Container |

## Page and shell

| module | KB | what it is | exports (displayName / scope) | used by |
|---|---|---|---|---|
| `lYRm1Ytba0fEaT72gO8Y3cQH-To3rzGeaa6VatF3SJ8.d_xe5FNF.mjs` | 351 | **The page module.** Every section of this page as one `Home` component (`framer-KmWmf`, root variant classes `framer-v-72rtr7` desktop / `framer-v-uuxm6n` tablet / `framer-v-wc1e1l` phone), plus the sub-components it owns and two inlined code components. | `Home` (`framer-KmWmf`) · `Step` (`framer-BDiiR`) · `Testimonials` (`framer-eo5xJ`) · `Product Feature` (`framer-nbXXU`) · `Feature Section` (`framer-5Y2Hx`) · `Status` (`framer-9bYeO`) · `Cortex Stats` (`framer-AhJf9`) · `Tab Button` (`framer-V3qmg`, phone only) · `Mobile Carousel` (`framer-PlXiw`, phone only) · `Graph Pulse` (`framer-U3LFO`, phone only) · `FAQ` (`framer-uLM4K`) · `FAQ Question` (`framer-Bi957`) · `New Strip` (`framer-QjZ00`) · `Layout Jump Preventer` · icons `Chart No Axes Column Increasing` (`framer-QIJ8C`), `Sparkle` (`framer-0KIoe`), `Message Circle Question Mark` (`framer-bEAlb`), `Gauge` (`framer-bpHoo`), `Route` (`framer-i0sw1`), `Network` (`framer-PQmMh`), `File Output` (`framer-c1n2a`), `Share 2` (`framer-ErykM`), `Languages` (`framer-ZZeJd`), `Sparkles` (`framer-Efhma`) · code components: the scroll progress rail (`ar`), the rail-cart shape swapper (`Rr`), the hero announcement text ticker (`Ms`) | 0-8, plus the phone-only Features carousel |
| `script_main.8MTO-Tt7.mjs` | 354 | **The layout/shell module.** The `Layout` template that wraps every page: the fixed Navigation, both dropdown menus, the mobile menu, the Footer, the newsletter form, the CTA WebGL wrapper, the Lenis provider, and the marketplace template overlay. | `Layout` · `Navigation` (`framer-Hi6IO`) · `Nav Product Button` (`framer-zfuWk`) · `Nav Single Button` (`framer-UUE7D`) · `Nav Menu Row Item` (`framer-tG8tW`) · `Nav Mobile Menu` (`framer-gy7u4`) · `Mobile navigation item` (`framer-fXWrN`) · `Menu` (`framer-grV1P`) · `Footer Newsletter` (`framer-e9zZI`) · `External Link` (`framer-TbQBv`) · `CTA Nordwell Animation` (`framer-zhkea`, the CTA WebGL wrapper) · `Lenis` · `Purchase Template Button` · `Checkout License Modal` (`framer-bXSK9`, not rendered) · `License Option` (`framer-6G52L`, not rendered) · `Page` (`framer-bEdDE`, not rendered) · `Feature` (`framer-VrdWK`, not rendered) · `Cortex` / `Ask` / `Pulse` dropdown icons (`framer-7zl6k`, `framer-x2eYv`, `framer-tHYnb`) · icons `Stripe` (`framer-7Hzyv`), `Milestone` (`framer-SO7t0`), `User Round` (`framer-CnHod`), `Layout Dashboard`, `Box` (`framer-M1WAF`), `Layers` (`framer-CxKJY`), `Component` (`framer-7QfWE`), `Lock Keyhole` (`framer-l1CJE`), `Monitor Smartphone` (`framer-KejkX`), `Polar` (`framer-guWti`), `Circle Question Mark` (`framer-1Eje6`), `File Code 2` (`framer-2WioN`), `Chevron Up` (`framer-RD9jt`) | Navigation, 9 Footer Container, Template overlay |
| `UudkIH-2UmxY8ivjW6Zu26pXrEnWbUv4I6wO6sY7y7w.DwgC5WQI.mjs` | 1 | page metadata module. Declares the three breakpoint hashes (`72rtr7` >=1200, `uuxm6n` 810-1199.98, `wc1e1l` <810) and the anchor-id map used for every section `id`: `huHhlTABf`->`hero`, `HDSWH3Mhb`->`features`, `lMuLw7rBf`->`products-swap-scroll`, `ZCf3gPeUL`->`products-scroll`, `DP73v_68v`->`features-cortex`, `qOfta1b7O`->`features-ask`, `G9H9GcHWQ`->`features-pulse`, `D6ka2Tgrs`->`integrations`, `PUj5rU80n`->`statistics`. | metadata | whole page |
| `shared-lib.D5K85Osy.mjs` | 0.5 | site-wide meta (title, description, favicon, social image). | metadata | `<head>` |

## Component libraries

| module | KB | what it is | exports (displayName / scope) | used by |
|---|---|---|---|---|
| `tQctxOsxU.BMpimIfh.mjs` | 388 | Big shared component library, non-mangled identifiers. Owns the animated chat mock, a Lottie player, and a per-letter text transition component. Also embeds the whole bodymovin/Lottie runtime (used by section 7's four Lottie players). | `Ask Chat Anim` (`framer-JcDMh`) · `Chat Dialog Result` (`framer-rl0Pk`) · `Clipboard List` (`framer-T13M8`) · `Activity` (`framer-cnenU`) · `Align Horizontal Justify Center` (`framer-ENWIm`) · `Mic` (`framer-Mv0fb`) · Lottie player (`At`) · `TextTransitionV2` / `Letter` | 3 Conversation (Ask Chat Anim), 4 Features (Ask Chat Anim in the rail-cart slot), 7 Statistics (Lottie player x4) |
| `lFOi1sWHj.CT5eLhTa.mjs` | 53 | Integrations visual kit. | `Integrations` (`framer-kdORT`) · `Integration Single` (`framer-7anIQ`) · `Integration Single Tile` (`framer-DXDHz`) · `Chatdock` (`framer-OtoXu`) · `Stat` (`framer-6SsJm`) · `Refresh Ccw` (`framer-teLFS`) | 5 Integrations, 4 Features |
| `iGMqUL1SO.CO4Rx4RY.mjs` | 38 | Quick-action / status kit used inside the chat mock. | `Quick Action` (`framer-MvRYe`) · `Status Indicator` (`framer-3VM4T`) · `Message Square Share` (`framer-qIgAD`) · `Plus` (`framer-K11hZ`) · `File Spreadsheet` (`framer-50oIK`) · `Chart Pie` (`framer-kIZlk`) · `Nietzsche Logo` (`framer-MOhqr`) | 3 Conversation, 5 Integrations |
| `wGW8GAdNp.DI9jMS0f.mjs` | 69 | the six partner wordmarks rendered in the ticker. | `Acme` (`framer-Iwohq`) · `Capsule` (`framer-pnjIA`) · `Luminous` (`framer-WxnZN`) · `CloudWatch` (`framer-OWogs`) · `Nietzsche` (`framer-ywcy7`) · `Sisyphus` (`framer-HQQM6`) | 2 Partners |

## Buttons and small components

| module | KB | what it is | exports (displayName / scope) | used by |
|---|---|---|---|---|
| `VDI2v9hjz.CSIN71cc.mjs` | 23 | **the main button.** 12 variants = 4 styles (Primary / Secondary / Ghost / Light) x 3 sizes (XL / LG / MD). hover + pressed on all 12. | `CTA Button` (`framer-nnJOX`) | Navigation, 0 Hero, 9 Footer Container (CTA) |
| `cZrCCoVsg.6VaJQZpD.mjs` | 23 | icon-only round button. 25 variants = 5 styles (Primary / Secondary / Light / Ghost / Disabled) x 5 sizes (XL / LG / MD / SM / XS). | `Circular Button` (`framer-ssUFK`) | 5 Integrations, 6 Testimonials (the two carousel arrows) |
| `R4iI64qGo.tEWc6BFP.mjs` | 7 | text link with a trailing round button. transition is a 0.1s tween `[0.44,0,0.56,1]`. | `Circular Button With Text` (`framer-z2KqL`) | 4 Features (x3, "Explore ..."), 5 Integrations ("View integrations") |
| `FQ7fHGkTD.D5uGLdFt.mjs` | 11 | newsletter submit button with Default / Loading / Disabled / Success / Error states. | `Form Submit Button` (`framer-DAIlr`, secondary scope `framer-iiwtf`) | 9 Footer Container (newsletter) |
| `fWyRwFk4d.OE3urp4C.mjs` | 14 | small label pill. Variants Primary / Extra Padding / Small / Primary - Hover. | `Pill` (`framer-LKFMZ`, secondary scope `framer-mEJFY`) | 0 Hero (the "New" pill in the announcement strip), 5 Integrations |
| `LxfG345Ju.1NrqUAuk.mjs` | 5 | small tag chip. | `Tag` (`framer-022zo`) | not rendered on this page |
| `BPbDZR7IG.6r3LE1ht.mjs` | 10 | `Hash` (`framer-XAHcT`, Solid / Dashed) and `Vertical Dot Arrow` (`framer-EOMkT`, Neutral / Down / Up) | `Hash`, `Vertical Dot Arrow` | 8 FAQ (the row indicator) |
| `r0opSXunw.COjhZ_g9.mjs` | 6 | six 2x2px dots that morph from a "thinking" cluster into an arrow. Variants Primary / Next, three staggered spring transitions (delay 0 / 0.05 / 0.1). | `Dot Arrow` (`framer-AfnJr`) | 0 Hero (announcement strip) |
| `Z1shk5IlQ.DDtm828J.mjs` | 5 | the chromatic-aberration divider line: six 1px bars (b/g/r left + right) that grow from width 0% to 100% and desaturate. | `Chromatic Border` (`framer-kEcQz`, inner `framer-t5arn`) | 2 Partners, 5 Integrations, 6 Testimonials, 7 Statistics (4 instances, all driven by variant-on-scroll) |
| `StatusPingV2.Dx0_L55Q.mjs` | 1 | a dot with an expanding ripple ring, `repeat: Infinity`. | status ping | 4 Features (inside `Cortex Stats` cards) |
| `NdJd_T7MO.DQ2ehMCR.mjs` | 3 | `Life Buoy` (`framer-otzfv`) icon | icon | not rendered on this page |

## WebGL code components

| module | KB | what it is | exports | used by |
|---|---|---|---|---|
| `HeroThreeJSV2.BLMtRZnd.mjs` | 33 | the hero graphic: a points/tube particle field extruded along an SVG outline. Mounted with **no** motion wrapper, **no** appear id, **no** scroll link. | hero shader component (`Tt` in the page module) | 0 Hero |
| (inlined in the page module, `Rr` / `Fr`) | - | the Features rail-cart shape swapper: same shader family, plus a `sectionName` scroll hook that picks which slot child to show. | `Rr` | 4 Features |
| (inlined in `script_main`, `CTA Nordwell Animation`) | - | the CTA background shader with an `introProgress` prop. | `framer-zhkea` | 9 Footer Container |

## Logo components (Integrations grid + ticker)

All are single-export SVG wordmarks with no motion.

| module | KB | displayName / scope | used by |
|---|---|---|---|
| `JdYRKOb7H.ByKgF8of.mjs` | 2 | `Nordwell` (`framer-YfD14`) | Navigation logo, 5 Integrations |
| `SmiCe72jp.Da_wGi5K.mjs` | 6 | `Pipecloud` (`framer-bqZNq`) | 5 Integrations |
| `FwgPDzych.Cui99Pva.mjs` | 4 | `Cleardesk` (`framer-ymZ8h`) | 5 Integrations |
| `hoOdvt9sa.BM_-PT9n.mjs` | 3 | `Threadbase` (`framer-TvQhD`) | 5 Integrations |
| `tG6a4EVLL.CM5T52fQ.mjs` | 3 | `VaultDB` (`framer-VAmFs`) | 5 Integrations |
| `eIz93xLDQ.CAPfEQvQ.mjs` | 3 | `Scaleforce` (`framer-SGmg3`) | 5 Integrations |
| `gx3qGggAK.NB8ne5Yh.mjs` | 3 | `Surfboard` (`framer-Sb2xs`) | 5 Integrations |
| `jIrv3aFLA.CajVcfuE.mjs` | 3 | `Trackwise` (`framer-wLgrk`) | 5 Integrations |
| `A7QaNMVpR.DwVEPMLG.mjs` | 3 | `Stride` (`framer-zS0tf`) | 5 Integrations |
| `PU6raJhwj.CKmAxRk6.mjs` | 3 | `Driftline` (`framer-iCtWw`) | 5 Integrations |
| `B_VzeB0ov.BuORaWkb.mjs` | 2 | `Replystack` (`framer-phRX5`) | 5 Integrations |

## Icon components

| module | KB | displayName / scope | used by |
|---|---|---|---|
| `zD0HidK19.BonexWDa.mjs` | 2 | `Chevron Right` (`framer-ab47M`) | 3, 4, 5, 6 |
| `GXOmzsK3W.Ca3eACUy.mjs` | 2 | `Chevron Left` (`framer-4rnSx`) | 6 Testimonials |
| `ZodASoCsI.FAXXWZcA.mjs` | 2 | `Chevron Down` (`framer-rjFuH`) | Navigation (dropdown carets) |
| `ZajZqjjCF.BbWe1lXK.mjs` | 2 | `Check` (`framer-FCBgc`) | not rendered on this page |
| `P3MA2yYun.BTRAJ29p.mjs` | 2 | `Arrow Up Right` (`framer-HfmfX`) | 9 Footer Container (`External Link`, two stacked copies: "Arrow default" + "Arrow hovered") |
| `gpufTpA3b.BGpHTkX6.mjs` | 2 | `X` (`framer-RiU4T`) | not rendered on this page |

## Text style presets

Each exports one `framer-styles-preset-*` rule set with a per-breakpoint override block. No motion.

| module | preset class | role | used by |
|---|---|---|---|
| `hkVthjEO7.C4362upy.mjs` | `framer-styles-preset-19ingv` | hero h1 | 0 Hero |
| `omEb8Ipew.Cti9Je53.mjs` | `framer-styles-preset-1p8mz83` | section h2 | 3, 5, 7, 8 |
| `uboWt2ocK.Dz1_8mHi.mjs` | `framer-styles-preset-1gn15j8` | CTA h2 (and the template overlay) | 6, 9 |
| `gO5BOL9GY.BZ9VB3ef.mjs` | `framer-styles-preset-4ysld2` | big stat number h3 | 7 Statistics, Navigation |
| `KWb9XH2R2.ccY8PSs5.mjs` | `framer-styles-preset-6awed` | step number + step title h3 | 1 Steps |
| `SdTPp_N7j.BudclxlG.mjs` | `framer-styles-preset-1b45yw5` | FAQ question h3 | 8 FAQ |
| `HN3v7c7uq.i8JSf2L8.mjs` | `framer-styles-preset-1h9i0d0` | button label / small body | 0, 4, 5, 9, Navigation |
| `DcM4UVtzQ.DI7hcmw5.mjs` | `framer-styles-preset-1tsnca` | body paragraph | most sections |
| `zP54Deppw.CV5M7OPU.mjs` | `framer-styles-preset-1unq4w` | caption / micro body | 0, 3, 5 |
| `asuQ9IUVH.Ddn5QmW7.mjs` | `framer-styles-preset-c6fndl` | step description | 1 Steps |
| `j5N4vM3LD.CMMEJVvj.mjs` | `framer-styles-preset-1rmkco3` | small mono label | 4 Features, 6 Testimonials |
| `xkcDuX5jD.CtiyNjZt.mjs` | `framer-styles-preset-hwasvf` | card sub-label | 4 Features, Navigation |
| `GTRGe9j5m.KMtu-5jw.mjs` | `framer-styles-preset-12bheum` | (defined, matched only inside 5 Integrations) | 5 Integrations |
| `Go8bnqpJM.Yr9X_Jp-.mjs` | `framer-styles-preset-onxyg3` | testimonial quote | 6 Testimonials |

The two link presets `framer-styles-preset-1ybqtif` (footer column links) and
`framer-styles-preset-656phd` (Terms / Privacy) are declared inside `script_main.8MTO-Tt7.mjs`, not in
their own modules. Both carry `transition: color .15s cubic-bezier(.12,.23,.5,1)` and a
`--framer-link-hover-text-color` token; this is the only pure-CSS transition on the page.
