
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { BannerBackgroundSlide } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnimatedBannerBackgroundProps {
  slides: BannerBackgroundSlide[];
}

export function AnimatedBannerBackground({ slides }: AnimatedBannerBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          // ⚡ Bolt: Update DOM directly to prevent React re-renders on scroll
          if (containerRef.current) {
            containerRef.current.style.transform = `translateY(${window.scrollY * 0.5}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // ⚡ Bolt: Added { passive: true } to improve scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial position
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // ⚡ Bolt: Cancel any pending animation frame to prevent memory leaks
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);


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
    <div 
      ref={containerRef}
      className="absolute inset-0 h-full w-full z-0 overflow-hidden"
    >
      {slides.map((slide, index) => {
        return (
          <Image
            key={slide.id}
            src={slide.imageUrl}
            alt="Banner Background"
            fill
            className={cn(
              'absolute inset-0 object-cover transition-opacity ease-linear animate-background-zoom',
              index === currentIndex ? 'opacity-100' : 'opacity-0',
            )}
            style={{ 
              transitionDuration: '2000ms', // Fade transition between images
              objectPosition: slide.objectPosition || 'center',
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
    </div>
  );
}
