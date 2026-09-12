"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Nav } from "./Nav";

function ChromeInner() {
  const params = useSearchParams();
  // `?only=<section>` renders a single block with no shell, for measuring.
  if (params.get("only")) return null;
  return <Nav />;
}

export function Chrome() {
  return (
    <Suspense fallback={null}>
      <ChromeInner />
    </Suspense>
  );
}
