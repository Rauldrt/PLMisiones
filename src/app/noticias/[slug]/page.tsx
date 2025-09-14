
import { getNewsArticleBySlugAction, getNewsAction } from '@/lib/server/data';
import { notFound } from 'next/navigation';
import { NewsArticleClient } from '@/components/NewsArticleClient';
import { InstagramEmbedProcessor } from '@/components/InstagramEmbedProcessor';

// This is a Server Component. It can fetch data and generate static pages.

// This function runs at build time to generate static pages for each news article
export async function generateStaticParams() {
  const news = await getNewsAction();
  return news.map((article) => ({
    slug: article.slug,
  }));
}

// This function runs at build time to generate metadata for each page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlugAction(params.slug);
  if (!article) {
    return { title: 'Noticia no encontrada' };
  }
  return {
    title: article.title,
    description: article.content.substring(0, 150),
  };
}

// This is the page component itself
export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlugAction(params.slug);

  if (!article || article.hidden) {
    notFound();
  }

  // We render a Client Component and pass the article data to it as props.
  // The client component will handle the interactive parts, like the Instagram embed.
  return (
    <>
      <NewsArticleClient article={article} />
      <InstagramEmbedProcessor />
    </>
  );
}
