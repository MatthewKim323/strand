import { AskHero } from "@/components/sections/ask/AskHero";
import { AskBento } from "@/components/sections/ask/AskBento";
import { AskUsps } from "@/components/sections/ask/AskUsps";
import { AskStatistics } from "@/components/sections/ask/AskStatistics";
import { FooterContainer } from "@/components/sections/FooterContainer";

/**
 * `?only=<name>` renders one block on its own, with no shell, so a single
 * block can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  hero: AskHero,
  bento: AskBento,
  "ask-usps": AskUsps,
  statistics: AskStatistics,
  "footer-container": FooterContainer,
} as const;

export default async function AskPage({
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
      <AskHero />
      <AskBento />
      <AskUsps />
      <AskStatistics />
      <FooterContainer />
    </>
  );
}
