
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCardClick = (candidate: Candidate) => {
        if (selectedCandidate?.id === candidate.id && isExpanded) {
            setIsExpanded(false);
        } else {
            setSelectedCandidate(candidate);
            // Wait for state to update before scrolling, then expand
            setTimeout(() => {
                const candidateIndex = candidates.findIndex(c => c.id === candidate.id);
                if (api && candidateIndex !== -1) {
                    api.scrollTo(candidateIndex);
                }
                setIsExpanded(true);
            }, 50);
        }
    };
    
    const handleClose = () => {
        setIsExpanded(false);
    }

    // Effect to handle closing when carousel is scrolled manually
    useEffect(() => {
        if (!api) return;

        const onScroll = () => {
            if (isExpanded) {
                // If the carousel is scrolled by any means other than our click handler, close the card
                // This is a simple way to handle manual drags/swipes
                 setIsExpanded(false);
            }
        };

        api.on("scroll", onScroll);
        return () => {
            api.off("scroll", onScroll);
        };
    }, [api, isExpanded]);


    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[380px] flex flex-col justify-end">
             {/* Carousel Layer */}
             <div 
                className={cn(
                    "transition-opacity duration-300",
                    isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
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
                                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                            >
                                <ExpandingCandidateCard 
                                    candidate={candidate}
                                    isExpanded={false}
                                    onClick={() => handleCardClick(candidate)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            
            {/* Expanded Card Layer - It's always here, just hidden/visible */}
            {selectedCandidate && (
                <div 
                    className={cn(
                        "absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 z-20",
                        isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                >
                    <div className={cn("w-full max-w-xs mx-auto")}>
                        <ExpandingCandidateCard
                            candidate={selectedCandidate}
                            isExpanded={true}
                            onClick={handleClose}
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-0 right-0 md:top-2 md:right-2 text-white bg-black/20 hover:bg-black/40 rounded-full z-30"
                        onClick={handleClose}
                    >
                        <Icons.Close className="w-6 h-6" />
                    </Button>
                </div>
            )}
        </div>
    );
}
