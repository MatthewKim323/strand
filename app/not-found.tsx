import { NotFoundBlock } from "@/components/sections/notfound/NotFoundBlock";
import { Footer } from "@/components/layout/Footer";

/** The footer on this route is the footer alone: no call-to-action panel. */
function FooterContainer() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexFlow: "column nowrap",
        flex: "none",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        gap: 0,
        width: "100%",
        height: "min-content",
        padding: 0,
        overflow: "visible",
        boxShadow:
          "inset 0 1px 0 0 var(--token-f3013730-45dd-4b90-8bef-48999f95aa1d, rgb(38, 38, 38))",
      }}
    >
      <Footer />
    </div>
  );
}

/**
 * Next's catch-all for unmatched routes. It cannot read search params, so this
 * route has no `?only=` isolation mode: measure it by hitting any URL that does
 * not resolve.
 */
export default function NotFound() {
  return (
    <>
      <NotFoundBlock />
      <FooterContainer />
    </>
  );
}
