
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
    const [expandedCandidate, setExpandedCandidate] = useState<Candidate | null>(null);

    const handleCardClick = (candidate: Candidate) => {
        if (expandedCandidate?.id === candidate.id) {
            setExpandedCandidate(null);
        } else {
            setSelectedCandidate(candidate);
            setTimeout(() => setExpandedCandidate(candidate), 50); // Allow state to update for animation
        }
    };
    
    const handleClose = () => {
        setExpandedCandidate(null);
    }

    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[380px] flex flex-col justify-end">
            {/* Carousel Layer */}
             <div 
                className={cn(
                    "transition-opacity duration-300",
                    expandedCandidate ? "opacity-0 pointer-events-none" : "opacity-100"
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
            
            {/* Expanded Card Layer */}
            {selectedCandidate && (
                 <div 
                    className={cn(
                        "absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 z-20",
                        expandedCandidate ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}
                >
                    <div className={cn("w-full max-w-md mx-auto transition-all duration-500 ease-in-out",
                        expandedCandidate ? 'scale-100' : 'scale-50'
                    )}>
                        <ExpandingCandidateCard
                            candidate={selectedCandidate}
                            isExpanded={true}
                            onClick={handleClose}
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                                "absolute -top-2 -right-2 text-white transition-opacity duration-300 z-30",
                                expandedCandidate ? "opacity-100" : "opacity-0"
                                )}
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
