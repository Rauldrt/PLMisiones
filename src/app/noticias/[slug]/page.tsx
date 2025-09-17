import { getNewsArticleBySlugAction, getNewsAction } from '@/actions/data';
import { notFound } from 'next/navigation';
import { NewsArticleClient } from '@/components/NewsArticleClient';
import { InstagramEmbedProcessor } from '@/components/InstagramEmbedProcessor';
import type { Metadata } from 'next';

// This is a Server Component. It can fetch data and generate static pages.

// This function runs at build time to generate static pages for each news article
export async function generateStaticParams() {
  const news = await getNewsAction();
  return news.map((article) => ({
    slug: article.slug,
  }));
}

// This function runs at build time to generate metadata for each page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getNewsArticleBySlugAction(params.slug);
  if (!article) {
    return { title: 'Noticia no encontrada' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partidolibertariomisiones.com.ar';
  const articleUrl = `${siteUrl}/noticias/${article.slug}`;
  const articleDescription = article.content.replace(/<[^>]*>?/gm, '').substring(0, 155);
  const imageUrl = article.imageUrl ? `${siteUrl}${article.imageUrl}` : `${siteUrl}/logo-banner.png`;

  return {
    title: article.title,
    description: articleDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: articleDescription,
      url: articleUrl,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: articleDescription,
      images: [imageUrl],
    },
  };
}

export function formatDate(dateString: string) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC', // Use UTC to avoid timezone shifts
    });
}


// This is the page component itself
export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlugAction(params.slug);

  if (!article || article.hidden) {
    notFound();
  }
  
  const formattedDate = formatDate(article.date);

  // We render a Client Component and pass the article data to it as props.
  // The client component will handle the interactive parts, like the Instagram embed.
  return (
    <>
      <NewsArticleClient article={article} formattedDate={formattedDate} />
      <InstagramEmbedProcessor />
    </>
  );
}
