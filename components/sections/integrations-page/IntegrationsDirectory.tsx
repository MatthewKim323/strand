"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, INTEGRATIONS, PAGE_SIZE, type IntegrationItem } from "./data";

/* ------------------------------------------------------------------ colours
   Copied verbatim from the design spec so every value resolves through the
   shared token sheet with no translation. */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const HAIRLINE_2 = "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(64, 64, 64))";
const SURFACE = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const GROUND = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";
const GROUND_2 = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const INK = "var(--token-35e0c09c-bfbb-4fb7-9f38-c4d8879499d6, rgb(23, 23, 23))";
const CHIP_ON = "var(--token-ba35e0ab-850d-49cf-be59-934f032ab5a0, rgb(245, 245, 245))";
const CORNER = "var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(38, 38, 38))";
const SPECK = "var(--token-57c56f68-f082-419e-90db-9531e03d4b87, rgb(161, 161, 161))";

/** The listing's one house transition, taken from the design's own constant. */
const SWAP = "0.1s cubic-bezier(0.12, 0.23, 0.5, 1)";

const SEARCH_MASK =
  "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22><path d=%22M7 2.5a5 5 0 0 1 4.13 7.82l2.03 2.03a.75.75 0 0 1-1.06 1.06l-2-2A5 5 0 1 1 7 2.5Zm-3.5 5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z%22 fill=%22%23999%22/></svg>')";

/** The 12x12 speckle the tiles fade in behind themselves on hover. */
const SPECKLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Crect x='6' y='6' width='2' height='2' fill='%231c1917'/%3E%3C/svg%3E\")";

const CSS = `
/* ------------------------------------------------------------------- hero */
.ip-hero, .ip-cats, .ip-int {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.ip-hero-frame {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${HAIRLINE}, inset -1px 0 0 0 ${HAIRLINE};
}
.ip-hero-content {
  position: relative; display: flex; flex: 0.7 0 0; width: 1px;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center;
  align-items: flex-start; gap: 40px; height: min-content; padding: 60px 40px; overflow: clip;
}
.ip-hero-titles {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 20px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ip-hero-line {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ip-hero-search { position: relative; flex: none; width: 320px; height: auto; }

/* ------------------------------------------------------------- search field */
.ip-search {
  position: relative; display: flex; align-items: center;
  width: 100%; height: 40px; padding: 12px; border-radius: 12px;
  background: ${GROUND_2}; overflow: hidden;
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
  transition: box-shadow ${SWAP};
}
.ip-search:focus-within { box-shadow: inset 0 0 0 1px ${HAIRLINE_2}; }
.ip-search-glyph {
  display: block; flex-shrink: 0; width: 16px; height: 16px; margin-right: 8px;
  background-color: rgb(153, 153, 153);
  -webkit-mask-image: ${SEARCH_MASK}; mask-image: ${SEARCH_MASK};
  -webkit-mask-size: 16px; mask-size: 16px;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: 50%; mask-position: 50%;
}
.ip-search input {
  flex: 1; width: auto; min-width: 0; height: 100%; padding: 0;
  background: none; border: none; outline: none;
  font-family: var(--font-body); font-weight: 500; font-size: 14px;
  line-height: 20px; letter-spacing: 0em; color: ${BRIGHT};
  text-overflow: ellipsis; white-space: nowrap; overflow: hidden;
}
.ip-search input::placeholder { color: ${DIM}; }

/* ------------------------------------------------------------- category row */
.ip-cats-frame {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${HAIRLINE}, inset -1px 0 0 0 ${HAIRLINE},
              inset 0 -1px 0 0 ${HAIRLINE};
}
.ip-cats-scroll {
  position: relative; display: flex; flex: 1 0 0; width: 1px;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start;
  align-items: center; gap: 16px; height: min-content; padding: 20px 40px; overflow: clip;
  scrollbar-width: none;
}
.ip-cats-scroll::-webkit-scrollbar { width: 0; height: 0; }
.ip-cats-list {
  position: relative; display: flex; flex: 1 0 0; width: 1px;
  flex-flow: row wrap; align-content: center; justify-content: flex-start;
  align-items: center; gap: 8px; height: min-content; padding: 0;
}
.ip-chip {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 8px 16px;
  border: none; border-radius: 56px; cursor: pointer; background: ${GROUND};
  box-shadow: inset 0 0 0 1px ${HAIRLINE_2};
  transition: background-color ${SWAP}, box-shadow ${SWAP};
}
.ip-chip:hover { background: var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23)); }
.ip-chip[data-on="true"] { background: ${CHIP_ON}; box-shadow: none; }
.ip-chip-label { position: relative; flex: none; width: auto; height: auto; white-space: pre; }

/* ------------------------------------------------------------------- grid */
.ip-int-frame {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0; overflow: clip;
  box-shadow: inset 1px 0 0 0 ${HAIRLINE}, inset -1px 0 0 0 ${HAIRLINE};
}
.ip-grid {
  position: relative; display: grid; flex: none;
  grid-template-columns: repeat(3, minmax(50px, 1fr));
  grid-auto-rows: min-content; justify-content: center;
  gap: 0; width: 100%; height: min-content; padding: 0;
}
.ip-cell { position: relative; z-index: 2; flex: none; place-self: start; width: 100%; height: 324px; }

/* ------------------------------------------------------------------- tile */
.ip-tile {
  position: relative; display: flex; flex-flow: column nowrap;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 28px; width: 100%; height: 100%; padding: 40px;
  text-decoration: none; cursor: pointer; background-color: rgba(0, 0, 0, 0);
  transition: background-color ${SWAP};
}
.ip-tile-speckle {
  position: absolute; inset: 0; flex: none; opacity: 0; pointer-events: none;
  background-image: ${SPECKLE}; background-repeat: repeat;
  transition: opacity ${SWAP};
}
.ip-logo {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 64px; height: auto; aspect-ratio: 1; padding: 0;
  border-radius: 8px; background-color: ${SURFACE};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px, inset 0 0 0 1px ${HAIRLINE};
}
.ip-logo img {
  position: relative; display: block; flex: none;
  width: 32px; height: auto; aspect-ratio: 1;
  -webkit-user-select: none; user-select: none;
}
.ip-info {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ip-primary {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ip-namerow {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0;
  transition: gap ${SWAP};
}
.ip-name { position: relative; flex: 1 0 0; width: 1px; height: auto; }
.ip-types {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.ip-types > * { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.ip-desc {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
.ip-edge-r { position: absolute; z-index: 1; flex: none; top: 0; bottom: 0; right: 0; width: 1px; background-color: ${HAIRLINE}; }
.ip-edge-b { position: absolute; z-index: 1; flex: none; left: 0; right: 0; bottom: 0; height: 1px; background-color: ${HAIRLINE}; }

/* hover corner ticks */
.ip-tick { position: absolute; z-index: 1; flex: none; width: 6px; height: auto; aspect-ratio: 1; opacity: 0; transition: opacity ${SWAP}; }
.ip-tick > i { display: block; width: 100%; height: 100%; overflow: clip; }
.ip-tick-tr { top: 2px; right: 2px; }
.ip-tick-tr > i { box-shadow: inset -1px 1px 0 0 ${CORNER}; }
.ip-tick-tl { top: 2px; left: 2px; }
.ip-tick-tl > i { box-shadow: inset 1px 1px 0 0 ${CORNER}; }
.ip-tick-bl { bottom: 2px; left: 2px; }
.ip-tick-bl > i { box-shadow: inset 1px -1px 0 0 ${CORNER}; }
.ip-tick-br { bottom: 2px; right: 2px; }
.ip-tick-br > i { box-shadow: inset -1px -1px 0 0 ${CORNER}; }

/* the six-speck arrow that slides out of the name on hover */
.ip-arrow-slot { position: relative; flex: none; width: 0; height: auto; opacity: 0; transition: width ${SWAP}, opacity ${SWAP}; }
.ip-arrow { position: relative; display: block; width: 100%; height: 16px; overflow: visible;
  -webkit-mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%);
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 100%); }
.ip-arrow span {
  position: absolute; flex: none; width: 2px; height: 2px; overflow: clip;
  border-radius: 36px; background-color: ${SPECK};
  transition: left ${SWAP}, right ${SWAP}, opacity ${SWAP};
}
.ip-sp-1 { top: 4px;  left: -10px; opacity: 0; }
.ip-sp-2 { top: 10px; left: -10px; opacity: 0; }
.ip-sp-3 { top: 7px;  left: -7px;  opacity: 0; }
.ip-sp-4 { top: 4px;  left: 6px; }
.ip-sp-5 { top: 10px; left: 6px; }
.ip-sp-6 { top: 7px;  left: 9px; }

/* --------------------------------------------------------------- load more */
.ip-more-cell { position: relative; flex: none; grid-column: span 3; place-self: start; width: 100%; height: 100px; }
.ip-more {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 10px; width: 100%; height: 100%; padding: 0;
  border: none; cursor: pointer; background-color: ${GROUND};
}
.ip-more:hover { background-color: ${GROUND_2}; }
.ip-more-label {
  position: relative; flex: none; width: auto; height: auto; white-space: pre;
  font-family: var(--font-code); font-weight: 500; font-size: 14px; line-height: 20px;
  -webkit-user-select: none; user-select: none;
}

/* ------------------------------------------------------------ hover states
   The design enables the hover variant on the desktop tile only. */
@media (min-width: 1200px) and (hover: hover) {
  .ip-tile:hover { background-color: ${GROUND_2}; }
  .ip-tile:hover .ip-tile-speckle { opacity: 1; }
  .ip-tile:hover .ip-tick { opacity: 1; }
  .ip-tile:hover .ip-namerow { gap: 4px; }
  .ip-tile:hover .ip-arrow-slot { width: 16px; opacity: 1; }
  .ip-tile:hover .ip-sp-1, .ip-tile:hover .ip-sp-2 { left: 6px; opacity: 1; }
  .ip-tile:hover .ip-sp-3 { left: 9px; opacity: 1; }
  .ip-tile:hover .ip-sp-4 { left: auto; right: -8px; }
  .ip-tile:hover .ip-sp-5 { left: 22px; }
  .ip-tile:hover .ip-sp-6 { left: 25px; }
}

/* ---------------------------------------------------------- <= 1199.98px */
@media (max-width: 1199.98px) {
  .ip-hero, .ip-cats, .ip-int { padding: 0; }
  .ip-hero-frame, .ip-int-frame { box-shadow: none; }
  .ip-hero-content { flex: 1 0 0; padding: 40px 40px 20px; }
  .ip-cats-frame { box-shadow: inset 0 -1px 0 0 ${HAIRLINE}; }
  .ip-cats-scroll { overflow: auto; }
  .ip-cats-list { flex-wrap: nowrap; flex: none; width: min-content; }
  .ip-grid { grid-template-columns: repeat(2, minmax(50px, 1fr)); }
  .ip-cell { height: 300px; }
  .ip-more-cell { grid-column: span 2; }
}

/* ----------------------------------------------------------- <= 809.98px */
@media (max-width: 809.98px) {
  .ip-hero-frame { flex-direction: column; }
  .ip-hero-content { flex: none; width: 100%; padding: 40px 20px 20px; }
  .ip-hero-titles { order: 0; }
  .ip-hero-search { order: 1; width: 100%; }
  .ip-cats-scroll { padding: 20px; overflow: auto; }
  .ip-grid { grid-template-columns: repeat(1, minmax(50px, 1fr)); }
  .ip-cell { height: 260px; }
  .ip-more-cell { grid-column: span 1; }
  .ip-tile { padding: 20px; }
}
`;

function Tile({ item }: { item: IntegrationItem }) {
  return (
    <a className="ip-tile" href={`/integrations/${item.slug}`}>
      <span className="ip-tile-speckle" aria-hidden />

      <div className="ip-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.logo} alt="" aria-hidden />
      </div>

      <div className="ip-info">
        <div className="ip-primary">
          <div className="ip-namerow">
            <span className="ip-arrow-slot" aria-hidden>
              <span className="ip-arrow">
                <span className="ip-sp-1" />
                <span className="ip-sp-2" />
                <span className="ip-sp-3" />
                <span className="ip-sp-4" />
                <span className="ip-sp-5" />
                <span className="ip-sp-6" />
              </span>
            </span>
            <div className="ip-name">
              <h3 className="t-h3" style={{ color: BRIGHT }}>
                {item.name}
              </h3>
            </div>
          </div>
          <div className="ip-types">
            <p className="t-mono" style={{ color: DIM }}>
              {item.type}
            </p>
            <p className="t-mono" style={{ color: DIM }}>
              ·
            </p>
            <p className="t-mono" style={{ color: DIM }}>
              {item.auth}
            </p>
          </div>
        </div>
        <div className="ip-desc">
          <p className="t-body" style={{ color: MUTED }}>
            {item.description}
          </p>
        </div>
      </div>

      <span className="ip-edge-r" aria-hidden />
      <span className="ip-edge-b" aria-hidden />
      <span className="ip-tick ip-tick-tr" aria-hidden>
        <i />
      </span>
      <span className="ip-tick ip-tick-tl" aria-hidden>
        <i />
      </span>
      <span className="ip-tick ip-tick-bl" aria-hidden>
        <i />
      </span>
      <span className="ip-tick ip-tick-br" aria-hidden>
        <i />
      </span>
    </a>
  );
}

/**
 * The whole directory route: the short hero with its search field, the
 * category filter row, and the paged tile grid. The three blocks share one
 * piece of state (query + category + page count) so they live in one client
 * component; `only` renders a single block for isolated measurement.
 */
export function IntegrationsDirectory({ only }: { only?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [pages, setPages] = useState(1);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const shown = matches.slice(0, pages * PAGE_SIZE);
  const hasMore = shown.length < matches.length;

  const hero = (
    <div className="ip-hero" data-section="Hero">
      <div className="ip-hero-frame">
        <div className="ip-hero-content">
          <div className="ip-hero-titles">
            <div className="ip-hero-line">
              <h1 className="t-d1" style={{ color: MUTED }}>
                <span style={{ color: BRIGHT }}>
                  240+ integrations.
                  <br />
                </span>
                One connection point.
              </h1>
            </div>
            <div className="ip-hero-line">
              <p className="t-body" style={{ color: MUTED }}>
                Pulse learns what normal looks like for your business and only fires when
                something genuinely deviates. No more alert fatigue.
              </p>
            </div>
          </div>

          <label className="ip-hero-search">
            <div className="ip-search">
              <span className="ip-search-glyph" aria-hidden />
              <input
                type="text"
                placeholder="Search integrations..."
                aria-label="Search integrations"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPages(1);
                }}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const cats = (
    <div className="ip-cats" data-section="Categories">
      <div className="ip-cats-frame">
        <div className="ip-cats-scroll">
          <div className="ip-cats-list">
            {CATEGORIES.map((c) => {
              const on = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  className="ip-chip"
                  data-on={on}
                  aria-pressed={on}
                  onClick={() => {
                    setCategory(c);
                    setPages(1);
                  }}
                >
                  <span className="ip-chip-label t-label" style={{ color: on ? INK : BRIGHT }}>
                    {c}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const grid = (
    <div className="ip-int" data-section="Integrations">
      <div className="ip-int-frame">
        <div className="ip-grid">
          {shown.map((item) => (
            <div className="ip-cell" key={item.slug}>
              <Tile item={item} />
            </div>
          ))}
          {hasMore ? (
            <div className="ip-more-cell">
              <button type="button" className="ip-more" onClick={() => setPages((p) => p + 1)}>
                <span className="ip-more-label" style={{ color: MUTED }}>
                  LOAD MORE
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const style = <style>{CSS}</style>;
  if (only === "hero")
    return (
      <>
        {style}
        {hero}
      </>
    );
  if (only === "categories")
    return (
      <>
        {style}
        {cats}
      </>
    );
  if (only === "integrations")
    return (
      <>
        {style}
        {grid}
      </>
    );

  return (
    <>
      {style}
      {hero}
      {cats}
      {grid}
    </>
  );
}
