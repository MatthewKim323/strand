"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const FIELD_BG = "var(--token-ac705832-092f-475e-a252-93784ea8573d, rgb(18, 16, 14))";

/**
 * The footer's one field. The outer shell carries its hairline as an inset
 * shadow, the input fills the row and the submit sits flush inside the 4px
 * gutter, which is why the whole control is exactly 40px tall.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      className="fc-form"
      onSubmit={(e) => e.preventDefault()}
      style={{ backgroundColor: FIELD_BG, boxShadow: `inset 0 0 0 1px ${HAIRLINE}` }}
    >
      <label className="fc-form-row">
        <div className="fc-input-wrap">
          <input
            className="fc-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@nordwell.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="fc-submit">
          <Button
            type="submit"
            variant="primary"
            size="md"
            height={32}
            style={{ width: 100, padding: "0 12px", gap: 0 }}
          >
            Subscribe
          </Button>
        </div>
      </label>
    </form>
  );
}
