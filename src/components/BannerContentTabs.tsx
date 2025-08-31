'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Referente } from '@/lib/types';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BannerContentTabsProps {
    referentes: Referente[];
}

const organigramaData = [
    { id: '1', name: 'Juan Pérez', role: 'Presidente', level: 0, imageUrl: 'https://picsum.photos/200/200', imageHint: 'man portrait' },
    { id: '2', name: 'María Gómez', role: 'Vicepresidenta', level: 1, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait' },
    { id: '3', name: 'Carlos Rodriguez', role: 'Secretario General', level: 1, imageUrl: 'https://picsum.photos/200/200', imageHint: 'person portrait' },
    { id: '4', name: 'Ana Garcia', role: 'Tesorera', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait smiling' },
    { id: '5', name: 'Luis Torres', role: 'Vocal Titular 1°', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'man portrait serious' },
    { id: '6', name: 'Marta Fernandez', role: 'Vocal Titular 2°', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait professional' },
];

function CandidatosTab({ referentes }: { referentes: Referente[] }) {
    const [expandedCandidate, setExpandedCandidate] = useState<string | null>(referentes.length > 0 ? referentes[0].id : null);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });

    useEffect(() => {
        if (!carouselApi || !emblaApi) return;
        
        const onSelect = () => {
            const selectedId = emblaApi.slideNodes()[emblaApi.selectedScrollSnap()].getAttribute('data-referente-id');
            if (selectedId && selectedId !== expandedCandidate) {
                 setExpandedCandidate(selectedId);
            }
        };

        carouselApi.on("select", onSelect);
        return () => { carouselApi.off("select", onSelect) };
    }, [carouselApi, emblaApi, expandedCandidate]);

    const handleCardClick = (id: string, index: number) => {
        setExpandedCandidate(id);
        if (emblaApi) {
            emblaApi.scrollTo(index);
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

    return (
        <div className="w-full">
            <div className="md:hidden">
                <div className="overflow-hidden">
                    <Carousel setApi={setCarouselApi} opts={{ align: "center", loop: false, skipSnaps: true }} className="w-full">
                        <CarouselContent ref={emblaRef}>
                            {referentes.map((referente, index) => (
                                <CarouselItem 
                                    key={referente.id} 
                                    data-referente-id={referente.id} 
                                    className={cn(expandedCandidate ? (expandedCandidate === referente.id ? 'basis-full' : 'basis-0') : 'basis-1/2', 'transition-all duration-500 ease-in-out p-1')}
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

function OrganigramaTab() {
    const [selectedMember, setSelectedMember] = useState(organigramaData[0]);

    return (
         <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden">
                <Carousel opts={{ align: "start", loop: false }} className="w-full">
                    <CarouselContent className="-ml-2">
                        {organigramaData.map((member) => (
                            <CarouselItem key={member.id} className="pl-2 basis-auto">
                                <Button
                                    variant={selectedMember.id === member.id ? 'secondary' : 'outline'}
                                    onClick={() => setSelectedMember(member)}
                                     className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-white/10"
                                >
                                    {member.name}
                                </Button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
          
            <div className="w-full">
                <Card className="bg-card/50 backdrop-blur-sm border-white/20 text-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0">
                                <Image
                                    src={selectedMember.imageUrl}
                                    alt={selectedMember.name}
                                    fill
                                    className="rounded-lg object-cover"
                                    sizes="(max-width: 768px) 128px, 160px"
                                    data-ai-hint={selectedMember.imageHint}
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <CardTitle className="font-headline text-2xl text-white">{selectedMember.name}</CardTitle>
                                <CardDescription className="text-lg mt-1 text-white/80">{selectedMember.role}</CardDescription>
                                <p className="mt-4 text-white/80">
                                    Información detallada sobre el rol y las responsabilidades de {selectedMember.name} en el partido, destacando su compromiso con nuestros valores y su visión para el futuro de Misiones.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export function BannerContentTabs({ referentes }: BannerContentTabsProps) {
    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="candidatos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-background/20 backdrop-blur-sm border border-white/20">
                    <TabsTrigger value="candidatos" className="text-white/80 data-[state=active]:text-white">Candidatos</TabsTrigger>
                    <TabsTrigger value="organigrama" className="text-white/80 data-[state=active]:text-white">Organigrama</TabsTrigger>
                </TabsList>
                <TabsContent value="candidatos" className="mt-6">
                   <CandidatosTab referentes={referentes} />
                </TabsContent>
                <TabsContent value="organigrama" className="mt-6">
                    <OrganigramaTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
