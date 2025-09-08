
'use client';

import { getNews, getNewsArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NewsArticle } from '@/lib/types';
import { useEffect, useState } from 'react';

// Although this is a client component, we can still fetch data on the server
// by moving the data fetching logic outside the component.
// However, for simplicity in this case where we need client-side effects
// for the Instagram embed, we'll fetch inside a `useEffect` hook.

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<NewsArticle | null | undefined>(undefined);
  
  const isEmbed = article && /<iframe|<blockquote/.test(article.content.trim());

  useEffect(() => {
    async function loadArticle() {
      const articleData = await getNewsArticleBySlug(params.slug);
      setArticle(articleData);
    }
    loadArticle();
  }, [params.slug]);
  
  useEffect(() => {
    // This effect runs after the component mounts and the article content is rendered.
    // It triggers the Instagram embed script to process any blockquotes.
    if (isEmbed && typeof (window as any).instgrm !== 'undefined') {
      (window as any).instgrm.Embeds.process();
    }
  }, [isEmbed, article]);

  if (article === undefined) {
    // Loading state
    return <div className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">Cargando...</div>;
  }

  if (!article) {
    notFound();
  }
  
  return (
    <article className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Publicado el {new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {article.imageUrl && !isEmbed && (
        <div className="relative my-8 h-64 md:h-96 w-full overflow-hidden rounded-lg">
            <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                data-ai-hint={article.imageHint}
            />
        </div>
      )}

      <div
        className={cn(
            'mt-8',
            isEmbed 
                ? 'flex justify-center' 
                : 'prose prose-invert mx-auto max-w-full prose-headings:font-headline prose-a:text-foreground/80 prose-strong:text-foreground'
        )}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

// Keeping metadata generation on the server
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Noticia no encontrada' };
  }
  return {
    title: article.title,
    description: article.content.substring(0, 150),
  };
}

// Keeping static params generation on the server
export async function generateStaticParams() {
  const news = await getNews();
  return news.map((article) => ({
    slug: article.slug,
  }));
}
