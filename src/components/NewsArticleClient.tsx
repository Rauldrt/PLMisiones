
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import { notFound } from 'next/navigation';
import { clientSanitize } from '@/lib/client-sanitize';
import { useBackground } from '@/components/SiteLayout';
import { Card } from '@/components/ui/card';
import { LinkPreviewCard } from '@/components/LinkPreviewCard';

interface NewsArticleClientProps {
  article: NewsArticle;
  formattedDate: string;
}

export function NewsArticleClient({ article, formattedDate }: NewsArticleClientProps) {
  const { setActiveBg } = useBackground();

  useEffect(() => {
    if (article?.imageUrl) {
      setActiveBg(article.imageUrl);
    }
    return () => {
      setActiveBg('');
    };
  }, [article?.imageUrl, setActiveBg]);

  if (!article) {
    notFound();
  }

  // A simple check to see if the content is primarily an embed.
  const isEmbed = /<iframe|<blockquote/.test(article.content?.trim() || '');
  
  return (
    <article className="py-16 relative z-10 bg-transparent">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg p-6 md:p-10 w-full text-foreground">
          {/* Header inside the main content area */}
          <div className={cn("text-center", isEmbed ? "mb-8" : "")}>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold md:text-5xl text-foreground">{article.title}</h1>
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
                <div className="responsive-video" dangerouslySetInnerHTML={{ __html: clientSanitize(article.content) }} />
              ) : (
                // For standard text articles, we use the prose class for styling.
                <div 
                  className="prose mx-auto max-w-none prose-headings:font-headline prose-a:text-primary prose-strong:text-foreground text-foreground/90" 
                  dangerouslySetInnerHTML={{ __html: clientSanitize(article.content) }}
                />
              )}

              {article.linkPreview && article.linkPreview.url && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Enlace relacionado:</h4>
                  <LinkPreviewCard metadata={article.linkPreview} className="bg-muted/10 border-border/40" />
                </div>
              )}
          </div>
        </Card>
      </div>
    </article>
  );
}
