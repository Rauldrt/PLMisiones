'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { BannerSlide } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnimatedBannerBackgroundProps {
  slides: BannerSlide[];
}

export function AnimatedBannerBackground({ slides }: AnimatedBannerBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * slides.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      });
    }, 7000); // Change image every 7 seconds, decoupled from carousel

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return <div className="absolute inset-0 bg-background z-0" />;
  }

  return (
    <>
      {slides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.imageUrl}
          alt={slide.title}
          fill
          className={cn(
            'absolute inset-0 object-cover transition-opacity duration-[4000ms] ease-in-out',
            index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          )}
          priority={index === 0}
          data-ai-hint={slide.imageHint}
        />
      ))}
    </>
  );
}
