import { Hero } from "@/components/sections/Hero";
import { Steps } from "@/components/sections/Steps";
import { Partners } from "@/components/sections/Partners";
import { Conversation } from "@/components/sections/Conversation";
import { Features } from "@/components/sections/Features";
import { Integrations } from "@/components/sections/Integrations";
import { Testimonials } from "@/components/sections/Testimonials";
import { Statistics } from "@/components/sections/Statistics";
import { Faq } from "@/components/sections/Faq";
import { FooterContainer } from "@/components/sections/FooterContainer";

/**
 * `?only=<name>` renders one section on its own, with no shell, so a single
 * block can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  hero: Hero,
  steps: Steps,
  partners: Partners,
  conversation: Conversation,
  features: Features,
  integrations: Integrations,
  testimonials: Testimonials,
  statistics: Statistics,
  faq: Faq,
  "footer-container": FooterContainer,
} as const;

export default async function Home({
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
      <Hero />
      <Steps />
      <Partners />
      <Conversation />
      <Features />
      <Integrations />
      <Testimonials />
      <Statistics />
      <Faq />
      <FooterContainer />
    </>
  );
}
