import { IntegrationsDirectory } from "@/components/sections/integrations-page/IntegrationsDirectory";
import { FooterContainer } from "@/components/sections/FooterContainer";

/**
 * `?only=<name>` renders one block on its own, with no shell, so it can be
 * screenshotted and measured in isolation. Names: hero, categories,
 * integrations, footer-container.
 */
export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ only?: string }>;
}) {
  const { only } = await searchParams;

  if (only === "footer-container")
    return (
      <div data-only style={{ width: "100%" }}>
        <FooterContainer />
      </div>
    );

  if (only)
    return (
      <div data-only style={{ width: "100%" }}>
        <IntegrationsDirectory only={only} />
      </div>
    );

  return (
    <>
      <IntegrationsDirectory />
      <FooterContainer />
    </>
  );
}
