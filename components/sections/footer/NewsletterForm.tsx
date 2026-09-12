"use client";

import { useState } from "react";
import { motion, type Transition } from "motion/react";

const FIELD_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))";
const FIELD_BG_HOVER = "var(--token-93b991d8-cb67-4763-830d-23defa20a3ea, rgb(28, 25, 23))";
const LINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const LINE_FOCUS = "var(--token-a9ea621e-bd19-4f4b-962f-5a113b46a5eb, rgb(68, 64, 60))";
const LINE_INVALID = "var(--token-83011b35-94f4-4b05-950b-90fd095a6bea, rgb(229, 72, 77))";

const SUBMIT_BG = "var(--token-b171d873-56c5-4b61-933d-325079b55926, rgb(245, 245, 244))";
const SUBMIT_BG_HOVER = "var(--token-e308c24b-f83a-4af3-938d-f30465c0b60a, rgb(231, 229, 228))";
const SUBMIT_BG_PRESS = "var(--token-3b4d6f03-62c3-4973-a45f-106736577695, rgb(214, 211, 209))";
const SUBMIT_LABEL = "var(--token-35e0c09c-bfbb-4fb7-9f38-c4d8879499d6, rgb(28, 25, 23))";

/** The house spring, which is what the field component declares. */
const SPRING_FIELD: Transition = { type: "spring", bounce: 0.2, duration: 0.4, delay: 0 };
/**
 * The submit button is the odd one out: it declares a 0.2s tween on the sine
 * curve rather than the house spring, so its hover and press are noticeably
 * snappier than every other button on the page.
 */
const SUBMIT_TWEEN: Transition = { type: "tween", duration: 0.2, ease: [0.44, 0, 0.56, 1], delay: 0 };

type FieldState = "primary" | "focus" | "invalid";

const LINE_FOR: Record<FieldState, string> = {
  primary: LINE,
  focus: LINE_FOCUS,
  invalid: LINE_INVALID,
};

/**
 * The footer's one field. The outer shell carries its hairline as an inset
 * shadow, the input fills the row and the submit sits flush inside the 4px
 * gutter, which is why the whole control is exactly 40px tall.
 *
 * Motion, from the field component's variant table: hover moves the background
 * only and is identical in all three states; focus and invalid move the border
 * colour only. Nothing scales. State is driven by input events, not gestures:
 * focus enters Focus, blur returns to Primary, a failed constraint check enters
 * Invalid, and Invalid clears only once the value becomes valid (focus does not
 * clear it, because the Invalid variant drops the focus handler).
 *
 * TODO(spec): the button's Loading, Success and Error variants, and with them
 * the page's only loop-effect spinner (1s linear rotate, repeatType 'loop',
 * repeatDelay 0, paused off-screen), are unreachable here. They are driven by
 * the result of a POST to the source's hosted form endpoint, which this rebuild
 * has no equivalent of, so submission is cancelled and only Default and
 * Disabled are ever rendered.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FieldState>("primary");

  return (
    <motion.form
      className="fc-form"
      onSubmit={(e) => e.preventDefault()}
      initial={false}
      style={{
        backgroundColor: FIELD_BG,
        ["--nl-line" as string]: LINE,
        boxShadow: "inset 0 0 0 1px var(--nl-line)",
      }}
      animate={{ ["--nl-line" as string]: LINE_FOR[state] }}
      whileHover={{ backgroundColor: FIELD_BG_HOVER }}
      transition={SPRING_FIELD}
    >
      <label className="fc-form-row">
        <div className="fc-input-wrap">
          <input
            className="fc-input"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="name@nordwell.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "invalid" && e.target.validity.valid) setState("focus");
            }}
            onFocus={() => {
              if (state !== "invalid") setState("focus");
            }}
            onBlur={() => {
              if (state !== "invalid") setState("primary");
            }}
            onInvalid={() => setState("invalid")}
          />
        </div>
        <div className="fc-submit">
          <motion.button
            type="submit"
            className="fc-submit-btn"
            initial={false}
            style={{ backgroundColor: SUBMIT_BG }}
            animate={{ opacity: state === "invalid" ? 0.5 : 1 }}
            whileHover={{ backgroundColor: SUBMIT_BG_HOVER }}
            whileTap={{ backgroundColor: SUBMIT_BG_PRESS }}
            transition={SUBMIT_TWEEN}
          >
            <div className="fc-submit-label">
              <p className="t-label" style={{ color: SUBMIT_LABEL }}>
                Subscribe
              </p>
            </div>
          </motion.button>
        </div>
      </label>

      <style>{`
.fc-submit-btn {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100px; height: 32px; padding: 0 12px; overflow: visible;
  border: 0; border-radius: 8px; cursor: pointer;
  -webkit-appearance: none; appearance: none;
}
.fc-submit-label {
  position: relative; flex: none; width: auto; height: auto; white-space: pre;
  -webkit-user-select: none; user-select: none;
}
.fc-submit-label > p { margin: 0; }
      `}</style>
    </motion.form>
  );
}
