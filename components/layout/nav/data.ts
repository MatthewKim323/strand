/**
 * Every label, blurb and route the navigation shows. Copy is verbatim from the
 * spec tree / layout module: do not reword it.
 */

export type ProductItem = {
  label: string;
  description: string;
  href: string;
  /** sprite symbol id, 32x32 viewBox */
  icon: string;
};

export type RowItem = {
  label: string;
  description: string;
  /** the two SUPPORT rows carry no destination in the source */
  href?: string;
  /** sprite symbol id, 24x24 viewBox */
  icon: string;
};

export type LinkItem = { label: string; href: string };

/** "Features" panel: three product cards. */
export const PRODUCTS: ProductItem[] = [
  {
    label: "Cortex",
    description: "Connect and unify data across every source.",
    href: "/features/cortex",
    icon: "2652311070",
  },
  {
    label: "Ask",
    description: "Query your data in plain language.",
    href: "/features/ask",
    icon: "1081822090",
  },
  {
    label: "Pulse",
    description: "Detect anomalies before they become problems.",
    href: "/features/pulse",
    icon: "3915734215",
  },
];

/**
 * "Resources" panel, left column. Neither row is wired to a destination in the
 * source: the link slot is left empty, so they render as inert rows here too.
 */
export const SUPPORT: RowItem[] = [
  {
    label: "Developer docs",
    description: "API references, SDKs, and guides.",
    // TODO(spec): no href in the source component.
    icon: "894405547",
  },
  {
    label: "Help Center",
    description: "Tutorials and answers for your team.",
    // TODO(spec): no href in the source component.
    icon: "168667647",
  },
];

/** "Resources" panel, right column. */
export const COMPANY: LinkItem[] = [
  { label: "Integrations", href: "/integrations" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact-us" },
];

export const PRICING_HREF = "/pricing";
export const ABOUT_HREF = "/about-us";

/** Chevron glyph shared by the menu triggers and the collapsed menu rows. */
export const CHEVRON_ID = "4024583230";
/** Hamburger glyph on the tablet / phone bar. */
export const MENU_ID = "3467097230";
