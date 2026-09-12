/* Every rule for the blog listing, in one scoped sheet. Exact values come from
   the captured spec; nothing here is eyeballed. Class prefix: bl-            */

const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const CORNER = "var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(38, 38, 38))";
const HOVER = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))";
const GROUND = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9))";
const BULLET = "var(--token-b5638a62-26ff-4efc-a9d7-90e970d50095, rgb(87, 83, 78))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(120, 113, 108))";
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";

/* The dot field, drawn as a repeating tile: a square of side `weight` placed at
   (space, space) inside a tile of side 2 * space. The ink is the same value as
   --token-93b991d8-cb67-4763-830d-23defa20a3ea / --token-5206bb0a-1eac-4660-9763-613fdbda3479,
   inlined because a data URI cannot read a custom property. */
const dots = (space: number, weight: number) => {
  const tile = space * 2;
  return (
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${tile}' height='${tile}'%3E` +
    `%3Crect x='${space}' y='${space}' width='${weight}' height='${weight}' fill='%231c1917'/%3E%3C/svg%3E")`
  );
};

/* The card's own gesture transition, read off the component's transition
   constant: 100ms, ease [0.44, 0, 0.56, 1]. */
const GEST = "0.1s cubic-bezier(0.44, 0, 0.56, 1)";

export const BLOG_CSS = `
/* ------------------------------------------------------------------ bands */
.bl-band {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.bl-band-gap { gap: 16px; }
.bl-band-flush { gap: 0; }
@media (max-width: 1199.98px) { .bl-band { padding: 0; } }

/* a heading band's inner frame: hairline down both sides and along the foot */
.bl-head {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; max-width: 1400px; height: min-content;
  padding: 40px; overflow: clip;
}
@media (max-width: 809.98px) {
  .bl-head-title {
    flex-direction: column; align-content: flex-start; align-items: flex-start;
    padding: 20px;
  }
}
@media (max-width: 1199.98px) {
  .bl-head-latest {
    flex-direction: column; align-content: flex-start; align-items: flex-start;
  }
}
@media (max-width: 809.98px) { .bl-head-latest { padding: 40px 20px; } }

.bl-fill {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
}
@media (max-width: 809.98px) { .bl-fill-title { flex: none; width: 100%; } }
@media (max-width: 1199.98px) { .bl-fill-latest { flex: none; width: 100%; } }

/* ------------------------------------------------------------------- type */
.bl-h1 {
  font-family: var(--font-body); font-weight: 600;
  font-size: 40px; line-height: 40px; letter-spacing: -0.01em; text-align: start;
}
.bl-h2 {
  font-family: var(--font-body); font-weight: 600;
  font-size: 32px; line-height: 34px; letter-spacing: -0.01em; text-align: start;
}
.bl-h3-large {
  font-family: var(--font-body); font-weight: 600;
  font-size: 24px; line-height: 28px; letter-spacing: -0.005em; text-align: start;
}
@media (max-width: 1199.98px) {
  .bl-h1 { font-size: 32px; line-height: 34px; }
  .bl-h2 { font-size: 28px; line-height: 30px; }
}
.bl-bright { color: ${BRIGHT}; }
.bl-muted  { color: ${MUTED}; }
.bl-dim    { color: ${DIM}; }

/* --------------------------------------------------- overlay hairlines --
   Never a real border: an inset overlay, so it cannot add to a box's height. */
.bl-edge {
  position: absolute; inset: 0; pointer-events: none; box-sizing: border-box;
  border-style: solid; border-color: ${LINE}; border-width: 0;
  border-radius: inherit;
}
.bl-edge-all    { border-width: 1px; }
.bl-edge-frame  { border-width: 0 1px 1px 1px; }
@media (max-width: 1199.98px) { .bl-edge-frame { border-width: 0 0 1px 0; } }

/* ------------------------------------------------------------------ grids */
.bl-grid {
  position: relative; display: grid; grid-auto-rows: min-content;
  justify-content: center; gap: 0; width: 100%; max-width: 1400px;
  height: min-content; padding: 0;
}
.bl-grid-featured { grid-template-columns: repeat(2, minmax(50px, 1fr)); }
.bl-grid-latest   { grid-template-columns: repeat(3, minmax(50px, 1fr)); }
@media (max-width: 1199.98px) {
  .bl-grid-latest { grid-template-columns: repeat(2, minmax(50px, 1fr)); }
}
@media (max-width: 809.98px) {
  .bl-grid-featured, .bl-grid-latest { grid-template-columns: repeat(1, minmax(50px, 1fr)); }
}
.bl-cell { position: relative; flex: none; place-self: start; width: 100%; height: auto; }
.bl-cell-wide { grid-column: span 3; }
@media (max-width: 1199.98px) { .bl-cell-wide { grid-column: span 2; } }
@media (max-width: 809.98px)  { .bl-cell-wide { grid-column: span 1; } }

/* the Latest Articles grid keeps no foot rule: the tiles carry their own */
.bl-edge-grid { border-width: 0 1px 0 1px; }
@media (max-width: 1199.98px) { .bl-edge-grid { border-width: 0; } }

/* ------------------------------------------------------------------- card */
.bl-card {
  position: relative; display: flex; flex-flow: column nowrap;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 0; width: 100%; height: min-content; padding: 0;
  overflow: clip; cursor: pointer; text-decoration: none;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color ${GEST};
}
.bl-card[data-hover="true"] { background-color: ${HOVER}; }
.bl-card-mini { height: 280px; }
@media (max-width: 809.98px) { .bl-card-mini { height: 192px; } }

.bl-card-dots {
  position: absolute; inset: 0; flex: none; opacity: 0; pointer-events: none;
  background-image: ${dots(6, 2)}; background-repeat: repeat;
  transition: opacity ${GEST};
}
.bl-card[data-hover="true"] .bl-card-dots { opacity: 1; }

.bl-graphic {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 40px; overflow: clip;
}
@media (max-width: 809.98px) { .bl-graphic { padding: 20px; } }
.bl-graphic-frame {
  position: relative; flex: none; width: 100%; height: auto;
  aspect-ratio: 1.1953727506426735 / 1; overflow: clip;
  pointer-events: none; -webkit-user-select: none; user-select: none;
}
@media (max-width: 1199.98px) { .bl-graphic-frame { aspect-ratio: 1.3210227272727273 / 1; } }
@media (max-width: 809.98px)  { .bl-graphic-frame { aspect-ratio: 1.3835616438356164 / 1; } }
.bl-graphic-frame img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; border-radius: inherit;
}

.bl-content {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 32px; width: 100%; height: min-content; padding: 20px 40px 40px;
  overflow: visible;
}
@media (max-width: 1199.98px) { .bl-content-large { height: 296px; } }
@media (max-width: 809.98px)  { .bl-content-large { height: 261px; padding: 20px 20px 32px; } }
.bl-content-mini {
  flex: 1 0 0; height: 1px; gap: 0; justify-content: space-between; padding: 40px;
}
@media (max-width: 809.98px) { .bl-content-mini { padding: 20px; } }

.bl-cmm {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 32px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.bl-cmm-mini { justify-content: flex-end; gap: 20px; }
@media (max-width: 809.98px) { .bl-cmm-large { flex: 1 0 0; gap: 0; height: 1px; } }

.bl-row {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
@media (max-width: 809.98px) { .bl-meta-large { padding: 0 0 20px; } }

.bl-nowrap { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.bl-dot {
  position: relative; flex: none; width: 3px; height: 3px;
  border-radius: 100%; background-color: ${BULLET};
}

.bl-body {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 12px; width: 100%; height: min-content; min-height: 128px;
  padding: 0; overflow: visible;
}

.bl-clamp {
  position: relative; flex: none; width: 100%; height: auto;
  display: -webkit-box; -webkit-box-orient: vertical; overflow: clip;
  white-space: pre-line; word-break: break-word; overflow-wrap: break-word;
}
.bl-clamp-2 { -webkit-line-clamp: 2; line-clamp: 2; }
.bl-clamp-3 { -webkit-line-clamp: 3; line-clamp: 3; }

.bl-avatar {
  position: relative; flex: none; width: 20px; height: auto;
  aspect-ratio: 1 / 1; border-radius: 68px; overflow: hidden;
}
.bl-avatar img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; border-radius: inherit;
}

.bl-corner {
  position: absolute; z-index: 2; width: 6px; height: 6px; opacity: 0;
  box-sizing: border-box; border-style: solid; border-color: ${CORNER};
  pointer-events: none; transition: opacity ${GEST};
}
.bl-card[data-hover="true"] .bl-corner { opacity: 1; }
.bl-corner-tl { top: 2px; left: 2px; border-width: 1px 0 0 1px; }
.bl-corner-tr { top: 2px; right: 2px; border-width: 1px 1px 0 0; }
.bl-corner-bl { bottom: 2px; left: 2px; border-width: 0 0 1px 1px; }
.bl-corner-br { bottom: 2px; right: 2px; border-width: 0 1px 1px 0; }

.bl-card-rb {
  position: absolute; z-index: 1; top: 0; bottom: 0; right: 0;
  width: 1px; background-color: ${LINE};
}
.bl-card-bb {
  position: absolute; z-index: 1; left: 0; right: 0; bottom: 0;
  height: 1px; background-color: ${LINE};
}
/* the tile column rules follow the grid: every tile at 3 up, the left-hand
   tile of each pair at 2 up, none at 1 up */
@media (max-width: 1199.98px) {
  .bl-grid-latest > .bl-cell:nth-child(even) .bl-card-rb { display: none; }
}
@media (max-width: 809.98px) {
  .bl-grid-latest .bl-card-rb, .bl-grid-featured .bl-card-rb { display: none; }
  .bl-cell-phone-hide { display: none; }
}

/* ---------------------------------------------------------------- divider */
.bl-divider-box {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content;
  padding: 0; overflow: clip;
}
@media (max-width: 809.98px) {
  .bl-divider-box {
    flex-direction: column; align-content: flex-start; align-items: flex-start;
  }
}
.bl-divider-fill {
  position: relative; flex: 1 0 0; width: 1px; height: 80px;
  background-image: ${dots(4, 1.5)}; background-repeat: repeat;
}
@media (max-width: 809.98px) { .bl-divider-fill { flex: none; width: 100%; } }

/* -------------------------------------------------------------- load more */
.bl-more {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 10px; width: 100%; height: 80px; padding: 0; cursor: pointer;
  background-color: ${GROUND};
}
.bl-more[data-hover="true"] { background-color: ${HOVER}; }
.bl-more-label {
  position: relative; flex: none; width: auto; height: auto; white-space: pre;
  -webkit-user-select: none; user-select: none;
  font-family: var(--font-code); font-weight: 500;
  font-size: 14px; line-height: 20px; text-align: start; color: ${MUTED};
}

/* --------------------------------------------------------------- footer -- */
.bl-footer {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: visible;
  box-shadow: inset 0 1px 0 0 ${LINE};
}
`;
