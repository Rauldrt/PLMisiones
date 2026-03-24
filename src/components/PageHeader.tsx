
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
}

export function PageHeader({ icon, title, description, imageUrl, imageHint }: PageHeaderProps) {
  const IconComponent = getIcon(icon);

  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          // ⚡ Bolt: Throttled state update to prevent main thread blocking during scroll
          if (parallaxRef.current) {
            parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // ⚡ Bolt: Added { passive: true } to improve scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // ⚡ Bolt: Cancel any pending animation frame to prevent state updates on unmounted components
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="relative h-96 w-full overflow-hidden flex items-center justify-center text-center text-white">
      {imageUrl && (
        <div 
          ref={parallaxRef}
          className="absolute inset-0 h-full w-full z-0"
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover animate-background-zoom"
            data-ai-hint={imageHint}
            priority
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="relative z-20 container px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {IconComponent && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-white border border-primary/50 backdrop-blur-sm">
                <IconComponent className="h-8 w-8" />
            </div>
        )}
        <h1 className="mt-6 font-headline text-4xl font-bold md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
          {description}
        </p>
      </div>
    </div>
  );
}
