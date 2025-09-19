
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';

function formatDate(dateString: string) {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString; // Fallback for invalid date format
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    // Use UTC to prevent timezone shifts between server and client
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC', 
    });
}

export function NewsCard({ article }: { article: NewsArticle }) {
    const [isClient, setIsClient] = useState(false);
    const [cleanContent, setCleanContent] = useState('');

    useEffect(() => {
        setIsClient(true);
        // On the client, create a clean version of the content without scripts or blockquotes for the preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        
        // Remove script tags
        Array.from(tempDiv.getElementsByTagName('script')).forEach(script => script.remove());
        
        // Find the first paragraph or text content
        let previewText = (tempDiv.querySelector('p')?.textContent || tempDiv.textContent || '').trim();
        
        setCleanContent(previewText);

    }, [article.content]);

    const isEmbed = /<iframe|<blockquote/.test(article.content?.trim() || '');

    return (
        <Card className="flex w-full min-h-[500px] flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
            <CardHeader className="p-0">
                {isEmbed && isClient ? (
                     <div className="relative h-48 w-full bg-muted">
                        <div className="responsive-video h-full w-full" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                ) : (
                    article.imageUrl && (
                        <div className="relative h-48 w-full bg-muted">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                                data-ai-hint={article.imageHint}
                            />
                        </div>
                    )
                )}
                <div className="p-6">
                    <CardTitle className="font-headline text-xl leading-tight">
                        <Link href={`/noticias/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-foreground/60 mt-2">{formatDate(article.date)}</p>
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
