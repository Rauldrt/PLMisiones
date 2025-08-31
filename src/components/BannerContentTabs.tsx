
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
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });

    useEffect(() => {
        if (!carouselApi || !emblaApi) return;
        
        const onSelect = () => {
            if (emblaApi.slidesInView().length > 1) {
                setExpandedCandidate(null);
            } else {
                 const selectedId = emblaApi.slideNodes()[emblaApi.selectedScrollSnap()].getAttribute('data-referente-id');
                 if(selectedId) setExpandedCandidate(selectedId);
            }
        };

        carouselApi.on("select", onSelect);
        return () => { carouselApi.off("select", onSelect) };
    }, [carouselApi, emblaApi]);

    const handleCardClick = (id: string, index: number) => {
        if (expandedCandidate === id) {
            setExpandedCandidate(null);
        } else {
            setExpandedCandidate(id);
            if (emblaApi) {
                emblaApi.scrollTo(index);
            }
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
                <div className="overflow-hidden">
                    <Carousel setApi={setCarouselApi} opts={{ align: "center", loop: false }} className="w-full">
                        <CarouselContent ref={emblaRef}>
                            {referentes.map((referente, index) => (
                                <CarouselItem 
                                    key={referente.id} 
                                    data-referente-id={referente.id} 
                                    className={cn(expandedCandidate ? (expandedCandidate === referente.id ? 'basis-full' : 'basis-0') : 'basis-1/2 md:basis-1/3', 'transition-all duration-500 ease-in-out p-1')}
                                >
                                    <ExpandingCandidateCard 
                                        referente={referente}
                                        isExpanded={expandedCandidate === referente.id}
                                        onClick={() => handleCardClick(referente.id, index)}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
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
