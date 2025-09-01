
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Icons } from './icons';
import { cn } from '@/lib/utils';

interface MosaicLightboxProps {
  images: string[];
  imageHints?: string[];
  title: string;
  onClose: () => void;
}

export function MosaicLightbox({ images, imageHints, title, onClose }: MosaicLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in-0"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 text-white">
          <h2 className="text-2xl font-headline">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 hover:text-white">
            <Icons.Close className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <Carousel className="w-full flex-1" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {images.map((src, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <div className="relative w-full h-[80%]">
                    <Image
                      src={src}
                      alt={`${title} - Imagen ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      data-ai-hint={imageHints ? imageHints[index] : ''}
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 border-none" />
        </Carousel>
      </div>
    </div>
  );
}
