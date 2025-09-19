
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

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
        <Card className="flex w-full flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
            <CardHeader className="p-0">
                <div className={cn(
                    "relative w-full bg-muted overflow-hidden max-h-[500px]",
                )}>
                    <Link href={`/noticias/${article.slug}`} className="block h-[500px] w-full" aria-label={article.title}>
                        {article.imageUrl ? (
                            <Image
                                src={article.imageUrl}
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
                                    className="h-full w-full [&_iframe]:!h-full [&_iframe]:!w-full [&_blockquote]:h-auto [&_blockquote]:w-full"
                                    dangerouslySetInnerHTML={{ __html: article.content }} 
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full bg-secondary text-primary aspect-video">
                               <Icons.Media className="w-12 h-12" />
                            </div>
                        )}
                    </Link>
                </div>
                <div className="p-6">
                    <CardTitle className="font-headline text-xl leading-tight">
                        <Link href={`/noticias/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    {isClient && <p className="text-sm text-foreground/60 mt-2">{formatDate(article.date)}</p>}
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-6 pt-0">
                <p className="text-foreground/80 line-clamp-4">
                    {cleanContent}
                </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/noticias/${article.slug}`}>
                        Leer más
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
