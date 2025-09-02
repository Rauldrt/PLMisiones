
'use client';

import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { Candidate } from '@/lib/types';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

interface BannerContentTabsProps {
    candidates: Candidate[];
}

export function BannerContentTabs({ candidates }: BannerContentTabsProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [expandedCandidate, setExpandedCandidate] = useState<Candidate | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [cardPosition, setCardPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    const handleCardClick = (candidate: Candidate, e: React.MouseEvent<HTMLDivElement>) => {
        if (expandedCandidate) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setCardPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });

        setIsAnimating(true);
        setExpandedCandidate(candidate);
    };
    
    const handleClose = () => {
        if (!expandedCandidate) return;
        
        setIsAnimating(false);
        setTimeout(() => {
            setExpandedCandidate(null);
            setCardPosition(null);
        }, 500); 
    }

    useEffect(() => {
        if (expandedCandidate) {
            setIsAnimating(true);
        }
    }, [expandedCandidate]);

    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col justify-end">
             {/* Carousel Layer */}
             <div className={cn("transition-opacity duration-300", expandedCandidate ? 'opacity-0' : 'opacity-100')}>
                <Carousel 
                    setApi={setApi}
                    opts={{ 
                        align: "center", 
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {candidates.map((candidate) => (
                            <CarouselItem 
                                key={candidate.id} 
                                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <div onClick={(e) => handleCardClick(candidate, e)}>
                                    <ExpandingCandidateCard 
                                        candidate={candidate}
                                        isExpanded={false}
                                        onClick={() => {}}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            
            {/* Expanded Card Layer - Animación */}
            {expandedCandidate && cardPosition && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={handleClose}
                >
                    <div
                        className={cn(
                            'absolute transition-all duration-500 ease-in-out',
                            isAnimating 
                                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[16rem]'
                                : 'top-[var(--top)] left-[var(--left)] w-[var(--width)] h-[var(--height)]'
                        )}
                        style={{
                            '--top': `${cardPosition.top}px`,
                            '--left': `${cardPosition.left}px`,
                            '--width': `${cardPosition.width}px`,
                            '--height': `${cardPosition.height}px`,
                        } as React.CSSProperties}
                        onClick={(e) => e.stopPropagation()} 
                    >
                         <ExpandingCandidateCard
                            candidate={expandedCandidate}
                            isExpanded={true}
                            onClick={handleClose}
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-white bg-black/20 hover:bg-black/40 rounded-full z-30"
                            onClick={handleClose}
                        >
                            <Icons.Close className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
