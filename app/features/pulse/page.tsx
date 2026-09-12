import { FooterContainer } from "@/components/sections/FooterContainer";
import { PulseBento } from "@/components/sections/pulse/PulseBento";
import { PulseHero } from "@/components/sections/pulse/PulseHero";
import { PulseShowcase } from "@/components/sections/pulse/PulseShowcase";
import { PulseStatement } from "@/components/sections/pulse/PulseStatement";

/**
 * `?only=<name>` renders one block on its own, with no shell, so a single
 * block can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  hero: PulseHero,
  bento: PulseBento,
  statement: PulseStatement,
  showcase: PulseShowcase,
  "footer-container": FooterContainer,
} as const;

export default async function PulsePage({
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
      <PulseHero />
      <PulseBento />
      <PulseStatement />
      <PulseShowcase />
      <FooterContainer />
    </>
  );
}
