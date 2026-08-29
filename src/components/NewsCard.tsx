
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Icons } from './icons';
import { clientSanitize } from '@/lib/client-sanitize';

function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

function getCleanContentPreview(htmlContent: string): string {
    if (typeof window === 'undefined') {
        // Provide a simple fallback for server-side rendering
        return htmlContent.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Remove elements that are not part of the main text
    tempDiv.querySelectorAll('script, style, iframe, blockquote, figure').forEach(el => el.remove());
    
    // Find the first paragraph with meaningful content
    const firstParagraph = Array.from(tempDiv.querySelectorAll('p')).find(p => p.textContent?.trim());
    
    return (firstParagraph?.textContent || tempDiv.textContent || '').trim();
}


export function NewsCard({ article }: { article: NewsArticle }) {
    const [isClient, setIsClient] = useState(false);
    const [cleanContent, setCleanContent] = useState('');
    const [isEmbed, setIsEmbed] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const contentIsEmbed = /<iframe|<blockquote|<div class="fb-video"|<div class="fb-post"/.test(article.content?.trim() || '');
        setIsEmbed(contentIsEmbed);
        setCleanContent(contentIsEmbed ? '' : getCleanContentPreview(article.content));
    }, [article.content]);

    return (
        <Card className="flex w-full flex-col overflow-hidden bg-card/90 border border-white/80 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_10px_30px_-10px_rgba(139,31,164,0.15)] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.22),0_0_25px_rgba(249,115,22,0.3),0_15px_35px_-5px_rgba(139,31,164,0.3)] rounded-[1.8rem] sm:rounded-[2.5rem] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2.5 h-[42vh] sm:h-auto sm:min-h-[460px]">
            <CardHeader className="p-0">
                <div className="relative w-full bg-muted overflow-hidden">
                    {(() => {
                        const finalImageUrl = article.imageUrl || article.linkPreview?.imageUrl;
                        return (
                            <Link
                              href={`/noticias/${article.slug}`}
                              className={cn(
                                "block w-full relative",
                                 (finalImageUrl || isEmbed) ? "h-[23vh] sm:h-60" : "h-[15vh] sm:h-40"
                              )}
                              aria-label={article.title}
                            >
                                {finalImageUrl ? (
                                    <Image
                                        src={finalImageUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        data-ai-hint={article.imageHint}
                                    />
                                ) : isEmbed ? (
                            <div className="relative h-full w-full">
                                <div className="pointer-events-none absolute inset-0 z-10" />
                                <div 
                                    className="h-full w-full flex items-center justify-center [&_iframe]:h-full [&_iframe]:w-full [&_blockquote]:h-auto [&_blockquote]:w-full"
                                    // Security: Sanitize article content to prevent XSS attacks
                                    dangerouslySetInnerHTML={{ __html: clientSanitize(article.content) }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full bg-secondary text-primary aspect-video">
                               <Icons.Media className="w-12 h-12" />
                            </div>
                        )}
                    </Link>
                        );
                    })()}
                </div>
                <div className="p-3 pb-1 sm:p-6 sm:pb-2">
                    <CardTitle className="font-headline text-sm sm:text-xl leading-tight line-clamp-2">
                        <Link href={`/noticias/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    {isClient && <p className="text-[10px] sm:text-sm text-foreground/60 mt-0.5 sm:mt-2">{formatDate(article.date)}</p>}
                </div>
            </CardHeader>
            <CardContent className="flex-grow min-h-0 px-3 pt-0 sm:px-6">
                <p className="text-foreground/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                    {cleanContent}
                </p>
            </CardContent>
            <div className="px-3 pt-0 pb-2 sm:px-6 sm:pb-4 mt-auto">
                {article.linkPreview?.url ? (
                    <Button asChild variant="link" className="p-0 h-auto text-xs sm:text-sm">
                        <a href={article.linkPreview.url} target="_blank" rel="noopener noreferrer">
                            Leer más
                        </a>
                    </Button>
                ) : (
                    <Button asChild variant="link" className="p-0 h-auto text-xs sm:text-sm">
                        <Link href={`/noticias/${article.slug}`}>
                            Leer más
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
    );
}
