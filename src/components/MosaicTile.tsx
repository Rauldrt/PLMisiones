
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { MosaicItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MosaicTileProps {
  item: MosaicItem;
  onClick: (item: MosaicItem, startIndex: number) => void;
}

const animationTypes = ['fade', 'slide-left', 'slide-right', 'zoom'];
const animationDurations = [5000, 7000, 9000];

export function MosaicTile({ item, onClick }: MosaicTileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize random values so they are consistent across re-renders
  const { animationType, baseDuration } = useMemo(() => {
    const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const baseDuration = animationDurations[Math.floor(Math.random() * animationDurations.length)];
    return { animationType, baseDuration };
  }, []);
  
  useEffect(() => {
    if (item.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % item.imageUrls.length);
    }, baseDuration + (Math.random() * 2000 - 1000)); // Add some randomness to interval

    return () => clearInterval(interval);
  }, [item.imageUrls.length, baseDuration]);

  const getAnimationClass = (isActive: boolean) => {
    if (!isActive) return 'opacity-0';
    switch (animationType) {
      case 'fade':
        return 'animate-fade-in-out';
      case 'slide-left':
        return 'animate-slide-in-out-left';
      case 'slide-right':
        return 'animate-slide-in-out-right';
      case 'zoom':
        return 'animate-zoom-in-out';
      default:
        return 'animate-fade-in-out';
    }
  };
  
  const animationDurationStyle = {
    animationDuration: `${baseDuration}ms`
  };
  
  return (
    <div
      onClick={() => onClick(item, currentIndex)}
      className={cn(
        'relative overflow-hidden rounded-3xl group cursor-pointer',
        `md:col-span-${item.colSpan}`,
        `md:row-span-${item.rowSpan}`
      )}
    >
      {item.imageUrls.map((url, index) => (
        <Image
          key={`${item.id}-${index}`}
          src={url}
          alt={item.title}
          fill
          className={cn(
            'absolute inset-0 object-cover transition-opacity',
            getAnimationClass(index === currentIndex)
          )}
          style={animationDurationStyle}
          sizes={`(max-width: 768px) 100vw, ${item.colSpan * 25}vw`}
          data-ai-hint={item.imageHints ? item.imageHints[index] : ''}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 flex items-end justify-start p-4 md:p-6">
        <h3 className="font-headline text-2xl font-bold text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">{item.title}</h3>
      </div>
    </div>
  );
}
