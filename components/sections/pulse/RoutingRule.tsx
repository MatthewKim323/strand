"use client";

import { motion } from "motion/react";

import { Icon } from "@/components/ui/Sprite";
import {
  C_CARD,
  C_DIM,
  C_GREEN,
  C_LINE,
  C_MUTED,
  C_MUTED_2,
  C_RED,
  C_TEXT,
  C_WELL,
  overlay,
} from "./parts";

/* The rule chrome sits on the darkest surface token, which is not one of the
   constants parts.tsx already exports. */
const C_SURFACE = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";
/* The grip widget's divider is a raw literal in the source, not a token. */
const C_GRIP_LINE = "rgb(34, 34, 34)";

/* --------------------------------------------------------------- icon art */

/**
 * The drag grip: six dots in two columns. Its id is not in the shared sprite,
 * so the path data is inlined here from the source module rather than added to
 * the sheet.
 */
const GRIP_DOT =
  "M 0 1 C 0 0.448 0.448 0 1 0 C 1.552 0 2 0.448 2 1 C 2 1.552 1.552 2 1 2 C 0.448 2 0 1.552 0 1 Z";
const GRIP_AT: Array<[number, number]> = [
  [8, 11],
  [8, 4],
  [8, 18],
  [14, 11],
  [14, 4],
  [14, 18],
];

function GripVertical({ size = 16, color = C_MUTED }: { size?: number; color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ width: size, height: size, flex: "none", display: "block" }}
    >
      {GRIP_AT.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={GRIP_DOT}
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          stroke={color}
          transform={`translate(${x} ${y})`}
        />
      ))}
    </svg>
  );
}

/** The first destination's mark, inlined from the source module's data URI. */
function MarkThreadbase({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      style={{ width: size, height: size, flex: "none", display: "block" }}
    >
      <g transform="translate(4 4)">
        <path
          d="M 7.858 0 L 10.576 1.257 L 10.228 4.38 L 5.369 9.885 C 2.487 8.033 0.533 5.037 0 1.653 Z"
          fill="rgb(21, 227, 255)"
          transform="translate(0 12.212)"
        />
        <path
          d="M 5.682 1.305 L 9.317 7.568 C 7.3 8.986 4.894 9.745 2.428 9.741 C 1.612 9.741 0.799 9.659 0 9.495 L 0.8 2.332 L 2.858 0 Z"
          fill="rgb(52, 141, 252)"
          transform="translate(9.428 14.259)"
        />
        <path
          d="M 9.929 0 C 10.187 0.98 10.325 2.009 10.325 3.07 C 10.325 5.54 9.579 7.835 8.3 9.744 L 1.577 6.635 L 0 3.919 L 1.982 1.673 Z"
          fill="rgb(253, 72, 115)"
          transform="translate(13.533 8.929)"
        />
        <path
          d="M 0.969 0 C 4.449 0.061 7.73 1.633 9.958 4.307 L 4.403 10.602 L 1.476 11.218 L 0 8.674 Z"
          fill="rgb(255, 199, 0)"
          transform="translate(11.111 0)"
        />
        <path
          d="M 10.802 7.534 L 10.476 10.455 L 7.55 11.071 L 0 7.58 C 0.951 4.245 3.294 1.482 6.43 0 Z"
          fill="rgb(0, 231, 185)"
          transform="translate(0.309 1.141)"
        />
      </g>
    </svg>
  );
}

/** The second destination's mark, inlined from the source module's data URI. */
function MarkAlertDuty({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      style={{ width: size, height: size, flex: "none", display: "block" }}
    >
      <g transform="translate(2 5)">
        <path
          d="M 11.621 6.14 C 11.621 2.75 8.783 0 5.281 0 L 0 0 L 0 6.14 L 5.283 6.14 L 5.283 13.815 L 11.623 13.815 L 11.623 6.14 Z"
          fill="rgb(255, 77, 0)"
          transform="translate(8.19 7.712)"
        />
        <path
          d="M 0 14.325 C 0 18.281 3.312 21.488 7.396 21.488 L 11.623 21.488 L 11.623 15.348 L 7.396 15.348 C 6.813 15.348 6.34 14.89 6.34 14.325 L 6.34 13.814 L 0 13.814 Z M 13.208 0 C 21.086 0 27.472 6.185 27.472 13.814 L 27.472 21.488 L 21.132 21.488 L 21.132 13.814 C 21.132 9.576 17.584 6.14 13.208 6.14 L 7.396 6.14 C 6.813 6.14 6.34 6.598 6.34 7.163 L 6.34 7.674 L 0 7.674 L 0 7.163 C 0 3.207 3.312 0 7.396 0 Z"
          fill="rgb(255, 77, 0)"
          transform="translate(0.264 0.038)"
        />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- pieces */

/** The dot with the ring that grows and fades, as the source's ping is wired. */
function StatusPing({
  size = 6,
  tint = C_GREEN,
  pingSize = 16,
  pingWeight = 2,
  repeatDelay = 1,
}: {
  size?: number;
  tint?: string;
  pingSize?: number;
  pingWeight?: number;
  repeatDelay?: number;
}) {
  const startSize = Math.max(size - pingWeight * 2, 1);
  const endSize = startSize + pingSize;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        backgroundColor: tint,
        position: "relative",
      }}
    >
      <motion.div
        initial={{ width: startSize, height: startSize, opacity: 1 }}
        animate={{ width: endSize, height: endSize, opacity: 0 }}
        transition={{
          type: "tween",
          duration: 0.3,
          delay: 0,
          ease: [0.44, 0, 0.56, 1],
          repeat: Infinity,
          repeatDelay,
        }}
        style={{
          borderRadius: 9999,
          outline: `${pingWeight}px solid ${tint}`,
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
      />
    </div>
  );
}

type Operator = "=" | "!=" | "<" | ">" | "<=" | ">=";

/**
 * One row of the builder: a grip, a metric, an optional comparison operator and
 * a value that is either plain text or a tinted pill.
 */
function Rule({
  metric,
  operator,
  value,
  valueBox = false,
  valueColor = C_MUTED,
  valueFill = C_WELL,
  showOperator = true,
  mark,
}: {
  metric: string;
  operator?: Operator;
  value: string;
  valueBox?: boolean;
  valueColor?: string;
  valueFill?: string;
  showOperator?: boolean;
  mark?: React.ReactNode;
}) {
  return (
    <div className="pu-rr-rule" style={{ backgroundColor: C_SURFACE }}>
      <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 6 })} />

      <div className="pu-rr-grip" style={{ backgroundColor: C_WELL }}>
        <span style={overlay({ borderRightWidth: 1, borderColor: C_GRIP_LINE })} />
        <GripVertical />
      </div>

      <div className="pu-rr-metric">
        <span style={overlay({ borderRightWidth: 1, borderColor: C_LINE })} />
        {mark ? <div className="pu-rr-mark">{mark}</div> : null}
        <p className="t-label pu-rr-clamp" style={{ color: C_TEXT }}>
          {metric}
        </p>
        <Icon id="4024583230" size={16} color={C_MUTED} strokeWidth={2} />
      </div>

      {showOperator ? (
        <div className="pu-rr-op">
          <span style={overlay({ borderRightWidth: 1, borderColor: C_LINE })} />
          <p className="t-label pu-rr-op-text" style={{ color: C_MUTED }}>
            {operator}
          </p>
          <Icon id="4024583230" size={16} color={C_MUTED} strokeWidth={2} />
        </div>
      ) : null}

      <div className="pu-rr-value">
        <span style={overlay({ borderRightWidth: 1, borderColor: C_LINE })} />
        {valueBox ? (
          <div className="pu-rr-value-box" style={{ backgroundColor: valueFill }}>
            <p className="t-label pu-rr-pre" style={{ color: valueColor }}>
              {value}
            </p>
          </div>
        ) : (
          <p className="t-label pu-rr-clamp" style={{ color: valueColor }}>
            {value}
          </p>
        )}
        <Icon id="4024583230" size={16} color={C_MUTED} strokeWidth={2} />
      </div>
    </div>
  );
}

/**
 * The connector that runs down the left of the stack. It is a vertical line
 * broken by either a word ("if", "and", "or", "then") or a small empty node.
 * `fixedTop` / `fixedBottom` swap a 9px stub for the line that would otherwise
 * fill the remaining height.
 */
function LogicOperator({
  option,
  fixedTop = true,
  fixedBottom = false,
  emptyNode = false,
}: {
  option: string;
  fixedTop?: boolean;
  fixedBottom?: boolean;
  emptyNode?: boolean;
}) {
  return (
    <div className="pu-rr-lo" style={{ height: "100%" }}>
      {!fixedTop ? <div className="pu-rr-lo-line" style={{ backgroundColor: C_LINE }} /> : null}
      {fixedTop ? <div className="pu-rr-lo-stub" style={{ backgroundColor: C_LINE }} /> : null}

      {!emptyNode ? (
        <div className="pu-rr-lo-box" style={{ backgroundColor: C_WELL }}>
          <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 6 })} />
          <p className="t-nano pu-rr-pre" style={{ color: C_MUTED }}>
            {option}
          </p>
        </div>
      ) : null}
      {emptyNode ? (
        <div className="pu-rr-lo-node" style={{ backgroundColor: C_SURFACE }}>
          <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 99 })} />
        </div>
      ) : null}

      {fixedBottom ? <div className="pu-rr-lo-stub" style={{ backgroundColor: C_LINE }} /> : null}
      {!fixedBottom ? <div className="pu-rr-lo-line" style={{ backgroundColor: C_LINE }} /> : null}
    </div>
  );
}

/** The outcome picker at the foot of the builder. */
function DropDown({ option, color = C_TEXT }: { option: string; color?: string }) {
  return (
    <div className="pu-rr-dd" style={{ backgroundColor: C_SURFACE }}>
      <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 6 })} />
      <p className="t-label pu-rr-clamp" style={{ color }}>
        {option}
      </p>
      <Icon id="4024583230" size={16} color={C_MUTED} strokeWidth={2} />
    </div>
  );
}

/* ----------------------------------------------------------------- panel */

export function RoutingRule() {
  return (
    <div className="pu-rr">
      <style>{CSS}</style>

      <div className="pu-rr-title">
        <div className="pu-fill">
          <p className="t-micro" style={{ textAlign: "left", color: C_MUTED }}>
            Routing rule <span style={{ color: C_DIM }}>&middot; Growth</span>
          </p>
        </div>
        <div className="pu-rr-status">
          <div style={{ flex: "none", width: "auto", height: "auto", position: "relative" }}>
            <StatusPing />
          </div>
          <div className="pu-pre">
            <p className="t-micro" style={{ textAlign: "left", color: C_TEXT }}>
              Active
            </p>
          </div>
        </div>
      </div>

      <div className="pu-rr-stack">
        <div className="pu-rr-row">
          <div className="pu-rr-lo-slot">
            <LogicOperator option="if" fixedTop={false} fixedBottom={false} />
          </div>
          <div className="pu-rr-cell">
            <Rule metric="metric" operator="=" value="conversion" valueBox valueColor={C_MUTED} />
          </div>
        </div>

        <div className="pu-rr-row">
          <div className="pu-rr-lo-slot">
            <LogicOperator option="if" fixedTop={false} fixedBottom={false} />
          </div>
          <div className="pu-rr-cell">
            <Rule metric="deviation" operator="<" value="20%" valueColor={C_RED} />
          </div>
        </div>

        <div className="pu-rr-row">
          <div className="pu-rr-lo-slot">
            <LogicOperator option="and" fixedTop fixedBottom={false} />
          </div>
          <div className="pu-rr-collection">
            <div className="pu-rr-visual" style={{ backgroundColor: C_CARD }}>
              <span style={overlay({ borderWidth: 1, borderColor: C_LINE, borderRadius: 6 })} />
              <div className="pu-w100">
                <p className="t-xs" style={{ textAlign: "left", color: C_MUTED_2 }}>
                  the following:
                </p>
              </div>
              <div className="pu-rr-substack">
                <div className="pu-rr-row">
                  <div className="pu-rr-lo-slot">
                    <LogicOperator option="if" fixedTop={false} fixedBottom={false} />
                  </div>
                  <div className="pu-rr-cell">
                    <Rule metric="time" operator="=" value="business hours" valueColor={C_TEXT} />
                  </div>
                </div>
                <div className="pu-rr-row">
                  <div className="pu-rr-lo-slot">
                    <LogicOperator option="or" fixedTop={false} fixedBottom={false} />
                  </div>
                  <div className="pu-rr-cell">
                    <Rule metric="campaign" operator="=" value="active" valueColor={C_GREEN} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pu-rr-outcome-row">
          <div className="pu-rr-lo-col">
            <div className="pu-rr-lo-slot-39">
              <LogicOperator option="then" fixedTop={false} fixedBottom emptyNode />
            </div>
            <div className="pu-rr-lo-slot-35">
              <LogicOperator option="then" fixedTop fixedBottom={false} />
            </div>
          </div>
          <div className="pu-rr-outcome">
            <div className="pu-rr-substack">
              <div className="pu-rr-dd-cell">
                <div className="pu-rr-dd-slot">
                  <DropDown option="route to" />
                </div>
              </div>
              <div className="pu-rr-cell-col">
                <Rule
                  metric="Threadbase"
                  value="# growth-team"
                  valueBox
                  showOperator={false}
                  mark={<MarkThreadbase />}
                />
              </div>
              <div className="pu-rr-cell-col">
                <Rule
                  metric="AlertDuty"
                  value="on-call"
                  valueBox
                  showOperator={false}
                  mark={<MarkAlertDuty />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.pu-rr {
  position: relative; display: flex; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 24px;
  width: 479px; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-title {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-status {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: min-content; height: min-content; padding: 0; overflow: visible;
}
.pu-rr-stack {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-substack {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-row {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-outcome-row {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: flex-start center; align-items: flex-start; gap: 8px;
  width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-cell {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 16px;
  width: 1px; height: min-content; padding: 2px 0; overflow: clip;
}
.pu-rr-cell-col {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 2px 0; overflow: clip;
}
.pu-rr-dd-cell {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center flex-start; align-items: flex-start; gap: 16px;
  width: 100%; height: min-content; padding: 2px 0; overflow: clip;
}
.pu-rr-dd-slot { flex: none; height: auto; position: relative; width: 185px; }
.pu-rr-collection {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 16px;
  width: 1px; height: min-content; padding: 2px 0; overflow: clip;
}
.pu-rr-visual {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 8px;
  width: 1px; height: min-content; padding: 8px; border-radius: 6px; overflow: clip;
}
.pu-rr-lo-col {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
.pu-rr-outcome {
  position: relative; display: flex; flex-flow: column nowrap; flex: 1 0 0;
  place-content: center; align-items: center; gap: 0;
  width: 1px; height: min-content; padding: 40px 0 4px; overflow: clip;
}

.pu-rr-lo-slot { align-self: stretch; flex: none; height: auto; position: relative; width: auto; }
.pu-rr-lo-slot-39 { flex: none; height: 39px; position: relative; width: auto; }
.pu-rr-lo-slot-35 { flex: none; height: 35px; position: relative; width: auto; }
.pu-rr-lo {
  position: relative; display: flex; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 0;
  width: min-content; padding: 0; overflow: clip;
}
.pu-rr-lo-line { flex: 1 0 0; height: 1px; width: 1px; position: relative; overflow: visible; }
.pu-rr-lo-stub { flex: none; height: 9px; width: 1px; position: relative; overflow: visible; }
.pu-rr-lo-box {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 36px; height: min-content; padding: 4px 8px;
  border-radius: 6px; overflow: visible;
}
.pu-rr-lo-node {
  flex: none; width: 7px; height: 7px; position: relative;
  border-radius: 99px; overflow: visible;
}

.pu-rr-rule {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 0;
  width: 100%; height: min-content; padding: 0;
  border-radius: 6px; overflow: clip;
}
.pu-rr-grip {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  align-self: stretch; place-content: center; align-items: center; gap: 16px;
  width: min-content; height: auto; padding: 6px; overflow: clip;
}
.pu-rr-metric {
  position: relative; display: flex; flex-flow: row nowrap; flex: 0.8 0 0;
  place-content: center; align-items: center; gap: 6px;
  width: 1px; height: min-content; padding: 6px; overflow: clip;
}
.pu-rr-mark { flex: none; width: 14px; height: 14px; position: relative; }
.pu-rr-op {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 8px;
  width: 46px; height: min-content; padding: 6px; overflow: clip;
}
.pu-rr-op-text {
  position: relative; flex: none; width: 10px; height: auto; overflow: clip;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.pu-rr-value {
  position: relative; display: flex; flex-flow: row nowrap; flex: 1 0 0;
  align-self: stretch; place-content: center space-between; align-items: center;
  width: 1px; height: auto; padding: 0 6px; overflow: clip;
}
.pu-rr-value-box {
  position: relative; display: flex; flex-flow: row nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: min-content; height: min-content; padding: 1px 6px;
  border-radius: 4px; overflow: visible;
}
.pu-rr-dd {
  position: relative; display: flex; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 8px;
  width: 100%; height: min-content; padding: 6px 10px;
  border-radius: 6px; overflow: clip;
}
.pu-rr-clamp {
  position: relative; flex: 1 0 0; width: 1px; height: auto; overflow: clip;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.pu-rr-pre { white-space: pre; flex: none; width: auto; height: auto; position: relative; }
`;
