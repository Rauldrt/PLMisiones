
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
import {
  Accordion as UiAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BannerSlide, MosaicItem, AccordionItem, NewsArticle, Referente } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { Banner } from './Banner';


interface HomepageClientProps {
    bannerSlides: BannerSlide[];
    mosaicItems: MosaicItem[];
    accordionItems: AccordionItem[];
    newsArticles: NewsArticle[];
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

export function HomepageClient({ bannerSlides, mosaicItems, accordionItems, newsArticles, referentes }: HomepageClientProps) {
  const [selectedMember, setSelectedMember] = useState(organigramaData[0]);
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(referentes.length > 0 ? referentes[0].id : null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false });

  useEffect(() => {
    if (!carouselApi) {
      return
    }
     carouselApi.on("select", () => {
        const selectedId = emblaApi?.slideNodes()[emblaApi.selectedScrollSnap()].getAttribute('data-referente-id');
        if (selectedId) {
            setExpandedCandidate(selectedId);
        }
    })
  }, [carouselApi, emblaApi])

  const handleCardClick = (id: string, index: number) => {
    setExpandedCandidate(prevId => (prevId === id ? null : id));
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
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Carousel */}
      <Banner bannerSlides={bannerSlides} />

      {/* Candidatos Section */}
       <section className="py-16 lg:py-24 bg-card">
         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
            Nuestros Candidatos
          </h2>
           <p className="mt-4 text-center text-lg text-foreground/80 font-body">
            Conocé a quienes llevarán las ideas de la libertad al gobierno.
          </p>
          <div className="mt-12 md:hidden">
             <div className="overflow-hidden">
                <Carousel setApi={setCarouselApi} opts={{ align: "center", loop: false }} className="w-full">
                    <CarouselContent ref={emblaRef}>
                        {referentes.map((referente, index) => (
                            <CarouselItem key={referente.id} data-referente-id={referente.id} className={cn(expandedCandidate ? (expandedCandidate === referente.id ? 'basis-full' : 'basis-0') : 'basis-1/2', 'transition-all duration-500 ease-in-out')}>
                                <ExpandingCandidateCard 
                                    referente={referente}
                                    isExpanded={expandedCandidate === referente.id}
                                    onClick={() => handleCardClick(referente.id, index)}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2" />
                </Carousel>
             </div>
          </div>
          <div className="mt-12 hidden md:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {candidateCards}
          </div>
           <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/referentes">Ver todos los referentes</Link>
            </Button>
          </div>
         </div>
       </section>

      {/* Organigrama Section */}
      <section className="py-16 bg-background lg:py-24">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
                Organigrama del Partido
            </h2>
            <p className="mt-4 text-center text-lg text-foreground/80">
                Nuestra estructura organizativa.
            </p>
            <div className="mt-12 flex flex-col gap-8 items-center">
                <div className="w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden">
                    <Carousel opts={{ align: "start", loop: false }} className="w-full">
                        <CarouselContent className="-ml-2">
                            {organigramaData.map((member) => (
                                <CarouselItem key={member.id} className="pl-2 basis-auto">
                                <Button
                                    variant={selectedMember.id === member.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedMember(member)}
                                >
                                    {member.name}
                                </Button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-[-16px] top-1/2 -translate-y-1/2" />
                        <CarouselNext className="absolute right-[-16px] top-1/2 -translate-y-1/2" />
                    </Carousel>
                </div>
              
              <div className="w-full">
                <Card className="bg-card">
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
                            <CardTitle className="font-headline text-2xl">{selectedMember.name}</CardTitle>
                            <CardDescription className="text-lg mt-1">{selectedMember.role}</CardDescription>
                            <p className="mt-4 text-foreground/80">
                                Información detallada sobre el rol y las responsabilidades de {selectedMember.name} en el partido, destacando su compromiso con nuestros valores y su visión para el futuro de Misiones.
                            </p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
        </div>
      </section>

      {/* Mosaic Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 h-[600px]">
            {mosaicItems.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg group"
                style={{
                  gridColumn: `span ${item.colSpan}`,
                  gridRow: `span ${item.rowSpan}`,
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.imageHint}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <h3 className="font-headline text-2xl font-bold md:text-3xl text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Accordion Section */}
      <section className="py-16 bg-card lg:py-24">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
            Nuestra Identidad
          </h2>
           <p className="mt-4 text-center text-lg text-foreground/80">
            Los pilares que guían nuestro accionar.
          </p>
          <UiAccordion type="single" collapsible className="w-full mt-12">
            {accordionItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="font-headline text-xl text-left hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </UiAccordion>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
            Últimas Noticias
          </h2>
          <p className="mt-4 text-center text-lg text-foreground/80">
            Mantenete al tanto de nuestras últimas actividades y comunicados.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <Card key={article.id} className="flex flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
                <CardHeader className="p-0">
                   <div className="relative h-48 w-full">
                     <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      data-ai-hint={article.imageHint}
                    />
                  </div>
                  <div className="p-6">
                    <CardTitle className="font-headline text-xl leading-tight">
                        <Link href={`/noticias/${article.slug}`} className="hover:text-primary transition-colors">{article.title}</Link>
                    </CardTitle>
                    <p className="text-sm text-foreground/60 mt-2">{new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6 pt-0">
                  <div className="text-foreground/80 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.content.split('</p>')[0] + '</p>'}} />
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={`/noticias/${article.slug}`}>
                      Leer más
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/noticias">Ver todas las noticias</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

    