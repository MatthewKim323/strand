import { AboutUs } from "@/components/sections/about/AboutUs";
import { FooterContainer } from "@/components/sections/FooterContainer";

/**
 * `?only=<name>` renders one block on its own, with no shell, so it can be
 * screenshotted and measured in isolation.
 */
const SECTIONS = {
  "about-us": AboutUs,
  "footer-container": FooterContainer,
} as const;

export default async function AboutPage({
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
      <AboutUs />
      <FooterContainer />
    </>
  );
}
