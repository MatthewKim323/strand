import Link from "next/link";

/**
 * Wordmark. The mark is a drawn glyph; the word itself is set live in the
 * display face, pinned to the reference's exact ink width with textLength so
 * the block measures the same whether or not the face has loaded yet.
 */
export function Logo({
  markSize = 24,
  wordWidth = 68,
  wordHeight = 17,
  gap = 8,
}: {
  markSize?: number;
  wordWidth?: number;
  wordHeight?: number;
  gap?: number;
}) {
  return (
    <Link
      href="/"
      aria-label="Nordwell home"
      style={{
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        gap,
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 32 32"
        style={{ width: markSize, height: markSize, flexShrink: 0, display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M 15.987 0.494 C 16.832 0.005 17.837 -0.127 18.78 0.126 C 19.723 0.379 20.527 0.996 21.014 1.843 C 22.03 3.604 21.427 5.856 19.667 6.875 C 17.441 8.161 13.549 6.583 11 8.056 C 10.96 8.078 10.936 8.121 10.938 8.166 C 10.94 8.212 10.968 8.252 11.01 8.271 C 12.385 8.901 20.21 12.489 20.271 12.505 C 21.861 12.93 22.976 14.36 23.001 16.006 C 23.027 17.652 21.957 19.116 20.381 19.591 C 18.112 20.519 14.511 19.191 12.104 20.582 C 9.554 22.056 8.974 26.219 6.749 27.506 C 5.904 27.994 4.899 28.126 3.956 27.873 C 3.013 27.62 2.21 27.003 1.723 26.157 C 0.707 24.395 1.309 22.143 3.069 21.125 C 5.619 19.651 9.187 21.417 11.736 19.944 C 12.009 19.786 11.955 19.387 11.666 19.262 L 2.727 15.427 C 1.301 15.043 0.242 13.845 0.034 12.385 C -0.174 10.925 0.51 9.479 1.775 8.715 C 4.115 7.303 8.077 8.865 10.573 7.423 C 13.122 5.95 13.762 1.781 15.987 0.494 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        viewBox="0 0 272 68"
        style={{ width: wordWidth, height: wordHeight, flexShrink: 0, display: "block" }}
        role="img"
        aria-label="Nordwell"
      >
        <text
          x="0"
          y="52"
          textLength="272"
          lengthAdjust="spacingAndGlyphs"
          fill="currentColor"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 64,
            letterSpacing: "-0.02em",
          }}
        >
          Nordwell
        </text>
      </svg>
    </Link>
  );
}
