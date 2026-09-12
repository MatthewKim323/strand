# Component motion spec

The rebuild works from this file. Every number here is quoted from the page module, the layout module,
the shared component libraries, the SSR appear payload, or the measured capture. Nothing is rounded and
nothing is invented. Where something is genuinely ambiguous it is called out as **UNCERTAIN**.

Target stack: Next.js 16 App Router, React 19, `motion` (import from `"motion/react"`), Lenis.

Naming: the particle-trail graphic in the hero and in the CTA background is called a **filament** in this
rebuild. Section numbering follows the capture.

---

## 0. Global facts

### 0.1 Preloader

**No.** There is no preloader, splash, progress bar, or load overlay anywhere on the page.

- The only `@keyframes` in the whole document is `__framer-loading-spin` (800ms linear rotate, infinite),
  and it belongs to the editor-bar `<style>` block. No element in the body ever carries that class
  (`grep -c 'class="[^"]*__framer-loading' dom/full.html` = 0). Do not port it.
- The two full-screen fixed overlays in the layout module (`.framer-19h89bg` backdrop,
  `.framer-8c61kp` fullscreen stack) are the template-purchase modal, opened by user tap only.
- The one thing that *looks* like a load animation is the floating marketplace pill (appear id
  `w6pet3`, opacity 0.001 -> 1 after a **1.5s delay**). That is the template-store badge that sits
  above `#main`; it is not part of the page and should not be rebuilt.

### 0.2 Breakpoints

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

### 0.3 Smooth scroll

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

### 0.4 Which of the five mechanisms this page uses

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

### 0.5 Transition constant glossary

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

### 0.6 Section geometry (measured, all four capture viewports)

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

### 0.7 The only pure-CSS transition on the page

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

### 0.8 Route transition

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
