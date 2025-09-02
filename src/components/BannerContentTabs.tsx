
'use client';

import React, { useState, useEffect } from 'react';
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

    const handleCardClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
    };

    const handleCloseExpanded = () => {
        setSelectedCandidate(null);
    };
    
    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[380px]">
            <div 
                className={cn(
                    "transition-opacity duration-500",
                    selectedCandidate ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                <Carousel 
                    opts={{ 
                        align: "start", 
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
                                    isExpanded={false} // Never expanded inside the carousel
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

            {selectedCandidate && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center p-1 animate-fade-in-up">
                    <div className="w-full max-w-lg mx-auto">
                        <ExpandingCandidateCard
                            candidate={selectedCandidate}
                            isExpanded={true}
                            onClick={handleCloseExpanded}
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-0 right-0 text-white"
                            onClick={handleCloseExpanded}
                        >
                            <Icons.Close className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
