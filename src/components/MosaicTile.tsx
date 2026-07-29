
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import type { MosaicItem } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MosaicTileProps {
  item: MosaicItem;
  onClick: (item: MosaicItem, startIndex: number) => void;
}

export function MosaicTile({ item, onClick }: MosaicTileProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const baseDuration = item.animationDuration || 7000;
  const animationType = item.animationType || 'fade';
  
  useEffect(() => {
    if (item.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % item.imageUrls.length);
    }, baseDuration);

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
        'relative overflow-hidden rounded-[2rem] border border-white/10 dark:border-white/5 shadow-lg group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20',
        `md:col-span-${item.colSpan}`,
        `md:row-span-${item.rowSpan}`
      )}
    >
      {/* Photo count badge */}
      {item.imageUrls.length > 0 && (
        <div className="absolute top-4 right-4 z-20 bg-black/45 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-md transition-opacity duration-300 opacity-90 group-hover:opacity-100">
          <Camera className="w-3.5 h-3.5 text-primary" />
          <span>{item.imageUrls.length}</span>
        </div>
      )}

      {/* Glass Glare Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent translate-x-[-150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none z-20" />

      {/* Image Wrapper for zoom on hover */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
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
      </div>

      {/* Bottom Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none z-10" />
      
      {/* Title & action call */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col items-start">
        <h3 className="font-headline text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-[11px] text-white/70 font-semibold tracking-wide uppercase mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1">
          Ver galería <span className="transition-transform group-hover:translate-x-1 duration-300">→</span>
        </p>
      </div>
    </div>
  );
}
