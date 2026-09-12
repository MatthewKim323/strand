"use client";

import { Button } from "@/components/ui/Button";
import { T } from "./ui";

const CSS = `
.cx-cta {
  position: relative; display: flex; flex: none; flex-flow: column nowrap;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.cx-cta-frame {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  align-content: center; justify-content: space-between; align-items: center;
  width: 100%; max-width: 1400px; height: min-content; padding: 60px 40px; overflow: clip;
}
.cx-cta-copy-slot { flex: none; width: auto; }
.cx-cta-copy {
  position: relative; flex: none; width: 418px; height: auto; margin: 0;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
  color: ${T.bright};
}
.cx-cta-buttons {
  position: relative; display: flex; flex: none; flex-flow: row nowrap;
  place-content: center; align-items: center; gap: 12px;
  width: min-content; height: min-content; padding: 0; overflow: clip;
}
@media (max-width: 1199.98px) { .cx-cta { padding: 0; } }
@media (max-width: 809.98px) {
  .cx-cta-frame { flex-direction: column; justify-content: flex-start; gap: 20px; padding: 40px 20px; }
  .cx-cta-copy-slot { width: 100%; }
  .cx-cta-copy { width: 100%; }
}
`;

export function CortexCta() {
  return (
    <>
      <style>{CSS}</style>
      <div className="cx-cta" data-cx-block="cta">
        <div className="cx-cta-frame">
          <div className="cx-cta-copy-slot">
            <p className="t-body cx-cta-copy">
              The knowledge graph that connects everything. Relationships mapped automatically, in real
              time.
            </p>
          </div>
          <div className="cx-cta-buttons">
            <div>
              <Button variant="primary" size="xl" href="/contact-us">
                Get started
              </Button>
            </div>
            <div>
              <Button variant="secondary" size="xl" href="/pricing">
                View prices
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
