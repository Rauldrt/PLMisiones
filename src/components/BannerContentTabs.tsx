
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
    
    const handleCardClick = (candidate: Candidate) => {
        setExpandedCandidate(candidate);
    };
    
    const handleClose = () => {
        setExpandedCandidate(null);
    };

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
                        align: "start", 
                        loop: true,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {candidates.map((candidate) => (
                            <CarouselItem 
                                key={candidate.id} 
                                className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                            >
                                <div onClick={() => handleCardClick(candidate)}>
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
            
            {/* Expanded Card Layer - Animación Fuchsia OS Resorte */}
            {expandedCandidate && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                    onClick={handleClose}
                >
                    <div
                        className="w-full max-w-[17rem] md:max-w-[19rem] p-2 bg-transparent relative animate-candidate-spring"
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
                            className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/60 rounded-full z-30 transition-all active:scale-90"
                            onClick={handleClose}
                            aria-label="Cerrar candidato"
                        >
                            <Icons.Close className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
