/**
 * Article bodies, transcribed from the capture of each article page.
 *
 * Nothing in this file is written by hand: every run of copy is the text node
 * as it appears in the captured DOM, punctuation and typographic apostrophes
 * included. An article with no capture gets no body rather than an invented
 * one; `BODIES[slug]` is simply absent and the route renders the header alone.
 *
 * Generated from the captures, then read through against them.
 */

/** A run of text inside a block. A bare string is an unstyled run. */
export type Run =
  | string
  | {
      text: string;
      /** `<strong>` */
      bold?: true;
      /** `<em>` */
      italic?: true;
      /** `<code>` */
      code?: true;
      /** `<a href>` */
      href?: string;
    };

/** One top level element of the rich text. */
export type Block =
  | { kind: "p" | "h2" | "h3" | "h4" | "blockquote"; runs: Run[] }
  | { kind: "ul" | "ol"; items: Run[][] };

export type Body = {
  /** The `datetime` attribute the reference puts on the posted date. */
  isoDate: string;
  /**
   * The hero graphic, when the collection entry carries none. The listing only
   * renders a graphic for the two featured entries, so the rest of the wide
   * images only show up on the detail pages and are recorded here.
   */
  graphic?: string;
  /** Alt text, verbatim from the capture. */
  graphicAlt?: string;
  avatarAlt?: string;
  blocks: Block[];
};

export const BODIES: Record<string, Body> = {
  "introducing-ask-query-your-entire-stack-in-plain-language": {
    isoDate: "2025-02-03T00:00:00.000Z",
    graphicAlt: "Ask product logo",
    avatarAlt: "Headshot of Ravi Menon, office background.",
    blocks: [
      { kind: "p", runs: [
        "Most data tools assume you know SQL, or at least know which tool to open. Ask assumes neither. It takes a plain language question, understands the intent behind it, and translates it into a precise query across every connected source in your graph. The result comes back in seconds, formatted for reading, and shareable with your team in one click. We built it for the people who need answers but should not have to become data engineers to get them.",
      ] },
      { kind: "h3", runs: [
        "Handling ambiguity",
      ] },
      { kind: "p", runs: [
        "The part we spent the most time on is ambiguity handling. Natural language is full of relative references, implied filters, and time ranges that are obvious to a human but genuinely hard to resolve programmatically. When someone asks which accounts are at risk, Ask needs to know what at risk means in the context of that company\u2019s data. It pulls from schema context, historical query patterns, and the structure of the knowledge graph to resolve those gaps before returning a result. When it is not confident, it surfaces the assumption it made so the user can correct it.",
      ] },
      { kind: "h3", runs: [
        "What is available today",
      ] },
      { kind: "p", runs: [
        "Ask is available on Pro and Enterprise plans today. The initial release supports queries across all connected sources, exportable results in CSV and JSON, and direct sharing to Slack. Follow-up question suggestions and saved query libraries are coming in the next release cycle.",
      ] },
    ],
  },
  "why-we-built-cortex-as-a-graph-not-a-warehouse": {
    isoDate: "2025-01-14T00:00:00.000Z",
    graphic: "/img/img-e1f74ade02.png",
    graphicAlt: "Cortex product logo",
    avatarAlt: "Headshot of Daniel Reyes, office background.",
    blocks: [
      { kind: "p", runs: [
        "Relational databases are great at answering the questions you already know how to ask. The problem is that real business data is messier than rows and columns. A customer is connected to an account, a subscription tier, a support history, a usage pattern, and a sales rep. None of those relationships sit cleanly in a table, and forcing them to creates a model that breaks the moment someone asks a question that crosses more than two of those boundaries.",
      ] },
      { kind: "h3", runs: [
        "Why we chose a graph",
      ] },
      { kind: "p", runs: [
        "When we started designing Cortex, we made the deliberate choice to model data as a graph from day one. That meant giving up some of the familiarity and tooling that comes with relational systems. Query planners, ORM support, and a decades-deep ecosystem of adjacent tooling are all easier to reach for in a relational world. Building on a graph required us to make more decisions ourselves, earlier, with less prior art to lean on.",
      ] },
      { kind: "h3", runs: [
        "What it unlocks",
      ] },
      { kind: "p", runs: [
        "Every query that runs on top of Cortex can traverse relationships that were never explicitly defined by the person asking the question. A natural language query about churn risk can pull in support ticket frequency, login patterns, billing changes, and account age without any of those connections being pre-joined or pre-modeled. The graph finds them. That is the core bet we made, and two years in, it is the reason Ask works the way it does.",
      ] },
    ],
  },
  "the-hidden-cost-of-data-fragmentation": {
    isoDate: "2025-02-19T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Daniel Reyes, office background.",
    blocks: [
      { kind: "p", runs: [
        "We surveyed 500 operations leaders across B2B SaaS companies earlier this year. The number that stood out was not about tools or budgets. It was time. The average team spends 4.2 hours per week per person just locating data before any analysis begins. That is not analysis time, not reporting time, and not the time spent building dashboards. That is the time spent figuring out which tool has the number and how to get it out.",
      ] },
      { kind: "h3", runs: [
        "The invisible cost",
      ] },
      { kind: "p", runs: [
        "Multiply that across a team of ten and you have a full-time headcount devoted entirely to data wrangling. For most companies we spoke with, that cost is invisible because it is distributed across every person on the team in small, daily increments. No single person spends a full day doing it, so it never gets flagged as a problem. But it compounds fast, and it shows up in slower decisions, missed signals, and analyst burnout.",
      ] },
      { kind: "h3", runs: [
        "The structural cause",
      ] },
      { kind: "p", runs: [
        "The root cause is almost always the same: metrics are defined and stored differently across tools, with no shared layer connecting them. Revenue lives in Stripe. Usage lives in Mixpanel. Account health lives in Salesforce. When a question touches all three, someone has to do the joining manually. A connected data layer does not eliminate the tools. It eliminates the manual work between them.",
      ] },
    ],
  },
  "pulse-anomaly-detection-that-respects-your-attention": {
    isoDate: "2025-03-07T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Claire Fontaine, office background.",
    blocks: [
      { kind: "p", runs: [
        "Alerting tools fail in one consistent direction: too much noise. Most systems treat every deviation as signal, which means teams learn to ignore alerts within weeks of turning them on. A 3% drop in daily active users on a Sunday morning is not the same as a 3% drop on the first day of your biggest marketing campaign. Pulse was designed around that distinction. It builds an adaptive baseline for each metric using your business\u2019s own historical patterns, and accounts for day-of-week, seasonal, and growth-curve variation before deciding whether something is worth your attention.",
      ] },
      { kind: "h3", runs: [
        "How severity scoring works",
      ] },
      { kind: "p", runs: [
        "Severity scoring adds a second layer of filtering. When Pulse does fire, it attaches a severity score based on how far outside the baseline the deviation sits, how long it has persisted, and whether correlated metrics are also moving. A single metric dipping briefly scores low. Multiple related metrics moving together in an unexpected direction scores high. That scoring feeds directly into routing logic, so a low-severity alert goes to a Slack channel and a high-severity alert can page on-call.",
      ] },
      { kind: "h3", runs: [
        "Getting started",
      ] },
      { kind: "p", runs: [
        "Pulse is available on Pro and Enterprise plans. Setup requires no manual threshold configuration. Connect your metrics, let Pulse observe for 72 hours to establish baselines, and it handles the rest. Routing destinations, severity thresholds, and suppression windows can all be adjusted from the Pulse settings panel once baselines are active.",
      ] },
    ],
  },
  "how-vantage-cut-reporting-time-by-80-percent": {
    isoDate: "2025-03-28T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Marcus Webb, office background.",
    blocks: [
      { kind: "h3", runs: [
        "The problem",
      ] },
      { kind: "p", runs: [
        "Vantage\u2019s operations team was maintaining three internal tools and a recurring spreadsheet process to track pipeline health, customer health, and operational metrics. Every Friday, someone spent the better part of an afternoon pulling numbers from Salesforce, Mixpanel, and Stripe to build a report that leadership reviewed on Monday. By Monday, some of those numbers were already out of date. The team knew this was not sustainable, but rebuilding the reporting infrastructure from scratch was not a project anyone had the bandwidth to take on.",
      ] },
      { kind: "h3", runs: [
        "What changed in the first month",
      ] },
      { kind: "p", runs: [
        "When they connected Nordwell, the goal was narrow: eliminate the Friday report. Within the first two weeks, their VP of Operations was answering the same questions directly through Ask, without pulling a single export. By the end of the first month, two of the three internal tools had been retired. The spreadsheet was gone. What had taken four hours on a Friday now took under a minute on any day of the week.",
      ] },
      { kind: "h3", runs: [
        "The questions they never thought to ask",
      ] },
      { kind: "p", runs: [
        "The outcome that surprised them most was not the time saved. It was the questions they started asking that they had never been able to ask before. Which enterprise accounts had both a support ticket spike and a usage drop in the same 30-day window? Which cohort of customers expanded fastest after onboarding? Those questions had always been too expensive to answer manually. With the knowledge graph in place, they became routine.",
      ] },
    ],
  },
  "building-reliable-data-pipelines-at-scale": {
    isoDate: "2025-04-11T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Jordan Osei, office background.",
    blocks: [
      { kind: "p", runs: [
        "Pathways handles over 240 integrations, and each one comes with its own API quirks, rate limits, authentication edge cases, and failure modes. Making that reliable at scale means you cannot treat every integration as a special case. You need a sync architecture that handles the common failure patterns generically, and a layer on top that lets you configure integration-specific behavior without forking the core logic. That is the architecture we settled on after about six months of production learnings.",
      ] },
      { kind: "h3", runs: [
        "Getting retry logic right",
      ] },
      { kind: "p", runs: [
        "Retry logic is where most pipeline systems get into trouble. Naive retry on failure creates duplicate data when the original request succeeded but the acknowledgment failed. Pathways uses idempotency keys scoped to each sync event, so retries are safe to run without checking for duplicates downstream. Conflict resolution is configurable per integration: last-write-wins is the default, but teams with strict data integrity requirements can define field-level rules that control which source wins when two systems disagree on the same value.",
      ] },
      { kind: "h3", runs: [
        "Full pipeline observability",
      ] },
      { kind: "p", runs: [
        "Full pipeline observability was something we added later than we should have. Every sync event now generates a structured log entry that captures source, destination, record count, duration, conflict count, and retry count. Those logs are queryable through the Nordwell interface and exportable for teams that want to pipe them into their own monitoring stack. If a pipeline fails or slows down, you can see exactly where it happened and why, without digging through API logs on the source side.",
      ] },
    ],
  },
  "from-spreadsheets-to-a-living-graph-meridian-s-first-90-days": {
    isoDate: "2025-05-05T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Zara Mitchell, office background.",
    blocks: [
      { kind: "p", runs: [
        "Meridian\u2019s data team was maintaining 14 spreadsheets to track pipeline health, customer health, and operational metrics. The spreadsheets were not a legacy problem. They were the current solution, actively updated by three people across the ops and finance teams. Every Monday, someone spent close to three hours pulling numbers from four different tools to produce a report that leadership reviewed that afternoon. The team had talked about fixing it for over a year. The problem was that fixing it meant rebuilding something that was, technically, still working.",
      ] },
      { kind: "h3", runs: [
        "The first 30 days",
      ] },
      { kind: "p", runs: [
        "In their first 30 days with Nordwell, the focus was connection and validation. They brought in Salesforce, Stripe, Mixpanel, and their internal PostgreSQL database. Cortex mapped the relationships automatically, and the team spent time verifying that the numbers coming out of Ask matched what they had been calculating manually. In most cases they did. In a few cases they did not, and tracing those discrepancies revealed two metric definitions that had drifted between tools without anyone noticing.",
      ] },
      { kind: "h3", runs: [
        "Day 90 and beyond",
      ] },
      { kind: "p", runs: [
        "By day 90, ten of the 14 spreadsheets had been retired. The Monday report was replaced by a shared Ask query that any team member could run themselves. The three hours of weekly prep time had dropped to under 20 minutes of occasional spot-checking. The bigger shift was cultural: the ops team stopped being the bottleneck for data questions and started being the team that built the queries other people used.",
      ] },
    ],
  },
  "a-practical-guide-to-auditing-your-data-stack": {
    isoDate: "2025-05-22T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Claire Fontaine, office background.",
    blocks: [
      { kind: "p", runs: [
        "Most teams do not have a clear picture of how many tools they are actively using until someone checks the credit card statement. Shadow subscriptions, tools adopted by one team and forgotten by another, and integrations set up for a project that ended six months ago all accumulate quietly. Before connecting your data to any intelligence layer, it is worth spending half a day doing a proper audit. The goal is not to cut tools for the sake of it. The goal is to know what you have, where your key metrics actually live, and which sources are authoritative for which data.",
      ] },
      { kind: "h3", runs: [
        "Building your inventory",
      ] },
      { kind: "p", runs: [
        "Start by listing every tool that touches customer, revenue, or operational data. For each one, note what data it holds, who owns it, how often it is updated, and whether any other tool holds overlapping data. Pay particular attention to metric definitions. Revenue might be defined differently in your CRM than in your billing system. Active users might mean different things in your product analytics tool and your support platform. Those discrepancies are normal, but you need to know they exist before you start querying across sources.",
      ] },
      { kind: "h3", runs: [
        "What to look for",
      ] },
      { kind: "p", runs: [
        "Once you have the inventory, look for two things: redundancy and gaps. Redundancy means two tools holding the same data with no clear rule for which one to trust. Gaps mean a question your team regularly asks that no single tool can answer on its own. Both are useful inputs for deciding which sources to connect first and how to configure field mapping when you do. Most teams find at least two redundancies they did not know existed. Some find significantly more.",
      ] },
    ],
  },
  "five-questions-every-ops-team-should-answer-in-under-a-minute": {
    isoDate: "2025-06-09T00:00:00.000Z",
    graphic: "/img/img-81ac14557e.png",
    graphicAlt: "Company logo",
    avatarAlt: "Headshot of Kevin Liang, office background.",
    blocks: [
      { kind: "p", runs: [
        "There is a short list of questions that every operations team gets asked regularly and that should, in theory, be easy to answer. Which accounts show signs of churn risk right now. Where did revenue growth come from last quarter and which segment drove it. Which support issues correlate most strongly with early cancellations. These are not complicated analytical questions. They do not require custom models or data science expertise. They require connecting a few sources and running a straightforward query. For most teams, they take hours anyway.",
      ] },
      { kind: "h3", runs: [
        "Why they take so long",
      ] },
      { kind: "p", runs: [
        "The reason is structural. Each of those questions touches data that lives in at least two tools, often three. Churn risk requires product usage data, support ticket history, and billing status. Revenue attribution requires CRM data, marketing data, and billing data. Correlating support issues with cancellations requires support data and subscription data joined on a customer identifier that may not match between systems. Without a shared data layer, answering any one of those questions means exporting, cleaning, and joining data manually every time someone asks.",
      ] },
      { kind: "h3", runs: [
        "Using them as a benchmark",
      ] },
      { kind: "p", runs: [
        "The five questions in this guide are ones we heard repeatedly from ops leaders when we were building Nordwell. We use them as a benchmark internally: if a team can answer all five in under a minute after connecting their core sources, the integration is working. If any one of them takes longer, it usually points to a gap in source coverage or a metric definition that needs to be aligned between tools. Use them as a starting point for evaluating the state of your own data stack.",
      ] },
    ],
  },
};
