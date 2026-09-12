"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Sprite";
import { Ticker } from "./Ticker";

/* ------------------------------------------------------------------ tokens */
const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 250))";
const TEXT = "var(--token-9c2e8ee6-e444-42b8-997a-df33e3515cb5, rgb(217, 217, 217))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const CARD_BG = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";
const ROW_BG = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(12, 10, 9))";
const TOGGLE_BG = "var(--token-dbfb79b6-fd8a-46f1-b1ff-21a736547d33, rgb(14, 13, 11))";
const PILL_BG = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(23, 23, 23))";
const DOT = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const ICON_OFF = "var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82))";
const INPUT_BG = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";
const INPUT_TEXT = "var(--token-5d8f23dc-92a7-4ff0-acf1-4f5feb4637ee, rgb(245, 245, 245))";

const TOGGLE_TWEEN = { duration: 0.2, ease: [0.44, 0, 0.56, 1] as const };

/* -------------------------------------------------------------------- data */
type Plan = {
  name: string;
  price: string;
  /** shown while the billing toggle is on Yearly */
  yearlyPrice?: string;
  /** the saving badge beside the yearly figure, where the plan has one */
  discount?: string;
  period?: string;
  previous?: [string, string, string];
  features: string[];
  cta: { label: string; variant: "primary" | "secondary" };
  rightBorder: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    yearlyPrice: "$0",
    period: "/month",
    features: [
      "Up to 5 data sources",
      "1,000 queries per month",
      "Cortex knowledge graph",
      "Ask natural language queries",
      "Community support",
    ],
    cta: { label: "Get started free", variant: "secondary" },
    rightBorder: true,
  },
  {
    name: "Pro",
    price: "$79",
    yearlyPrice: "$63",
    discount: "-10%",
    period: "/month",
    previous: ["Everything from", "Starter,", "and:"],
    features: [
      "Up to 25 data sources",
      "Unlimited queries",
      "Pulse anomaly detection",
      "Recall pattern recognition",
      "Slack and email integrations",
      "Priority support",
    ],
    cta: { label: "Start 14-day trial", variant: "primary" },
    rightBorder: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    yearlyPrice: "Custom",
    previous: ["Everything from", "Pro,", "and:"],
    features: [
      "Unlimited data sources",
      "Nucleus developer toolkit",
      "Custom Pathways pipelines",
      "SSO and SAML",
      "Dedicated account manager",
      "99.99% uptime SLA",
    ],
    cta: { label: "Talk to sales", variant: "secondary" },
    rightBorder: false,
  },
];

/** A value is either a check, a cross, or a literal string. */
type Cell = true | false | string;
type Row = { label: string; values: [Cell, Cell, Cell] };
type Group = { title?: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    rows: [
      { label: "Data sources", values: ["5", "25", "Unlimited"] },
      { label: "Queries per month", values: ["1,000", "Unlimited", "Unlimited"] },
      { label: "Team members", values: ["Unlimited", "Unlimited", "Unlimited"] },
    ],
  },
  {
    title: "Core",
    rows: [
      { label: "Cortex knowledge graph", values: [true, true, true] },
      { label: "Ask natural language queries", values: [true, true, true] },
      { label: "Pathways data pipelines", values: [false, true, true] },
      { label: "Exportable results (CSV, JSON, Slack)", values: [false, true, true] },
      { label: "Visual graph explorer", values: [false, true, true] },
    ],
  },
  {
    title: "Intelligence",
    rows: [
      { label: "Pulse anomaly detection", values: [false, true, true] },
      { label: "Recall pattern recognition", values: [false, true, true] },
      { label: "Adaptive baselines per metric", values: [false, true, true] },
      {
        label: "Automated insight reports",
        values: [false, "Weekly", "Weekly + on-demand"],
      },
      { label: "Cross-source correlation analysis", values: [false, false, true] },
    ],
  },
  {
    title: "Security and admin",
    rows: [
      { label: "SSO and SAML", values: [false, false, true] },
      { label: "Full pipeline audit logs", values: [false, true, true] },
      { label: "Custom Pathways pipelines", values: [false, false, true] },
      { label: "Nucleus developer toolkit", values: [false, false, true] },
      { label: "Dedicated account manager", values: [false, false, true] },
      { label: "99.99% uptime SLA", values: [false, false, true] },
    ],
  },
];

/* --------------------------------------------------------------------- css */
const CSS = `
.pr-root {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.pr-container {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 0;
  overflow: clip;
}
.pr-edge {
  position: absolute; inset: 0; z-index: 1;
  border-radius: inherit; pointer-events: none;
}
.pr-e-lr { box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE}; }
.pr-e-t { box-shadow: inset 0 1px 0 0 ${LINE}; }
.pr-e-b { box-shadow: inset 0 -1px 0 0 ${LINE}; }
.pr-e-lrb {
  box-shadow: inset 1px 0 0 0 ${LINE}, inset -1px 0 0 0 ${LINE},
    inset 0 -1px 0 0 ${LINE};
}
.pr-e-all { box-shadow: inset 0 0 0 1px ${LINE}; }
.pr-pattern { position: relative; flex: none; align-self: stretch; width: 96px; height: auto; }
.pr-content {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 0; width: 1px; height: min-content; padding: 0; overflow: clip;
}

/* -- plan cards ---------------------------------------------------------- */
.pr-cardgroup {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-titlerow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 32px; overflow: clip;
}
.pr-title { position: relative; white-space: pre; flex: none; width: auto; height: auto; }
.pr-t-title {
  font-family: var(--font-body); font-weight: 600; font-size: 40px;
  line-height: 40px; letter-spacing: -0.01em; text-align: start;
}
.pr-t-price {
  font-family: var(--font-body); font-weight: 600; font-size: 24px;
  line-height: 28px; letter-spacing: -0.005em; text-align: start;
}
.pr-toggle-slot { position: relative; flex: none; width: 196px; height: 40px; }
.pr-toggle {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 4px; width: 100%; height: 100%; padding: 4px; border-radius: 12px;
  overflow: clip; background-color: ${TOGGLE_BG};
}
.pr-toggle-track {
  position: absolute; inset: 0; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 4px; padding: 4px; overflow: clip;
}
.pr-toggle-pill {
  position: relative; flex: 1 0 0; width: 1px; height: 100%;
  border-radius: 8px; background-color: ${PILL_BG};
  box-shadow: inset 0 0 0 1px ${LINE};
}
.pr-toggle-space { position: relative; flex: 1 0 0; width: 1px; height: 100%; border-radius: 8px; }
.pr-toggle-opt {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 1px; height: min-content; padding: 6px 12px;
  cursor: pointer; user-select: none; -webkit-user-select: none;
  background: none; border: 0;
}
.pr-toggle-opt > div {
  white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word;
  flex: 1 0 0; width: 1px; height: auto; position: relative;
  transition: color 0.2s cubic-bezier(0.44, 0, 0.56, 1);
}
.pr-grid {
  position: relative; display: grid; flex: none;
  grid-template-columns: repeat(3, minmax(156px, 1fr));
  grid-auto-rows: minmax(0, 1fr); justify-content: center; gap: 0;
  width: 100%; height: min-content; padding: 0;
}
.pr-card-slot { position: relative; flex: none; place-self: start; width: 100%; height: 100%; }
.pr-card {
  position: relative; display: flex; flex-flow: column nowrap;
  align-content: flex-start; justify-content: space-between; align-items: flex-start;
  width: 100%; height: 100%; min-height: 476px; padding: 32px;
  background-color: ${CARD_BG};
}
.pr-upper {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 40px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-main {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-name {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: none; width: 100%; height: auto;
}
.pr-pricerow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: flex-end; justify-content: center; align-items: flex-end;
  gap: 12px; width: 100%; height: min-content; padding: 0;
}
.pr-pricemain {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: flex-end; justify-content: flex-start; align-items: flex-end;
  gap: 6px; width: 1px; height: min-content; padding: 0;
}
.pr-price { position: relative; white-space: pre; flex: none; width: auto; height: auto; }
.pr-discount {
  position: relative; flex: none; width: min-content; height: min-content;
  display: flex; align-items: center; justify-content: center;
  padding: 4px 8px; border-radius: 6px; white-space: pre;
  background-color: var(--token-5ede7ff4-9baf-4919-b9da-b4753e2a0dcd, #10ec9033);
  color: var(--token-1b607253-4aac-469b-9eb8-fd5858f5863c, #10ec90);
}
.pr-discount p { color: inherit; }
.pr-period {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: 1 0 0; width: 1px; height: auto;
}
.pr-features {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-prev {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 4px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-prev > div { position: relative; white-space: pre; flex: none; width: auto; height: auto; }
.pr-featureslot { position: relative; flex: none; width: 100%; height: auto; }
.pr-feature {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-feature-text {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: 1 0 0; width: 1px; height: auto;
}
.pr-gap { position: relative; flex: none; width: 100%; height: 40px; overflow: clip; }
.pr-cardcta { position: relative; flex: none; width: 100%; height: auto; }
.pr-card-rb {
  position: absolute; z-index: 1; flex: none; width: 1px; top: 0; bottom: 0;
  right: 0; background-color: ${LINE};
}
.pr-card-bb {
  position: absolute; z-index: 1; flex: none; height: 1px; bottom: 0; left: 0;
  right: 0; background-color: ${LINE};
}
.pr-fill {
  position: relative; display: none; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  place-self: start; gap: 16px; width: 100%; height: 100%; padding: 32px;
  overflow: clip;
}
.pr-fill-inner { position: relative; flex: 1 0 0; width: 100%; height: 1px; }

/* -- partners ------------------------------------------------------------ */
.pr-partners {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-partners-inner {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0 32px; width: 100%; max-width: 1400px; height: min-content;
  padding: 40px 0; overflow: clip;
}
.pr-partners-titlerow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-partners-title {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: min-content; height: min-content; padding: 40px 40px 0;
  overflow: clip;
}
.pr-partners-title-text { position: relative; white-space: pre; flex: none; width: auto; height: auto; }
.pr-tickerwrap {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 40px; width: 100%; height: min-content; padding: 40px 0 0; overflow: clip;
}

/* -- comparison table ---------------------------------------------------- */
.pr-table {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-labelsrow {
  position: sticky; top: 68px; z-index: 1; display: flex; flex-flow: row nowrap;
  flex: none; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
  background-color: ${ROW_BG};
}
.pr-labels-space {
  position: relative; height: auto; overflow: clip; flex: 1 0 0;
  align-self: stretch; width: 1px;
}
.pr-labels {
  position: relative; display: flex; flex-flow: row nowrap; flex: 3 0 0;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 20px 32px; overflow: clip;
}
.pr-labels-inner {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 0; width: 1px; height: min-content; padding: 0;
}
.pr-label-cell {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 10px; width: 1px; height: min-content; padding: 0;
}
.pr-label-text {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: 1 0 0; width: 1px; height: auto;
}
.pr-selectwrap {
  position: relative; display: none; flex-flow: column nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 8px; width: 1px; height: min-content; padding: 0;
}
.pr-select { position: relative; display: block; flex: none; width: 100%; height: auto;
  background-color: ${INPUT_BG}; border-radius: 12px; }
.pr-select > select {
  appearance: none; -webkit-appearance: none; display: block; width: 100%;
  padding: 12px; padding-right: 40px; margin: 0; background: transparent;
  border: 0; outline: none; color: ${INPUT_TEXT};
  font-family: var(--font-body); font-size: 14px; font-weight: 500;
  line-height: 20px; letter-spacing: 0; border-radius: 12px;
}
.pr-select > select option { color: #000; }
.pr-select-chevron {
  position: absolute; right: 12px; top: 50%; margin-top: -8px;
  width: 16px; height: 16px; pointer-events: none;
}
.pr-featureslist {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 48px; width: 100%; height: min-content; padding: 32px; overflow: clip;
}
.pr-group {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-section {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 24px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-section-title {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: none; width: 100%; height: auto;
}
.pr-row {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-rowlabel-slot { position: relative; flex: 1 0 0; width: 1px; height: auto; }
.pr-cell-label {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 10px; width: 100%; height: min-content; padding: 12px 0;
}
.pr-cell-label-text {
  position: relative; height: auto; overflow: clip; white-space: pre-wrap;
  word-break: break-word; overflow-wrap: break-word; flex: 1 0 0; width: 1px;
}
.pr-values {
  position: relative; display: flex; flex-flow: row nowrap; flex: 3 0 0;
  align-content: flex-start; justify-content: center; align-self: stretch;
  align-items: flex-start; gap: 0; width: 1px; height: auto; padding: 0;
}
.pr-values-one {
  position: relative; display: none; flex-flow: row nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: center; align-self: stretch;
  align-items: flex-start; gap: 0; width: 1px; height: auto; padding: 0;
}
.pr-valueslot { position: relative; flex: 1 0 0; width: 1px; height: 100%; }
.pr-cell-value {
  position: relative; display: flex; flex-flow: row nowrap;
  align-content: center; justify-content: center; align-items: center;
  gap: 10px; width: 100%; height: 100%; padding: 12px 0;
}
.pr-cell-value-text {
  position: relative; white-space: pre-wrap; word-break: break-word;
  overflow-wrap: break-word; flex: 1 0 0; width: 1px; height: auto;
}
.pr-ctarow {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pr-cta-space {
  position: relative; height: auto; overflow: clip; flex: 1 0 0;
  align-self: stretch; width: 1px;
}
.pr-cta-buttons {
  position: relative; display: flex; flex-flow: row nowrap; flex: 3 0 0;
  align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 0 42px 42px; overflow: clip;
}
.pr-cta-three {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 20px; width: 1px; height: min-content; padding: 0;
}
.pr-cta-cell {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 0; width: 1px; height: min-content; padding: 0;
}
.pr-cta-slot { position: relative; flex: 1 0 0; width: 1px; height: auto; }
.pr-cta-one {
  position: relative; display: none; flex-flow: row nowrap; flex: 1 0 0;
  align-content: center; justify-content: flex-start; align-items: center;
  gap: 20px; width: 1px; height: min-content; padding: 0;
}

/* -- tablet -------------------------------------------------------------- */
@media (max-width: 1199.98px) {
  .pr-root { padding: 0; }
  .pr-e-container { box-shadow: none; }
  .pr-t-title { font-size: 32px; line-height: 34px; }
}
@media (min-width: 810px) and (max-width: 1199.98px) {
  .pr-pattern { flex: 1 0 0; width: 1px; }
  .pr-content { min-width: 800px; }
  .pr-grid { grid-template-columns: repeat(2, minmax(156px, 1fr)); }
  .pr-fill { display: flex; }
  .pr-labels { padding: 20px 30px; }
  .pr-featureslist { padding: 30px; }
  .pr-cta-buttons { padding: 0 30px 42px; }
}

/* -- phone --------------------------------------------------------------- */
@media (max-width: 809.98px) {
  .pr-pattern { display: none; }
  .pr-e-content { box-shadow: none; }
  .pr-titlerow { flex-wrap: wrap; padding: 32px 20px; }
  .pr-toggle-slot { width: 167px; }
  .pr-grid { grid-template-columns: repeat(1, minmax(156px, 1fr)); grid-auto-rows: min-content; }
  .pr-card-slot { height: auto; }
  .pr-card { min-height: unset; padding: 20px; }
  .pr-upper { gap: 28px; }
  .pr-partners-inner { padding: 40px 0 0; }
  .pr-e-partners { box-shadow: none; }
  .pr-partners-title { flex: 1 0 0; width: 1px; padding: 40px 20px 0; }
  .pr-partners-title-text { white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; width: 100%; }
  .pr-e-labelsrow { box-shadow: none; }
  .pr-labels-space { display: none; }
  .pr-labels { padding: 20px; }
  .pr-labels-inner { display: none; }
  .pr-selectwrap { display: flex; }
  .pr-featureslist { padding: 20px; }
  .pr-values { display: none; }
  .pr-values-one { display: flex; }
  .pr-cta-space { display: none; }
  .pr-cta-buttons { padding: 0 20px 42px; }
  .pr-cta-three { display: none; }
  .pr-cta-one { display: flex; }
}
`;

/* ------------------------------------------------------------------ pieces */
function Dots({ patternId }: { patternId: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ height: "100%", width: "100%" }}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect x="4" y="4" width="1.5" height="1.5" fill={DOT} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function Edge({ cls }: { cls: string }) {
  return <span className={`pr-edge ${cls}`} aria-hidden="true" />;
}

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  return (
    <div className="pr-card-slot">
      <div className="pr-card">
        <div className="pr-upper">
          <div className="pr-main">
            <div className="pr-name">
              <h3 className="t-h3" style={{ color: MUTED }}>
                {plan.name}
              </h3>
            </div>
            <div className="pr-pricerow">
              <div className="pr-pricemain">
                <div className="pr-price">
                  <h3 className="pr-t-price" style={{ color: BRIGHT }}>
                    {yearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                  </h3>
                </div>
                {plan.period ? (
                  <div className="pr-period">
                    <p className="t-body" style={{ color: DIM }}>
                      {plan.period}
                    </p>
                  </div>
                ) : null}
              </div>
              {yearly && plan.discount ? (
                <div className="pr-discount">
                  <p className="t-micro">{plan.discount}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="pr-features">
            {plan.previous ? (
              <div className="pr-prev">
                {plan.previous.map((word) => (
                  <div key={word}>
                    <p className="t-label" style={{ color: MUTED }}>
                      {word}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
            {plan.features.map((f) => (
              <div className="pr-featureslot" key={f}>
                <div className="pr-feature">
                  <Icon id="2994208654" size={24} color={ICON_OFF} strokeWidth={2} />
                  <div className="pr-feature-text">
                    <p className="t-label" style={{ color: TEXT }}>
                      {f}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pr-gap" />
        <div className="pr-cardcta">
          <Button
            href="/contact-us"
            variant={plan.cta.variant}
            size="lg"
            height={36}
            style={{ width: "100%" }}
          >
            {plan.cta.label}
          </Button>
        </div>
        {plan.rightBorder ? <div className="pr-card-rb" /> : null}
        <div className="pr-card-bb" />
      </div>
    </div>
  );
}

function ValueCell({ value }: { value: Cell }) {
  return (
    <div className="pr-valueslot">
      <div className="pr-cell-value">
        <Edge cls="pr-e-b" />
        {typeof value === "string" ? (
          <div className="pr-cell-value-text">
            <p className="t-label" style={{ textAlign: "center", color: BRIGHT }}>
              {value}
            </p>
          </div>
        ) : value ? (
          <Icon id="3338047389" size={16} color={BRIGHT} strokeWidth={2} />
        ) : (
          <Icon id="2710857035" size={16} color={ICON_OFF} strokeWidth={2} />
        )}
      </div>
    </div>
  );
}

function TableRow({ row, plan }: { row: Row; plan: number }) {
  return (
    <div className="pr-row">
      <div className="pr-rowlabel-slot">
        <div className="pr-cell-label">
          <Edge cls="pr-e-b" />
          <div className="pr-cell-label-text">
            <p className="t-label" style={{ color: MUTED }}>
              {row.label}
            </p>
          </div>
        </div>
      </div>
      <div className="pr-values">
        {row.values.map((v, i) => (
          <ValueCell key={i} value={v} />
        ))}
      </div>
      <div className="pr-values-one">
        <ValueCell value={row.values[plan]} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- root */
export function PricingBlock() {
  const [yearly, setYearly] = useState(false);
  const [plan, setPlan] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const pill = (
    <motion.div
      key="pill"
      className="pr-toggle-pill"
      layout
      transition={TOGGLE_TWEEN}
      style={{ order: yearly ? 1 : 0 }}
    />
  );
  const space = (
    <div key="space" className="pr-toggle-space" style={{ order: yearly ? 0 : 1 }} />
  );

  return (
    <section className="pr-root" data-section="Pricing">
      <style>{CSS}</style>

      <div className="pr-container">
        <div className="pr-pattern">
          <Dots patternId={`pr-dots-l-${uid}`} />
        </div>

        <div className="pr-content">
          {/* -------------------------------------------------- plan cards */}
          <div className="pr-cardgroup">
            <div className="pr-titlerow">
              <div className="pr-title">
                <h1 className="pr-t-title" style={{ color: BRIGHT }}>
                  Pricing
                </h1>
              </div>
              <div className="pr-toggle-slot">
                <div className="pr-toggle">
                  <div className="pr-toggle-track">
                    {pill}
                    {space}
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className="pr-toggle-opt"
                    onClick={() => setYearly(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setYearly(false);
                    }}
                  >
                    <div>
                      <p
                        className="t-label"
                        style={{ textAlign: "center", color: yearly ? DIM : BRIGHT }}
                      >
                        Monthly
                      </p>
                    </div>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className="pr-toggle-opt"
                    onClick={() => setYearly(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setYearly(true);
                    }}
                  >
                    <div>
                      <p
                        className="t-label"
                        style={{ textAlign: "center", color: yearly ? BRIGHT : DIM }}
                      >
                        Yearly
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pr-grid">
              {PLANS.map((p) => (
                <PlanCard key={p.name} plan={p} yearly={yearly} />
              ))}
              <div className="pr-fill">
                <Edge cls="pr-e-lrb" />
                <div className="pr-fill-inner">
                  <Dots patternId={`pr-dots-f-${uid}`} />
                </div>
              </div>
              <Edge cls="pr-e-t" />
            </div>
          </div>

          {/* ---------------------------------------------------- partners */}
          <div className="pr-partners">
            <div className="pr-partners-inner">
              <div className="pr-partners-titlerow">
                <div className="pr-partners-title">
                  <Edge cls="pr-e-t" />
                  <div className="pr-partners-title-text">
                    <p className="t-label" style={{ color: MUTED }}>
                      Trusted by 56+ teams who are tired of tab-switching
                    </p>
                  </div>
                </div>
              </div>
              <div className="pr-tickerwrap">
                <Edge cls="pr-e-b" />
                <Ticker />
              </div>
              <Edge cls="pr-e-lr pr-e-partners" />
            </div>
          </div>

          {/* ------------------------------------------------------- table */}
          <div className="pr-table">
            <div className="pr-labelsrow">
              <div className="pr-labels-space" />
              <div className="pr-labels">
                <div className="pr-labels-inner">
                  {PLANS.map((p) => (
                    <div className="pr-label-cell" key={p.name}>
                      <div className="pr-label-text">
                        <h3
                          className="t-h3"
                          style={{ textAlign: "center", color: BRIGHT }}
                        >
                          {p.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pr-selectwrap">
                  <label className="pr-select">
                    <select
                      aria-label="Plan"
                      value={String(plan)}
                      onChange={(e) => setPlan(Number(e.target.value))}
                    >
                      {PLANS.map((p, i) => (
                        <option key={p.name} value={String(i)}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <Edge cls="pr-e-all" />
                    <svg
                      className="pr-select-chevron"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M 3.5 6 L 8 10.5 L 12.5 6"
                        fill="transparent"
                        strokeWidth="1.5"
                        stroke="rgb(153, 153, 153)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                </div>
                <Edge cls="pr-e-b" />
              </div>
              <Edge cls="pr-e-lr pr-e-labelsrow" />
            </div>

            <div className="pr-featureslist">
              {GROUPS.map((g, gi) =>
                g.title ? (
                  <div className="pr-section" key={g.title}>
                    <div className="pr-section-title">
                      <h3 className="t-h3" style={{ color: BRIGHT }}>
                        {g.title}
                      </h3>
                    </div>
                    <div className="pr-group">
                      {g.rows.map((r) => (
                        <TableRow key={r.label} row={r} plan={plan} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pr-group" key={gi}>
                    {g.rows.map((r) => (
                      <TableRow key={r.label} row={r} plan={plan} />
                    ))}
                  </div>
                ),
              )}
            </div>

            <div className="pr-ctarow">
              <div className="pr-cta-space" />
              <div className="pr-cta-buttons">
                <div className="pr-cta-three">
                  {PLANS.map((p) => (
                    <div className="pr-cta-cell" key={p.name}>
                      <div className="pr-cta-slot">
                        <Button
                          href="/contact-us"
                          variant={p.cta.variant}
                          size="lg"
                          height={36}
                          style={{ width: "100%" }}
                        >
                          {p.cta.label}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pr-cta-one">
                  <div className="pr-cta-slot">
                    <Button
                      href="/contact-us"
                      variant={PLANS[plan].cta.variant}
                      size="lg"
                      height={36}
                      style={{ width: "100%" }}
                    >
                      {PLANS[plan].cta.label}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Edge cls="pr-e-lr pr-e-content" />
        </div>

        <div className="pr-pattern">
          <Dots patternId={`pr-dots-r-${uid}`} />
        </div>

        <Edge cls="pr-e-lr pr-e-container" />
      </div>
    </section>
  );
}
