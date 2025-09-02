
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleCardClick = (candidate: Candidate) => {
        if (selectedCandidate?.id === candidate.id) {
            // If the same card is clicked, close it
            setIsExpanded(false);
            // We use a timeout to allow the closing animation to finish
            setTimeout(() => setSelectedCandidate(null), 500); 
        } else {
            // If a new card is clicked, select it first (without expanding)
            setSelectedCandidate(candidate);
            // Then, trigger the expansion animation
            setTimeout(() => setIsExpanded(true), 50);
        }
    };

    const handleClose = () => {
         setIsExpanded(false);
         setTimeout(() => setSelectedCandidate(null), 500); 
    };

    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[380px] flex flex-col justify-center">
            <div 
                className={cn(
                    "transition-opacity duration-300",
                    selectedCandidate ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                <Carousel 
                    opts={{ 
                        align: "center", 
                        loop: candidates.length > 3,
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
               
                <div className="mt-8 text-center">
                    <Button asChild size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10">
                        <Link href="/referentes">Ver todos los referentes</Link>
                    </Button>
                </div>
            </div>
            
            {/* Expanded Card Layer */}
            {selectedCandidate && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                    <div className={cn("w-full max-w-lg mx-auto transition-transform duration-500 ease-in-out",
                        isExpanded ? 'scale-100' : 'scale-50',
                        'pointer-events-auto'
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
                                "absolute -top-2 -right-2 text-white transition-opacity duration-300",
                                isExpanded ? "opacity-100" : "opacity-0"
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
