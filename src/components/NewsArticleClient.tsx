
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import { notFound } from 'next/navigation';

interface NewsArticleClientProps {
  article: NewsArticle;
}

export function NewsArticleClient({ article }: NewsArticleClientProps) {
  // The ?.trim() is important because content could be null/undefined initially
  const isEmbed = article && /<iframe|<blockquote/.test(article.content?.trim() || '');

  useEffect(() => {
    // This effect runs after the component mounts and the article content is rendered.
    // It triggers the Instagram embed script to process any blockquotes.
    if (isEmbed && typeof (window as any).instgrm !== 'undefined') {
      (window as any).instgrm.Embeds.process();
    }
  }, [isEmbed, article]);

  if (!article) {
    // This should technically be handled by the parent server component,
    // but as a fallback, we can call notFound() here too.
    return notFound();
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
