
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import { notFound } from 'next/navigation';

interface NewsArticleClientProps {
  article: NewsArticle;
}

declare global {
  interface Window {
    instgrm?: any;
  }
}

export function NewsArticleClient({ article }: NewsArticleClientProps) {
  
  if (!article) {
    notFound();
  }

  const isEmbed = /<iframe|<blockquote/.test(article.content?.trim() || '');
  const isInstagramEmbed = isEmbed && article.content.includes('instagram-media');

  useEffect(() => {
    if (isInstagramEmbed) {
      const scriptId = 'instagram-embed-script';
      let script = document.getElementById(scriptId);

      const processInstagram = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.onload = processInstagram;
        document.body.appendChild(script);
      } else {
        // If script already exists, it might have been loaded on a previous page.
        // We just need to tell it to process the new embeds on this page.
        processInstagram();
      }
    }
  }, [isInstagramEmbed, article.id]); // Rerun whenever the article ID changes
  
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
            'w-full mt-8',
            !isEmbed && 'prose prose-invert mx-auto max-w-full prose-headings:font-headline prose-a:text-foreground/80 prose-strong:text-foreground'
        )}
      >
        {isEmbed ? (
          <div className="responsive-video flex justify-center" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
    </article>
  );
}
