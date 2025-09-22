
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublicImagesAction } from "@/actions/gallery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface ImageGalleryProps {
    onImageSelect: (url: string) => void;
}

export function ImageGallery({ onImageSelect }: ImageGalleryProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadImages() {
            setIsLoading(true);
            const images = await getPublicImagesAction();
            // Sort images to show newest first, assuming they might have date-like names
            const sortedImages = images.sort((a, b) => b.localeCompare(a));
            setImageUrls(sortedImages);
            setIsLoading(false);
        }
        loadImages();
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

    if (imageUrls.length === 0) {
        return <div className="flex items-center justify-center h-full min-h-48"><p>No se encontraron imágenes en la carpeta /public.</p></div>
    }

    return (
        <ScrollArea className="h-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                {imageUrls.map((url, index) => (
                    <button
                        key={url}
                        onClick={() => onImageSelect(url)}
                        className="relative aspect-square w-full rounded-md overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        <Image
                            src={url}
                            alt={`Imagen de la galería ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                            <p className="text-white text-xs truncate">{url.split('/').pop()}</p>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    )
}
