const DOT = "var(--token-5206bb0a-1eac-4660-9763-613fdbda3479, rgb(28, 25, 23))";

/**
 * The 8x8 dot lattice the reference paints behind the page gutters and behind
 * every team portrait. One 1.5px square per cell, offset to the cell centre.
 */
export function DotGrid({ id }: { id: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ height: "100%", width: "100%" }}
    >
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect x="4" y="4" width="1.5" height="1.5" fill={DOT} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
