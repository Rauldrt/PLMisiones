'use client';

import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { BannerSlide } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatedBannerBackground } from './AnimatedBannerBackground';

interface BannerProps {
    bannerSlides: BannerSlide[];
}

export function Banner({ bannerSlides }: BannerProps) {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] md:h-[80vh] overflow-hidden">
        <AnimatedBannerBackground slides={bannerSlides} />
        <div className="absolute inset-0 z-20 bg-black/60" />
        <div className="relative z-30 h-full w-full">
            <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                className="w-full h-full"
            >
                <CarouselContent className="h-full">
                    {bannerSlides.map((slide) => (
                    <CarouselItem key={slide.id} className="group h-full">
                        <div className="relative h-full w-full">
                        <div className="w-full h-full px-4 flex flex-col items-center justify-center text-center py-16 md:py-24">
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
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
        </div>
      </section>
  )
}
