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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Must match carousel autoplay delay

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
            'absolute inset-0 object-cover transition-opacity duration-2000 ease-in-out',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
          priority={index === 0}
          data-ai-hint={slide.imageHint}
        />
      ))}
    </>
  );
}
