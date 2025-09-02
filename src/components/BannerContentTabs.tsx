
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
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
    const autoplayPlugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    useEffect(() => {
        if (!api) return;
        
        const onSelect = () => {
            setExpandedCandidate(null); // Collapse any expanded card on manual scroll
        };

        api.on("select", onSelect);
        return () => { api.off("select", onSelect) };
    }, [api]);
    
    useEffect(() => {
      if (expandedCandidate) {
        autoplayPlugin.current.stop();
      } else {
        if (api) autoplayPlugin.current.play();
      }
    }, [expandedCandidate, api])


    const handleCardClick = (id: string, index: number) => {
       if (api && api.selectedScrollSnap() !== index) {
            api.scrollTo(index);
       }
       setExpandedCandidate(prev => (prev === id ? null : id));
    };
    
    if (!candidates || candidates.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <Carousel 
                setApi={setApi} 
                opts={{ align: "center", loop: true }}
                plugins={[autoplayPlugin.current]}
                className="w-full"
            >
                <CarouselContent>
                    {candidates.map((candidate, index) => (
                        <CarouselItem 
                            key={candidate.id} 
                             className={cn(
                                'p-1 transition-all duration-500 ease-in-out md:basis-1/2 lg:basis-1/3',
                                expandedCandidate && (expandedCandidate !== candidate.id) ? 'md:basis-0 opacity-0' : ''
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
           
            <div className="mt-8 text-center">
                <Button asChild size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10">
                    <Link href="/referentes">Ver todos los referentes</Link>
                </Button>
            </div>
        </div>
    );
}
