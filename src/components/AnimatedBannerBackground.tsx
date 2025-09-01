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

    const currentSlide = slides[currentIndex];
    const duration = (currentSlide?.animationDuration || 10) * 1000;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [slides, currentIndex]);
  
  if (!slides || slides.length === 0) {
    return <div className="absolute inset-0 bg-background z-0" />;
  }
  
  const currentSlide = slides[currentIndex];
  const overlayOpacity = currentSlide?.overlayOpacity ?? 0.7;

  return (
    <>
      {slides.map((slide, index) => {
        const animationType = slide.animationType || 'zoom-in';
        const animationDuration = slide.animationDuration || 10;
        
        return (
          <Image
            key={slide.id}
            src={slide.imageUrl}
            alt={slide.title}
            fill
            className={cn(
              'absolute inset-0 object-cover transition-opacity ease-linear',
              index === currentIndex ? `opacity-100 animate-${animationType}` : 'opacity-0',
            )}
            style={{ 
              animationDuration: `${animationDuration}s`,
              transitionDuration: '2000ms' // Fade transition between images
            }}
            priority={index === 0}
            data-ai-hint={slide.imageHint}
          />
        )
      })}
      <div 
        className="absolute inset-0 z-10 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
    </>
  );
}
