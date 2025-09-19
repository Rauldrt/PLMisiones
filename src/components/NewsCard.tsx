
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/lib/types';

function formatDate(dateString: string) {
    // Handles cases where date might not be in YYYY-MM-DD format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // Use UTC to prevent timezone shifts between server and client
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

function getCleanContentPreview(htmlContent: string): string {
    if (typeof window === 'undefined') {
        // Return a basic preview on the server
        return htmlContent.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Remove elements that shouldn't be part of a text preview
    tempDiv.querySelectorAll('script, style, iframe, blockquote, figure').forEach(el => el.remove());
    
    // Find the first paragraph with meaningful text
    const firstParagraph = Array.from(tempDiv.querySelectorAll('p')).find(p => p.textContent?.trim());
    
    return (firstParagraph?.textContent || tempDiv.textContent || '').trim();
}

export function NewsCard({ article }: { article: NewsArticle }) {
    const [isClient, setIsClient] = useState(false);
    const [cleanContent, setCleanContent] = useState('');

    useEffect(() => {
        setIsClient(true);
        setCleanContent(getCleanContentPreview(article.content));
    }, [article.content]);

    return (
        <Card className="flex w-full min-h-[500px] flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
            <CardHeader className="p-0">
                <Link href={`/noticias/${article.slug}`} className="block relative h-48 w-full bg-muted" aria-label={article.title}>
                    {article.imageUrl ? (
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            data-ai-hint={article.imageHint}
                        />
                    ) : (
                        // Placeholder when no image is available, especially for embeds
                        <div className="flex items-center justify-center h-full w-full bg-secondary">
                             {isClient && /youtube\.com|youtu\.be/.test(article.content) && <div className="text-red-500 w-12 h-12 i-logos-youtube-icon"></div>}
                            {isClient && /instagram\.com/.test(article.content) && <div className="text-pink-500 w-12 h-12 i-logos-instagram-icon"></div>}
                             {isClient && /facebook\.com/.test(article.content) && <div className="text-blue-600 w-12 h-12 i-logos-facebook"></div>}
                        </div>
                    )}
                </Link>
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
