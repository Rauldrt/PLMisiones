
'use client';
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
    // Note: Toledate string might cause hydration mismatch if server and client locales differ,
    // but without suppressing hydration warning it's best to standardise or accept it.
    // Here we assume it's stable.
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

// ⚡ Bolt: Replace DOM parsing with Regex to allow server-side execution and prevent hydration mismatch, eliminating the need for useEffect
function getCleanContentPreview(htmlContent: string): string {
    // 1. Remove scripts, styles, iframes, blockquotes, and figures completely
    let clean = htmlContent.replace(/<(script|style|iframe|blockquote|figure)[^>]*>[\s\S]*?<\/\1>/gi, '');
    // 2. Strip remaining HTML tags
    clean = clean.replace(/<[^>]+>/g, ' ');
    // 3. Normalize whitespace
    clean = clean.replace(/\s+/g, ' ').trim();
    // 4. Fallback logic: truncate
    return clean.substring(0, 150) + (clean.length > 150 ? '...' : '');
}

export function NewsCard({ article }: { article: NewsArticle }) {
    // ⚡ Bolt: Calculate directly during render.
    // This removes the useEffect, preventing a second re-render cycle for every NewsCard.
    const isEmbed = /<iframe|<blockquote|<div class="fb-video"|<div class="fb-post"/.test(article.content?.trim() || '');
    const cleanContent = isEmbed ? '' : getCleanContentPreview(article.content);

    return (
        <Card className="flex w-full flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
            <CardHeader className="p-0">
                <div className="relative w-full bg-muted overflow-hidden">
                    <Link
                      href={`/noticias/${article.slug}`}
                      className={cn(
                        "block w-full",
                         (article.imageUrl || isEmbed) && "h-[500px]"
                      )}
                      aria-label={article.title}
                    >
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
                </div>
                <div className="p-6 pb-2">
                    <CardTitle className="font-headline text-xl leading-tight">
                        <Link href={`/noticias/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-foreground/60 mt-2" suppressHydrationWarning>{formatDate(article.date)}</p>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 px-4 pt-0">
                <p className="text-foreground/80 line-clamp-4">
                    {cleanContent}
                </p>
            </CardContent>
            <div className="px-4 pt-0 pb-2 mt-auto">
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/noticias/${article.slug}`}>
                        Leer más
                    </Link>
                </Button>
            </div>
        </Card>
    );
}
