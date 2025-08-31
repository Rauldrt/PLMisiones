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
import type { Referente } from '@/lib/types';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

interface BannerContentTabsProps {
    referentes: Referente[];
}

export function BannerContentTabs({ referentes }: BannerContentTabsProps) {
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });

    useEffect(() => {
        if (!emblaApi) return;
        
        const onSelect = () => {
            if (!emblaApi.canScrollNext() && !emblaApi.canScrollPrev()) return;

            const isFullyVisible = emblaApi.slidesInView().length === 1;
            const selectedSlideNode = emblaApi.slideNodes()[emblaApi.selectedScrollSnap()];
            const selectedId = selectedSlideNode?.getAttribute('data-referente-id');

            if (isFullyVisible && selectedId) {
                if (expandedCandidate !== selectedId) {
                   setExpandedCandidate(selectedId);
                }
            } else {
                setExpandedCandidate(null);
            }
        };

        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect) };
    }, [emblaApi, expandedCandidate]);

    const handleCardClick = (id: string, index: number) => {
        if (emblaApi) {
            if (expandedCandidate === id) {
                 setExpandedCandidate(null);
            } else {
                emblaApi.scrollTo(index);
                setExpandedCandidate(id);
            }
        } else {
            // Fallback for desktop or non-carousel view
            setExpandedCandidate(expandedCandidate === id ? null : id);
        }
    };
    
    const candidateCards = referentes.map((referente, index) => (
         <ExpandingCandidateCard 
            key={referente.id}
            referente={referente}
            isExpanded={expandedCandidate === referente.id}
            onClick={() => handleCardClick(referente.id, index)}
        />
    ));

    if (!referentes || referentes.length === 0) {
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:hidden">
                <div className="overflow-hidden" ref={emblaRef}>
                    <CarouselContent>
                        {referentes.map((referente, index) => (
                            <CarouselItem 
                                key={referente.id} 
                                data-referente-id={referente.id} 
                                className={cn(
                                    'transition-all duration-500 ease-in-out p-1',
                                    expandedCandidate ? (expandedCandidate === referente.id ? 'basis-full' : 'basis-0') : 'basis-1/2'
                                )}
                            >
                                <ExpandingCandidateCard 
                                    referente={referente}
                                    isExpanded={expandedCandidate === referente.id}
                                    onClick={() => handleCardClick(referente.id, index)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
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
