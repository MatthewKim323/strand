"use client";

import { C_MUTED, C_TEXT, ChromaticRule, overlay } from "./parts";

const CSS = `
.pu-statement {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 16px;
  width: 100%; height: min-content; padding: 0 64px; overflow: clip;
}
.pu-statement-container {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  max-width: 1400px; width: 100%; height: min-content; padding: 0; overflow: clip;
}
.pu-statement-content {
  position: relative; display: flex; flex-flow: column nowrap; flex: none;
  place-content: center; align-items: center; gap: 0;
  max-width: 1400px; width: 100%; height: min-content; padding: 160px 120px; overflow: clip;
}
.pu-statement-text {
  position: relative; flex: none; width: 100%; height: auto;
  white-space: pre-wrap; word-break: break-word; word-wrap: break-word;
}
@media (max-width: 1199.98px) {
  .pu-statement { padding: 0; }
  .pu-statement-line { display: none; }
  .pu-statement-content { padding: 120px; }
}
@media (max-width: 809.98px) {
  .pu-statement-content { padding: 80px 40px; }
}
`;

export function PulseStatement() {
  return (
    <div className="pu-statement" id="pulse-statement">
      <style>{CSS}</style>

      <div className="pu-statement-container">
        <span
          className="pu-statement-line"
          style={overlay({
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(41, 37, 36))",
          })}
        />

        <ChromaticRule />

        <div className="pu-statement-content">
          <div className="pu-statement-text">
            <h2 className="t-h2" style={{ textAlign: "center" }}>
              <span style={{ color: C_MUTED }}>Most tools alert you to everything.</span>
              <br />
              <span style={{ color: C_TEXT }}>Pulse only tells you what matters.</span>
            </h2>
          </div>
        </div>

        <ChromaticRule />
      </div>
    </div>
  );
}
