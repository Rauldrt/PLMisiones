
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StreamingItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { clientSanitize } from "@/lib/client-sanitize";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Play, Radio, Calendar, ExternalLink } from "lucide-react";

interface StreamingSectionProps {
    items: StreamingItem[];
}

function extractYouTubeVideoId(embedCodeOrId?: string): string | null {
    if (!embedCodeOrId) return null;
    // If it's already a plain video ID (typically 11 characters)
    if (/^[a-zA-Z0-9_-]{11}$/.test(embedCodeOrId)) {
        return embedCodeOrId;
    }
    // Match youtube.com/embed/VIDEO_ID
    const embedMatch = embedCodeOrId.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    
    // Match youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
    const watchMatch = embedCodeOrId.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];

    return null;
}

function formatDate(dateString?: string) {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function StreamingSection({ items }: StreamingSectionProps) {
    if (!items || items.length === 0) {
        return null;
    }

    const [selectedId, setSelectedId] = useState<string>(items[0]?.id || '');

    // Sync selected item if items change
    useEffect(() => {
        if (items.length > 0 && (!selectedId || !items.some(it => it.id === selectedId))) {
            setSelectedId(items[0].id);
        }
    }, [items, selectedId]);

    const activeItem = items.find(it => it.id === selectedId) || items[0];
    const activeVideoId = activeItem.videoId || extractYouTubeVideoId(activeItem.embedCode) || extractYouTubeVideoId(activeItem.id);

    return (
        <section className="py-16 lg:py-24 relative z-10 bg-transparent" id="streaming">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg p-6 md:p-10 w-full text-foreground bg-gradient-to-br from-card/95 via-purple-50/10 to-card/90">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                Canal Oficial en YouTube
                            </div>
                            <h2 className="font-headline text-3xl font-bold md:text-4xl text-foreground">
                                Streaming Ágora
                            </h2>
                            <p className="mt-2 text-base md:text-lg text-foreground/80">
                                Reviví nuestros últimos programas, transmisiones y debates en vivo.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Button asChild variant="outline" className="rounded-full border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700 font-semibold gap-2">
                                <Link href="https://www.youtube.com/@AGORALIBERTARIA" target="_blank" rel="noopener noreferrer">
                                    <Icons.Youtube className="w-5 h-5 text-red-600 fill-red-600" />
                                    <span>Ver Canal @AGORALIBERTARIA</span>
                                    <ExternalLink className="w-4 h-4 opacity-70" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Main Featured Player Stage */}
                    <div className="mb-10">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/20">
                            {activeVideoId ? (
                                <iframe
                                    key={activeVideoId}
                                    src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&autoplay=0`}
                                    title={activeItem.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center [&_iframe]:w-full [&_iframe]:h-full"
                                    dangerouslySetInnerHTML={{ __html: clientSanitize(activeItem.embedCode) }}
                                />
                            )}
                        </div>

                        {/* Current Playing Info */}
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/40 border border-primary/10">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                    <Radio className="w-3.5 h-3.5" />
                                    <span>Programa Seleccionado</span>
                                </div>
                                <h3 className="font-headline text-lg sm:text-xl font-bold text-foreground line-clamp-1">
                                    {activeItem.title}
                                </h3>
                            </div>
                            {activeItem.publishedAt && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground/70 shrink-0">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(activeItem.publishedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Horizontal Playlist / Carousel */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-headline text-lg font-bold text-foreground flex items-center gap-2">
                                <span>Todos los Programas</span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
                                    {items.length} videos
                                </span>
                            </h4>
                            <p className="text-xs text-foreground/60 hidden sm:block">
                                Hacé clic en cualquier video para reproducirlo arriba
                            </p>
                        </div>

                        <Carousel
                            opts={{
                                align: "start",
                                loop: items.length > 3,
                            }}
                            className="w-full relative"
                        >
                            <CarouselContent className="-ml-4">
                                {items.map((item) => {
                                    const videoId = item.videoId || extractYouTubeVideoId(item.embedCode) || extractYouTubeVideoId(item.id);
                                    const thumbnail = item.thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);
                                    const isSelected = item.id === selectedId;

                                    return (
                                        <CarouselItem key={item.id} className="pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setSelectedId(item.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        setSelectedId(item.id);
                                                    }
                                                }}
                                                className={cn(
                                                    "group flex flex-col h-full rounded-xl p-2.5 border transition-all duration-300 text-left cursor-pointer",
                                                    isSelected
                                                        ? "bg-primary/10 border-primary ring-2 ring-primary/40 shadow-lg scale-[1.02]"
                                                        : "bg-white/40 border-border/40 hover:bg-white/70 hover:border-primary/40 hover:shadow-md"
                                                )}
                                            >
                                                {/* Thumbnail */}
                                                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/80 mb-2.5">
                                                    {thumbnail ? (
                                                        <Image
                                                            src={thumbnail}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 25vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white">
                                                            <Icons.Youtube className="w-8 h-8 text-red-600" />
                                                        </div>
                                                    )}

                                                    {/* Overlay Play Icon */}
                                                    <div className={cn(
                                                        "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                                                        isSelected ? "bg-black/40 opacity-100" : "bg-black/20 opacity-0 group-hover:opacity-100"
                                                    )}>
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center transition-transform",
                                                            isSelected ? "bg-primary text-white scale-110" : "bg-white/90 text-primary group-hover:scale-110"
                                                        )}>
                                                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                                                        </div>
                                                    </div>

                                                    {/* Active badge on thumbnail */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow">
                                                            En pantalla
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Title & Date */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <h5 className={cn(
                                                        "font-headline text-xs sm:text-sm font-bold line-clamp-2 leading-tight transition-colors",
                                                        isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                                                    )}>
                                                        {item.title}
                                                    </h5>
                                                    {item.publishedAt && (
                                                        <p className="text-[11px] text-foreground/60 mt-1.5 flex items-center gap-1">
                                                            <span>{formatDate(item.publishedAt)}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:inline-flex bg-card/90 shadow-md hover:bg-card" />
                            <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex bg-card/90 shadow-md hover:bg-card" />
                        </Carousel>
                    </div>
                </Card>
            </div>
        </section>
    );
}

