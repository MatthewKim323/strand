# Component motion spec

The rebuild works from this file. Every number here is quoted from the page module, the layout module,
the shared component libraries, the SSR appear payload, or the measured capture. Nothing is rounded and
nothing is invented. Where something is genuinely ambiguous it is called out as **UNCERTAIN**.

Target stack: Next.js 16 App Router, React 19, `motion` (import from `"motion/react"`), Lenis.

Naming: the particle-trail graphic in the hero and in the CTA background is called a **filament** in this
rebuild. Section numbering follows the capture.

---

## Contents

| # | heading | what |
|---|---|---|
| G | Global facts | preloader, breakpoints, smooth scroll, mechanism census, transition glossary, geometry, route transition |
| N | Navigation | the fixed bar, both dropdowns, the mobile menu |
| 0 | Hero | 4 appear animations, the announcement strip, the hero filament |
| 1 | Steps | 3 appear animations |
| 2 | Partners | the one Framer ticker |
| D | Chromatic divider lines | the 4 variant-on-scroll switches shared by sections 2, 5, 6, 7 |
| 3 | Conversation | the self-driving chat mock, both text effects, the parallax |
| 4 | Features | the scroll progress rail, the shape swapper, the status ping loops |
| 5 | Integrations | the scroll-target effect, the in-view fade |
| 5b | Integrations, interactive | the rolling source list, tiles, buttons |
| 6 | Testimonials | the arrow-driven carousel |
| 7 | Statistics | four Lottie players, no count-up |
| 8 | FAQ | the single-open accordion |
| 9 | Footer Container | variant-on-scroll #5, `introProgress`, the newsletter, the social links |
| B | Button reference | every hover and press value for every button variant |
| L | Loop index | every `repeat: Infinity` in one table |
| C | Count-ups | there are none |
| X | What has no motion | recorded so the rebuild does not invent any |

---

## G. Global facts

### G.1 Preloader

**No.** There is no preloader, splash, progress bar, or load overlay anywhere on the page.

- The only `@keyframes` in the whole document is `__framer-loading-spin` (800ms linear rotate, infinite),
  and it belongs to the editor-bar `<style>` block. No element in the body ever carries that class
  (`grep -c 'class="[^"]*__framer-loading' dom/full.html` = 0). Do not port it.
- The two full-screen fixed overlays in the layout module (`.framer-19h89bg` backdrop,
  `.framer-8c61kp` fullscreen stack) are the template-purchase modal, opened by user tap only.
- The one thing that *looks* like a load animation is the floating marketplace pill (appear id
  `w6pet3`, opacity 0.001 -> 1 after a **1.5s delay**). That is the template-store badge that sits
  above `#main`; it is not part of the page and should not be rebuilt.

### G.2 Breakpoints

Declared in the page metadata module and repeated as `jc` in the page module:

| name | media query | breakpoint id | root variant class | `hidden-` suffix |
|---|---|---|---|---|
| desktop | `(min-width: 1200px)` | `WQLkyLRf1` | `framer-v-72rtr7` | `hidden-72rtr7` |
| tablet | `(min-width: 810px) and (max-width: 1199.98px)` | `rEV9rZoMS` | `framer-v-uuxm6n` | `hidden-uuxm6n` |
| phone | `(max-width: 809.98px)` | `unRQ49xdc` | `framer-v-wc1e1l` | `hidden-wc1e1l` |

The SSR appear payload keys its per-breakpoint entries as `default` (desktop), `uuxm6n` (tablet),
`wc1e1l` (phone). The layout module uses a different hash set for the same three queries:
`f76mnz` desktop, `1e3jmh` tablet, `1g056l3` phone.

The body gets `padding: 68px 0px 0px 0px` at desktop to clear the fixed nav.

### G.3 Smooth scroll

Lenis, mounted by the layout as a code component (`displayName = "Lenis"`, rendered at
`.framer-uz5b0i-container`, immediately before the Navigation). Props on this page:

```js
{ smooth: true, infinite: false, intensity: 12, orientation: 'vertical' }
```

which the component turns into:

```js
new Lenis({
  smoothWheel: true,
  duration: 1.2,               // intensity / 10
  infinite: false,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  autoRaf: true,
  autoToggle: true,
  anchors: true,
  allowNestedScroll: true,
  syncTouch: false,            // !!infinite
  stopInertiaOnNavigate: true,
})
```

`<html>` carries `class="lenis lenis-autoToggle"` and `style="scroll-behavior: auto"`. Every
scroll-linked effect on the page reads `window.scrollY`, so it works unchanged under Lenis.

### G.4 Which of the five mechanisms this page uses

Census across all 57 modules (`grep` counts, exact):

| mechanism | count | where |
|---|---|---|
| 1. SSR appear (`data-framer-appear-id`) | **16** entries in the payload (19 ids in the DOM, 3 with no payload) | Hero x4, Steps x3, Conversation x4 (+2 payload-less), Features x4, marketplace badge x1, Framer badge x1 |
| 2. Scroll transform, `onInView` | **0** | not used |
| 3. Scroll target (`__framer__transformTrigger: 'onScrollTarget'`) | **1** | Integrations "Visual", `x: 120 -> 0` |
| 4. Variant switch on scroll (`__framer__variantAppearEffectEnabled`) | **5** (4 page + 1 layout) | the 4 chromatic divider lines + the CTA filament field |
| 5. Text effect (`tokenization`) | **0 in the page module**, **2 in the shared library** | see the note below |
| style appear (`__framer__styleAppearEffectEnabled`, in-view opacity) | **1** | Integrations "Visual" wrapper |
| ticker (`tickerEffectEnabled`) | **1** Framer ticker + **1** custom text ticker | Partners logo row; hero announcement strip |
| `repeat: Infinity` loops | **3 declared** (`repeat:1/0`) | StatusPingV2 ring, the hero announcement text ticker, the per-letter gradient in `TextTransitionV2` |
| loop effect (`__framer__loopEffectEnabled`) | **1** | newsletter submit button spinner |
| count-up / animated number component | **0** | the Statistics numbers are static text; the motion there is four Lottie players |

**On "0 text effects": half true, and the half that is false matters.** The page module contains zero
`tokenization` occurrences, which is what the original claim was based on. But the shared library
`tQctxOsxU.BMpimIfh.mjs` declares two (`textEffect`, `textEffect1`) and its `Ask Chat Anim` component
renders in the Conversation section. The CDP capture proves they run: 121 recorded WebAnimations
include a run of `duration 200ms` with delays stepping `0, 20, 40 ... 520ms` and a run of
`duration 100ms` with delays stepping `100, 125, 150 ... 500ms`. Those are per-character staggers, not
appear animations. See section 3.

### G.5 Transition constant glossary

Use these names throughout. Every one is quoted verbatim from source.

```js
// The two house transitions.
const SPRING_A = { type: 'spring', bounce: 0.2, duration: 0.4, delay: 0 }
const TWEEN_A  = { type: 'tween',  duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0 }

// Shorter tweens on the same house curve.
const TWEEN_A_300 = { type: 'tween', duration: 0.3,  ease: [0.12, 0.23, 0.5, 1], delay: 0 }
const TWEEN_A_200 = { type: 'tween', duration: 0.2,  ease: [0.12, 0.23, 0.5, 1], delay: 0 }
const TWEEN_A_100 = { type: 'tween', duration: 0.1,  ease: [0.12, 0.23, 0.5, 1], delay: 0 }

// The "sine" curve, used by the status ping, the Cortex Stats cards and the
// Circular Button With Text.
const TWEEN_B_600 = { type: 'tween', duration: 0.6,  ease: [0.44, 0, 0.56, 1], delay: 0 }
const TWEEN_B_300 = { type: 'tween', duration: 0.3,  ease: [0.44, 0, 0.56, 1], delay: 0 }
const TWEEN_B_200 = { type: 'tween', duration: 0.2,  ease: [0.44, 0, 0.56, 1], delay: 0 }
const TWEEN_B_100 = { type: 'tween', duration: 0.1,  ease: [0.44, 0, 0.56, 1], delay: 0 }

// Linear.
const TWEEN_LINEAR_1S = { type: 'tween', duration: 1, ease: [0, 0, 1, 1], delay: 0 }

// The chromatic divider's three staggered channel tweens (red leads, green +0.02s, blue +0.04s).
const DIVIDER_R = { type: 'tween', duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0    }
const DIVIDER_G = { type: 'tween', duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0.02 }
const DIVIDER_B = { type: 'tween', duration: 0.4, ease: [0.12, 0.23, 0.5, 1], delay: 0.04 }
const DIVIDER_ROOT = TWEEN_B_600   // the Chromatic Border root MotionConfig

// The Dot Arrow's three staggered springs.
const DOT_0  = { type: 'spring', bounce: 0.2, duration: 0.4, delay: 0    }
const DOT_05 = { type: 'spring', bounce: 0.2, duration: 0.4, delay: 0.05 }
const DOT_1  = { type: 'spring', bounce: 0.2, duration: 0.4, delay: 0.1  }

// Springs internal to the two WebGL code components (not motion variants).
const FILAMENT_PROP_SPRING  = { duration: 1200, bounce: 0.2 }  // every animatable shader prop
const FILAMENT_INTRO_SPRING = { duration: 3000, bounce: 0   }  // CTA introProgress only
const HERO_FILAMENT_SPRING  = { duration: 3000, bounce: 0.2 }  // hero graphic springSettings

// Custom code-component springs.
const RAIL_PROGRESS_SPRING = { stiffness: 300, damping: 30 }   // Features scroll progress rail

// Route transition.
const ROUTE_ENTER = { type: 'tween', duration: 0.4, ease: [0.27, 0, 0.51, 1], delay: 0 }
```

Per-module bindings, so you can trace anything back:

| constant | bound as | in |
|---|---|---|
| `SPRING_A` | `si Si ca Sa Pa Ja co xo Uo ss Ss qc` | page module |
| `SPRING_A` | `di Fi na qa co wo Bo Ic yl` | layout module |
| `SPRING_A` | `transition1 transition1$1` | shared library |
| `SPRING_A` | `R` / `N` / `B` / `V` / `j` / `O` | Pill / Circular Button / CTA Button / Hash / Tag / Dot Arrow |
| `TWEEN_A` | `transition8` (shared lib), `Et` (integrations kit), `M` (Chromatic Border) | |
| `TWEEN_A_300` | `Ks` (page module, New Strip), `transition2` (shared lib) | |
| `TWEEN_A_200` | `Ci Zc _l` (layout module), `V` (Form Submit Button uses TWEEN_B_200 instead) | |
| `TWEEN_A_100` | `ec fc wc lu` (layout module) | |
| `TWEEN_B_100` | `z` | Circular Button With Text |
| `TWEEN_B_200` | `V` | Form Submit Button |
| `TWEEN_B_600` | `O` | Chromatic Border root |
| `TWEEN_LINEAR_1S` | `H` | Form Submit Button spinner loop |

Springs with a `bounce` + `duration` (no stiffness) are Motion's duration-based spring. In
`motion/react`, `{ type: 'spring', bounce: 0.2, duration: 0.4 }` is correct as written. The runtime
pre-samples these into WAAPI `linear(...)` keyframes, which is why the CDP capture shows five 400ms
`linear(0 0%, 0.0235 2.56%, ... 1.0151 58.97% ... 1 100%)` animations. That curve is exactly
`SPRING_A`; do not copy the sampled keyframes, use the spring.

### G.6 Section geometry (measured, all four capture viewports)

| section | desktop 1440x900 | tablet 1024x900 | tablet 810x900 | phone 390x844 |
|---|---|---|---|---|
| Navigation (fixed) | y 0 h 68 | y 0 h 68 | y 0 h 68 | y 0 h 68 |
| 0 Hero `#hero` | y 68 h 642 | y 68 h 642 | y 68 h 642 | y 68 h 888 |
| 1 Steps | y 710 h 148 | y 710 h 148 | y 710 h 148 | y 956 h 272 |
| 2 Partners | y 858 h 220 | y 858 h 220 | y 858 h 220 | y 1228 h 180 |
| 3 Conversation | y 1078 h 749 | y 1078 h 667 | y 1078 h 697 | y 1408 h 727 |
| 4 Features `#features` | y 1827 h 2700 | y 1745 h 2700 | y 1775 h 2700 | y 2135 h 918 |
| . `#products-swap-scroll` | y 1827 h 2700 | y 1745 h 2700 | y 1775 h 2700 | hidden |
| . `#products-scroll` | y 1827 h 1800 | y 1745 h 1800 | y 1775 h 1800 | hidden |
| 5 Integrations `#integrations` | y 4527 h 723 | y 4445 h 554 | y 4475 h 554 | y 3053 h 678 |
| 6 Testimonials | y 5250 h 601 | y 4999 h 501 | y 5029 h 501 | y 3731 h 709 |
| 7 Statistics `#statistics` | y 5851 h 489 | y 5500 h 565 | y 5530 h 565 | y 4440 h 663 |
| 8 FAQ | y 6340 h 512 | y 6065 h 590 | y 6095 h 590 | y 5103 h 572 |
| 9 Footer Container | y 6852 h 1618 | y 6655 h 1624 | y 6685 h 1569 | y 5675 h 1715 |
| document height | 8470 | 8279 | 8254 | 7390 |

Anchor ids, from the page metadata module: `hero`, `features`, `products-swap-scroll`,
`products-scroll`, `features-cortex`, `features-ask`, `features-pulse`, `integrations`, `statistics`.

### G.7 The only pure-CSS transition on the page

Two text-style presets declared inside the layout module:

```css
/* footer column links: Cortex, Ask, Pulse, Pricing, About, Careers, Blog,
   Integrations, Changelog, Developer docs, Help Center, 404 */
.framer-styles-preset-1ybqtif a {
  --framer-link-text-color:       var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, #a8a29e);
  --framer-link-hover-text-color: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, #fafaf9);
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1) 0s;
}
/* Terms and Conditions / Privacy Policy */
.framer-styles-preset-656phd a {
  --framer-link-hover-text-color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, #a1a1a1);
  --framer-link-hover-text-decoration: underline;
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1) 0s;
}
```

Everything else on the page is Motion, not CSS.

### G.8 Route transition

In the layout module's router bootstrap. There is no `exit` block and `opacity` stays `1`; the
transition is a **wipe mask**, not a fade.

```js
global.enter = { mask: { angle: 0,   type: 'wipe', width: '100%' }, opacity: 1, scale: 1,
                 rotate: 0, rotateX: 0, rotateY: 0, rotate3d: false, x: '0px', y: '0px',
                 transition: { type: 'tween', duration: 0.4, ease: [0.27, 0, 0.51, 1], delay: 0,
                               damping: 30, mass: 1, stiffness: 400 } }
// nine routes get angle: 180 when navigated to from the home page
```

**UNCERTAIN:** the transition object carries both tween fields and spring fields. `type: 'tween'` should
win, giving 0.4s `cubic-bezier(0.27, 0, 0.51, 1)`. The spring fields appear to be dead metadata.
The router also sets `isReducedMotion: true`, `scrollRestoration: true`.

---

## N. Navigation (fixed, h 68)

### N.1 Tree

```
Navigation                  .framer-gu3ill  data-border        position: fixed, z-index 5
└─ Container                .framer-2zulxl  data-border        max-width 1400px
   └─ .framer-1j6v7h8-container                                position: sticky, top 0, z-index 10
      └─ Desktop            .framer-Hi6IO .framer-128zegt      variant R4jqfv8ai
         ├─ Tablet / Mobile Menu  .framer-1vgcmcr  data-border  [tablet + phone only]
         │  ├─ .framer-17ha82z-container  -> Nav Mobile Menu (nodeId vPTd4B2R3)
         │  └─ Buttons      .framer-rlp82i                      [phone only]
         │     └─ Sign up   .framer-x18cer-container -> CTA Button variant fjOBCDEe9 "Sign up"
         └─ Nav Stack       .framer-15x7pvg  data-border
            ├─ Main Stack   .framer-4q76zg
            │  ├─ Logo <a href="./">  .framer-tfxiwl .framer-1nrg7n2
            │  │  ├─ mark   .framer-ilyc80   24px
            │  │  └─ Union  .framer-6rl07u   68x17 svg
            │  └─ Navigation Menu  .framer-llwb19                [desktop only]
            │     ├─ Features   .framer-12dyuiv-container  -> Ghost / LG + Chevron Down + popover
            │     ├─ Resources  .framer-9sm63-container    -> Ghost / LG + Chevron Down + popover
            │     ├─ Pricing    .framer-1jhb7w3-container  -> Ghost / LG
            │     └─ About      .framer-1fx5otc-container  -> Ghost / LG
            └─ Buttons      .framer-rq3bc0
               ├─ Sign up   .framer-ttq5lt-container -> CTA Button variant fjOBCDEe9 "Get started"  [not phone]
               └─ Mobile Button  .framer-qejymg                  [tablet + phone]
                  └─ icon   .framer-5154ll  24px
```

Navigation variants: `R4jqfv8ai` Desktop, `yJB8nDUZ2` Tablet Closed, `OvgLRR0Uu` Tablet Open,
`NQ16ltpYx` Mobile Closed, `JKXBDiVBt` Mobile Open. Component transition **`TWEEN_A_200`**
(`{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1]}`); the popovers use **`SPRING_A`**.

Root widths: desktop 1200px, tablet 810px, phone 390px.
Nav Stack: border `0 / 1px / 1px / 1px` solid `var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41,37,36))`,
background `var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12,10,9))`, padding `16px 40px`
(tablet `16px 30px 16px 40px`, phone `16px 10px 16px 20px`). Non-desktop variants set
`--border-left-width: 0px; --border-right-width: 0px`.

### N.2 Appear animations

**None.** The nav has no `data-framer-appear-id`.

### N.3 Scroll behaviour

**None.** No `useScroll`, no `__framer__transformTrigger`, no `__framer__variantAppearEffectEnabled`
anywhere on the nav. It is `position: fixed` from the first frame and never changes on scroll.
Do not add a hide-on-scroll-down or a shrink.

### N.4 Nav links (Features / Resources / Pricing / About)

All four are `CTA Button` (`framer-nnJOX`) at variant `B_d5gslqy` = **Ghost / LG**.
Transition **`SPRING_A`**. `enabledGestures: { hover: true, pressed: true }`.

```tsx
// rest
{ backgroundColor: 'rgba(0, 0, 0, 0)',
  borderRadius: 8,
  '--border-bottom-width': '0px', '--border-left-width': '0px',
  '--border-right-width': '0px',  '--border-top-width': '0px' }
// whileHover
{ backgroundColor: 'var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))' }
// whileTap
{ backgroundColor: 'var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))' }
transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
```

Padding `8px` (`framer-v-1m7eu8f`). Label preset `framer-styles-preset-1h9i0d0`, colour
`var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))` and the right-icon tint
`--1m973uw` the same. **Neither the label colour nor the icon colour changes on hover, and the
chevron does not rotate when the dropdown opens.** `backgroundColor` is the only animated property.

### N.5 "Get started" button

`CTA Button` variant `fjOBCDEe9` = **Primary / LG**, transition **`SPRING_A`**.

```tsx
// rest
{ backgroundColor: 'var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))',
  borderRadius: 8, '--border-*-width': '0px', '--border-color': 'rgba(0, 0, 0, 0)' }
// whileHover
{ backgroundColor: 'var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))' }
// whileTap
{ backgroundColor: 'var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))' }
```

Label colour `var(--token-52462940-c15c-4103-9816-370bb3c11bfa, rgb(23, 23, 23))`, unchanged on hover.

### N.6 Logo

**No hover state at all.** No variants, no gesture handlers, no `data-highlight`.

### N.7 The Features and Resources dropdowns

**They open on hover, not on tap.** The trigger's `hover` prop (`CKwAJbpc0`) is bound to the CTA
Button's `onMouseEnter`, and it calls `overlay.show()`. There is no `unhover` and no `click` prop, so
closing is handled by the popover's own dismiss (pointer-out of the safe area, or route change).
Overlay options: `{ blockDocumentScrolling: false, dismissWithEsc: false }`.

The panel is **not a variant switch**. It is a portal that mounts and unmounts with explicit
`initial` / `animate` / `exit`, all sharing **`SPRING_A`**.

Popover placement:

| | Features | Resources |
|---|---|---|
| placement | `bottom` | `bottom` |
| alignment | `start` | `start` |
| offsetX | `0` | `-105` |
| offsetY | `6` | `6` |
| collisionDetection | `true`, padding `20` | `true`, padding `20` |
| safeArea | `true` | `true` |
| zIndex | `11` | `11` |
| portal id | `<id>-12dyuiv` | `<id>-9sm63` |

```tsx
// Features panel  (.framer-x8xxzw, layoutId u_CrP7Uuh)
initial={{ opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }}
animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
exit={{    opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }}
transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}

// Resources panel (.framer-1s7zkgm, layoutId xNFNKkBjJ)
initial={{ opacity: 0, x: 0, y: -2, scale: 1, rotate: 0 }}
animate={{ opacity: 1, x: 0, y:  0, scale: 1, rotate: 0 }}
exit={{    opacity: 0, x: 0, y: -2, scale: 1, rotate: 0 }}
transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
```

That asymmetry (Features has no `y`, Resources has `y: -2`) is what the source says. Reproduce it.
No blur, no scale, no height animation, no `pointerEvents` toggle, no `borderRadius` animation.

Panel chrome, static:

```css
border: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38));  /* overlay border */
background-color: var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16));
border-radius: 10px;
box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.05);
/* Features: display:grid; grid-template-columns: repeat(3, minmax(166px, 1fr)); padding:4px; width:534px */
/* Resources: display:grid; grid-template-columns: repeat(3, minmax(50px, 1fr));  padding:0px; width:449px */
```

Resources left column `.framer-li0k4b` spans 2 columns, padding 8px, gap 4px; right column
`.framer-ignzii` padding `8px 8px 12px 8px`, `--border-left-width: 1px`,
`--border-color: rgb(41, 36, 35)`.

Contents:

- Features: three `Nav Product Button` rows, 175.3333px wide each. Cortex / "Connect and unify data
  across every source." / Ask / "Query your data in plain language." / Pulse / "Detect anomalies
  before they become problems."
- Resources left ("SUPPORT"): two `Nav Menu Row Item` rows, 283.3333px each. Developer docs /
  "API references, SDKs, and guides." and Help Center / "Tutorials and answers for your team."
- Resources right ("COMPANY"): five `Nav Single Button` rows, 133.6667px each. Integrations,
  Changelog, Blog, Careers, Contact.

### N.8 Dropdown row hovers

All three row components animate **`backgroundColor` only**, each with a **0.1s tween on the house
curve** (`TWEEN_A_100`). No icon colour change, no text colour change, no x offset, no scale.

| component | rest | whileHover | whileTap | radius / padding |
|---|---|---|---|---|
| `Nav Product Button` (Features rows) | `rgba(0,0,0,0)` | `var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))` | `var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))` (Horizontal variant only) | 8 / `12px`, column, gap 12px, 173px |
| `Nav Menu Row Item` (SUPPORT rows) | `rgba(0,0,0,0)` | `var(--token-efb6b80c-ff66-4fd5-b06e-7af1e4433402, rgb(41, 37, 36))` | `var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))` | 8 / `8px`, row, gap 12px, 298px |
| `Nav Single Button` (COMPANY links) | `rgba(0,0,0,0)` | `var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(41, 37, 36))` | `var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))` | 8 / `8px 12px`, row, gap 4px, 141px |

`transition={{ type: 'tween', duration: 0.1, ease: [0.12, 0.23, 0.5, 1] }}` on all three.

`Nav Menu Row Item` icon box `.framer-1l4uu33`: fixed 40x40, `border: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41,37,36))`,
`background var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28,25,23))`, radius 8, icon 16px
tinted `var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(168, 162, 158))`. Static.

### N.9 Mobile menu

Trigger: `.framer-qejymg` (36x36), `cursor: pointer`, `onTap` toggles the Navigation variant
(`NQ16ltpYx <-> JKXBDiVBt` on phone, `yJB8nDUZ2 <-> OvgLRR0Uu` on tablet). The 24px icon **swaps
component** from `Menu` to `X` on open. It does **not** rotate or morph; colour
`var(--token-cefbcc11-70c9-467a-ad0a-ef0379160d6f, rgb(120, 113, 108))` and stroke width 2 stay put.

Panel `.framer-1vgcmcr` (`layoutId: Z52ZV3Mna`) is always mounted, `position: absolute`, full viewport
height, and the variant flips its anchor:

```css
/* closed */ bottom: 0; left: 0; right: 0; height: calc(var(--framer-viewport-height, 100vh) * 1);
/* open   */ bottom: unset; top: 0;
/* padding closed/open tablet: 88px 32px 40px 32px ; phone: 76px 8px 8px 8px */
background: var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9));
border-bottom: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36));
overflow: auto;
```

It slides **down from above**, animated by motion's layout projection under the Navigation's
MotionConfig, i.e. **`TWEEN_A_200`** = `{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1]}`.

**UNCERTAIN / rebuild note:** there is no `initial`/`animate` pair to copy; the source relies on
layout projection of a `bottom: 0` -> `top: 0` swap. In the rebuild write it explicitly as
`y: -100vh -> 0` (or `translateY`) with `TWEEN_A_200`.

**There are no staggered item animations.** No `staggerChildren`, no `delayChildren`, no per-item
delay anywhere in the menu.

Inside the panel, `Nav Mobile Menu` is an accordion with variants `J7hScYVmB` Closed,
`cksXs3AfV` Features, `bP7ZNLLU9` "Variant 3" (Resources). Transition **`TWEEN_A_200`**. The open
section animates `height: 1px -> min-content` on `.framer-j79stn` / `.framer-1q45jrl` (both wrapped in
`overflow: clip` parents), plus a padding change on the section wrapper
(`0px 0px 20px 0px` for Features, `0px 0px 12px 0px` for Resources).

Section headers are `Mobile navigation item`, transition **`SPRING_A`**, gestures `{ pressed: true }`
only (no hover):

```tsx
// root <a>
rest:     { backgroundColor: 'rgba(0, 0, 0, 0)' }
whileTap: { backgroundColor: 'var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))' }
// chevron .framer-1xd0ijz (16px, tint var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(245,245,244)), stroke 2)
closed: { rotate: 0 }
open:   { rotate: -180 }
transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
```

That chevron rotation is the one rotate on the whole page.

---

## 0. Hero (`#hero`, desktop y 68 h 642)

### 0.1 Tree

```
Hero  .framer-1w7wuhd  #hero
└─ Container  .framer-jurjgy  data-border
   ├─ New Container  .framer-dp7izi  data-border   appear=dp7izi
   │  └─ .framer-r7yxnk-container
   │     └─ Variant 1  (New Strip, .framer-QjZ00 .framer-1hpvfsx)   href -> ./blog/introducing-ask...
   │        ├─ .framer-viz05f-container -> Primary (Pill, .framer-mEJFY .framer-x4g6b3)  "New"
   │        └─ Message  .framer-10o8lwh
   │           ├─ .framer-1m0muau-container -> Primary (Dot Arrow, .framer-AfnJr .framer-17evz1o)
   │           │     6 dots: Set 2 -3, Set 2 -2, Set 3 -1, Set 1 -3, Set 1 -2, Set 1 -1
   │           └─ .framer-18d75j4-container -> text ticker  "Introducing Ask: Query your entire stack in plain language"
   ├─ Content  .framer-qcgctf
   │  ├─ Main Title  .framer-133zkvp
   │  │  └─ Title Container  .framer-1gdcm2d
   │  │     ├─ Container  .framer-1akirha
   │  │     │  ├─ h1  .framer-1jsercw   appear=1jsercw   "The missing connection layer"
   │  │     │  └─ p   .framer-1b2lh6y   appear=1b2lh6y   "Nordwell builds a living kno..."
   │  │     └─ CTAs  .framer-13ye9y3    appear=13ye9y3
   │  │        ├─ .framer-122b7gn-container -> CTA Button  Primary / XL    "Get started"   -> ./pricing
   │  │        └─ .framer-1yjtgfi-container -> CTA Button  Secondary / XL  "Book a demo"   -> ./contact-us
   │  └─ Main Graphic  .framer-14ucdac
   │     └─ .framer-1t7pn02-container -> hero filament WebGL (canvas 562x643 at 1440)
```

### 0.2 Appear animations (all **on-mount**, not in-view)

Framer pre-samples these into WAAPI before hydration. They fire once, on page load, regardless of
scroll position. Values identical at desktop / tablet / phone.

| appear id | element | initial | animate | transition |
|---|---|---|---|---|
| `dp7izi` | `New Container` (announcement strip wrapper) | `{opacity:0.001, x:0, y:0, scale:1, rotate:0, rotateX:0, rotateY:0, skewX:0, skewY:0}` | `{opacity:1, x:0, y:0, scale:1, rotate:0, rotateX:0, rotateY:0, skewX:0, skewY:0}` | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0}` |
| `1jsercw` | h1 "The missing connection layer" | `{opacity:0.001, x:0, y:10, ...}` | `{opacity:1, x:0, y:0, ...}` | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.1}` |
| `1b2lh6y` | subhead paragraph | `{opacity:0.001, x:0, y:10, ...}` | `{opacity:1, x:0, y:0, ...}` | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.2}` |
| `13ye9y3` | `CTAs` row | `{opacity:0.001, x:0, y:10, ...}` | `{opacity:1, x:0, y:0, ...}` | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.3}` |

Verbatim `motion/react` props:

```tsx
// dp7izi
initial={{opacity:0.001, y:0}}  animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0}}
// 1jsercw
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.1}}
// 1b2lh6y
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.2}}
// 13ye9y3
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.3}}
```

`opacity: 0.001` rather than `0` is deliberate in Framer (keeps the compositor layer alive). Keep it.

The `Main Graphic` has **no** appear animation and **no** scroll link.

### 0.3 The announcement strip ("New Strip", `framer-QjZ00`)

Single variant `yT3VtMIJu` "Variant 1" with a hover gesture. Component transition
**`TWEEN_A_300`** = `{type:'tween', duration:0.3, ease:[0.12,0.23,0.5,1], delay:0}`.
`enabledGestures: { yT3VtMIJu: { hover: true } }` (no pressed).

Layout: `display:flex; flex-direction:row; align-items:center; gap:8px; width:536px;
padding: var(--37nty6) = 20px 0px 20px 40px; cursor:pointer; overflow:clip; text-decoration:none`.

Three things change on hover:

1. **The "New" pill.** `Pill` (`framer-mEJFY`) switches variant `l4Rq4ITVJ` (Primary) ->
   `vzx6FkGP4` (Primary - Hover). Animated with the **Pill's own** transition **`SPRING_A`**.
   ```tsx
   // rest (l4Rq4ITVJ)
   { backgroundColor: 'var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))',
     borderRadius: 321,
     border: '1px solid var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))',
     padding: '4px 8px' }
   // hover (vzx6FkGP4)
   { backgroundColor: 'var(--token-d84f0da5-69e7-4c51-a9dd-4ad7ce3301a8, rgb(41, 37, 36))' }
   transition={{ type:'spring', bounce:0.2, duration:0.4 }}
   ```
   Border colour and radius do **not** change. Label "New", preset `framer-styles-preset-1unq4w`,
   colour `var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))`, unchanged.
2. **The Dot Arrow shifts right 4px.** CSS rule
   `.framer-QjZ00.framer-v-1hpvfsx.hover .framer-1m0muau-container { left: 4px }` against a base of
   `left: 0px` (`position:absolute; top:50%; z-index:1`). Animated by the New Strip's
   **`TWEEN_A_300`**. In the rebuild write it as `x: 0 -> 4` with that tween.
3. Nothing else. No background change on the strip itself, no scale, no shadow.

The Dot Arrow's own variant does **not** change on hover (it stays `bAhGXCi73` "Primary").

### 0.4 Dot Arrow (`framer-AfnJr`) reference

16x16 box, `mask: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%) add`.
Six 2x2px dots, `border-radius: 36`, background
`var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))`.

| dot | class | Primary (`bAhGXCi73`) | Next (`OZFYLRg1T`) | transition |
|---|---|---|---|---|
| Set 2 -3 | `.framer-gogk9y` | `opacity:0`, `left:-10px; top:4px` | `opacity:1`, `left:6px` | `DOT_05` (delay 0.05) |
| Set 2 -2 | `.framer-1xm8b4i` | `opacity:0`, `left:-10px; top:10px` | `opacity:1`, `left:6px` | `DOT_1` (delay 0.1) |
| Set 3 -1 | `.framer-14d3uid` | `opacity:0`, `left:-7px; top:7px` | `opacity:1`, `left:9px` | `DOT_0` (delay 0) |
| Set 1 -3 | `.framer-1s74r8s` | `opacity:1`, `left:6px; top:4px` | `opacity:0`, `left:unset; right:-8px` | `DOT_05` |
| Set 1 -2 | `.framer-mweelx` | `opacity:1`, `left:6px; top:10px` | `opacity:0`, `left:22px` | `DOT_1` |
| Set 1 -1 | `.framer-1597kz4` | `opacity:1`, `left:9px; top:7px` | `opacity:0`, `left:25px` | `DOT_0` |

All three transitions are `{type:'spring', bounce:0.2, duration:0.4}` with delays 0 / 0.05 / 0.1.
**On this page the Next variant is never triggered.** The component sits at `bAhGXCi73` permanently;
the arrow morph is authored but unused. Build the Primary state; wire the Next variant only if you
want the extra polish (the hover of the strip would be the natural trigger).

### 0.5 The announcement text ticker (custom code component)

Not a Framer ticker. A small component in the page module (`Ms`), rendered at
`.framer-18d75j4-container`:

```js
{ font: { fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: '14px',
          fontStyle: 'normal', fontWeight: 400, letterSpacing: '0em', lineHeight: '20px' },
  gap: 40,
  speed: 30,
  text: 'Introducing Ask: Query your entire stack in plain language' }
```

Implementation, verbatim behaviour:

```tsx
const x = useMotionValue('0%');
// measure: overflowing = innerP.scrollWidth > outerDiv.offsetWidth  (ResizeObserver on both)
// if not overflowing: x.set('0%'), maskImage 'none', render one <p>
// if overflowing:
animate(x, ['0%', '-100%'], { duration: innerP.scrollWidth / speed, ease: 'linear', repeat: Infinity })
// mask when overflowing:
maskImage: `linear-gradient(90deg, #0000, #000 7%, #000 93%, #0000)`
// markup: outer {display:flex; overflow:hidden} > inner {flexShrink:0; color:white; width:max-content; display:flex}
//         > <p style={{padding:'0px 40px 0px 0px', margin:0, x}}>text</p>  (duplicated when overflowing)
```

`duration = scrollWidth / 30`, so the scroll rate is **30 px/s**.
**At 1440 the string does not overflow**, so on desktop it is static: the captured DOM shows
`mask-image: none` and `transform: none` on the `<p>`. It only animates at narrow widths.
`gap` is applied as `padding-right: 40px` on each `<p>`.

### 0.6 Hero CTA buttons

Both are `CTA Button` (`framer-nnJOX`), transition **`SPRING_A`**, gestures `{hover, pressed}`.
Only `backgroundColor` (and `--border-color` on Secondary) animates. No scale, no shadow, no gradient.

**Primary / XL** (`WFn7l_ycj`), "Get started":
```tsx
rest:     { backgroundColor: 'var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))',
            borderRadius: 8, '--border-*-width': '0px', '--border-color': 'rgba(0, 0, 0, 0)' }
whileHover:{ backgroundColor: 'var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))',
            '--border-bottom-width':'0px','--border-left-width':'0px','--border-right-width':'0px','--border-top-width':'0px' }
whileTap:  { backgroundColor: 'var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))',
            '--border-*-width':'0px' }
transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```
Label colour `var(--token-52462940-c15c-4103-9816-370bb3c11bfa, rgb(23, 23, 23))`, static.

**Secondary / XL** (`mpynBH2Cv`), "Book a demo":
```tsx
rest:      { backgroundColor: 'var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))',
             '--border-bottom-width':'1px','--border-left-width':'1px','--border-right-width':'1px','--border-top-width':'1px',
             '--border-style':'solid',
             '--border-color':'var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(34, 34, 34))',
             borderRadius: 8 }
whileHover:{ backgroundColor: 'var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))',
             '--border-color': 'var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))' }
whileTap:  { backgroundColor: 'var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))' }
transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```
Label colour `var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))`, static.

The border is drawn as the Framer overlay pseudo-element (`data-border="true"` + `--border-*-width`),
not as a real CSS border. Use `box-shadow: inset 0 0 0 1px <color>` or an inset span so it does not
add 2px to the box.

### 0.7 The hero filament graphic (WebGL, owned by another agent)

`.framer-1t7pn02-container`, nodeId `s7UhAvBRF`. **No motion wrapper, no appear id, no variant, no
scroll link.** It mounts and runs its own rAF loop. Instance props on this page:

```js
{ cameraFov: 36, cameraPosition: {x:0, y:0, z:1.8}, cameraRotationX: 2, cameraRotationY: 0,
  dispersion: 0.8, dispersionBand: 0.9, dispersionOffset: 0.05,
  extrudeOffset: {x:0, y:0.1, z:0.4}, extrudeScale: 0.95,
  fallbackFit: 'cover',
  fallbackImage: 'https://framerusercontent.com/images/6u6BoEVYMsztTFLqQ6AaC4LkZM.png?width=1200&height=1200',
  highlightRadius: 0.3, highlightSpeed: 10, highlightStrength: 2,
  maxDelay: 1, noiseScale: 5, noiseStrength: 0.15, opacitySpeed: 2,
  points: '<long polyline string>',
  pulseSpeedBase: 0.1, pulseSpeedRandomMax: 0.1, pulseStrength: 1,
  randomOffset: {x:0.4, y:0.2, z:0.2}, scale: 1,
  simDamping: 6, simMaxVelocity: 5, simRadius: 0.15, simSpring: 60, simStrength: 8,
  sizeVariance: 0.49,
  springSettings: { bounce: 0.2, duration: 3000 },
  steps: 32,
  nordwellOpacity: 0.2,   // phone override: 0.26
  threshold: 0.4, tipLayers: 8,
  tipRadius: 0.0035,      // phone override: 0.004
  tipTexture: 'https://framerusercontent.com/images/uMNT221vEn5naMu3VgNputh9yZU.png?width=256&height=256',
  tubeRadius: 0.0012 }
```

Every animatable prop inside the component is sprung with `springSettings`
(`{duration: 3000, bounce: 0.2}`), but nothing on this page ever changes them, so the shader runs at
a fixed configuration. Do not transcribe shaders here.

---

## 1. Steps (desktop y 710 h 148)

### 1.1 Tree

```
Steps  .framer-1ye9oqd
└─ Container  .framer-170t0as  data-border
   ├─ Connect  .framer-fkx45e-container   appear=fkx45e   -> Step (.framer-BDiiR .framer-6ytqww)
   ├─ Map      .framer-1scv7sf-container  appear=1scv7sf  -> Step
   └─ Ask      .framer-16yp3wb-container  appear=16yp3wb  -> Step
```

Each `Step` renders `.framer-9y91v8` (number `1.` / `2.` / `3.` + title) and `.framer-1s1qb3c`
(description). Props: `c4Gb7QbS0` (number), `W9tnuGizu` (title), `Q2WFeb_pT` (description).

### 1.2 Appear animations (on-mount)

Same tween, same y, cascading delays. Only a `default` entry exists, so the same values apply at
every breakpoint.

```tsx
// fkx45e "Connect"
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.5}}
// 1scv7sf "Map"
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.6}}
// 16yp3wb "Ask"
initial={{opacity:0.001, y:10}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.7}}
```

So the full on-mount cascade across Hero + Steps is 0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.7 seconds, each
0.4s long: the last one finishes at t = 1.1s. The capture's `load` scenario shows motion from
471ms to 1561ms, which matches once you allow for hydration latency.

### 1.3 Everything else

The `Step` component has two variants (`rCunthrX7` "Visible", `SD1DhNtYs` "Hidden"; Hidden renders
nothing) and a transition of **`SPRING_A`**, but the page only ever uses "Visible".
**No hover, no press, no scroll link, no loop.** Steps is otherwise completely static.

---

## 2. Partners (desktop y 858 h 220)

### 2.1 Tree

```
Partners  .framer-vpqdy2
└─ Container  .framer-1o566ps  data-border
   ├─ Partners title  .framer-643cw9
   │  └─ Title  .framer-lrjd3c  data-border
   │     └─ p "Trusted by 56+ teams who are tired of tab-switching"
   └─ Ticker Container  .framer-149ica6  data-border
      ├─ .framer-1qbqem3          <- the ticker
      │  └─ ul > li.ticker-item x6 (+ cloned groups)
      │       Sisyphus .framer-9jncga · Acme .framer-1vynhgh · CloudWatch .framer-123r8k1
      │       Luminous .framer-bo08ni · Capsule .framer-10wb9cu · Nietzsche .framer-10v9rg4
      └─ .framer-17vu96m-container -> Chromatic Border divider (nodeId Z3Ay9tvwc)
```

### 2.2 Appear animations

**None** in this section.

### 2.3 Ticker

Exactly one Framer ticker on the page. Props, verbatim:

```js
{ tickerEffectEnabled: true,
  tickerEffectAlign: 'center',
  tickerEffectDirectionModifier: 'default',
  tickerEffectDraggable: false,
  tickerEffectGap: '46px',
  tickerEffectHoverModifier: 100,
  tickerEffectOverflow: 'clip',
  tickerEffectPosition: 'relative',
  tickerEffectStackDirection: 'row',
  tickerEffectVelocity: 50 }
```

Runtime derivation (`framer.Dy0MSJwM.mjs`):

- `axis = stackDirection.startsWith('column') ? 'y' : 'x'` -> **`x`**
- `directionModifier = (direction === 'reverse') ? -1 : 1` -> **`+1`**
- `hoverFactor = isNumber(hoverModifier) ? hoverModifier / 100 : 1` -> **`1.0`**
- `overflow = (overflow === 'visible')` -> `'clip'` gives **`false`**, so the list is clipped
- not draggable -> the non-drag branch, `velocity = (playState === 'paused' ? 0 : velocity ?? 100) * directionModifier` = **50**
- frame loop: `offset.set(offset.get() - (deltaMs / 1000) * (velocity * sign * hoverFactor))`, with
  `sign = +1` for `axis 'x'` + `direction ltr`

**Result: 50 px/s, moving left (content translates in -x), constant.**

- **gap: 46px** (also set as the flex `gap` on `.framer-1qbqem3`).
- **fade edges: none.** `tickerEffectFadeOptions` is not passed, so the runtime `fade` default `0`
  applies and no mask is generated. The container is `overflow: clip; border-radius: 10px`.
- **hover behaviour: none.** `hoverFactor` resolves to `1`, so `onPointerEnter` animates the speed
  multiplier to 1 (a no-op). The capture agrees: the `loop-0-ticker-container` scenario records
  "hover: no change on hover".
- **draggable: false.**
- **loop: true** (runtime default). The runtime measures the item row and renders
  `ceil` clone groups so the strip is seamless; the captured DOM has 12 `<li>` (6 real + 6 cloned).

Rebuild:

```tsx
const x = useMotionValue(0);
useAnimationFrame((_, delta) => { x.set(x.get() - (delta / 1000) * 50); });
// wrap x into [-groupWidth, 0] where groupWidth = totalItemWidth + gap
<div style={{overflowX:'clip', display:'flex', gap:46, borderRadius:10}}>
  <motion.ul style={{display:'flex', gap:46, x}}>{items}{items}</motion.ul>
</div>
```

Logo sizes from CSS, e.g. `.framer-9jncga { aspect-ratio: 4.15152; width: 137px; height: auto }` with
`--ezu53: var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, #fafafa)` as the fill token.

### 2.4 Divider (variant-on-scroll #1 of 4) -- see section D below

`.framer-17vu96m-container`, nodeId `Z3Ay9tvwc`.

---

## D. The chromatic divider lines (variant-on-scroll x4)

Four identical instances of `Chromatic Border` (`framer-kEcQz`), each wrapped in the
`withVariantAppearEffect` HOC. These are the page module's four
`__framer__variantAppearEffectEnabled` occurrences.

| # | section | container class | nodeId |
|---|---|---|---|
| 1 | 2 Partners, below the ticker | `.framer-17vu96m-container` | `Z3Ay9tvwc` |
| 2 | 5 Integrations, first child of Container | `.framer-ixio0v-container` | `j9EHuYhM7` |
| 3 | 6 Testimonials, last child of Container | `.framer-1bxf2yj-container` | `MSwOXYRCw` |
| 4 | 7 Statistics, last child of Container | `.framer-qwko6a-container` | `YPSDP79B7` |

Wrapper props, identical on all four:

```js
{ __framer__variantAppearEffectEnabled: true,
  __framer__visibleVariantId:  'oPm9OVnZ7',   // "End"
  __framer__obscuredVariantId: 'eaoQNLtEk',   // "Start"
  __framer__threshold: 1,
  __framer__animateOnce: true,
  variant: 'oPm9OVnZ7', height: '100%', width: '100%', style: { width: '100%' } }
```

Sizing wrapper: `height: 1`, `width: min(100vw - 128px, 1400px)`; tablet and phone override to
`min(100vw, 1400px)`.

### Runtime semantics (verified in `framer.Dy0MSJwM.mjs`)

Because there is **no `__framer__targets` array**, the runtime takes the simple branch: a plain
in-view observer on the element itself.

```js
useState(obscuredVariantId)                      // starts at "Start"
useInView(ref, cb, { enabled: true, animateOnce: true, threshold: { y: 1 } })
// cb(isInView) -> setVariant(isInView ? visibleVariantId : obscuredVariantId)
// animateOnce true -> once it has fired with true it never flips back
```

`threshold: 1` maps to Motion's `amount: 1`, i.e. **the whole 1px-tall element must be inside the
viewport**. `animateOnce: true`, so it plays once per page load. It is **not** scroll-progress linked
and it is **not** a scroll range.

Rebuild:

```tsx
const ref = useRef<HTMLDivElement>(null);
const inView = useInView(ref, { amount: 1, once: true });
// animate the six bars to inView ? 'end' : 'start'
```

### What the component animates

`Chromatic Border` root: `display:flex; flex-direction:row; align-items:center; justify-content:center;
gap:0; height:min-content; width:100% (authored 429px); overflow:clip`.

Two halves, each `flex: 1 0 0px; height: 1px; width: 1px; overflow: clip; position: relative`:

- `Left`  `.framer-t5arn`  -> three bars anchored `right: 0` (`top:0; bottom:0; position:absolute; z-index:1`)
- `Right` `.framer-12bx2ig` -> three bars anchored `left: 0`

The six bars, with `mix-blend-mode: screen` on the g and r bars in each half (the b bar has none):

| half | name | class | Start (`eaoQNLtEk`) | End (`oPm9OVnZ7`) | transition |
|---|---|---|---|---|---|
| Left | b | `.framer-u6zm30`  | `width:0%`, `backgroundColor: rgb(0, 0, 255)` | `width:100%`, `rgb(0, 0, 36)` | `DIVIDER_B` (delay 0.04) |
| Left | g | `.framer-1s7vawm` | `width:0%`, `rgb(0, 255, 0)` | `width:100%`, `rgb(0, 37, 0)` | `DIVIDER_G` (delay 0.02) |
| Left | r | `.framer-1ndw0of` | `width:0%`, `rgb(255, 0, 0)` | `width:100%`, `rgb(41, 0, 0)` | `DIVIDER_R` (delay 0) |
| Right | b | `.framer-ddlp53`  | `width:0%`, `rgb(0, 0, 255)` | `width:100%`, `rgb(0, 0, 36)` | `DIVIDER_R` (delay 0) |
| Right | g | `.framer-1is7c6b` | `width:0%`, `rgb(0, 255, 0)` | `width:100%`, `rgb(0, 37, 0)` | `DIVIDER_G` (delay 0.02) |
| Right | r | `.framer-1j63n4i` | `width:0%`, `rgb(255, 0, 0)` | `width:100%`, `rgb(41, 0, 0)` | `DIVIDER_B` (delay 0.04) |

All six: `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1]}` with delay 0 / 0.02 / 0.04.
The root MotionConfig is `DIVIDER_ROOT` = `{type:'tween', duration:0.6, ease:[0.44,0,0.56,1]}`;
nothing on the root or the two halves actually animates, so it only matters if you add anything there.

Note the mirrored delay assignment: on the Left half blue is slowest, on the Right half red is
slowest. That is what makes the two halves split chromatically as they grow outward from the centre.

```tsx
// per bar
initial={{ width: '0%',   backgroundColor: START_COLOR }}
animate={{ width: '100%', backgroundColor: END_COLOR }}
transition={{ type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay: 0 | 0.02 | 0.04 }}
```

In the source the width difference lives in the variant CSS class (`framer-v-1kv1gub` sets
`width: 0%` on all six) and is animated by Framer's layout projection; in the rebuild animate `width`
directly, which is equivalent for a 1px-tall absolutely positioned bar.

---

## 3. Conversation (desktop y 1078 h 749)

### 3.1 Tree

```
Conversation  .framer-r08n9p
└─ Container  .framer-12x5o77  data-border
   ├─ Tagline  .framer-ca5wfl   h2 "Your team wastes hours pulling data from scattered tools. <span>...</span>"
   └─ Example  .framer-r0uhuf
      └─ .framer-11tggmb-container  (nodeId wwoQ8hlC3)
         └─ Thinking  .framer-JcDMh .framer-1b5ogf8      <- Ask Chat Anim, captured mid-cycle
            ├─ .framer-1oh8dd5                            [parallax wrapper]
            ├─ Chat Container      .framer-19qsf6k
            │  ├─ Container        .framer-1bvs57s
            │  │  ├─ Top container .framer-2xhl4y
            │  │  │  ├─ .framer-984o4f
            │  │  │  │  ├─ Placeholder .framer-1gf4w1f   "How can I help today?"
            │  │  │  │  └─ Message     .framer-642k88    "Which accounts are at risk this quarter?"
            │  │  │  └─ Status Container .framer-5rfih0
            │  │  │     ├─ Thinking   .framer-1cbnqjk-container  -> Status Indicator "Thinking"
            │  │  │     └─ 3 Results  .framer-g8q9cy-container   -> Status Indicator "3 Results"
            │  │  └─ Buttons Container .framer-1hnulot
            │  │     ├─ Button .framer-1umbp4q  (Plus icon, static)
            │  │     └─ Button .framer-1q7wox5  (Mic <-> Chevron Right)
            │  └─ Background  .framer-5xg612
            ├─ Quick Action Bar  .framer-t1zk3n   (4 actions: Analyze / Compare / Monitor / Report)
            ├─ Quick Action Bar  .framer-vams9e   (2 actions: Export CSV / Share with team)
            ├─ Results Container .framer-4ig9li   data-border
            │  ├─ .framer-1vwlie1-container -> TextTransitionV2 status line
            │  └─ .framer-h6s1b3  -> 3 Chat Dialog Result rows + 2 dividers
            └─ .framer-1ykvmaj-container -> particle grid WebGL
```

Instance props on this page (`wwoQ8hlC3`): `variant: 'dGCFozRyi'` (Primary), `ltWGnHZW1: true`
(status on), `PSTJiG3p8: 2` (point size), `Pwl_s00am: 4` (4 quick actions),
`ugG8YyQe7: '16px 16px 80px 16px'` (padding). Phone override:
`{ ltWGnHZW1: false, PSTJiG3p8: 4, Pwl_s00am: 3, ugG8YyQe7: '16px 16px 200px 16px' }`.

### 3.2 The self-driving loop

`Ask Chat Anim` runs a 12 second variant cycle with no user input. Component transition map is
context based, see the table below.

| from | wait | to |
|---|---|---|
| `dGCFozRyi` **Primary** | **2000 ms** | `yebqQkg1K` **Chat start** |
| `yebqQkg1K` **Chat start** | **2000 ms** | `CtVEKtlJu` **Thinking** |
| `CtVEKtlJu` **Thinking** | **4000 ms** | `eg6XjUQLY` **Results** |
| `eg6XjUQLY` **Results** | **3500 ms** | `CryN59OAs` **Loop Reset** |
| `CryN59OAs` **Loop Reset** | **500 ms** | `dGCFozRyi` **Primary** |
| `MPeNLgoLm` **Standalone** | - | no handler, static |

Total period **12000 ms**. Two runtime details that must be reproduced:

- All pending timers are cleared on every variant change, so only one timer is ever live.
- The variant setter is deferred until `document.hidden === false` **and** the component's own element
  `isIntersecting`. **The loop pauses when the tab is hidden or the component is off screen and
  resumes where it left off.** Without this the rebuild drifts out of phase with the design.

Transition contexts (Framer `MotionConfig` nesting; `value: undefined` inherits the nearest ancestor):

| context | value | applies to |
|---|---|---|
| root | `SPRING_A` `{type:'spring', bounce:0.2, duration:0.4}` | `.framer-1oh8dd5`, `.framer-t1zk3n`, `.framer-vams9e`, `.framer-4ig9li`, `.framer-h6s1b3`, `.framer-1ykvmaj-container` |
| Chat Container | `TWEEN_A_300` `{type:'tween', duration:0.3, ease:[0.12,0.23,0.5,1]}` | everything inside `.framer-19qsf6k` |
| Placeholder / Message | `{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1], delay:0.3}` | the two text nodes |
| Thinking pill | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0.3}`, overridden to `delay:0.2` while Thinking, and to inherited `TWEEN_A_300` while Results | `.framer-1cbnqjk-container` |
| 3 Results pill | `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1], delay:0}`, inherited `TWEEN_A_300` while Results | `.framer-g8q9cy-container` |
| Quick Action Bar 1 | inherits root; `{type:'spring', bounce:0.2, duration:0.4, delay:0.2}` while Loop Reset | `.framer-t1zk3n` |
| Results Container | inherits root; `{type:'spring', bounce:0.2, duration:0.4, delay:0.2}` while Thinking | `.framer-4ig9li` |

### 3.3 Per element variant values

```tsx
// .framer-1hnulot  Buttons Container         transition: TWEEN_A_300
{ dGCFozRyi:{opacity:1}, yebqQkg1K:{opacity:1}, CtVEKtlJu:{opacity:0},
  eg6XjUQLY:{opacity:0}, CryN59OAs:{opacity:1}, MPeNLgoLm:{opacity:1} }

// .framer-1q7wox5  right Button              transition: TWEEN_A_300
rest:      { backgroundColor: 'rgba(38, 38, 38, 0)', borderRadius: 12 }
yebqQkg1K: { backgroundColor: 'var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))' }
CtVEKtlJu: { backgroundColor: 'rgb(38, 38, 38)' }
// its icon hard-swaps Mic -> Chevron Right in Chat start / Thinking / Results (no tween)

// .framer-1cbnqjk-container  "Thinking" pill
rest: { opacity: 0 }   CtVEKtlJu: { opacity: 1 }
// plus a layout move: absolute bottom:-32px / left:49% -> position:relative in Thinking
//                     -> top:-32px in Results

// .framer-g8q9cy-container  "3 Results" pill
rest: { opacity: 0 }   eg6XjUQLY: { opacity: 1 }
// same kind of layout move, one beat later

// .framer-t1zk3n  Quick Action Bar 1         transition: root SPRING_A (delay 0.2 in Loop Reset)
{ dGCFozRyi:1, yebqQkg1K:1, CtVEKtlJu:0, eg6XjUQLY:0, CryN59OAs:1, MPeNLgoLm:1 }   // opacity

// .framer-vams9e  Quick Action Bar 2         mounted only in Thinking / Results / Loop Reset
{ CtVEKtlJu:{opacity:0}, eg6XjUQLY:{opacity:1}, CryN59OAs:{opacity:0} }

// .framer-4ig9li  Results Container          transition: root SPRING_A (delay 0.2 in Thinking)
rest: { opacity: 0 }   CtVEKtlJu: { opacity: 1 }   eg6XjUQLY: { opacity: 1 }

// .framer-1vwlie1-container  TextTransitionV2 host
rest: { opacity: 0 }   CtVEKtlJu: { opacity: 1 }   eg6XjUQLY: { opacity: 1 }
```

Static chrome: Chat Container background is
`linear-gradient(111deg, var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68,64,60)) 0%,
var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41,37,36)) 35.13513513513514%,
var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38,38,38)) 73%,
var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68,64,60)) 100%)`, radius 16.
Background inner `.framer-5xg612`: `var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(17,15,13))`,
radius 15, `inset: 1px`.

### 3.4 Parallax on `.framer-1oh8dd5`

The one parallax on the page. Props:
`{ __framer__parallaxTransformEnabled: true, __framer__speed: 95, __framer__offset: 0, __framer__adjustPosition: false }`.

Runtime: `a = speed/100 - 1 = -0.05`, and it drives `y` only:
`y = (adjustPosition ? (elTop - offset) * a : 0) + (-scrollY * a)` = **`y = 0.05 * scrollY`**.
Computed off the global `useScroll().scrollY`, unbounded. Disabled in the Standalone variant.

```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, v => v * 0.05);
```

**UNCERTAIN:** the formula is unbounded, so far down the page the offset is large. Verify against
`capture/frames/scroll-conversation` before shipping.

### 3.5 Text effects (the two the page actually has)

Both are `tokenization: 'character'`, `trigger: 'onMount'`, `type: 'appear'`, no `repeat`.
The runtime splits the text into per-character `<span style="display:inline-block">` (spaces live in
a `<span white-space:nowrap>` word wrapper and get no span of their own) and staggers them.

```js
// textEffect  -> "How can I help today?"  (.framer-1gf4w1f "Placeholder")
{ effect: { filter: 'blur(3px)', opacity: 0.001, rotate: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 2 },
  startDelay: 0.1,
  tokenization: 'character',
  transition: { type: 'tween', duration: 0.1, ease: [0.12, 0.23, 0.5, 1], delay: 0.025 },
  trigger: 'onMount' }
// applied ONLY under the MPeNLgoLm (Standalone) variant, which the Conversation instance never enters

// textEffect1 -> "Which accounts are at risk this quarter?"  (.framer-642k88 "Message")
{ effect: { opacity: 0.001, rotate: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 0 },
  tokenization: 'character',
  transition: { type: 'tween', duration: 0.01, ease: [0.12, 0.23, 0.5, 1], delay: 0.025 },
  trigger: 'onMount' }
// applied unconditionally; the Message node mounts in Chat start / Thinking / Results
```

In the effect object, `delay` is the **per-token stagger**, not a start offset. Effective per-token
delay = `startDelay + index * delay`. So `textEffect` runs characters at
`0.1, 0.125, 0.150, ... 0.5` s with a 0.1s duration; `textEffect1` runs at
`0, 0.025, 0.050, ...` with a 0.01s duration (effectively an instant reveal with a typed feel).

Rebuild:

```tsx
{Array.from(text).map((ch, i) => (
  <motion.span key={i} style={{display:'inline-block', whiteSpace:'pre'}}
    initial={{opacity:0.001, y:2, filter:'blur(3px)'}}
    animate={{opacity:1, y:0, filter:'blur(0px)'}}
    transition={{type:'tween', duration:0.1, ease:[0.12,0.23,0.5,1], delay: 0.1 + i * 0.025}}>
    {ch}
  </motion.span>))}
```

**For a Conversation-only rebuild: wire `textEffect1`, and do NOT wire `textEffect`.** The
Placeholder text appears with no per-character animation on this instance.

### 3.6 The status line (`TextTransitionV2`, one instance on the page)

Rendered at `.framer-1vwlie1-container`, layoutId `xLRIwc4A_`. Props on this page:

```js
{ font: { fontFamily: '"Geist Mono", "Geist Mono Placeholder", monospace', fontSize: '12px',
          fontStyle: 'normal', fontWeight: 500, letterSpacing: '0em', lineHeight: '20px',
          textAlign: 'left' },
  text: ['Scanning Salesforce', 'Scoring by churn signal weight', '3 accounts flagged'],
  playMode: 'once',
  play: false,                   // overridden to true in CtVEKtlJu and eg6XjUQLY
  interval: 2,
  startDelay: 0,
  transition: { type: 'tween', duration: 0.2, ease: [0.12, 0.23, 0.5, 1], delay: 0.02 },
  gradient: ['rgb(115, 115, 115)', 'rgb(0, 238, 255)', 'rgb(0, 14, 221)',
             'rgb(245, 29, 0)', 'rgb(255, 187, 0)', 'rgb(115, 115, 115)'],
  gradientDuration: 1,
  gradientRange: 25 }
```

Behaviour:

- `setInterval(..., interval * 1000)` advances the string. `playMode: 'once'` stops at the last item
  and resets to index 0 each time `play` flips true. So entering Thinking replays from
  `Scanning Salesforce`, advances at +2s and +4s, then holds `3 accounts flagged`.
- Characters are wrapped in `<AnimatePresence mode="popLayout">` and keyed on neighbours, so changing
  strings cross-animates per letter. **Spaces are letters here** (`Array.from(text[i])`).
- Per letter:
  ```tsx
  <motion.span
    initial={{ rotateX: -90, opacity: 0 }}
    animate={{ rotateX:   0, opacity: 1 }}
    exit={{    rotateX:  90, opacity: 0 }}
    transition={{ type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1], delay: index * 0.02 + 0 }}
    style={{ display:'inline-block', whiteSpace:'pre', transformOrigin:'center center -5px', color }} />
  ```
  The stagger formula is `index * transition.delay + startDelay`; the original `delay` key is
  destructured out and replaced.
- **Loop:** each letter also runs an infinite colour sweep:
  ```tsx
  const v = useMotionValue(0);
  animate(v, 100, { delay: index * 0.02, duration: 1, repeat: Infinity, ease: 'linear' });
  const color = useTransform(v,
    [25, 35, 45, 55, 65, 75],
    ['rgb(115, 115, 115)','rgb(0, 238, 255)','rgb(0, 14, 221)','rgb(245, 29, 0)','rgb(255, 187, 0)','rgb(115, 115, 115)']);
  ```
  `inputRange` is derived as `50 - gradientRange + k/(n-1) * gradientRange*2` for k in 0..5.
  The sweep is gated `gradientAnim = !isLastString && play`, so it runs on strings 0 and 1 and
  **stops on `3 accounts flagged`**, which settles to flat grey.

This component is the source of the long 200ms / 20ms-stagger runs in the CDP capture:
30 entries (`Scoring by churn signal weight`), 18 (`3 accounts flagged`), 19 (`Scanning Salesforce`),
counting spaces.

### 3.7 The Quick Action bars

**Bar 1** (`.framer-t1zk3n`, 4 actions, gated on `Pwl_s00am`):

| container | appear id | label | icon |
|---|---|---|---|
| `.framer-n00lzi-container` | `n00lzi` | `Analyze ` (trailing space is in the source) | Chart Pie |
| `.framer-17bqj0-container` | `17bqj0` | `Compare` | Align Horizontal Justify Center |
| `.framer-10q9li8-container` | `10q9li8` | `Monitor` | Activity |
| `.framer-1ysxh9n-container` | `1ysxh9n` | `Report` | Clipboard List |

The SSR appear payload holds:

```tsx
// n00lzi
initial={{opacity:0.001, y:12}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1], delay:0.1}}
// 17bqj0  -> delay 0.2
// 10q9li8 -> delay 0.3
// 1ysxh9n -> { default: null, uuxm6n: null }   i.e. NO animation
```

**Important:** those three payload entries were written by two *other* instances of the same
component (the Standalone ones used in the Features rail-cart slot and the phone carousel), which
render at `variant: MPeNLgoLm` where the `initial`/`animate` props are applied. On the
**Conversation instance the four actions have no entrance animation of their own** - they simply
fade with their parent bar's `opacity`. Build the Conversation section that way.

**Bar 2** (`.framer-vams9e`, mounted only in Thinking / Results / Loop Reset), two actions with
`initial`/`animate` applied unconditionally. These two have appear ids in the DOM but **no SSR
payload entry** (no instance was server rendered in a variant that mounts this bar), so they run as
ordinary on-mount animations the moment the bar mounts:

```tsx
// .framer-3kyhfb-container  "Export CSV"  (File Spreadsheet icon)
initial={{opacity:0.001, y:12}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1], delay:0}}
// .framer-7k78ji-container  "Share with team"  (Message Square Share icon)
initial={{opacity:0.001, y:12}} animate={{opacity:1, y:0}}
transition={{type:'tween', duration:0.2, ease:[0.12,0.23,0.5,1], delay:0.1}}
```

`Quick Action` (`framer-MvRYe`) itself: single variant, **no hover**. Chrome: `padding 8px; gap 8px;
border-radius 8; border 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38,38,38));
background var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20,18,16))`, icon and label both
`rgb(161, 161, 161)`.

### 3.8 The result rows

Mounted only in Results and Loop Reset. All carry `initial: {opacity:0.001, x:20, y:0}` and a
staggered `animate` on the **sine** curve:

| element | appear id | animate transition |
|---|---|---|
| `.framer-bjkrkd-container` "Meridian Corp" / "High risk" / "No login in 30d" | `bjkrkd` | `{type:'tween', duration:0.2, ease:[0.44,0,0.56,1], delay:0.1}` |
| `.framer-15yxkhe` Divider | `15yxkhe` | `delay:0.15` |
| `.framer-1dde39s-container` "Apex Systems" / "Medium" / "Usage -40%" | `1dde39s` | `delay:0.2` |
| `.framer-540yzz` Divider | `540yzz` | `delay:0.25` |
| `.framer-163fnxe-container` "Acme Corp" / "High Risk" / "Ticket spike" | `163fnxe` | `delay:0.3` |

```tsx
initial={{opacity:0.001, x:20}} animate={{opacity:1, x:0}}
transition={{type:'tween', duration:0.2, ease:[0.44,0,0.56,1], delay: 0.1 | 0.15 | 0.2 | 0.25 | 0.3}}
```

None of these has an SSR payload entry either (the SSR render caught the component in Primary).

Row colours: rows 1 and 3 use
`var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))` /
`var(--token-3a95eaa6-e51b-4092-9cd6-e78e24a17dd1, rgba(229, 72, 77, 0.2))`; row 2 uses
`var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))` /
`var(--token-aace3d5f-06f1-4eda-b5c4-3a57d2e8e178, rgba(249, 171, 0, 0.2))`.
Dividers: `height 1px; width 100%; background var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38,38,38))`.

`Chat Dialog Result` (`framer-rl0Pk`) is single variant, **no hover**, transition `SPRING_A`.
Its `StatusPingV2` dot is passed `play: false` on every instance here, so **the dot never pings in
this section** - it is a static 6px circle in the row's status colour.

### 3.9 The particle grid WebGL (owned by another agent)

`.framer-1ykvmaj-container`, `position:absolute; inset:0; z-index:1`,
`mask: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%) add`, `opacity: 0.3`.
Mounted in every variant except Standalone. Per-variant uniform swaps (**hard swaps, not tweened**):

```js
base:      { noiseFrequency: 2, noiseLayerSpread: 0.005, timeScale: 0.05, waveHeightScale: 0.1, pointSize: PSTJiG3p8 }
yebqQkg1K: { timeScale: 0.25 }
CtVEKtlJu: { noiseFrequency: 3, noiseLayerSpread: 0.01, timeScale: 0.31, waveHeightScale: 0.14 }
eg6XjUQLY: { noiseFrequency: 3, noiseLayerSpread: 0.01, timeScale: 0.31, waveHeightScale: 0.14 }
```

In Results the canvas moves to `order: 1` so the chat box sits above it.

### 3.10 No hover anywhere in this section

A regex sweep of `tQctxOsxU.BMpimIfh.mjs` for `whileHover|whileTap|onHoverStart|-hover` returns zero
matches. `Ask Chat Anim`, `Chat Dialog Result`, `Status Indicator`, `Quick Action`, `Tag` and all six
icon components are single-variant with no `enabledGestures`. Nothing in the Conversation section
responds to the pointer.

---

## 4. Features (`#features`, desktop y 1827 h 2700)

Three stacked feature blocks (Cortex, Ask, Pulse) in a left column, with a sticky right column holding
a WebGL shape that morphs as you scroll and a numbered progress rail.

### 4.1 Tree

```
Features  .framer-e37e89  #features
└─ Container  .framer-2wq6o  data-border
   ├─ Left Stack  .framer-11wxjj4  #products-swap-scroll   [hidden-wc1e1l -> hidden on phone]
   │  ├─ Scroll Progress Section  .framer-ongoh1  #products-scroll
   │  │  ├─ Rail  .framer-g1gjpv  data-border
   │  │  │  └─ Rail Cart  .framer-8cz25g  #features-cortex
   │  │  │     └─ Cortex  .framer-qdle9s-container -> Feature Section (.framer-5Y2Hx .framer-tnjwra)
   │  │  └─ Rail  .framer-1mqiqes  data-border
   │  │     └─ Rail Cart  .framer-1ilx1em  #features-ask
   │  │        └─ Ask  .framer-1d5ij2n-container -> Feature Section
   │  └─ Rail  .framer-gw12jb
   │     └─ Rail Cart  .framer-1s7z65x  #features-pulse
   │        └─ Pulse  .framer-zggyi1-container -> Feature Section
   ├─ Right Stack  .framer-z2pejt
   │  ├─ Rail Cart  .framer-iejl6p
   │  │  └─ Container  .framer-12nzhvt
   │  │     └─ .framer-1apm31s-container  (nodeId Dr7s_qOFh)  -> shape-swapper WebGL + slot
   │  │        ├─ canvas (649x508 at 1440)
   │  │        └─ AnimatePresence slot child (one of three)
   │  │           └─ .framer-iyty47-container -> Cortex Stats (.framer-AhJf9 .framer-1txctdx)
   │  │              ├─ .framer-1ctfs4x-container  appear=1ctfs4x  -> Status card "Scaleforce"
   │  │              ├─ .framer-zatbru-container   appear=zatbru   -> Status card "Strive"
   │  │              ├─ .framer-17bslm8-container  appear=17bslm8  -> Status card "PostgridDB"
   │  │              └─ .framer-18u74t1-container  appear=18u74t1  -> Status card "HotSpot"
   │  └─ Progress  .framer-1ak0sa5
   │     └─ .framer-i0hju5-container  (nodeId gaH8OTWcR)  -> scroll progress rail
   └─ .framer-jbnu5j-container  [hidden-72rtr7 hidden-uuxm6n -> PHONE ONLY]
      └─ Mobile Carousel (.framer-PlXiw)
```

Each `Rail` is 900px tall. `#products-scroll` (1800px) covers rails 1 and 2;
`#products-swap-scroll` (2700px) is the whole Left Stack, covering all three.

Each `Feature Section` (`framer-5Y2Hx`) has breakpoint variants
`Fq1EJYEOR` Desktop / `HbdczjDkY` Tablet / `uVgwvxKpm` Mobile, transition **`SPRING_A`**, and
contains Context (title + description), a 3-up `Features` grid of `Product Feature` cards, and a
`Circular Button With Text` link. **The Feature Section itself has no appear animation and no
scroll link.**

### 4.2 Appear animations

Four, on the Cortex Stats cards inside the shader slot. All on-mount (of the slot child), identical
across breakpoints, on the **sine** curve:

| appear id | card | initial | animate | transition |
|---|---|---|---|---|
| `1ctfs4x` | "Scaleforce" | `{opacity:0.001, x:100, y:0}` | `{opacity:1, x:0, y:0}` | `{type:'tween', duration:0.2, ease:[0.44,0,0.56,1], delay:0}` |
| `zatbru` | "Strive" | `{opacity:0.001, x:100}` | `{opacity:1, x:0}` | `delay:0.05` |
| `17bslm8` | "PostgridDB" | `{opacity:0.001, x:100}` | `{opacity:1, x:0}` | `delay:0.1` |
| `18u74t1` | "HotSpot" | `{opacity:0.001, x:100}` | `{opacity:1, x:0}` | `delay:0.15` |

```tsx
initial={{opacity:0.001, x:100}} animate={{opacity:1, x:0}}
transition={{type:'tween', duration:0.2, ease:[0.44,0,0.56,1], delay: 0 | 0.05 | 0.1 | 0.15}}
```

Because the cards live inside an `AnimatePresence` slot, these replay every time the shader swaps
back to slot child 0.

### 4.3 The Status cards and their ping loops

`Cortex Stats` (`framer-AhJf9`) is a column of four `Status` cards, `gap: var(--1o2x40t)` =
`bRG9OLk6M` (**8** in the desktop slot, **4** in the phone carousel). Width 344px.

`Status` (`framer-9bYeO`), single variant `SqtsxgsfE`, transition **`SPRING_A`**, no hover.
Chrome: `border 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38,38,38));
background var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20,18,16)); border-radius 16`.

| card | title | stat | status | tint | `animatePing` | ping transition |
|---|---|---|---|---|---|---|
| `1ctfs4x` | Scaleforce | 14,203 entities | **Live** | `var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))` | **true** | `{type:'tween', duration:0.3, ease:[0.44,0,0.56,1], delay:0}` |
| `zatbru` | Strive | 8,847 entities | **Live** | same green | **true** | `delay:0.1` |
| `17bslm8` | PostgridDB | 52,091 entities | **Syncing** | `var(--token-5e110c3f-82c1-4736-86cd-104cc5e3bfff, rgb(54, 197, 240))` | **false** | `delay:0.3` |
| `18u74t1` | HotSpot | 52,091 entities | **Pending** | `var(--token-d5c4dbc3-b3ce-4d57-8583-5c04401312ab, rgb(249, 171, 0))` | **false** | `delay:0.4` |

So only the two **Live** dots pulse. The other two render a static dot.

`StatusPingV2`, with the card's values (`size: 8`, `pingSize: 16`, `pingWeight: 2`, `repeatDelay: 1`):

```tsx
// the dot
<div style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: tint, position: 'relative' }}>
  {animatePing && (
    <motion.div
      initial={{ width: 4,  height: 4,  opacity: 1 }}   // startSize = max(size - pingWeight*2, 1) = 4
      animate={{ width: 20, height: 20, opacity: 0 }}   // endSize   = startSize + pingSize    = 20
      style={{ borderRadius: 9999, outline: `2px solid ${tint}`,
               position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%' }}
      transition={{ type: 'tween', duration: 0.3, ease: [0.44, 0, 0.56, 1],
                    delay: 0 /* or 0.1 */, repeat: Infinity, repeatDelay: 1 }} />
  )}
</div>
```

Cycle: 0.3s expand-and-fade, then 1s idle, forever. The captured DOM confirms it: card 1's ring reads
`width: 20px; opacity: 0` (settled) and card 2's reads `width: 18.9717px; opacity: 0.0646`
(mid-flight, 0.1s behind).

### 4.4 The scroll progress rail (custom code component)

`.framer-i0hju5-container`, nodeId `gaH8OTWcR`. Props on this page:

```js
{ sectionName: 'products-scroll',
  sections: 3,
  numLines: 8,
  lineGap: 10,
  lineWeight: 1,
  primaryColor: 'rgb(250, 250, 250)',
  secondaryColor: 'rgb(115, 115, 115)',
  fade: 0.05,
  font: { fontFamily: '"Geist Mono", "Geist Mono Placeholder", monospace', fontSize: '12px',
          fontStyle: 'normal', fontWeight: 400, letterSpacing: '0em', lineHeight: '31px',
          textAlign: 'left' } }
```

Implementation, verbatim:

```tsx
const target = useRef<HTMLElement|null>(null);
useEffect(() => { target.current = document.getElementById(sectionName); }, []);
const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 30 });
const y = useTransform(progress, [0, 1], ['50%', '-50%']);

<div style={{ height: '100%', display: 'flex', alignItems: 'center',
              maskImage: 'linear-gradient(0deg, #0000, #000 10%, #000 90%, #0000)' }}>
  <motion.div style={{ display:'flex', flexDirection:'column', position:'relative',
                       marginBottom: `calc(${font.lineHeight})`, y }}>
    {sections.map((_, n) => <Section index={n+1} range={[n/(sections-1), (n+1)/(sections-1)]}
                                    progress={progress} isLast={n === sections-1} .../>)}
  </motion.div>
  <div style={{ width: 5, height: lineWeight, marginLeft: 4,
                borderTopLeftRadius: 9999, borderBottomLeftRadius: 9999,
                backgroundColor: primaryColor }} />
</div>
```

Per section (index label `01` / `02` / `03`, zero padded):

```tsx
// the number, colour interpolated across the section boundary
const color = useTransform(progress,
  [r0 - fade*2, r0 - fade, r0, r0 + fade, r0 + fade*2],
  [secondaryColor, primaryColor, primaryColor, primaryColor, secondaryColor]);
// wrapper: position: isLast ? 'absolute' : 'relative'; top: '100%'
// lines container: display:flex; flex-direction:column; gap: lineGap (10); align-items: end
```

Per tick line (`numLines` = 8 per section, skipped on the last section):

```tsx
const pos = (r1 - r0) / (numLines + 1) * (i + 1) + r0;
const stops = [pos - fade*2, pos - fade, pos, pos + fade, pos + fade*2];
const color = useTransform(progress, stops, [secondaryColor, primaryColor, primaryColor, primaryColor, secondaryColor]);
const width = useTransform(progress, stops, ['40%', '65%', '65%', '65%', '40%']);
<motion.div style={{ width, height: lineWeight, borderRadius: 9999, backgroundColor: color }} />
```

With `sections: 3`, section ranges are `[0, 0.5]` and `[0.5, 1]` and `[1, 1.5]`
(`n/(sections-1)` with `sections-1 = 2`).

**UNCERTAIN:** with `sections: 3` the third range starts at 1.0, past the end of `scrollYProgress`, so
its number only lights at the very end. That is what the arithmetic gives; verify against
`capture/frames/scroll-features`.

### 4.5 The rail-cart shape swapper (custom code component + WebGL)

`.framer-1apm31s-container`, nodeId `Dr7s_qOFh`. Scroll props:

```js
{ sectionName: 'products-swap-scroll', previewShape: 0, refresh: false, debugMode: false,
  shapes: [ {points:'...', threshold:..., scale:...}, ... ],   // three outline shapes
  slot: [ /* 3 children */ ] }
```

The three slot children, in order:

| # | container | size | component |
|---|---|---|---|
| 0 | `.framer-iyty47-container` (`qC1md0qrO`) | 289 x 336 | `Cortex Stats` with `bRG9OLk6M: 8` |
| 1 | `.framer-egpkas-container` (`maoqKGyWe`) | 401 x 428 | `Ask Chat Anim` at `variant: MPeNLgoLm` (Standalone, static), `ltWGnHZW1: false, PSTJiG3p8: 2, Pwl_s00am: 3, ugG8YyQe7: '16px'` |
| 2 | `.framer-ssv5r4-container` (`uP3bEb_QB`) | 297 x 289 | a third visual component |

Scroll logic, verbatim:

```tsx
const target = useRef<HTMLElement|null>(null);
useEffect(() => { target.current = document.getElementById(sectionName) ?? null; }, [sectionName]);
const { scrollYProgress } = useScroll({ target, offset: ['start center', 'end center'] });

const f = children.length;                       // 3
const [index, setIndex] = useState(0);
useEffect(() => scrollYProgress.on('change', v => {
  setIndex(Math.min(Math.max(Math.floor(v * f), 0), f - 1));
}), [scrollYProgress, f]);

// visibility gate: a triangle wave that dips at each swap boundary
const S = 1 / (f * 2);                           // 1/6
const gate = useTransform(useTransform(scrollYProgress, v => clamp(S, 1 - S, v)),
                          v => triangle(v, f) * 0.5 + 0.3 > 0);
// triangle(e, t) with n=1, r=0:
//   i = 1/t;  a = ((e % i) + i) % i / i;  return a < .5 ? 4a - 1 : 3 - 4a
const [visible, setVisible] = useState(true);
useMotionValueEvent(gate, 'change', setVisible);
```

Presence animation on the slot child:

```tsx
<AnimatePresence mode="wait" initial={false}>
  {visible && (
    <motion.div key={index}
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)',
                 transition: { duration: 0.1, ease: 'easeOut',
                               filter: { duration: 0.3, ease: 'easeOut' },
                               scale:  { duration: 0.3, ease: 'easeOut' } } }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)',
              transition: { duration: 0.15, ease: 'easeIn' } }}
      style={{ width: '100%', height: '100%' }}>
      <div style={{ pointerEvents:'none', userSelect:'none', width:'100%', height:'100%',
                    display:'flex', justifyContent:'center', alignItems:'center', padding:'0px 12px' }}>
        {children[index]}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

The CDP capture corroborates: `100ms ease-out` x2, `300ms ease-out` x2, `150ms ease-in` x4.

The shader itself takes `currentShape = index` and morphs its outline. Props (owned by another agent):
`cameraFov: 34, cameraPosition: {x:0, y:0, z:1.8}, dispersion: 0.8, dispersionBand: 0.9,
dispersionOffset: 0.05, opacitySpeed: 5.3, springVariance: 22.6, tipLayers: 8, tipRadius: 0.003,
tipTexture: 'https://framerusercontent.com/images/uMNT221vEn5naMu3VgNputh9yZU.png?width=256&height=256',
fallbackImage: 'https://framerusercontent.com/images/SqLdVKcP2FReuGdnVp855FcnJM8.png?width=1200&height=1200',
fallbackFit: 'contain'`. **No motion wrapper, no appear id, no variant wrapper.**

### 4.6 Phone only: the Mobile Carousel

`.framer-jbnu5j-container` carries `hidden-72rtr7 hidden-uuxm6n`, i.e. it renders **only on phone**.
`Mobile Carousel` (`framer-PlXiw`), transition **`SPRING_A`**, variants:

| variant | title | classname |
|---|---|---|
| `eLMkAwc3x` | Cortex (default) | `framer-v-nl0bhk` |
| `zHyFerOUH` | Ask | `framer-v-1ae4yg9` |
| `E0V3DdRup` | Pulse | `framer-v-1e454dn` |

Three `Tab Button` instances (`framer-V3qmg`, also phone only) tap to `setVariant`. Per carousel
variant the slot cards cross-fade (`style:{opacity:1}` with `{other: {opacity: 0}}` overrides) and the
shader's `currentShape` goes 0 / 1 / 2.

`Tab Button` (`framer-V3qmg`), transition **`SPRING_A`**, variants `clkwCB8KL` Default (with
`{hover: true, pressed: true}`) and `pcuDVrfxv` Selected:

```tsx
// root <a>, border-bottom 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))
rest (clkwCB8KL):    { backgroundColor: 'var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(17, 15, 13))' }
whileHover:          { backgroundColor: 'var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))' }
whileTap:            { backgroundColor: 'var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))' }
selected (pcuDVrfxv):{ '--border-color': 'var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))' }

// label colour  (--extracted-r6o4lv)
rest:      'var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108))'
hover:     'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))'
pressed:   'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))'
selected:  'var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))'
transition={{type:'spring', bounce:0.2, duration:0.4}}
```

**This is the only Cortex / Ask / Pulse tab control on the page, and it does not exist at desktop or
tablet.** At those widths the three feature blocks are simply stacked.

---

## 5. Integrations (`#integrations`, desktop y 4527 h 723)

### 5.1 Tree

```
Integrations  .framer-65i7ss  #integrations       <- also the scroll-target marker (ref)
└─ Container  .framer-vedlvf  data-border
   ├─ .framer-ixio0v-container -> Chromatic Border divider (nodeId j9EHuYhM7)   [see section D]
   ├─ Context  .framer-19csyfa
   │  └─ Context  .framer-mjvzh3
   │     ├─ Title  .framer-5t78lj   h2
   │     ├─ Description  .framer-1i3vsvd
   │     └─ Variant 1  (.framer-z2KqL) -> Circular Button With Text "View integrations"
   └─ Visual  .framer-n9voe3                       <- in-view opacity fade
      └─ .framer-6okzgi-container  (nodeId FTLhHUANj)   <- the x:120 -> 0 scroll target
         └─ Desktop  (.framer-kdORT .framer-gdrllt)  -> Integrations visual
            ├─ Top Container  .framer-185hq2g
            ├─ Content  .framer-83tgt0
            │  ├─ 11 x Integration Single  (.framer-7anIQ)  Chatdock / VaultDB / Stride / ThreadBase / Pipecloud, repeated
            │  └─ Right Column Grid  .framer-8euj4w   15 x Integration Single Tile (.framer-DXDHz)
            └─ Bottom Container  .framer-15nwmy8
               ├─ Stats  .framer-1mlkfvk   2 x Stat (.framer-6SsJm)
               └─ Stats  .framer-4279vg    -> Circular Button (Light / XS)
```

### 5.2 The one style-appear (in-view opacity fade)

The `Visual` wrapper is the page's only `__framer__styleAppearEffectEnabled`:

```js
{ __framer__styleAppearEffectEnabled: true,
  __framer__enter:  { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, skewX: 0, skewY: 0 },
  __framer__exit:   { opacity: 0, ..., transition: SPRING_A },
  __framer__animate:{ transition: SPRING_A },
  __framer__threshold: 0.5,
  __framer__animateOnce: true,
  __targetOpacity: 1,
  className: 'framer-n9voe3', 'data-framer-name': 'Visual' }
```

Runtime: an in-view observer with `amount: 0.5`, `once: true`. On entry it resets to `enter` and
animates every transform key to its rest default, which for this object means **opacity 0 -> 1 only**.

```tsx
const ref = useRef(null);
const inView = useInView(ref, { amount: 0.5, once: true });
<motion.div ref={ref}
  initial={{ opacity: 0 }}
  animate={inView ? { opacity: 1 } : { opacity: 0 }}
  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
```

### 5.3 The scroll-target effect (the page's only one)

On `.framer-6okzgi-container` (nodeId `FTLhHUANj`), **inside** the `Visual` wrapper:

```js
{ __framer__styleTransformEffectEnabled: true,
  __framer__transformTrigger: 'onScrollTarget',
  __framer__transformViewportThreshold: 1,
  __framer__transformTargets: [
    { target: { opacity:1, x:120, y:0, scale:1, rotate:0, rotateX:0, rotateY:0, skewX:0, skewY:0 } },
    { ref: <the Integrations section element>,
      target: { opacity:1, x:0,   y:0, scale:1, rotate:0, rotateX:0, rotateY:0, skewX:0, skewY:0 } }
  ],
  __targetOpacity: 1, __perspectiveFX: false }
```

**The marker ref is the `Integrations` section itself** (`.framer-65i7ss`, `id="integrations"`,
the element the page component creates with `ref: X`). There is **no `__framer__spring`**, so the
transform follows scroll one to one with no chase spring.

Runtime range math (`Ul` / `Zl` / `$l` in `framer.Dy0MSJwM.mjs`, verified):

```
start = max( offsetTopToDocument(marker) - 1 - threshold * viewportHeight , 0 )
end   = max( start + marker.clientHeight , 0 )
x     = interpolate(scrollY, [start, end], [120, 0])     // clamped
```

with `threshold = 1`, so the offset is exactly one viewport height. The `- 1` is a runtime constant.
Only `x` differs between the two targets, so nothing else animates.

Concrete input ranges at the captured viewport heights:

| breakpoint | marker y | marker h | viewport h | input range (scrollY) | output |
|---|---|---|---|---|---|
| desktop 1440 | 4527 | 723 | 900 | `[3626, 4349]` | `x: 120 -> 0` |
| tablet 1024 | 4445 | 554 | 900 | `[3544, 4098]` | `x: 120 -> 0` |
| tablet 810 | 4475 | 554 | 900 | `[3574, 4128]` | `x: 120 -> 0` |
| phone 390 | 3053 | 678 | 844 | `[2208, 2886]` | `x: 120 -> 0` |

Rebuild (measure, do not hardcode):

```tsx
'use client';
import { useScroll, useTransform, motion } from 'motion/react';

function IntegrationsVisual() {
  const sectionRef = useRef<HTMLDivElement>(null);   // the #integrations section element
  const { scrollY } = useScroll();
  const [range, setRange] = useState<[number, number]>([0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      let top = 0;
      let n: HTMLElement | null = el;
      while (n) { top += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      const start = Math.max(top - 1 - window.innerHeight, 0);
      const end = Math.max(start + el.clientHeight, 0);
      setRange([start, end]);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const x = useTransform(scrollY, range, [120, 0], { clamp: true });

  return (
    <section ref={sectionRef} id="integrations">
      {/* ... */}
      <motion.div style={{ x }}>{/* the integrations visual */}</motion.div>
    </section>
  );
}
```

Under Lenis this works unchanged: Lenis writes real `window.scrollY`.

Breakpoint overrides on the inner component: phone gets `boRManxAv: 4` and
`variant: 'm29m57BbI'`; desktop passes `boRManxAv: 3` and `variant: 'hgluiL7kw'`. The `Visual`
wrapper gets `height: 360` and `width: calc(min(100vw, 1400px) - 32px)` on phone.

---

## 7. Statistics (`#statistics`, desktop y 5851 h 489)

### 7.1 Tree

```
Statistics  .framer-1ycn8bz  #statistics
└─ Container  .framer-74z6vi  data-border
   ├─ .framer-fjarzo   h2 "Your team already has the data. <span>Nordwell gives you the answers.</span>"
   ├─ .framer-1apfvab
   │  ├─ Stat  .framer-n9q4h9
   │  │  ├─ Stat1 Animation  .framer-l2pcl2-container   -> Lottie (svg 64x64)
   │  │  └─ Info  .framer-l7k635
   │  │     ├─ Stat Number  .framer-1woxgo9   h3 "16x"
   │  │     └─ Description  .framer-1qqta5d   p  "Faster time-to-answer"
   │  ├─ Stat  .framer-n3di6v    -> Stat2 Animation .framer-q5w0ul-container  · "47%"
   │  ├─ Stat  .framer-1nhhc37   -> Stat3 Animation .framer-vb4ntv-container  · "80%"
   │  └─ Stat  .framer-ddxb04    -> Stat4 Animation .framer-13nl88v-container · "4.2hrs"
   └─ .framer-qwko6a-container -> Chromatic Border divider (nodeId YPSDP79B7)   [see section D]
```

### 7.2 There is no count-up

**The four numbers are static text.** `16x`, `47%`, `80%` and `4.2hrs` are literal strings in the page
module inside plain `RichText` nodes (`framer-styles-preset-4ysld2` / `gO5BOL9GY`), colour
`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))`. There is no
`AnimatedNumber`, no stylokit component, no `useSpring` on a number, no
`toLocaleString` animation anywhere in this section. If the brief expected a count-up spring, the
page does not have one.

What *does* animate is a **Lottie player per stat**, a 64x64 inline SVG rendered by the bodymovin
runtime embedded in `tQctxOsxU.BMpimIfh.mjs`. The captured DOM shows
`<svg viewBox="0 0 64 64"><defs><clipPath id="__lottie_element_2">...` with ten `<g><g><path>` groups.

Props, identical per stat except the source file and `progress`:

```js
{ loop: true,
  playing: true,
  speed: 1,
  isForwardsDirection: true,
  pauseOnCanvas: true,
  poster: 'Auto',
  posterProgress: 0,
  progress: 0,              // Stat4 Animation is authored with progress: 62
  srcType: 'Upload',
  srcUrl: 'https://misc.framerstatic.com/lottie/logo.json',   // ignored, srcType is Upload
  style: { height: '100%', width: '100%' } }
```

| name | nodeId | container | srcFile |
|---|---|---|---|
| Stat1 Animation | `HHE4hHMlq` | `.framer-l2pcl2-container` | `https://framerusercontent.com/assets/M4cE4HJq5O8swp96M5SKA1B0PrE.json` |
| Stat2 Animation | `O1DXwaGLK` | `.framer-q5w0ul-container` | `https://framerusercontent.com/assets/BHL4ecdDXKXyhms78jiNJSHlnQ.json` |
| Stat3 Animation | `bhVtGybhb` | `.framer-vb4ntv-container` | `https://framerusercontent.com/assets/IvyiEpo8Z4taU1v3jR2F0qpXI4.json` |
| Stat4 Animation | `kM6FK35En` | `.framer-13nl88v-container` | `https://framerusercontent.com/assets/T6HSiRz7cqn3Bq6lGf7dXehXdOg.json` |

Rebuild: fetch the four JSON files into `public/lottie/` and mount them with `lottie-web`
(`loop: true, autoplay: true`, `renderer: 'svg'`). They are **not** Framer motion and have no
transition constant.

### 7.3 Everything else

**No appear animations, no hover, no scroll link** in this section, other than the divider at the end.

---

## 9. Footer Container (desktop y 6852 h 1618)

### 9.1 Tree

```
Footer Container  .framer-vjqi89  data-border         --border-top-width: 1px
├─ CTA  .framer-1aeo38i
│  └─ Container  .framer-9aqjls                       height 677px, max-width 1400px, overflow clip
│     ├─ .framer-1w558nd-container  (nodeId MZnzrpbQb)   <- variant-on-scroll #5
│     │  └─ Hidden  (.framer-zhkea .framer-sm5shs)
│     │     └─ .framer-17womtx-container -> CTA filament WebGL (canvas 1400x677)
│     └─ .framer-qr3vrw
│        ├─ .framer-o9bwxk   h2 "Your data, finally connected"
│        └─ .framer-cq6zkv-container -> CTA Button Primary / XL "Get started" -> ./pricing
└─ Footer  .framer-1xetojl
   └─ Container  .framer-66k0md
      ├─ Links  .framer-wyzuea                         grid repeat(4, minmax(156px,1fr)), gap 40px
      │  ├─ Features Column  .framer-11jzkye  -> Cortex / Ask / Pulse
      │  ├─ Company          .framer-i8ygc2   -> Pricing / About / Careers / Blog
      │  ├─ Resources        .framer-1q8s67d  -> Integrations / Changelog / Developer docs / Help Center / 404
      │  └─ Connect          .framer-17009n1  -> 3 x External Link (X, LinkedIn, GitHub)
      ├─ Uptime Newsletter  .framer-1p5h1ve
      │  ├─ Uptime      .framer-j8ngry  data-border   radius 210px, padding 12px 16px
      │  │  ├─ .framer-ic5mpm-container -> StatusPingV2
      │  │  ├─ "All systems operational"  .framer-1qrftu8
      │  │  ├─ divider .framer-1rrzwpy  [hidden on phone]
      │  │  └─ "99.98% UPTIME"           .framer-5jvd8e
      │  └─ Newsletter  .framer-fqk3g9
      │     ├─ "Updates on new features and releases."  .framer-27d16y
      │     └─ .framer-1exlpg3-container -> Footer Newsletter (form)
      ├─ Logo       .framer-138v7uv
      └─ Copyright  .framer-15v4uw2   + Terms / Privacy links
```

Phone grid override: `.framer-wyzuea { grid-template-columns: repeat(2, minmax(120px,1fr));
grid-template-rows: repeat(2, min-content); gap: 40px 20px; padding: 40px 20px }`.
Tablet: `gap: 20px`.

### 9.2 Appear animations

**None** in the CTA or the Footer.

### 9.3 Variant-on-scroll #5: the CTA filament field

The layout module's only `__framer__variantAppearEffectEnabled`, and the only one on the page that
flips back.

```js
// wrapper on .framer-1w558nd-container, nodeId / layoutId MZnzrpbQb
{ __framer__variantAppearEffectEnabled: true,
  __framer__visibleVariantId:  'qqtzmr701',   // "Visible"
  __framer__obscuredVariantId: 'S9BU72mBi',   // "Hidden"
  __framer__threshold: 0.5,
  __framer__animateOnce: false,               // <- flips back on scroll out
  variant: 'qqtzmr701',
  style: { height: '100%', width: '100%' } }
```

No `__framer__targets`, so it is the plain in-view branch: `useInView(ref, { amount: 0.5 })` with
`once: false`, setting the variant to Visible when at least half the element is in view and back to
Hidden when it leaves.

Container CSS (static, not part of the variant):

```css
.framer-1w558nd-container {
  position: absolute; inset: 0; z-index: 1; flex: none; opacity: 0.85;
  -webkit-mask: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14.000000000000002%,
                rgba(0,0,0,1) 82.43243243243244%, rgba(0,0,0,0) 100%) add;
          mask: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14.000000000000002%,
                rgba(0,0,0,1) 82.43243243243244%, rgba(0,0,0,0) 100%) add;
}
```

**What the two variants differ by: exactly one prop.** There is no `framer-v-18pnsc2` CSS rule and no
motion `variants` map on the component. The Visible variant only sets, on the WebGL child:

```js
{ introProgress: 1.1 }      // Hidden leaves the base introProgress: 0
```

### 9.4 How `introProgress` is animated

**This is the answer to the brief's question, and the transition is not a Framer transition constant.**

1. **Trigger:** the in-view variant switch above (threshold 0.5, `animateOnce: false`).
2. **Variant:** `qqtzmr701` "Visible" sets `introProgress: 0 -> 1.1` via `addPropertyOverrides`. This
   is a **plain React number prop**, not a motion style, so it changes instantly.
3. **The easing lives inside the code component:**

```tsx
const raw = useMotionValue(introProgress);
const sprung = useSpring(raw, { duration: 3000, bounce: 0 });   // <- 3000ms, zero bounce
useEffect(() => { raw.set(introProgress); }, [introProgress]);
// every frame:
material.uniforms.uIntroProgress.value = sprung.get();
```

So the reveal is a **3000 ms, bounce 0 spring on a single scalar**, running `0 -> 1.1` on entry and
`1.1 -> 0` on exit. The shader gates each point's visibility on
`uIntroProgress * 2.0 > (vUV.x + vRandom.x)`, so the filaments write themselves in from root to tip
with a randomised per-filament offset; positions never move. The `1.1` target overshoots the
clamped `1.0` on purpose so the reveal visually completes before the spring settles.

**Do not use the component's own transition constant here.** `CTA Nordwell Animation` declares
`SPRING_A` as its MotionConfig value, but nothing under it animates. A 0.4s spring would be wrong.

Every *other* animatable prop on that component is sprung with
`FILAMENT_PROP_SPRING = { duration: 1200, bounce: 0.2 }` (from its `springSettings` prop), but nothing
on this page changes them.

Instance props (owned by another agent, no shaders transcribed):

```js
{ introProgress: 0,            // -> 1.1 in the Visible variant
  springSettings: { bounce: 0.2, duration: 1200 },
  dispersion: 0.8, dispersionBand: 0.9, dispersionOffset: 0.385,
  highlightRadius: 2, highlightSpeed: 8, highlightStrength: 2,
  longLengthMax: 8, longLengthMin: 3, longSegments: 96,
  maxStart: {x:1, y:-0.6, z:1}, minStart: {x:-1, y:0.6, z:0},
  noiseScale: 0.73, noiseStrength: 0.35,
  pulseSpeedBase: 0.03, pulseSpeedRandomMax: 0.1, pulseStrength: 0.35,
  shortLengthMax: 4, shortLengthMin: 1.4, shortLineRatio: 0.9, shortSegments: 48,
  simDamping: 6, simMaxVelocity: 14, simRadius: 2, simSpring: 45, simStrength: 15,
  sizeVariance: 0.5, nordwellOpacity: 0.25,
  tipLayers: 6, tipRadius: 0.02,
  tipTexture: 'https://framerusercontent.com/images/uMNT221vEn5naMu3VgNputh9yZU.png?width=256&height=256',
  totalLines: 1600, tubeRadius: 0.01,
  fallbackFit: 'cover',
  fallbackImage: 'https://framerusercontent.com/images/5ViBNrW2So7arIANy02EAq5jV8.png?width=1400&height=800' }
```

There is **no appear animation and no other motion wrapper** around either WebGL component.

### 9.5 CTA button

`CTA Button` Primary / XL, identical to the hero's. See 0.6.

### 9.6 Footer column links

Pure CSS, the only CSS transition on the page:
`transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1) 0s`, from
`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, #a8a29e)` to
`var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, #fafaf9)` on hover
(preset `framer-styles-preset-1ybqtif`). The Terms / Privacy links use
`framer-styles-preset-656phd`: same timing, hover colour
`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, #a1a1a1)` plus
`text-decoration: underline`.

Column headings (`Features`, `Company`, `Resources`, `Connect`) are not links and have no hover.

### 9.7 The three social links (`External Link`, `framer-TbQBv`)

Variants `oXnYFgfNW` Default / `HQutWjvTX` Hovered. **Hover is a manual variant switch**
(`onMouseEnter` / `onMouseLeave` call `setVariant`), not a gesture variant. Transition **`SPRING_A`**.

Three things change:

```tsx
// 1. label colour (.framer-15bmuku, preset framer-styles-preset-1tsnca)
rest:  { '--extracted-r6o4lv': 'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))' }
hover: { '--extracted-r6o4lv': 'var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))' }

// 2. the diagonal arrow swap, inside a clipped 16x16 box (.framer-l3hlb4, overflow: clip)
//    two stacked copies of the Arrow Up Right icon
.framer-jd7xak  /* "Arrow hovered" */  rest:  { position:'absolute', bottom:-16, left:-16, width:16, height:16 }
                                       hover: { bottom:'unset', left:0, right:0, top:0, width:'calc(100% - 0px)' }
.framer-1o6fma8 /* "Arrow default" */  rest:  { position:'absolute', left:0, right:0, top:0, width:'calc(100% - 0px)', height:16 }
                                       hover: { bottom:16, left:16, right:-16, top:'unset' }
// i.e. the visible arrow exits up-right by (16, -16) while the hidden one enters from down-left

// 3. the hovered arrow's tint
rest:  { '--1m973uw': 'var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))' }
hover: { '--1m973uw': 'var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))' }
// the default arrow stays var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(168, 162, 158))
transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```

In the rebuild write the arrow swap as `x/y` on two stacked absolutely positioned icons
(default: `0,0 -> 16,-16`; hovered: `-16,16 -> 0,0`) with `SPRING_A`.

Rows: `flex-direction: row; gap: 6px; width: min-content; align-items: center; text-decoration: none`.
Link stack `.framer-vz9imr` uses `gap: 12px`. Targets: `https://x.com/kreativnik_`,
`https://linkedin.com/`, `https://github.com/`.

### 9.8 The uptime status dot (loop)

`.framer-ic5mpm-container`, nodeId `vk3ZIEgV5`, a `StatusPingV2` with:

```js
{ play: true, size: 6, pingSize: 16, pingWeight: 2, repeatDelay: 1,
  pingTransition: { type: 'tween', duration: 0.3, ease: [0.44, 0, 0.56, 1], delay: 0 },
  tint: 'var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))' }
```

Resolved: `startSize = max(6 - 2*2, 1) = 2`, `endSize = 2 + 16 = 18`.

```tsx
<div style={{ width: 6, height: 6, borderRadius: 9999,
              backgroundColor: 'var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))',
              position: 'relative' }}>
  <motion.div
    initial={{ width: 2,  height: 2,  opacity: 1 }}
    animate={{ width: 18, height: 18, opacity: 0 }}
    style={{ borderRadius: 9999,
             outline: '2px solid var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))',
             position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%' }}
    transition={{ type:'tween', duration: 0.3, ease: [0.44, 0, 0.56, 1],
                  repeat: Infinity, repeatDelay: 1 }} />
</div>
```

0.3s expand-and-fade, 1s idle, forever.

### 9.9 The newsletter field (`Footer Newsletter`, `framer-e9zZI`)

Variants `EJmh9KJfM` Primary / `xrhwSR_Qt` Focus / `WX0LAmfO7` Invalid. Transition **`SPRING_A`**.
`enabledGestures: hover on all three variants, no pressed`.

State changes are input events, not gestures:
`onFocus -> Focus`, `onBlur -> Primary`, `onInvalid -> Invalid`, `onValid (only while Invalid) -> Focus`.

```tsx
// root <form>
rest: { backgroundColor: 'var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))',
        borderRadius: 12,
        '--border-bottom-width':'1px','--border-left-width':'1px',
        '--border-right-width':'1px','--border-top-width':'1px','--border-style':'solid',
        '--border-color': 'var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))' }

// hover, IDENTICAL in all three states
whileHover: { backgroundColor: 'var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))' }

// focus
Focus:   { '--border-color': 'var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))' }
// invalid
Invalid: { '--border-color': 'var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))' }

transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```

Hover changes **background only**; focus and invalid change **border colour only**. Nothing scales.

Layout: `padding: 4px 4px 4px 12px; width: 320px` (tablet 370px, phone `calc(min(100vw, 1400px) - 40px)`),
`border-radius: 12`, `cursor: pointer`. Input radius 10px on all corners, font Geist 12px / 500 /
line-height 16px, placeholder `name@framer.com`, colour
`var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))`, text colour
`var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))`.

Submit button (`Form Submit Button`, `framer-DAIlr`), 32px tall, label `Subscribe`, error label
`Error`. Variants `ZVS9uEAOl` Default / `Gzs7KLdOZ` Loading / `EAtv73LHu` Disabled /
`nqdgF8hBS` Success / `sTeqYCuJm` Error. Component transition
**`TWEEN_B_200`** = `{type:'tween', duration:0.2, ease:[0.44,0,0.56,1]}`.

Its spinner is the page's only `__framer__loopEffectEnabled`:

```js
{ __framer__loopEffectEnabled: true,
  __framer__loop: { opacity:1, rotate:360, rotateX:0, rotateY:0, scale:1, skewX:0, skewY:0, x:0, y:0 },
  __framer__loopTransition: { type:'tween', duration:1, ease:[0,0,1,1], delay:0 },
  __framer__loopRepeatType: 'loop',
  __framer__loopRepeatDelay: 0,
  __framer__loopPauseOffscreen: true }
```

```tsx
<motion.div animate={{ rotate: 360 }}
  transition={{ type:'tween', duration: 1, ease: [0, 0, 1, 1], repeat: Infinity, repeatType: 'loop', repeatDelay: 0 }}
  style={{ mask: "url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add" }} />
```

Form action: `https://api.framer.com/forms/v1/forms/fd523de1-47f2-4a82-87fa-d2d3202f0f0f/submit`.

---

## 5b. Integrations: the interactive parts

### 5.4 The rolling connected-sources list (custom code component)

`.framer-gh3cms-container`, nodeId `C3dBC5s2a`, inside `Content` `.framer-83tgt0`.
This is what makes the left column of the Integrations visual feel alive.

```js
{ elements: 10,
  interval: 3,                 // from the Integrations component's `boRManxAv` prop; phone override 4
  entries: [ ThreadBase, Pipecloud, Chatdock, VaultDB, Stride ]   // 5 Integration Single instances
}
```

Container style (on the wrapper, not the component):
`mask: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22.07207207207207%) add`.
Parent `.framer-83tgt0`: `height: 1px; flex: 1 0 0; overflow: clip; justify-content: flex-start`.

Implementation, verbatim:

```tsx
const [offset, setOffset] = useState(0);
useEffect(() => {
  const id = setInterval(() => setOffset(o => o + 1), interval * 1000);
  return () => clearInterval(id);
}, [interval]);

<motion.div style={{ display:'flex', flexDirection:'column', justifyContent:'end',
                     width:'100%', height:'100%', overflow:'clip' }}>
  <AnimatePresence initial={false}>
    {Array.from({length: elements}).map((_, n) => {
      const entry = entries[wrap(0, entries.length, offset + n)];
      return (
        <motion.div key={offset + n} layout layoutId={`${offset}-${n}`}
          initial={{ opacity: 0, x: '-100%' }}
          animate={{ opacity: 1, x: '0%' }}>
          {entry}
        </motion.div>
      );
    })}
  </AnimatePresence>
</motion.div>
```

No `exit`, no explicit transition, so the layout shift and the enter both run on the nearest
MotionConfig, which for this subtree is the `Integrations` component's
**`TWEEN_A`** = `{type:'tween', duration:0.4, ease:[0.12,0.23,0.5,1]}`.
Every 3 seconds a new row slides in from `x: -100%` at the bottom and the stack shifts up.
Each `Integration Single` row is `326 x 74`.

Entry data: ThreadBase "42 channels" / "alerts enabled", Pipecloud "874 accounts" /
"12,400 records", Chatdock "9.841 conversations" / "204 open", VaultDB "38 schemes" / ...,
Stride "$2.4 MMR" / "1,204 subscriptions". All with the green status token
`var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, rgb(16, 236, 144))`.

### 5.5 Integration tiles and stats: **no hover, no motion**

- `Integration Single` (`framer-7anIQ`): single variant `tclGWBIUg`, no gestures, no hover map.
  `border-top: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))`,
  `background var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))`.
- `Integration Single Tile` (`framer-DXDHz`): single variant `a8bwbXBDZ`, no gestures. 90px tall,
  `border: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))`,
  `border-radius: 16`. Its logo is permanently
  `filter: grayscale(1); opacity: 0.5; -webkit-filter: grayscale(1)` - **it does not un-grey on
  hover.** The Right Column Grid holds 15 of them.
- `Stat` (`framer-6SsJm`): single variant `ewKpzVcEm`, no gestures.
- `Integrations` (`framer-kdORT`): variants `hgluiL7kw` Desktop / `m29m57BbI` Mobile, transition
  **`TWEEN_A`**. The variant is chosen by breakpoint, not by interaction.

A regex sweep of `lFOi1sWHj.CT5eLhTa.mjs` for hover variant maps returns zero matches.

### 5.6 "View integrations" link

`Circular Button With Text` (`framer-z2KqL`), `OBAEvnEgE: 'View integrations'`.
See section B.2.

### 5.7 The Light / XS circular button in the Bottom Container

`.framer-4279vg` holds one `Circular Button` at variant `Ds9QQ9qkS` = **Light / XS**. See section B.1.

---

## 6. Testimonials (desktop y 5250 h 601)

### 6.1 Tree

```
Testimonials  .framer-141n56s
└─ Container  .framer-10ev3ja  data-border
   ├─ .framer-1rn4xk5-container (nodeId DWLDVOAaC)
   │  └─ Desktop 1  (.framer-eo5xJ .framer-1jsvu24)
   │     ├─ Content  .framer-h6gs46
   │     │  ├─ Headline  .framer-11otw6d  data-border
   │     │  └─ Testimonial and name  .framer-it7gdu
   │     │     ├─ Testimonial  .framer-r2x26v
   │     │     │  ├─ Filler   .framer-ekmnq7
   │     │     │  └─ Content  .framer-10oe2xi
   │     │     └─ Navigation and name  .framer-1x84j35
   │     │        ├─ Navigation  .framer-1bgiywn
   │     │        │  ├─ Previous  .framer-187vqs7-container -> Circular Button
   │     │        │  └─ Next      .framer-1y81spb-container -> Circular Button
   │     │        └─ Name  .framer-ml0o2b
   │     └─ Image  .framer-ezoypn
   └─ .framer-1bxf2yj-container -> Chromatic Border divider (nodeId MSwOXYRCw)   [see section D]
```

### 6.2 Appear animations

**None.**

### 6.3 The carousel

`Testimonials` (`framer-eo5xJ`) is a nine-variant component: three slides x three breakpoint layouts.
Transition **`SPRING_A`** for everything. There is **no autoplay** (no `useOnVariantChange`, no
`setInterval`, no `delay(...)` scheduler anywhere in the component). It only moves on arrow tap.

| slide | Desktop | Tablet | Phone |
|---|---|---|---|
| 1 | `aaMV3bLTJ` (`framer-v-1jsvu24`) | `tQKzW9LW7` (`framer-v-1g13ruz`) | `CGn4Kh9I9` (`framer-v-1nbms52`) |
| 2 | `VxeHPWB1_` (`framer-v-sefwfx`) | `VQiG8wA3C` (`framer-v-15v69me`) | `gULx4D9aI` (`framer-v-57s0pl`) |
| 3 | `nt3dh5mN0` (`framer-v-su3p2u`) | `wIynUAwwz` (`framer-v-y0kg0r`) | `Sgk7SCtVm` (`framer-v-1aaa1tt`) |

The page mounts `variant: aaMV3bLTJ` with tablet override `tQKzW9LW7` and phone override
`CGn4Kh9I9`. Tapping an arrow calls `setVariant(<slide id for the current breakpoint>)`, so the
carousel stays inside its breakpoint family.

What actually moves between slides: the testimonial text, the name, the role, the stat and the photo
all swap content, and the layout animates through Framer's shared `layoutId` under **`SPRING_A`**.
`transition={{ type:'spring', bounce:0.2, duration:0.4 }}`.

Content: three testimonials.
`"We used to stitch together Salesforce, Stripe, and Postgres by hand every Monday. Now it's one conversation."`
(Marcus Webb, VP of Operations @ Luminous, `12 hours` / `saved per week across the ops team`);
`"Our analysts stopped exporting CSVs and started asking questions. That shift alone paid for the platform."`
(Jordan Keller, Director of Data @ Northlane, `3 tools` / `replaced with a single graph`);
`"Pulse caught a churn spike three weeks before our dashboards would have shown it. That gap used to cost us accounts."`
(Priya Nair, Head of Customer Success @ Fieldstone, `80%` / `less time spent building reports`).

### 6.4 The two arrows

Both are `Circular Button` (`framer-ssUFK`) at **SM** size (26 x 26, icon 14px).

- **Previous** `.framer-187vqs7-container`: variant `L0ze52gis` = **Disabled / SM** on slide 1,
  `XSi82891F` = **Light / SM** on slides 2 and 3. Icon `Chevron Left`.
- **Next** `.framer-1y81spb-container`: `XSi82891F` = **Light / SM** on slides 1 and 2,
  `L0ze52gis` = **Disabled / SM** on slide 3. Icon `Chevron Right`.

So the carousel does **not** wrap; the first and last slide disable the matching arrow.

Light / SM hover and press (transition **`SPRING_A`**):

```tsx
rest:       { backgroundColor: 'var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))',
              borderRadius: 52, '--border-*-width': '0px' }
whileHover: { backgroundColor: 'var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))' }
whileTap:   { backgroundColor: 'var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))' }
// icon tint, static: var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))
transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```

Disabled / SM has **no hover and no press** (it is not in `enabledGestures`):

```tsx
{ backgroundColor: 'var(--token-5f5af133-2080-4ffb-a775-1ed7714f667c, rgb(68, 64, 59))',
  borderRadius: 52, cursor: 'not-allowed' }
// icon tint: var(--token-4a066b0b-c929-4483-845f-f6c69bce15cb, rgb(121, 113, 107))
```

---

## 8. FAQ (desktop y 6340 h 512)

### 8.1 Tree

```
FAQ  .framer-ao75xt
└─ Container  .framer-1l77w07  data-border
   ├─ Label Stack  .framer-1qqompg   h2 + description
   └─ .framer-...-container
      └─ Closed  (.framer-uLM4K .framer-19006hw)          <- the accordion container
         ├─ .framer-1gsrymb-container -> Layout Jump Preventer (direction: 'vertical')
         └─ 4 x FAQ Question  (.framer-Bi957 .framer-18wxj0v)
            └─ Container  .framer-ictz1l
               ├─ Question Stack  .framer-z5btwm   data-highlight, onTap
               │  ├─ Center Question  .framer-107e5o5  -> Question  .framer-1jfysh1
               │  └─ .framer-aauvgk-container -> Vertical Dot Arrow (32x32)
               ├─ Answer Stack  .framer-1jm0egw  -> Answer  .framer-qajgrr
               └─ Right Padding  .framer-177fnaj  (40px wide)
```

### 8.2 Appear animations

**None.**

### 8.3 The accordion, and it is single-open

`FAQ` (`framer-uLM4K`) holds the open state as its own variant. Transition **`SPRING_A`**.

| variant | meaning | class |
|---|---|---|
| `d2FCdyBSB` | Closed (default, nothing open) | `framer-v-19006hw` |
| `vkm7U1_y9` | First open | `framer-v-13g888u` |
| `DxMFLM9KM` | Second open | `framer-v-1v5y7eo` |
| `iZC_WHK0o` | Third open | `framer-v-1jy770m` |
| `Dp7DHVUdL` | Fourth open | `framer-v-1un2a8n` |

Tapping row N sets the container to that row's variant. Tapping the **already open** row sets the
container back to `d2FCdyBSB` (its click handler is swapped to the close handler while it is open).
**Only one row can be open at a time, and all four can be closed.**

Two things change on the *other* rows when one is open:

```tsx
// every row that is NOT the open one gets its question text colour dimmed
HTB2qJsvu: 'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))'
// the open row keeps
HTB2qJsvu: 'var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))'
```

### 8.4 `FAQ Question` (`framer-Bi957`)

Variants `eWOqytebR` **Open** (default) and `eJSmG59zF` **Closed**.
`enabledGestures: { eJSmG59zF: { hover: true } }` - **hover exists only on the Closed variant**,
and there is **no pressed state**. Component transition **`SPRING_A`**.

Row chrome, identical in both variants:
`border-bottom: 1px solid var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))`,
`padding: 16px 0`, `width: 532px`, `display: flex; flex-direction: row; gap: 0`.

What changes between Open and Closed:

| element | Open (`eWOqytebR`) | Closed (`eJSmG59zF`) | Closed + hover |
|---|---|---|---|
| root `.framer-18wxj0v` | `height: min-content`, `align-items: center` | `height: 88px`, `align-items: flex-start`, `cursor: pointer` | same as Closed |
| `.framer-ictz1l` Container | `gap: 0px` | `gap: 22px` | `gap: 22px` |
| `.framer-z5btwm` Question Stack | `padding: 12px 0 12px 0` | `padding: 12px 0 12px 0` | **`padding: 12px 0 12px 12px`** (a 12px left inset on hover) |
| `.framer-qajgrr` Answer | `opacity: 1` | `opacity: 0` | `opacity: 0` |
| `.framer-177fnaj` Right Padding | `align-self: stretch` | `align-self: unset; height: 100%` | `align-self: unset` |
| chevron dots | `Vertical Dot Arrow` variant `oMMfsF998` **Down** | variant `c2dBlHkN3` **Neutral** | Neutral |

```tsx
// the hover, the only gesture on the row
whileHover={{ paddingLeft: 12 }}   // on .framer-z5btwm, Closed variant only
transition={{ type:'spring', bounce:0.2, duration:0.4 }}

// the answer
animate={{ opacity: isOpen ? 1 : 0 }}
transition={{ type:'spring', bounce:0.2, duration:0.4 }}
```

The open/close height change (88px -> min-content) is a layout animation through the shared
`layoutId`, under **`SPRING_A`**. In the rebuild animate `height` with the same spring, or use
`<motion.div layout>` on the row.

### 8.5 `Vertical Dot Arrow` (`framer-EOMkT`)

A 32x32 clipped box with **five** 2x2px dots (`border-radius: 1`), all
`var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))`, laid out at
`left: 7 / 11 / 15 / 19 / 23px`, `top: 50%` with `transformTemplate: translateY(-50%)`.
Transition **`SPRING_A`** on every dot.

| variant | title | dot 2 (`.framer-1sbrqk7`) | dot 3 (`.framer-ozn1zi`) | dot 4 (`.framer-k9j781`) |
|---|---|---|---|---|
| `c2dBlHkN3` | **Neutral** (default, row closed) | `top: 50%` | `top: 50%` | `top: 50%` |
| `oMMfsF998` | **Down** (row open) | `bottom: 13px; top: unset` | `top: 63%` | `top: 56%` |
| `amUd8Kex2` | **Up** (unused on this page) | `top: 13px` | `top: 38%` | `top: 44%` |

Dots 1 and 5 never move. In the Down and Up variants the `transformTemplate` is dropped from dot 2,
so it loses its `translateY(-50%)`. The effect is a flat dotted line bending into a shallow
chevron. All five animate with `{type:'spring', bounce:0.2, duration:0.4}`.

Rebuild: animate `top` (or `y`) per dot with that spring; the row's open state selects the variant.

### 8.6 Layout Jump Preventer

`.framer-1gsrymb-container`, `direction: 'vertical'`. A spacer code component that reserves the
height difference so the section does not jump when a row opens. No motion of its own.

---

## B. Button reference

Every button on the page animates **`backgroundColor`** (plus `--border-color` on the Secondary
family) and **nothing else**. No scale, no translate, no box-shadow, no gradient, no border-radius
change, no icon rotation. All of them use **`SPRING_A`** except `Circular Button With Text`.

### B.1 `Circular Button` (`framer-ssUFK`), 25 variants

Transition **`SPRING_A`**. `enabledGestures: { hover: true, pressed: true }` on all 20
non-Disabled variants; the five Disabled variants have **no gestures**.
Root: `borderRadius: 52` on all corners, `display:flex; align-items:center; justify-content:center;
gap:4px; cursor:pointer; overflow:clip`.

Sizes:

| size | box | icon | variant classes |
|---|---|---|---|
| XL | 40 x 40 | 16px | `framer-1qc2red` (base), `framer-v-ky2352` (Disabled, `cursor: not-allowed`) |
| LG | 36 x 36 | 16px | `framer-v-rlp5ew` `framer-v-s4xh6n` `framer-v-wfeamq` `framer-v-187a6rj`, `framer-v-1iqjk5r` (Disabled) |
| MD | 32 x 32 | 16px | `framer-v-1fxg40n` `framer-v-13lzo22` `framer-v-10hsmm9` `framer-v-4jcjwb`, `framer-v-10n6yab` (Disabled) |
| SM | 26 x 26 | 14px | `framer-v-1fo68tz` `framer-v-14e06qg` `framer-v-1navpe9` `framer-v-1krc73u`, `framer-v-d1t73o` (Disabled) |
| XS | 20 x 20 | 12px | `framer-v-ojjviu` `framer-v-1muf3n5` `framer-v-9qkm51` `framer-v-bedbah`, `framer-v-1baw4bx` (Disabled) |

Variant ids by family and size:

| | XL | LG | MD | SM | XS |
|---|---|---|---|---|---|
| Primary | `SLXZ3TqyB` | `IHmlIlwnQ` | `nM0UY9btt` | `kDJy4jmgf` | `h9PYQoRoX` |
| Secondary | `L7FsmLiTr` | `f2aAwZgz0` | `my2k7r7SN` | `g7qpmuQW4` | `nB7BDBw0L` |
| Light | `BWnx7Fy38` | `iFFAFWtOn` | `IzROFuuuh` | `XSi82891F` | `Ds9QQ9qkS` |
| Ghost | `QYaeAlmyR` | `ik7iddnck` | `tXZIR3JON` | `daBcqLcSh` | `T_NyAgmeA` |
| Disabled | `U7mOPrSL0` | `SsL2ifNLr` | `zCwaap2aN` | `L0ze52gis` | `nzkwcXcuR` |

Per family (identical across the five sizes within a family):

**Primary** - rest `backgroundColor: var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))`,
borders 0px. Icon tint `var(--token-52462940-c15c-4103-9816-370bb3c11bfa, rgb(23, 23, 23))`.
```tsx
whileHover={{ backgroundColor: 'var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))' }}
whileTap={{   backgroundColor: 'var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))' }}
// XL (SLXZ3TqyB) additionally re-asserts all four --border-*-width: 0px in both states
```

**Secondary** - rest `backgroundColor: var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))`,
`border: 1px solid var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(82, 82, 82))`.
Icon tint `var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))`.
```tsx
whileHover={{ backgroundColor: 'var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))',
              '--border-color': 'var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))' }}
whileTap={{   backgroundColor: 'var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))' }}
```

**Light** - rest `backgroundColor: var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`,
borders 0px. Icon tint `var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))`.
```tsx
whileHover={{ backgroundColor: 'var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))' }}
whileTap={{   backgroundColor: 'var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))' }}
// exception: Light / XL (BWnx7Fy38) has pressed var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(64, 64, 64))
```

**Ghost** - rest `backgroundColor: rgba(0, 0, 0, 0)`, borders 0px.
Icon tint `var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))`.
```tsx
whileHover={{ backgroundColor: 'var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))' }}
whileTap={{   backgroundColor: 'var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))' }}
```

**Disabled** - rest `backgroundColor: var(--token-5f5af133-2080-4ffb-a775-1ed7714f667c, rgb(68, 64, 59))`,
`cursor: not-allowed`. Icon tint `var(--token-4a066b0b-c929-4483-845f-f6c69bce15cb, rgb(121, 113, 107))`.
**No hover, no press.**

### B.2 `Circular Button With Text` (`framer-z2KqL`)

Single variant `Rr1WCTEi6` with `{ hover: true, pressed: true }`. Transition is the odd one out:
**`TWEEN_B_100`** = `{type:'tween', duration:0.1, ease:[0.44,0,0.56,1], delay:0}`.

Layout: `display:flex; flex-direction:row; align-items:center; gap:12px; width:min-content;
cursor:pointer; text-decoration:none`. Round button 26 x 26, `borderRadius: 52`, icon 14px.

**Two things change together, and this is the only button whose label colour moves.**

```tsx
// label .framer-unk2by  (--extracted-r6o4lv)
rest:       'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))'
whileHover: 'var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))'
whileTap:   'var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))'

// round button .framer-1bs23ii
rest:       { backgroundColor: 'var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))', borderRadius: 52 }
whileHover: { backgroundColor: 'var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))' }
whileTap:   { backgroundColor: 'var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))' }

// icon tint, static: var(--token-68852133-66bc-42bc-90a0-dbfa7557286d, rgb(250, 250, 249))
transition={{ type:'tween', duration:0.1, ease:[0.44, 0, 0.56, 1] }}
```

Instances on the page: three in Features ("Explore ..." under each feature block, all
`.framer-2f6409-container`) and one in Integrations ("View integrations",
`.framer-1419ixl-container`, nodeId `VnQCbEVki`).

### B.3 `CTA Button` (`framer-nnJOX`), 12 variants

Transition **`SPRING_A`**, `{ hover: true, pressed: true }` on all 12. Root `borderRadius: 8`.

| | XL | LG | MD |
|---|---|---|---|
| Primary | `WFn7l_ycj` | `fjOBCDEe9` | `SrE8wxvlP` |
| Secondary | `mpynBH2Cv` | `BpAaIYVEg` | `BdqgXl6NE` |
| Ghost | `wuA86V8Cd` | `B_d5gslqy` | `n_hWf18Dw` |
| Light | `pXjM1fasS` | `nltwK9VLK` | `CHKefkC3P` |

**Primary** - rest `var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 245))`.
XL hover `var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))`;
LG and MD hover `var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(229, 229, 229))`.
All press `var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(212, 212, 212))`.
Label `var(--token-52462940-c15c-4103-9816-370bb3c11bfa, rgb(23, 23, 23))`.

**Secondary** - rest `var(--token-49f482bf-7282-4f8a-9849-f4d6c5f1f94c, rgb(38, 38, 38))` with
`border: 1px solid var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(34, 34, 34))`.
Hover `backgroundColor var(--token-148ab549-faa2-4e43-be76-92abb380b315, rgb(64, 64, 64))` +
`--border-color var(--token-fa695f43-dc97-4fcb-890e-19bee8613bc8, rgb(115, 115, 115))`.
Press `var(--token-24c110d7-70a2-4d2f-9770-b2e54961bd48, rgb(87, 83, 78))`; the LG variant
(`BpAaIYVEg`) additionally sets `--border-color var(--token-d77c8f0f-067e-4a45-ac82-2913bb2aee68, rgb(82, 82, 82))`
on press. Label `var(--token-d374d93c-0fe8-421f-a111-c491a4a873a6, rgb(245, 245, 245))`.

**Ghost** - rest `rgba(0, 0, 0, 0)`, borders 0.
Hover `var(--token-bb9172d5-978a-4462-9d85-50327c10d262, rgb(38, 38, 38))`,
press `var(--token-28be4a51-bbd3-4a71-bc59-db9d73dedaf5, rgb(64, 64, 64))`.
Label and icon `var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))`.

**Light** - rest `var(--token-78d1b0a0-3296-4d25-9069-55a6c86138e3, rgb(38, 38, 38))`, borders 0.
Hover `var(--token-494a45c3-2553-4e41-8258-c9545bf7163f, rgb(64, 64, 64))`,
press `var(--token-67732ab8-fe77-4ba4-8c23-2c487558049e, rgb(82, 82, 82))`.
Label and icon `var(--token-09a0b579-0f15-4449-80ce-92fd13281fd7, rgb(245, 245, 245))`.

Label and icon colours are per-variant but **never change between rest, hover and press**.

### B.4 `Pill` (`framer-LKFMZ` / `framer-mEJFY`)

Variants `l4Rq4ITVJ` Primary / `uHVFq2jZC` Extra Padding / `RorjGomGF` Small /
`vzx6FkGP4` Primary - Hover. Transition **`SPRING_A`**. **No gesture map** - the parent switches the
variant. Only `backgroundColor` differs (see 0.3). Paddings: Primary `4px 8px`,
Extra Padding `4px 16px`, Small `2px 8px`. `borderRadius: 321`.

---

## L. Loop index

Every continuously repeating thing on the page, in one table.

| # | what | where | keyframes | timing |
|---|---|---|---|---|
| 1 | Status ping ring (Live card 1) | 4 Features, `Cortex Stats` card `1ctfs4x` | `{width:4, height:4, opacity:1} -> {width:20, height:20, opacity:0}` | `{type:'tween', duration:0.3, ease:[0.44,0,0.56,1], delay:0, repeat:Infinity, repeatDelay:1}` |
| 2 | Status ping ring (Live card 2) | 4 Features, card `zatbru` | same | same but `delay: 0.1` |
| 3 | Status ping ring (uptime) | 9 Footer, `.framer-ic5mpm-container` | `{width:2, height:2, opacity:1} -> {width:18, height:18, opacity:0}` | `{type:'tween', duration:0.3, ease:[0.44,0,0.56,1], delay:0, repeat:Infinity, repeatDelay:1}` |
| 4 | Per-letter gradient sweep | 3 Conversation, `TextTransitionV2` | MotionValue `0 -> 100`, piped to `color` through `useTransform([25,35,45,55,65,75], [grey, cyan, blue, red, amber, grey])` | `{duration:1, ease:'linear', delay: index*0.02, repeat:Infinity}` |
| 5 | Announcement text ticker | 0 Hero, `.framer-18d75j4-container` | `x: '0%' -> '-100%'` | `{duration: scrollWidth/30, ease:'linear', repeat:Infinity}`, i.e. **30 px/s**. Only runs when the text overflows, which it does **not** at desktop |
| 6 | Partner logo ticker | 2 Partners, `.framer-1qbqem3` | rAF loop, `offset -= delta/1000 * 50` | **50 px/s**, leftward, no easing, never pauses |
| 7 | Newsletter submit spinner | 9 Footer, `.framer-1xef08e` | `rotate: 0 -> 360` | `{type:'tween', duration:1, ease:[0,0,1,1], repeat:Infinity, repeatType:'loop', repeatDelay:0}`, paused off-screen. Only visible in the Loading state |
| 8 | Rolling connected-sources list | 5 Integrations, `.framer-gh3cms-container` | a new row per tick, `{opacity:0, x:'-100%'} -> {opacity:1, x:'0%'}` plus a layout shift | `setInterval(3000)` (phone 4000), transition `TWEEN_A` |
| 9 | Ask Chat Anim variant cycle | 3 Conversation | 5-state machine | 2000 / 2000 / 4000 / 3500 / 500 ms, **12000 ms** period, pauses when hidden or off-screen |
| 10 | Statistics Lottie x4 | 7 Statistics | bodymovin, `loop: true, speed: 1` | continuous |
| 11 | Both WebGL fields | 0 Hero, 4 Features, 9 CTA | rAF `uTime` uniform | continuous, `IntersectionObserver` + `visibilitychange` gated |

Everything else on the page is one-shot.

## C. Count-ups and animated numbers

**There are none.** The four Statistics figures (`16x`, `47%`, `80%`, `4.2hrs`) are literal strings
in plain text nodes. No `AnimatedNumber`, no stylokit component, no number spring anywhere in any of
the 57 modules. Search `toLocaleString` and you find only `Step`'s zero-padded index formatter
(`1.`, `2.`, `3.`) and the `Progress` rail's `String(n).padStart(2, '0')`, neither of which animates.

If the design brief calls for a count-up, it is a change from the reference, not a port of it.

## X. What has no motion at all

Recorded so the rebuild does not invent any:

- `Step` (Steps section rows): no hover, no press, no scroll link.
- `Feature Section` (`framer-5Y2Hx`), `Product Feature` (`framer-nbXXU`), `Cortex Stats`
  (`framer-AhJf9`), `Status` (`framer-9bYeO`), `Testimonials` (`framer-eo5xJ`): no `enabledGestures`
  at all, so **no hover and no press** on any feature card, stat card, or the testimonial block.
- `Integration Single`, `Integration Single Tile`, `Stat`, `Integrations`: no gestures. The tiles
  stay `grayscale(1) opacity: 0.5` permanently.
- `Ask Chat Anim` and everything inside it, plus `Chat Dialog Result`, `Status Indicator`,
  `Quick Action`, `Tag` and all icon components: no gestures.
- The Navigation logo: no hover.
- The dropdown chevrons: no rotation on open.
- Footer column headings: not links, no hover.
- The Statistics numbers: static text.
- `Dot Arrow`'s "Next" variant is authored but never triggered on this page.
- `Hash` (`framer-XAHcT`), `Tag` (`framer-022zo`), `Check` (`framer-FCBgc`), `X` (`framer-RiU4T`),
  `Life Buoy` (`framer-otzfv`), `Chevron Up` (`framer-RD9jt`), `Feature` (`framer-VrdWK`),
  `Page` (`framer-bEdDE`), `License Option` (`framer-6G52L`), `Checkout License Modal`
  (`framer-bXSK9`): defined but not rendered on this page.
