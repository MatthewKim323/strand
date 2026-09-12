import { Fragment } from "react";
import type { Article } from "@/components/sections/blog/articles";
import { ARTICLE_CSS } from "./css";
import { BODIES, type Block, type Run } from "./bodies";

/** The sheet for this block. Rendered once by the route. */
export function ArticleCss() {
  return <style>{ARTICLE_CSS}</style>;
}

/* ------------------------------------------------------------------- dots */

/** The dot field down either side of the column: a 1.5px square per 8px tile. */
function DotRail({ id }: { id: string }) {
  return (
    <div className="ar-rail" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={id}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <rect
              x="4"
              y="4"
              width="1.5"
              height="1.5"
              fill="var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/**
 * The six-dot arrow between the two crumbs, drawn at its rest position.
 *
 * The component ships two variants (the three trailing dots slide across and
 * the three leading ones fade in) on a 0.4s bounce 0.2 spring, staggered by
 * 50ms. Nothing on this route triggers the second variant, so only the rest
 * state is rendered: three dots lit on the right, three parked off to the left
 * at zero opacity.
 */
const ARROW_DOTS = [
  { top: 4, left: -10, on: false },
  { top: 10, left: -10, on: false },
  { top: 7, left: -7, on: false },
  { top: 4, left: 6, on: true },
  { top: 10, left: 6, on: true },
  { top: 7, left: 9, on: true },
];

function DotArrow() {
  return (
    <div className="ar-arrow-slot" aria-hidden="true">
      <div className="ar-arrow">
        {ARROW_DOTS.map((d, i) => (
          <i key={i} style={{ top: d.top, left: d.left, opacity: d.on ? 1 : 0 }} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- rich text */

function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, i) => {
        if (typeof run === "string") return <Fragment key={i}>{run}</Fragment>;
        let node: React.ReactNode = run.text;
        if (run.code) node = <code>{node}</code>;
        if (run.bold) node = <strong>{node}</strong>;
        if (run.italic) node = <em>{node}</em>;
        if (run.href) node = <a href={run.href}>{node}</a>;
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}

function RichBlock({ block }: { block: Block }) {
  if (block.kind === "ul" || block.kind === "ol") {
    const items = block.items.map((runs, i) => (
      <li key={i}>
        <Runs runs={runs} />
      </li>
    ));
    return block.kind === "ul" ? <ul>{items}</ul> : <ol>{items}</ol>;
  }
  const runs = <Runs runs={block.runs} />;
  switch (block.kind) {
    case "h2":
      return <h2 dir="auto">{runs}</h2>;
    case "h3":
      return <h3 dir="auto">{runs}</h3>;
    case "h4":
      return <h4 dir="auto">{runs}</h4>;
    case "blockquote":
      return <blockquote dir="auto">{runs}</blockquote>;
    default:
      return <p dir="auto">{runs}</p>;
  }
}

/* ------------------------------------------------------------------ block */

/**
 * The article detail block: breadcrumbs, then a centred 800px column holding
 * the date and category, the headline, the byline, the hero graphic and the
 * body.
 *
 * Only one article was captured in full, so only that one has a body here. The
 * rest render the header, which is real data off the collection, and stop; no
 * copy is invented to fill the gap.
 */
export function ArticleBlock({ article }: { article: Article }) {
  const body = BODIES[article.slug];

  return (
    <section id="blog" data-section="Blog" className="ar-block">
      <div className="ar-container">
        <span className="ar-edge ar-edge-sides" aria-hidden="true" />
        <DotRail id="ar-dots-lead" />

        <div className="ar-content">
          <span className="ar-edge ar-edge-sides" aria-hidden="true" />

          <div className="ar-crumbs">
            <span className="ar-edge ar-edge-foot" aria-hidden="true" />
            <div className="ar-scroll">
              <div className="ar-trail">
                <div className="ar-crumb">
                  <p className="t-sm ar-muted">
                    <a href="/blog">Blog</a>
                  </p>
                </div>
                <DotArrow />
                <div className="ar-crumb">
                  <p className="t-sm ar-dim">{article.title}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ar-col">
            <div className="ar-head">
              <div className="ar-row">
                <div className="ar-cell">
                  <p className="t-mono ar-muted">
                    <time dateTime={body?.isoDate}>{article.date}</time>
                  </p>
                </div>
                <div className="ar-ellipse" />
                <div className="ar-cell">
                  <p className="t-mono ar-dim">{article.category}</p>
                </div>
              </div>

              <div className="ar-title">
                <h1 className="ar-h1">{article.title}</h1>
              </div>

              <div className="ar-row">
                <div className="ar-avatar">
                  <span>
                    <img src={article.avatar} alt={`Portrait of ${article.author}.`} />
                  </span>
                </div>
                <div className="ar-cell">
                  <p className="t-xs ar-bright">{article.author}</p>
                </div>
              </div>
            </div>

            {article.graphic ? (
              <div className="ar-graphic">
                <div className="ar-graphic-frame">
                  <span className="ar-edge ar-edge-all" aria-hidden="true" />
                  <span>
                    <img src={article.graphic} alt={article.title} />
                  </span>
                </div>
              </div>
            ) : null}

            <div className="ar-body">
              {/* No capture exists for eight of the nine articles, so their
                  bodies are deliberately empty rather than fabricated. */}
              <div className="ar-rt">
                {body?.blocks.map((block, i) => <RichBlock key={i} block={block} />)}
              </div>
            </div>
          </div>
        </div>

        <DotRail id="ar-dots-trail" />
      </div>
    </section>
  );
}
