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

interface BannerContentTabsProps {
    candidates: Candidate[];
}

export function BannerContentTabs({ candidates }: BannerContentTabsProps) {
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
    const [api, setApi] = React.useState<CarouselApi>()

    useEffect(() => {
        if (!api) return;
        
        const onSelect = () => {
            if (!api.canScrollNext() && !api.canScrollPrev()) {
                // If only one slide is visible (or no scroll is possible)
                // we might want to collapse any expanded card if user interacts
                // in a way that suggests deselection, but for now, we do nothing.
                return;
            }
             // Logic to auto-collapse if needed can go here
        };

        api.on("select", onSelect);
        return () => { api.off("select", onSelect) };
    }, [api]);

    const handleCardClick = (id: string, index: number) => {
       if (api) {
            api.scrollTo(index);
       }
       setExpandedCandidate(expandedCandidate === id ? null : id);
    };
    
    const candidateCards = candidates.map((candidate, index) => (
         <ExpandingCandidateCard 
            key={candidate.id}
            candidate={candidate}
            isExpanded={expandedCandidate === candidate.id}
            onClick={() => handleCardClick(candidate.id, index)}
        />
    ));

    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:hidden">
                 <Carousel setApi={setApi} opts={{ align: "center", loop: false }}>
                    <CarouselContent>
                        {candidates.map((candidate, index) => (
                            <CarouselItem 
                                key={candidate.id} 
                                className={cn(
                                    'transition-all duration-500 ease-in-out p-1',
                                    expandedCandidate ? (expandedCandidate === candidate.id ? 'basis-11/12' : 'basis-0 opacity-0') : 'basis-1/2'
                                )}
                            >
                                <ExpandingCandidateCard 
                                    candidate={candidate}
                                    isExpanded={expandedCandidate === candidate.id}
                                    onClick={() => handleCardClick(candidate.id, index)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="mt-4 hidden md:grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {candidateCards}
            </div>
            <div className="mt-8 text-center">
                <Button asChild size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10">
                    <Link href="/referentes">Ver todos los referentes</Link>
                </Button>
            </div>
        </div>
    );
}
