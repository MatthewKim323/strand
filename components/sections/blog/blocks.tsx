"use client";

import { useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { ARTICLES, PAGE_SIZE } from "./articles";
import { BLOG_CSS } from "./css";

/** The sheet for every block below. Rendered once by the route. */
export function BlogCss() {
  return <style>{BLOG_CSS}</style>;
}

/* ------------------------------------------------------------------ title */

export function BlogTitle() {
  return (
    <div className="bl-band bl-band-gap">
      <div className="bl-head bl-head-title">
        <div className="bl-fill bl-fill-title">
          <h1 className="bl-h1 bl-bright">Blog</h1>
        </div>
        <span className="bl-edge bl-edge-frame" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------- featured articles */

const FEATURED = ARTICLES.filter((a) => a.featured);

export function FeaturedArticles() {
  return (
    <div className="bl-band bl-band-flush">
      <div className="bl-grid bl-grid-featured bl-featured">
        {FEATURED.map((article, i) => (
          <div
            key={article.slug}
            className={`bl-cell${i > 0 ? " bl-cell-phone-hide" : ""}`}
          >
            <ArticleCard article={article} variant="large" rightBorder={i === 0} />
          </div>
        ))}
        <span className="bl-edge bl-edge-frame" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- divider */

export function BlogDivider() {
  return (
    <div className="bl-band bl-band-gap">
      <div className="bl-divider-box">
        <div className="bl-divider-fill" />
        <span className="bl-edge bl-edge-frame" aria-hidden="true" />
      </div>
    </div>
  );
}

/* --------------------------------------------------------- latest heading */

export function LatestHeading() {
  return (
    <div className="bl-band bl-band-gap">
      <div className="bl-head bl-head-latest">
        <div className="bl-fill bl-fill-latest">
          <h2 className="bl-h2 bl-bright">Latest articles</h2>
        </div>
        <span className="bl-edge bl-edge-frame" aria-hidden="true" />
      </div>
    </div>
  );
}

/* --------------------------------------------------------- latest grid -- */

export function LatestArticles() {
  const [pages, setPages] = useState(1);
  const [hover, setHover] = useState(false);
  const shown = ARTICLES.slice(0, pages * PAGE_SIZE);
  const more = shown.length < ARTICLES.length;

  return (
    <div className="bl-band bl-band-flush">
      <div className="bl-grid bl-grid-latest">
        {shown.map((article) => (
          <div key={article.slug} className="bl-cell">
            <ArticleCard article={article} variant="mini" rightBorder bottomBorder />
          </div>
        ))}
        {more ? (
          <div className="bl-cell bl-cell-wide">
            {/* TODO(spec): the reference swaps in a spinning Loading variant for
                the moment the next page is in flight. The page set is local
                here, so there is no flight to cover. */}
            <button
              className="bl-more"
              type="button"
              data-hover={hover ? "true" : undefined}
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
              onClick={() => setPages((p) => p + 1)}
            >
              <div className="bl-more-label">LOAD MORE</div>
            </button>
          </div>
        ) : null}
        <span className="bl-edge bl-edge-grid" aria-hidden="true" />
      </div>
    </div>
  );
}
