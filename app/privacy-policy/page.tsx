import { LegalBlock } from "@/components/sections/legal/LegalBlock";
import { PRIVACY_POLICY } from "@/components/sections/legal/content";
import { Footer } from "@/components/layout/Footer";

function PrivacyPolicyBlock() {
  return <LegalBlock doc={PRIVACY_POLICY} />;
}

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
 * `?only=<name>` renders one block on its own, with no shell, so a single
 * section can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  "0": PrivacyPolicyBlock,
  "privacy-policy": PrivacyPolicyBlock,
  "footer-container": FooterContainer,
} as const;

export default async function PrivacyPolicyPage({
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
      <PrivacyPolicyBlock />
      <FooterContainer />
    </>
  );
}
