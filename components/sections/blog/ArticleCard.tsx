"use client";

import { useState } from "react";
import type { Article } from "./articles";

/**
 * One article tile.
 *
 * `large` is the tile the Featured Articles band uses: a wide graphic on top,
 * then date, title, description and byline. `mini` is the tile the Latest
 * Articles grid uses: no graphic, no description, a fixed height, byline
 * pinned to the bottom edge.
 *
 * Both share the hover treatment: the ground lifts, a dot field fades in
 * behind the content and four corner ticks appear. It is driven by pointer
 * events rather than `:hover`, which is how the reference arms it: the tile
 * only lights up once the pointer has actually moved onto it.
 */
export function ArticleCard({
  article,
  variant,
  rightBorder = false,
  bottomBorder = false,
}: {
  article: Article;
  variant: "large" | "mini";
  rightBorder?: boolean;
  bottomBorder?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const large = variant === "large";
  return (
    <a
      className={`bl-card ${large ? "bl-card-large" : "bl-card-mini"}`}
      href={`/blog/${article.slug}`}
      data-hover={hover ? "true" : undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <span className="bl-card-dots" aria-hidden="true" />

      {large && article.graphic ? (
        <div className="bl-graphic">
          <div className="bl-graphic-frame">
            <img alt="" src={article.graphic} />
            <span className="bl-edge bl-edge-all" aria-hidden="true" />
          </div>
        </div>
      ) : null}

      <div className={`bl-content ${large ? "bl-content-large" : "bl-content-mini"}`}>
        <div className={`bl-cmm ${large ? "bl-cmm-large" : "bl-cmm-mini"}`}>
          <div className={`bl-row bl-meta ${large ? "bl-meta-large" : ""}`}>
            <div className="bl-nowrap">
              <p className="t-mono bl-muted">{article.date}</p>
            </div>
            <div className="bl-dot" />
            <div className="bl-nowrap">
              <p className="t-mono bl-dim">{article.category}</p>
            </div>
          </div>

          {large ? (
            <div className="bl-body">
              <div className="bl-clamp bl-clamp-2">
                <h3 className="bl-h3-large bl-bright">{article.title}</h3>
              </div>
              <div className="bl-clamp bl-clamp-3">
                <p className="t-sm bl-muted">{article.description}</p>
              </div>
            </div>
          ) : (
            <div className="bl-clamp bl-clamp-2">
              <h3 className="t-h3 bl-bright">{article.title}</h3>
            </div>
          )}
        </div>

        <div className="bl-row bl-by">
          <div className="bl-avatar">
            <img alt="" src={article.avatar} />
          </div>
          <div className="bl-nowrap">
            <p className="t-xs bl-bright">{article.author}</p>
          </div>
        </div>
      </div>

      <span className="bl-corner bl-corner-tr" aria-hidden="true" />
      <span className="bl-corner bl-corner-tl" aria-hidden="true" />
      <span className="bl-corner bl-corner-bl" aria-hidden="true" />
      <span className="bl-corner bl-corner-br" aria-hidden="true" />

      {rightBorder ? <span className="bl-card-rb" aria-hidden="true" /> : null}
      {bottomBorder ? <span className="bl-card-bb" aria-hidden="true" /> : null}
    </a>
  );
}
