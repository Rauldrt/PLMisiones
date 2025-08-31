
'use client';

import Image from 'next/image';
import type { BannerSlide } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AnimatedBannerBackgroundProps {
  slides: BannerSlide[];
}

export function AnimatedBannerBackground({ slides }: AnimatedBannerBackgroundProps) {
  return (
    <>
      {slides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.imageUrl}
          alt=""
          fill
          className={cn(
            'absolute inset-0 object-cover transition-opacity duration-2000 ease-in-out',
            'animate-fade-in-out'
          )}
          style={{ animationDelay: `${index * 5}s` }}
          priority={index === 0}
          data-ai-hint={slide.imageHint}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
       <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          className="relative w-full h-full"
        >
          <CarouselContent className="h-full">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="group h-full">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="container px-4 sm:px-6 lg:px-8">
                      <h1 className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-7xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.2s' }}>
                        {slide.title}
                      </h1>
                      <p className="mt-4 max-w-3xl mx-auto text-lg text-white/80 md:text-xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.4s' }}>
                        {slide.subtitle}
                      </p>
                      <div className="opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.6s' }}>
                        <Button asChild size="lg" className="mt-8">
                          <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
           <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
    </>
  );
}
