/**
 * The article collection behind the listing.
 *
 * Nine entries. The first six are what the listing renders on load (the
 * collection view asks for a page of six); the last three arrive when the
 * reader presses LOAD MORE, exactly as the reference paginates.
 *
 * `featured` marks the entries the Featured Articles band draws from: it takes
 * the first two at >= 810 and only the first one on a phone.
 */
export type Article = {
  slug: string;
  date: string;
  category: string;
  title: string;
  /** Shown by the large card only. The mini card never renders it. */
  description: string;
  author: string;
  /** Author portrait, 1:1. */
  avatar: string;
  /** Wide graphic, shown by the large card only. */
  graphic?: string;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    slug: "introducing-ask-query-your-entire-stack-in-plain-language",
    date: "Feb 3",
    category: "Product",
    title: "Introducing Ask: Query your entire stack in plain language",
    description:
      "Ask lets you query every connected data source using plain language. No SQL, no dashboards, just answers. Here is how it works and what comes next.",
    author: "Ravi Menon",
    avatar: "/img/img-2d2df2f87d.png",
    graphic: "/img/img-78622447d7.png",
    featured: true,
  },
  {
    slug: "why-we-built-cortex-as-a-graph-not-a-warehouse",
    date: "Jan 14",
    category: "Engineering",
    title: "Why we built cortex as a graph, not a warehouse",
    description:
      "Relational databases are great at answering the questions you already know how to ask. Here is why we chose to model data as a graph from day one, what we gave up, and what it unlocks.",
    author: "Daniel Reyes",
    avatar: "/img/img-de26d567ca.png",
    graphic: "/img/img-e1f74ade02.png",
    featured: true,
  },
  {
    slug: "the-hidden-cost-of-data-fragmentation",
    date: "Feb 19",
    category: "Guides",
    title: "The hidden cost of data fragmentation",
    // TODO(spec): the listing never renders a description for this entry, so
    // the capture carries none. Left empty rather than invented.
    description: "",
    author: "Daniel Reyes",
    avatar: "/img/img-de26d567ca.png",
  },
  {
    slug: "pulse-anomaly-detection-that-respects-your-attention",
    date: "Mar 7",
    category: "Product",
    title: "Pulse: Anomaly detection that respects your attention",
    description: "",
    author: "Claire Fontaine",
    avatar: "/img/img-aee68dc73f.png",
  },
  {
    slug: "how-vantage-cut-reporting-time-by-80-percent",
    date: "Mar 28",
    category: "Company",
    title: "How vantage cut reporting time by 80 percent",
    description: "",
    author: "Marcus Webb",
    avatar: "/img/img-829145cc50.png",
  },
  {
    slug: "building-reliable-data-pipelines-at-scale",
    date: "Apr 11",
    category: "Engineering",
    title: "Building reliable data pipelines at scale",
    description: "",
    author: "Jordan Osei",
    avatar: "/img/img-b281312059.png",
  },
  {
    slug: "from-spreadsheets-to-a-living-graph-meridian-s-first-90-days",
    date: "May 5",
    category: "Company",
    title: "From spreadsheets to a living graph: Meridian's first 90 Days",
    description: "",
    author: "Zara Mitchell",
    avatar: "/img/img-17bce2f0bf.png",
  },
  {
    slug: "a-practical-guide-to-auditing-your-data-stack",
    date: "May 22",
    category: "Guides",
    title: "A practical guide to auditing your data stack",
    description: "",
    author: "Claire Fontaine",
    avatar: "/img/img-aee68dc73f.png",
  },
  {
    slug: "five-questions-every-ops-team-should-answer-in-under-a-minute",
    date: "Jun 9",
    category: "Guides",
    title: "Five questions every Ops team should answer in under a minute",
    description: "",
    author: "Kevin Liang",
    avatar: "/img/img-0f7330a807.png",
  },
];

/** How many entries one page of the Latest Articles grid holds. */
export const PAGE_SIZE = 6;
