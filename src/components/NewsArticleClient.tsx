
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import { notFound } from 'next/navigation';

interface NewsArticleClientProps {
  article: NewsArticle;
  formattedDate: string;
}

export function NewsArticleClient({ article, formattedDate }: NewsArticleClientProps) {
  
  if (!article) {
    notFound();
  }

  // A simple check to see if the content is primarily an embed.
  const isEmbed = /<iframe|<blockquote/.test(article.content?.trim() || '');
  
  return (
    <article className="py-16">
      <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", isEmbed ? "max-w-4xl" : "max-w-4xl")}>
        
        {/* Header inside the main content area */}
        <div className={cn("text-center", isEmbed ? "mb-8" : "")}>
          <h1 className="font-headline text-4xl font-bold md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-foreground/60">
            Publicado el {formattedDate}
          </p>
        </div>
        
        {/* Media (Image or Embed) */}
        <div className="mt-8 w-full">
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

            {isEmbed ? (
              // For embeds, we let them take the full width of the container.
              <div className="responsive-video" dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              // For standard text articles, we use the prose class for styling.
              <div 
                className="prose prose-invert mx-auto max-w-4xl prose-headings:font-headline prose-a:text-foreground/80 prose-strong:text-foreground" 
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            )}
        </div>

      </div>
    </article>
  );
}
