import { CortexHero } from "@/components/sections/cortex/Hero";
import { CortexCta } from "@/components/sections/cortex/Cta";
import { CortexBento } from "@/components/sections/cortex/Bento";
import { CortexAccordion } from "@/components/sections/cortex/Accordion";
import { FooterContainer } from "@/components/sections/FooterContainer";

/**
 * `?only=<name>` renders one block on its own, with no neighbours, so a single
 * block can be screenshotted and measured in isolation.
 */
const SECTIONS = {
  hero: CortexHero,
  cta: CortexCta,
  bento: CortexBento,
  accordion: CortexAccordion,
  "footer-container": FooterContainer,
} as const;

export default async function Page({
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
      <CortexHero />
      <CortexCta />
      <CortexBento />
      <CortexAccordion />
      <FooterContainer />
    </>
  );
}
