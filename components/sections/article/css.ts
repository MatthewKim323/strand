/* Every rule for the article detail block, in one scoped sheet. Values come
   from the captured spec and the captured computed styles; nothing here is
   eyeballed. Class prefix: ar-                                              */

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const BULLET = "var(--token-b5638a62-26ff-4efc-a9d7-90e970d50095, rgb(87, 83, 78))";
const DOT = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";

/* The breadcrumb arrow fades out at both ends of its 16px box. */
const ARROW_MASK =
  "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%)";

export const ARTICLE_CSS = `
/* ------------------------------------------------------------------ shell */
.ar-block {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
@media (max-width: 1199.98px) { .ar-block { padding: 0; } }

.ar-container {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0;
  overflow: clip;
}

/* The dot field down either side of the column. Hidden on a phone, where the
   column takes the whole width. */
.ar-rail { position: relative; flex: 1 0 0; width: 1px; align-self: stretch; }
.ar-rail svg { display: block; width: 100%; height: 100%; }
@media (max-width: 809.98px) { .ar-rail { display: none; } }

.ar-content {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 0; width: 1px; min-width: 800px; height: min-content; padding: 0;
  overflow: clip;
}
@media (max-width: 809.98px) { .ar-content { min-width: 0; } }

/* --------------------------------------------------- overlay hairlines --
   Never a real border: an inset overlay, so it cannot add to a box's height. */
.ar-edge {
  position: absolute; inset: 0; pointer-events: none; box-sizing: border-box;
  border-style: solid; border-color: ${LINE}; border-width: 0;
  border-radius: inherit;
}
/* Container and column carry a hairline down both sides down to the phone,
   where the spec unsets the width all the way up the chain and it goes. */
.ar-edge-sides { border-width: 0 1px; }
@media (max-width: 809.98px) { .ar-edge-sides { border-width: 0; } }
.ar-edge-foot { border-width: 0 0 1px; }
.ar-edge-all  { border-width: 1px; }

/* ------------------------------------------------------------ breadcrumbs */
.ar-crumbs {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ar-scroll {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 16px; width: 1px; height: min-content; padding: 20px 40px;
  overflow: auto; scrollbar-width: none;
}
.ar-scroll::-webkit-scrollbar { width: 0; height: 0; }
.ar-scroll::-webkit-scrollbar-thumb { background: transparent; }
@media (max-width: 809.98px) { .ar-scroll { padding: 20px; } }

.ar-trail {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 0; overflow: clip;
}
.ar-crumb { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ar-crumb a { color: ${BRIGHT}; text-decoration: none; }
.ar-crumb a:hover { text-decoration: underline; }

/* the six-dot arrow between the crumbs, at rest */
.ar-arrow-slot { position: relative; flex: none; width: 16px; height: 16px; }
.ar-arrow {
  position: relative; width: 16px; height: 16px; overflow: visible;
  -webkit-mask-image: ${ARROW_MASK}; mask-image: ${ARROW_MASK};
}
.ar-arrow i {
  position: absolute; display: block; flex: none; width: 2px; height: 2px;
  border-radius: 36px; background-color: ${DOT}; overflow: clip;
}

/* ----------------------------------------------------------------- column */
.ar-col {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 40px; width: 100%; height: min-content; padding: 40px 40px 80px;
  overflow: clip;
}
@media (max-width: 809.98px) { .ar-col { padding: 20px; } }

.ar-head {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 20px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.ar-row {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.ar-cell { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ar-ellipse {
  position: relative; flex: none; width: 3px; height: 3px; border-radius: 100%;
  background-color: ${BULLET};
}
.ar-avatar {
  position: relative; flex: none; width: 20px; height: auto; aspect-ratio: 1;
  border-radius: 68px;
}
.ar-avatar > span { position: absolute; inset: 0; border-radius: inherit; }
.ar-avatar img {
  display: block; width: 100%; height: 100%; border-radius: inherit;
  object-position: center; object-fit: cover;
}

.ar-title {
  position: relative; flex: none; width: 100%; height: auto; overflow: visible;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}
.ar-h1 {
  font-family: var(--font-body); font-weight: 600;
  font-size: 40px; line-height: 40px; letter-spacing: -0.01em;
  text-align: start; color: ${BRIGHT};
}
@media (max-width: 1199.98px) { .ar-h1 { font-size: 32px; line-height: 34px; } }

.ar-muted { color: ${MUTED}; }
.ar-dim   { color: ${DIM}; }
.ar-bright { color: ${BRIGHT}; }

/* ---------------------------------------------------------------- graphic */
.ar-graphic {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: 525px; padding: 0; overflow: clip;
}
@media (max-width: 809.98px) { .ar-graphic { height: 362px; } }
.ar-graphic-frame {
  position: relative; flex: 1 0 0; width: 100%; height: 1px; overflow: clip;
  -webkit-user-select: none; user-select: none; pointer-events: none;
  will-change: var(--framer-will-change-filter-override, filter);
}
.ar-graphic-frame > span { position: absolute; inset: 0; border-radius: inherit; }
.ar-graphic-frame img {
  display: block; width: 100%; height: 100%; border-radius: inherit;
  object-position: center; object-fit: cover;
}

/* -------------------------------------------------------------- rich text */
.ar-body {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 32px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
/* The rich text container itself: a column flex box, exactly as the reference
   lays it out, so the per-element margins below never collapse. */
.ar-rt {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  justify-content: flex-start; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}
.ar-rt > * { margin: 0; padding: 0; }
/* Framer gives every block but the first a top margin equal to its own
   paragraph spacing. That is where the height of an article lives. */
.ar-rt > :not(:first-child) { margin-top: var(--ar-ps, 0); }

.ar-rt p, .ar-rt li {
  --ar-ps: 20px;
  font-family: var(--font-body); font-weight: 400;
  font-size: 16px; line-height: 24px; letter-spacing: 0;
  text-align: start; color: ${MUTED};
}
/* TODO(spec): no captured article uses h2, h4, a list, a blockquote, inline
   code or an inline link, so the nine rules below have no preset to copy. They
   carry the closest documented preset (h2 the 32/34 heading, h4 the 18/24 one)
   and Framer's default 20px paragraph spacing, and should be replaced the day a
   capture shows the real values. Nothing rendered today reaches them. */
.ar-rt h2 {
  --ar-ps: 40px;
  font-family: var(--font-body); font-weight: 600;
  font-size: 32px; line-height: 34px; letter-spacing: -0.01em;
  text-align: start; color: ${BRIGHT};
}
.ar-rt h3 {
  --ar-ps: 40px;
  font-family: var(--font-body); font-weight: 600;
  font-size: 24px; line-height: 28px; letter-spacing: -0.005em;
  text-align: start; color: ${BRIGHT};
}
.ar-rt h4 {
  --ar-ps: 40px;
  font-family: var(--font-body); font-weight: 600;
  font-size: 18px; line-height: 24px; letter-spacing: 0;
  text-align: start; color: ${BRIGHT};
}
.ar-rt ul, .ar-rt ol { --ar-ps: 20px; padding-inline-start: 24px; }
.ar-rt ul { list-style: disc outside; }
.ar-rt ol { list-style: decimal outside; }
.ar-rt blockquote {
  --ar-ps: 20px;
  font-family: var(--font-body); font-weight: 400;
  font-size: 16px; line-height: 24px; text-align: start; color: ${MUTED};
  padding-inline-start: 20px; box-shadow: inset 2px 0 0 0 ${LINE};
}
.ar-rt strong { font-weight: 700; }
.ar-rt em { font-style: italic; }
.ar-rt code {
  font-family: var(--font-code); font-size: 0.875em;
  color: ${BRIGHT};
}
.ar-rt a {
  color: inherit; text-decoration: underline;
  transition: color 0.15s cubic-bezier(0.12, 0.23, 0.5, 1);
}
.ar-rt a:hover { color: ${BRIGHT}; }
`;
