
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { BannerBackgroundSlide } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnimatedBannerBackgroundProps {
  slides: BannerBackgroundSlide[];
  disableParallax?: boolean;
  parallaxFactor?: number;
  disableOverlay?: boolean;
  onImageChange?: (url: string) => void;
  bannerOverlayOpacity?: number;
}

export function AnimatedBannerBackground({ 
  slides, 
  disableParallax = false, 
  parallaxFactor = 0.3,
  disableOverlay = false, 
  onImageChange, 
  bannerOverlayOpacity 
}: AnimatedBannerBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length > 0 && onImageChange) {
      onImageChange(slides[currentIndex]?.imageUrl || '');
    }
  }, [currentIndex, slides, onImageChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (disableParallax || !isIntersecting) return;
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          if (containerRef.current) {
            // translate3d forces GPU hardware acceleration to completely eliminate scroll jitter
            containerRef.current.style.transform = `translate3d(0, ${window.scrollY * parallaxFactor}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial position
    if (containerRef.current) {
      containerRef.current.style.transform = `translate3d(0, ${window.scrollY * parallaxFactor}px, 0)`;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [disableParallax, parallaxFactor, isIntersecting]);


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
  const overlayOpacity = bannerOverlayOpacity ?? ((currentSlide?.overlayOpacity ?? 0.7) * 0.45);

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
      {!disableOverlay && (
        <div 
          className="absolute inset-0 z-10 bg-background" 
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
