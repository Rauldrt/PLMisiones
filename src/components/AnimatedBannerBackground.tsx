
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { BannerSlide } from '@/lib/types';
import { cn } from '@/lib/utils';

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
            'absolute inset-0 object-cover transition-opacity duration-1000 ease-in-out',
            'animate-fade-in-out'
          )}
          style={{ animationDelay: `${index * 5}s` }}
          priority={index === 0}
          data-ai-hint={slide.imageHint}
        />
      ))}
    </>
  );
}
