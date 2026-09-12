import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES } from "@/components/sections/blog/articles";
import { ArticleBlock, ArticleCss } from "@/components/sections/article/ArticleBlock";
import { FooterContainer } from "@/components/sections/FooterContainer";

/** Every article in the collection gets a page, so no link from /blog 404s. */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} - Nordwell`,
    description: article.description || undefined,
  };
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  /** `?only=<name>` renders one block on its own, for measurement. */
  searchParams: Promise<{ only?: string }>;
}) {
  const { slug } = await params;
  const { only } = await searchParams;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  if (only === "0" || only === "blog")
    return (
      <div data-only style={{ width: "100%" }}>
        <ArticleCss />
        <ArticleBlock article={article} />
      </div>
    );

  if (only === "1" || only === "footer-container")
    return (
      <div data-only style={{ width: "100%" }}>
        <FooterContainer />
      </div>
    );

  return (
    <>
      <ArticleCss />
      <ArticleBlock article={article} />
      <FooterContainer />
    </>
  );
}
