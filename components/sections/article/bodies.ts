/**
 * Article bodies, transcribed verbatim from the capture of each article page.
 *
 * Nothing in this file is written by hand: every run of copy is the text node
 * as it appears in the captured DOM, punctuation and typographic apostrophes
 * included. An article with no capture gets no body rather than an invented
 * one; `BODIES[slug]` is simply absent and the route renders the header alone.
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
  blocks: Block[];
};

export const BODIES: Record<string, Body> = {
  "introducing-ask-query-your-entire-stack-in-plain-language": {
    isoDate: "2025-02-03T00:00:00.000Z",
    blocks: [
      {
        kind: "p",
        runs: [
          "Most data tools assume you know SQL, or at least know which tool to open. Ask assumes neither. It takes a plain language question, understands the intent behind it, and translates it into a precise query across every connected source in your graph. The result comes back in seconds, formatted for reading, and shareable with your team in one click. We built it for the people who need answers but should not have to become data engineers to get them.",
        ],
      },
      { kind: "h3", runs: ["Handling ambiguity"] },
      {
        kind: "p",
        runs: [
          "The part we spent the most time on is ambiguity handling. Natural language is full of relative references, implied filters, and time ranges that are obvious to a human but genuinely hard to resolve programmatically. When someone asks which accounts are at risk, Ask needs to know what at risk means in the context of that company’s data. It pulls from schema context, historical query patterns, and the structure of the knowledge graph to resolve those gaps before returning a result. When it is not confident, it surfaces the assumption it made so the user can correct it.",
        ],
      },
      { kind: "h3", runs: ["What is available today"] },
      {
        kind: "p",
        runs: [
          "Ask is available on Pro and Enterprise plans today. The initial release supports queries across all connected sources, exportable results in CSV and JSON, and direct sharing to Slack. Follow-up question suggestions and saved query libraries are coming in the next release cycle.",
        ],
      },
    ],
  },
};
