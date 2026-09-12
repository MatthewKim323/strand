import { PricingBlock } from "@/components/sections/pricing/PricingBlock";
import { Footer } from "@/components/layout/Footer";

/**
 * `?only=<name>` renders one block on its own, with no shell, so a single
 * section can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  "1": PricingBlock,
  pricing: PricingBlock,
  "footer-container": FooterContainer,
} as const;

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

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ only?: string }>;
}) {
  const { only } = await searchParams;
  const One = only ? SECTIONS[only as keyof typeof SECTIONS] : undefined;
  if (One)
    return (
      <div data-only style={{ width: "100%" }}>
        <One />
      </div>
    );

  return (
    <>
      <PricingBlock />
      <FooterContainer />
    </>
  );
}
