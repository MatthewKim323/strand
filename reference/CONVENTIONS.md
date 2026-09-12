# Conventions for section builders

Goal: a pixel-and-motion 1:1 rebuild of the captured reference, in Next.js 16 (App Router) + React 19 + `motion` (import from `"motion/react"`) + Lenis, shipped as **Nordwell**'s own components. Tailwind v4 is installed but exact values go in inline style objects and scoped `<style>` blocks, never in utility classes.

Project: `/Volumes/Vault/dev/strand`. Dev server runs at **http://localhost:3799** and is already started: do NOT start another (Next refuses a second one anyway). Reference: `/Volumes/Vault/dev/strand/reference/site/`. Rigs: `1to1 <cmd>` after `export PATH="$HOME/.claude/skills/1to1/bin:$PATH"` (see `1to1 help`).

## Origin blackout (rule zero)
Nothing you write may say where this came from. No origin name, host, brand, logo filename, link, or "cloned from / based on / like <site>" anywhere: not in a component, file name, class name, CSS comment, code comment, alt text, page metadata, doc or commit message. These are Nordwell's components and Nordwell's assets.
- The reference is already scrubbed for you: the origin's words read as `Nordwell` in `spec/`, `dom/`, `modules/` and the motion docs, and its links are route-relative. Copy text verbatim from `spec/page.txt` and you stay clean. Never open a live browser tab of any other site, and never go looking for a source url.
- **Never use the word "strand" (any case) as an identifier, class name, file name, comment or string.** The particle-trail concept in the reference code is called a **filament** here.
- Assets are content addressed (`img-<hash>.png`, `font-<hash>.woff2`). Keep those names.
- `1to1 blackout /Volumes/Vault/dev/strand` must print CLEAN. `1to1 verify` runs it and FAILs on a hit.

## Ground truth (read these, never guess)
- `reference/site/spec/page.txt` — the whole page. Lines 1..1703 are the DOM tree (`[Framer name]` labels, `appear=<id>`, classes, layout inline styles, text in quotes). Line 1704 onward is every CSS rule for those classes, grouped `@base` (desktop >= 1200) / `@media (max-width:1199px)` (tablet) / `@media (max-width:809px)` (phone). Cascade: apply @base, then the tablet override, then the phone override.
- `reference/site/spec/sections/NN-<name>.txt` — the same thing sliced to your section, once the capture finishes writing them.
- `reference/site/capture/{desktop,tablet,tablet-810,mobile}/sections/NN-*.png` — what it must look like, revealed, at 2x. Elements may be caught mid-animation; the **rest state** is the target.
- `reference/site/capture/<vp>/layout.json` — every element's page rect and computed styles. Use the rigs rather than reading it raw:
  - `1to1 refboxes reference/site desktop <y0> <y1>` — reference boxes for a y-range
  - `1to1 boxes "http://localhost:3799/?only=<section>" 1440 <y0> <y1>` — the same columns for your build
  - `1to1 cssq reference/site <class> [<class>...]` — every CSS rule for a class, per breakpoint
- `reference/site/motion/component-specs.md` + `transitions.json` — exact transitions per element (written by the motion agent; may not exist yet).
- `reference/site/motion/framer-appear.json` + `appear-by-name.json` — on-mount appear animations by id.
- `reference/site/assets/images/` — already copied to `public/img/` under the same names. Reference them as `/img/<name>.png`.

## Design tokens
`app/globals.css` defines:
- **semantic vars**: `--c-bg #060504`, `--c-bg-1 #0c0a09`, `--c-bg-2 #110f0d` (page background), `--c-bg-3 #141210`, `--c-bg-4 #1c1917`, `--c-bg-5 #292524`, `--c-line #1c1917`, `--c-line-2 #292524`, `--c-line-3 #44403c`, `--c-text #fafaf9`, `--c-text-2 #f5f5f4`, `--c-text-3 #d6d3d1`, `--c-muted #a6a09b`, `--c-muted-2 #79716b`, `--c-muted-4 #57534e`, `--c-accent #10ec90`, `--c-red #e5484d`, `--c-amber #f9ab00`, `--c-blue #36c5f0`.
- **every `--token-<uuid>` from the reference, with its exact hex**, so a value copied verbatim out of the spec (`var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))`) resolves with no translation. Prefer copying verbatim: it is faster and it cannot drift.
- Fonts: `var(--font-display)` is the display face (weights 700 and 900, self hosted) used by every `h1`/`h2`/`h3` display preset; `var(--font-body)` is the UI sans; `var(--font-code)` is the mono.

## Type presets (use these classes, do not re-declare the numbers)
| class | face / weight | desktop | <=1199 | <=809 |
|---|---|---|---|---|
| `.t-d1` | display 700 | 72 / 64 / -0.03em | 48 / 40 / -0.02em | same |
| `.t-d2` | display 700 | 60 / 52 / -0.025em, balance | 36 / 32 / -0.015em | same |
| `.t-d3` | display 700 | 48 / 40 / -0.02em | 36 / 32 / -0.015em | same |
| `.t-h2` | body 600 | 32 / 34 / -0.01em | 28 / 30 | same |
| `.t-h3` | body 600 | 18 / 24 | 18 / 24 | 16 / 20 |
| `.t-h4` | body 600 | 16 / 20 | 18 / 20 | 16 / 20 |
| `.t-lead` | body 400 | 20 / 28 | | |
| `.t-body` | body 400 | 16 / 24 | | |
| `.t-sm` | body 400 | 14 / 20 | | |
| `.t-label` | body 500 | 14 / 20 | | |
| `.t-xs` | body 400 | 12 / 16 | | |
| `.t-micro` | body 500 | 12 / 16 | | |
| `.t-nano` | body 500 | 11 / 15 | | |
| `.t-mono` | mono 500 | 12 / 16 | | |
| `.t-mono-s` | mono 500 | 11 / 15 | | |
Colour is NOT set by these classes. Set it at the use site, copying the `--framer-text-color` value from the spec. `.t-link` and `.t-link-u` carry the two link hover transitions.

## Shared primitives (reuse, never duplicate)
- `components/ui/Button.tsx` — `<Button variant="primary|secondary|ghost|light" size="xl|lg|md" href? icon? leading? height={40}>`. Twelve variants, hover and press colours already wired, border drawn as an inset shadow. Default height 40, which is what the page uses everywhere.
- `components/ui/Sprite.tsx` — `<SpriteSheet/>` is mounted once by the layout; use `<Icon id="4024583230" size={24} color="..." strokeWidth={2}/>` where the spec shows `<use href="#4024583230">`. The ids are the numbers in the spec.
- `components/ui/Logo.tsx` — `<Logo/>`.
- `lib/motion.ts` — `TWEEN` (0.4s), `TWEEN_MED` (0.3s), `TWEEN_FAST` (0.2s), `TWEEN_XFAST` (0.1s), `SPRING` (bounce 0.2, duration 0.4), `tween(d, delay)`, `spring(delay)`, `EASE = [0.12,0.23,0.5,1]`, `HIDDEN = 0.001`.
- `lib/appear.tsx` — `<Appear y={10} delay={0.1}>` for on-mount reveals (this page animates on mount, not on view).
- `lib/scroll-reveal.tsx` — `useScrollFx()` for scroll-progress-linked effects and `useScrollTargetFx()` for the one scroll-target effect. Never `whileInView` for these.
- `components/webgl/` — `FilamentField` (hero graphic) and `FilamentBurst` (CTA background), owned by another agent. Import them, do not edit them.
Re-read a shared file before editing it; another builder may have changed it. Extend backward-compatibly.

## Component rules
1. One file per section: `components/sections/<Name>.tsx`, `"use client"` only when it uses motion or hooks, named export `export function <Name>()`. Your file already exists as a stub; replace its contents.
2. Match the reference's box structure. Copy exact paddings, gaps, radii, sizes and typography from the spec. Never eyeball a number.
3. `data-border` in the tree means an **overlay** border: use `boxShadow: 'inset 0 0 0 1px <colour>'` or an absolutely positioned inset span with `borderRadius: 'inherit'` and `pointerEvents: 'none'`. Never a real CSS border: it adds 2px to the box and breaks section heights.
4. `flex: 1 0 0; width: 1px` is the reference's fill idiom and only works in a flex **row**. In a column context use `width: '100%'`. The `.fill` class in globals.css is that idiom if you want it.
5. Responsive: desktop-first inline styles, overrides in a `<style jsx global>`-free plain `<style>` block scoped by **your assigned class prefix** at `@media (max-width:1199.98px)` and `@media (max-width:809.98px)`. Nodes carrying a `hidden-<hash>` class are hidden at that breakpoint; check the spec's media blocks for `display:none`.
6. Motion: before `motion/component-specs.md` exists, use `Appear` / `TWEEN` / `SPRING` and mark every guessed value `// TODO(spec)`. After it exists, use its values verbatim.
7. Masks: `-webkit-mask` becomes `WebkitMaskImage` + `maskImage`.
8. Text content verbatim from the tree, including typographic apostrophes. Where the tree says `Nordwell`, that IS the copy: keep it.
9. **No em dashes** anywhere: not in code, comments, or copy you write.
10. After writing, screenshot and compare:
    ```
    1to1 shot "http://localhost:3799/?only=<section>" .work/shots/<section>-1440.png --w 1440
    ```
    Read the png next to `reference/site/capture/desktop/sections/NN-*.png`. Fix, repeat. Then `--w 1024`, `--w 810`, `--w 390` against the tablet / tablet-810 / mobile crops. Your section's height must equal the reference at every width.
11. Do not touch other sections' files, `app/layout.tsx`, `app/page.tsx` or `app/globals.css`.
12. `bunx tsc --noEmit` must pass for your file. Other files may have errors from other builders in flight: fix only yours, and say so.
13. Before reporting done: `1to1 blackout /Volumes/Vault/dev/strand` prints CLEAN.
