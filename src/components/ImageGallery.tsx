
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublicImagesAction } from "@/actions/gallery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Icons } from "./icons";
import path from "path";

interface ImageGalleryProps {
    onImageSelect: (url: string) => void;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

export function ImageGallery({ onImageSelect }: ImageGalleryProps) {
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadMedia() {
            setIsLoading(true);
            const media = await getPublicImagesAction();
            // Sort media to show newest first, assuming they might have date-like names
            const sortedMedia = media.sort((a, b) => b.localeCompare(a));
            setMediaUrls(sortedMedia);
            setIsLoading(false);
        }
        loadMedia();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                {Array.from({ length: 18 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                ))}
            </div>
        )
    }

    if (mediaUrls.length === 0) {
        return <div className="flex items-center justify-center h-full min-h-48"><p>No se encontraron archivos en la carpeta /public.</p></div>
    }

    const getMediaIcon = (url: string) => {
        const extension = path.extname(url).toLowerCase();
        if (['.mp4', '.webm'].includes(extension)) {
            return <Icons.Media className="h-10 w-10 text-muted-foreground" />;
        }
        if (['.mp3', '.wav', '.ogg'].includes(extension)) {
            return <Icons.Music2 className="h-10 w-10 text-muted-foreground" />;
        }
        return null;
    }

    return (
        <ScrollArea className="h-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                {mediaUrls.map((url, index) => {
                    const extension = path.extname(url).toLowerCase();
                    const isImage = IMAGE_EXTENSIONS.includes(extension);
                    const MediaIcon = getMediaIcon(url);

                    return (
                        <button
                            key={url}
                            onClick={() => onImageSelect(url)}
                            className="relative aspect-square w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted flex items-center justify-center"
                        >
                            {isImage ? (
                                <Image
                                    src={url}
                                    alt={`Contenido de la galería ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                MediaIcon
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                <p className="text-white text-xs truncate">{url.split('/').pop()}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </ScrollArea>
    )
}
