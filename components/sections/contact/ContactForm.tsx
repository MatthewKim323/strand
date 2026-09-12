"use client";

import { useState } from "react";
import { motion, type Transition } from "motion/react";

/* ------------------------------------------------------------------ tokens */
const FIELD_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(20, 18, 16))";
const FIELD_BG_HOVER = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const LINE_FOCUS = "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(64, 64, 64))";
const LINE_INVALID = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";

const BOX_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(16, 16, 16))";
const BOX_BG_HOVER = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(23, 23, 23))";

const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const RED = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";

const SUBMIT_BG = "var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 244))";
const SUBMIT_BG_HOVER = "var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))";
const SUBMIT_BG_PRESS = "var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(214, 211, 209))";
const SUBMIT_LABEL = "var(--token-35e0c09c-bfbb-4fb7-9f38-c4d8879499d6, rgb(28, 25, 23))";

/** The house spring, which is what the field and checkbox components declare. */
const SPRING_FIELD: Transition = { type: "spring", bounce: 0.2, duration: 0.4, delay: 0 };
/**
 * The submit button is the odd one out: it declares a 0.2s tween on the sine
 * curve rather than the house spring, so its hover and press are noticeably
 * snappier than every other button on this route.
 */
const SUBMIT_TWEEN: Transition = { type: "tween", duration: 0.2, ease: [0.44, 0, 0.56, 1], delay: 0 };

type FieldState = "rest" | "focus" | "invalid";

const LINE_FOR: Record<FieldState, string> = {
  rest: LINE,
  focus: LINE_FOCUS,
  invalid: LINE_INVALID,
};
const BG_FOR: Record<FieldState, string> = {
  rest: FIELD_BG,
  focus: FIELD_BG_HOVER,
  invalid: FIELD_BG,
};

/**
 * One labelled field. Six variants in the source (fixed / fill height, each
 * with a focus and an invalid twin) which differ only in three things: the
 * wrapper's background, the wrapper's hairline colour and the opacity of the
 * message under it. Nothing scales or moves, and every change rides the house
 * spring.
 *
 * The hairline is an inset shadow driven by a custom property so the colour can
 * animate; a real border would add 2px to a box whose height is load bearing.
 *
 * State is driven by input events, not gestures: focus enters Focus, blur
 * returns to rest, a failed constraint check enters Invalid, and Invalid clears
 * only once the value becomes valid again (focus does not clear it, because the
 * Invalid variants drop their focus handler).
 */
function Field({
  label,
  name,
  placeholder,
  message,
  type = "text",
  area = false,
  autoComplete,
}: {
  label: string;
  name: string;
  placeholder: string;
  message: string;
  type?: string;
  area?: boolean;
  autoComplete?: string;
}) {
  const [state, setState] = useState<FieldState>("rest");

  const onChange = (e: { currentTarget: { validity: ValidityState } }) => {
    if (state === "invalid" && e.currentTarget.validity.valid) setState("focus");
  };
  const onFocus = () => {
    if (state !== "invalid") setState("focus");
  };
  const onBlur = () => {
    if (state !== "invalid") setState("rest");
  };
  const onInvalid = () => setState("invalid");

  const shared = {
    name,
    placeholder,
    required: true,
    className: "ct-input",
    onChange,
    onFocus,
    onBlur,
    onInvalid,
  } as const;

  return (
    <label className={area ? "ct-field ct-field--fill" : "ct-field"}>
      <div className="ct-label-stack">
        <div className="ct-label-text">
          <p className="t-label" style={{ color: MUTED }}>
            {label}
          </p>
        </div>
      </div>

      <motion.div
        className={area ? "ct-input-wrap ct-input-wrap--area" : "ct-input-wrap"}
        initial={false}
        style={{
          ["--ct-line" as string]: LINE,
          backgroundColor: FIELD_BG,
          boxShadow: "inset 0 0 0 1px var(--ct-line)",
        }}
        animate={{ ["--ct-line" as string]: LINE_FOR[state], backgroundColor: BG_FOR[state] }}
        whileHover={{ backgroundColor: FIELD_BG_HOVER }}
        transition={SPRING_FIELD}
      >
        {area ? <textarea {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
      </motion.div>

      <motion.div
        className="ct-error"
        initial={false}
        animate={{ opacity: state === "invalid" ? 1 : 0 }}
        transition={SPRING_FIELD}
      >
        <p className="t-xs" style={{ color: RED }}>
          {message}
        </p>
      </motion.div>
    </label>
  );
}

/**
 * The consent box. Two variants only: Default and Invalid, where Invalid moves
 * the hairline to red and the label text with it. Hover moves the background in
 * both, identically.
 */
function Consent() {
  const [bad, setBad] = useState(false);

  return (
    <div className="ct-consent">
      <label className="ct-consent-box">
          <motion.input
            type="checkbox"
            name="Consent"
            required
            className="ct-checkbox"
            initial={false}
            style={{
              ["--ct-cb-line" as string]: LINE,
              backgroundColor: BOX_BG,
              boxShadow: "inset 0 0 0 1px var(--ct-cb-line)",
            }}
            animate={{ ["--ct-cb-line" as string]: bad ? LINE_INVALID : LINE }}
            whileHover={{ backgroundColor: BOX_BG_HOVER }}
            transition={SPRING_FIELD}
            onInvalid={() => setBad(true)}
            onChange={(e) => {
              if (e.currentTarget.checked) setBad(false);
            }}
          />
      </label>
      {/* The box component carries its own label, which this instance hides.
          The visible sentence is a sibling of the component, so it keeps its
          resting colour when the box goes invalid: only the box moves. */}
      <div className="ct-consent-text">
        <p className="t-sm" style={{ textAlign: "start", color: MUTED }}>
          {"I have read and agree to the "}
          <a className="ct-policy" href="/privacy-policy">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

/**
 * The contact form. Real fields with names, types and required flags, but no
 * endpoint in this rebuild, so submission is cancelled.
 *
 * TODO(spec): the submit button's Loading, Success, Error and Disabled variants
 * are unreachable here. They are driven by the result of a POST to the source's
 * hosted form endpoint, which this rebuild has no equivalent of, so only
 * Default is ever rendered.
 */
export function ContactForm() {
  return (
    <form className="ct-form" onSubmit={(e) => e.preventDefault()} noValidate={false}>
      <div className="ct-inputs">
        <div className="ct-grid">
          <div className="ct-cell">
            <Field
              label="Full name"
              name="Full name"
              placeholder="Full name"
              message="Provide a full name"
              autoComplete="name"
            />
          </div>
          <div className="ct-cell">
            <Field
              label="Work email"
              name="Work email"
              placeholder="john@website.com"
              message="Provide a valid email"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="ct-cell ct-cell--wide">
            <Field
              label="Company name"
              name="Company name"
              placeholder="Company name"
              message="Provide a company name"
              autoComplete="organization"
            />
          </div>
          <div className="ct-cell ct-cell--wide ct-cell--tall">
            <Field
              label="What can we help with?"
              name="Topic"
              placeholder="A few sentences is enough."
              message="Please fill out this field"
              area
            />
          </div>
        </div>
      </div>

      <div className="ct-footrow">
        <Consent />
        <div className="ct-submit-slot">
            <motion.button
              type="submit"
              className="ct-submit"
              initial={false}
              style={{ backgroundColor: SUBMIT_BG }}
              whileHover={{ backgroundColor: SUBMIT_BG_HOVER }}
              whileTap={{ backgroundColor: SUBMIT_BG_PRESS }}
              transition={SUBMIT_TWEEN}
            >
              <div className="ct-submit-label">
                <p className="t-label" style={{ color: SUBMIT_LABEL }}>
                  Submit
                </p>
              </div>
            </motion.button>
        </div>
      </div>
    </form>
  );
}
