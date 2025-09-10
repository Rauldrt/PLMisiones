
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
      
      const processInstagram = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };

      const script = document.getElementById(scriptId);
      if (!script) {
        const newScript = document.createElement('script');
        newScript.id = scriptId;
        newScript.src = '//www.instagram.com/embed.js';
        newScript.async = true;
        newScript.onload = processInstagram;
        document.body.appendChild(newScript);
      } else {
        processInstagram();
      }
    }
  }, [isInstagramEmbed, article.id, article.content]);
  
  return (
    <article className="py-16">
      <div className="container max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Publicado el {new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {article.imageUrl && !isEmbed && (
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      )}

      <div className="w-full mt-8">
        {isEmbed ? (
          <div className="responsive-video" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <div className="prose prose-invert mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose-headings:font-headline prose-a:text-foreground/80 prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
    </article>
  );
}
