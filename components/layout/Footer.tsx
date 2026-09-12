import { SocialLink } from "@/components/sections/footer/SocialLink";
import { NewsletterForm } from "@/components/sections/footer/NewsletterForm";
import { StatusPing } from "@/components/sections/footer/StatusPing";

const BRIGHT = "var(--token-17151d22-e81f-43e5-8876-d5286d6cf070, rgb(250, 250, 249))";
const MUTED = "var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(168, 162, 158))";
const DIM = "var(--token-2f1d35ad-f881-4439-84f5-765e4d808479, rgb(115, 115, 115))";
const HAIRLINE = "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))";
const SHELL = "var(--token-7f40e4a1-2b83-444e-8765-465c7d3596ab, rgb(10, 10, 10))";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Features",
    links: [
      { label: "Cortex", href: "/features/cortex" },
      { label: "Ask", href: "/features/ask" },
      { label: "Pulse", href: "/features/pulse" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about-us" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
      { label: "Developer docs", href: "/developers" },
      { label: "Help Center", href: "/help" },
      { label: "404", href: "/404" },
    ],
  },
];

const SOCIAL = [
  { label: "X", href: "https://x.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "GitHub", href: "https://github.com/" },
];

/**
 * The wordmark that closes the page: a single line spanning the full content
 * width, a hair above the page ground. The mark is the house glyph and the
 * name is live text in the display face, stretched to the exact width the
 * layout reserves for it, so the block keeps its 3.888 aspect ratio at every
 * breakpoint without shipping an image.
 */
function Wordmark() {
  return (
    <svg
      className="fc-mark-svg"
      viewBox="0 0 1322 340"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Nordwell"
      role="img"
    >
      <g fill="var(--c-line)" opacity={0.64}>
        <path
          transform="scale(12.147)"
          d="M 15.987 0.494 C 16.832 0.005 17.837 -0.127 18.78 0.126 C 19.723 0.379 20.527 0.996 21.014 1.843 C 22.03 3.604 21.427 5.856 19.667 6.875 C 17.441 8.161 13.549 6.583 11 8.056 C 10.96 8.078 10.936 8.121 10.938 8.166 C 10.94 8.212 10.968 8.252 11.01 8.271 C 12.385 8.901 20.21 12.489 20.271 12.505 C 21.861 12.93 22.976 14.36 23.001 16.006 C 23.027 17.652 21.957 19.116 20.381 19.591 C 18.112 20.519 14.511 19.191 12.104 20.582 C 9.554 22.056 8.974 26.219 6.749 27.506 C 5.904 27.994 4.899 28.126 3.956 27.873 C 3.013 27.62 2.21 27.003 1.723 26.157 C 0.707 24.395 1.309 22.143 3.069 21.125 C 5.619 19.651 9.187 21.417 11.736 19.944 C 12.009 19.786 11.955 19.387 11.666 19.262 L 2.727 15.427 C 1.301 15.043 0.242 13.845 0.034 12.385 C -0.174 10.925 0.51 9.479 1.775 8.715 C 4.115 7.303 8.077 8.865 10.573 7.423 C 13.122 5.95 13.762 1.781 15.987 0.494 Z"
        />
        <text
          x={353}
          y={279.5}
          textLength={980}
          lengthAdjust="spacingAndGlyphs"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 352,
            letterSpacing: "-0.02em",
          }}
        >
          Nordwell
        </text>
      </g>
    </svg>
  );
}

const CSS = `
.fc-footer {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.fc-f-inner {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 0; width: 100%; max-width: 1400px; height: min-content; padding: 40px 0; overflow: clip;
}

/* --- link columns --- */
.fc-links {
  position: relative; display: grid; flex: none;
  grid-template-rows: repeat(1, min-content);
  grid-template-columns: repeat(4, minmax(156px, 1fr));
  grid-auto-rows: min-content; justify-content: center;
  gap: 40px; width: 100%; height: min-content; padding: 40px; overflow: visible;
}
.fc-col {
  position: relative; display: flex; flex: none; place-self: start;
  flex-flow: column nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 16px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.fc-col-title {
  position: relative; flex: none; width: 100%; height: auto; overflow: clip;
  white-space: pre-line; word-break: break-word; word-wrap: break-word;
}
.fc-stack {
  position: relative; display: flex; flex: none;
  flex-flow: column nowrap; align-content: flex-start; justify-content: center; align-items: flex-start;
  gap: 12px; width: 100%; height: min-content; padding: 0; overflow: visible;
}
.fc-item { position: relative; flex: none; width: auto; height: auto; white-space: pre; overflow: clip; }

.fc-social {
  position: relative; display: flex;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 6px; width: min-content; height: min-content; padding: 0; overflow: visible;
  text-decoration: none;
}
/* The label colour is not a CSS transition here: the source swaps a variant on
   mouse enter / leave, so it rides the house spring. See SocialLink. */
.fc-social-label {
  position: relative; flex: none; width: auto; height: auto; white-space: pre; overflow: clip;
}
.fc-arrow { position: relative; flex: none; width: 16px; height: 16px; overflow: clip; }
.fc-arrow-slot { position: absolute; top: 0; left: 0; display: block; width: 16px; height: 16px; }

/* --- status + newsletter --- */
.fc-un {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 40px; overflow: visible;
}
.fc-uptime {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 8px; width: min-content; height: min-content; padding: 12px 16px; overflow: clip;
  border-radius: 210px; background-color: ${SHELL};
  box-shadow: inset 0 0 0 1px ${HAIRLINE};
}
.fc-status {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.fc-dot-wrap { position: relative; z-index: 1; flex: none; width: auto; height: auto; }
.fc-status-text { position: relative; flex: none; width: auto; height: auto; white-space: pre; overflow: clip; }
/* A 1px rule. The design file paints a placeholder fill behind a 1px overlay
   border, and at this width the border covers the fill outright, so the rule
   is just the hairline colour. */
.fc-divider {
  position: relative; flex: none; align-self: stretch; width: 1px; height: auto; overflow: visible;
  background-color: ${HAIRLINE}; box-shadow: inset 0 0 0 1px ${HAIRLINE};
}
.fc-uptime-val { position: relative; flex: none; width: auto; height: auto; white-space: pre; }

.fc-news {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 20px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.fc-news-text { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.fc-form-wrap { position: relative; flex: none; width: 320px; height: auto; }
.fc-form {
  position: relative; display: flex;
  flex-flow: column nowrap; align-content: flex-start; justify-content: flex-start; align-items: flex-start;
  gap: 10px; width: 100%; height: min-content; padding: 4px 4px 4px 12px;
  border-radius: 12px; overflow: clip; cursor: pointer;
}
.fc-form-row {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: flex-start; align-items: center;
  gap: 10px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.fc-input-wrap {
  position: relative; display: flex; flex: 1 0 0; align-self: stretch; width: 1px; height: auto;
  border-radius: 10px; overflow: hidden;
}
.fc-input {
  flex: 1 0 0; width: 1px; padding: 0; margin: 0; border: 0; outline: none; background: none;
  font-family: var(--font-body); font-size: 12px; font-weight: 500; line-height: 16px;
  letter-spacing: 0em;
  color: var(--token-3354c3de-221c-4edd-ae1d-909c9020f86d, rgb(161, 161, 161));
}
.fc-input::placeholder {
  color: var(--token-836557f1-9a2a-42ae-bf18-328e4f3549e3, rgb(82, 82, 82)); opacity: 1;
}
.fc-submit { position: relative; flex: none; width: auto; height: auto; }

/* --- wordmark + legal --- */
.fc-mark {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 40px; overflow: visible;
}
.fc-mark-slot {
  position: relative; flex: 1 0 0; width: 1px; height: auto;
  aspect-ratio: 3.888235294117647; overflow: visible;
}
.fc-mark-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.fc-legal {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: space-between; align-items: center;
  width: 100%; height: min-content; padding: 20px 40px; overflow: visible;
}
.fc-legal-text { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.fc-legal-links {
  position: relative; display: flex; flex: none;
  flex-flow: row nowrap; align-content: center; justify-content: center; align-items: center;
  gap: 12px; width: min-content; height: min-content; padding: 0; overflow: visible;
}
.fc-legal-item { position: relative; flex: none; width: auto; height: auto; white-space: pre; }
.fc-legal-sep { position: relative; flex: none; width: auto; height: auto; white-space: pre; user-select: none; }

@media (max-width: 1199.98px) {
  .fc-footer { padding: 0; }
  .fc-links { gap: 20px; }
  .fc-un {
    flex-direction: column; align-content: flex-start; justify-content: flex-start;
    align-items: flex-start; gap: 40px;
  }
  .fc-news { justify-content: flex-start; width: 100%; }
  .fc-form-wrap { width: 370px; }
}
@media (max-width: 809.98px) {
  .fc-links {
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 40px 20px; padding: 40px 20px;
  }
  .fc-un { padding: 20px; }
  .fc-uptime { gap: 0; justify-content: space-between; width: 100%; }
  .fc-divider { display: none; }
  .fc-status { flex: 1 0 0; justify-content: flex-start; width: 1px; }
  .fc-status-text {
    flex: 1 0 0; width: 1px;
    white-space: pre-line; word-break: break-word; word-wrap: break-word;
  }
  .fc-news { flex-direction: column; align-content: flex-start; align-items: flex-start; width: 100%; }
  .fc-news-text { width: 100%; white-space: pre-wrap; word-break: break-word; word-wrap: break-word; }
  .fc-form-wrap { width: 100%; }
  .fc-mark { padding: 40px 20px; }
  .fc-legal { flex-direction: column; justify-content: flex-start; gap: 20px; padding: 20px; }
}
`;

/**
 * The site footer: four link columns, the status and newsletter row, the
 * closing wordmark and the legal bar. Exported on its own so every route can
 * mount the same footer under its own closing section.
 */
export function Footer() {
  return (
    <footer className="fc-footer">
      <style>{CSS}</style>
      <div className="fc-f-inner">
        <div className="fc-links">
          {COLUMNS.map((col) => (
            <div className="fc-col" key={col.title}>
              <div className="fc-col-title">
                <p className="t-body" style={{ color: BRIGHT }}>
                  {col.title}
                </p>
              </div>
              <div className="fc-stack">
                {col.links.map((l) => (
                  <div className="fc-item" key={l.label}>
                    <p className="t-body">
                      <a className="t-link" href={l.href} style={{ color: MUTED }}>
                        {l.label}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="fc-col">
            <div className="fc-col-title">
              <p className="t-body" style={{ color: BRIGHT }}>
                Connect
              </p>
            </div>
            <div className="fc-stack">
              {SOCIAL.map((s) => (
                <div key={s.label}>
                  <SocialLink label={s.label} href={s.href} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fc-un">
          <div className="fc-uptime">
            <div className="fc-status">
              <div className="fc-dot-wrap">
                <StatusPing />
              </div>
              <div className="fc-status-text">
                <p className="t-micro" style={{ color: BRIGHT }}>
                  All systems operational
                </p>
              </div>
            </div>
            <div className="fc-divider" />
            <div className="fc-uptime-val">
              <p className="t-mono" style={{ color: MUTED }}>
                99.98% UPTIME
              </p>
            </div>
          </div>

          <div className="fc-news">
            <div className="fc-news-text">
              <p className="t-micro" style={{ color: MUTED }}>
                Updates on new features and releases.
              </p>
            </div>
            <div className="fc-form-wrap">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="fc-mark">
          <div className="fc-mark-slot">
            <Wordmark />
          </div>
        </div>

        <div className="fc-legal">
          <div className="fc-legal-text">
            <p className="t-micro" style={{ color: DIM, textAlign: "start" }}>
              © 2026 Nordwell. All rights reserved.
            </p>
          </div>
          <div className="fc-legal-links">
            <div className="fc-legal-item">
              <p className="t-micro" style={{ color: DIM }}>
                <a className="t-link-u" href="/terms-of-service">
                  Terms and Conditions
                </a>
              </p>
            </div>
            <div className="fc-legal-sep">
              <p className="t-micro" style={{ color: DIM }}>
                /
              </p>
            </div>
            <div className="fc-legal-item">
              <p className="t-micro" style={{ color: DIM }}>
                <a className="t-link-u" href="/privacy-policy">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
