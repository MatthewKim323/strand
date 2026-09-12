import { Footer } from "@/components/layout/Footer";
import {
  BlogCss,
  BlogDivider,
  BlogTitle,
  FeaturedArticles,
  LatestArticles,
  LatestHeading,
} from "@/components/sections/blog/blocks";

/** The footer on this route is the footer alone: no call-to-action panel. */
function FooterContainer() {
  return (
    <div className="bl-footer">
      <Footer />
    </div>
  );
}

/**
 * `?only=<name>` renders one block on its own, with no shell, so a single
 * block can be screenshotted and measured without the rest of the page.
 */
const SECTIONS = {
  "0": BlogTitle,
  title: BlogTitle,
  "1": FeaturedArticles,
  "featured-articles": FeaturedArticles,
  divider: BlogDivider,
  "2": LatestHeading,
  latest: LatestHeading,
  "3": LatestArticles,
  "latest-articles": LatestArticles,
  "4": FooterContainer,
  "footer-container": FooterContainer,
} as const;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ only?: string }>;
}) {
  const { only } = await searchParams;
  const One = only ? SECTIONS[only as keyof typeof SECTIONS] : undefined;
  if (One)
    return (
      <div data-only style={{ width: "100%" }}>
        <BlogCss />
        <One />
      </div>
    );

  return (
    <>
      <BlogCss />
      <BlogTitle />
      <FeaturedArticles />
      <BlogDivider />
      <LatestHeading />
      <LatestArticles />
      <FooterContainer />
    </>
  );
}
