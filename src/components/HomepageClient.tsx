
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Accordion as UiAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { BannerSlide, MosaicItem, AccordionItem, NewsArticle, Referente, Notification } from '@/lib/types';
import { Banner } from './Banner';
import { MosaicTile } from './MosaicTile';


interface HomepageClientProps {
    bannerSlides: BannerSlide[];
    mosaicItems: MosaicItem[];
    accordionItems: AccordionItem[];
    newsArticles: NewsArticle[];
    referentes: Referente[];
    notification: Notification;
}

interface LightboxData {
    images: string[];
    imageHints?: string[];
    title: string;
    startIndex: number;
}

const organigramaData = [
    { id: '1', name: 'Juan Pérez', role: 'Presidente', level: 0, imageUrl: 'https://picsum.photos/200/200', imageHint: 'man portrait' },
    { id: '2', name: 'María Gómez', role: 'Vicepresidenta', level: 1, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait' },
    { id: '3', name: 'Carlos Rodriguez', role: 'Secretario General', level: 1, imageUrl: 'https://picsum.photos/200/200', imageHint: 'person portrait' },
    { id: '4', name: 'Ana Garcia', role: 'Tesorera', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait smiling' },
    { id: '5', name: 'Luis Torres', role: 'Vocal Titular 1°', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'man portrait serious' },
    { id: '6', name: 'Marta Fernandez', role: 'Vocal Titular 2°', level: 2, imageUrl: 'https://picsum.photos/200/200', imageHint: 'woman portrait professional' },
];

function OrganigramaSection() {
    const [selectedMember, setSelectedMember] = useState(organigramaData[0]);

    return (
        <section className="py-16 bg-card lg:py-24">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
                 <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold md:text-4xl">
                        Organigrama del Partido
                    </h2>
                    <p className="mt-4 text-lg text-foreground/80">
                        Conocé la estructura que nos organiza y nos impulsa.
                    </p>
                </div>
                <div className="w-full max-w-sm md:max-w-md lg:max-w-2xl overflow-hidden">
                    <Carousel opts={{ align: "start", loop: false }} className="w-full">
                        <CarouselContent className="-ml-2">
                            {organigramaData.map((member) => (
                                <CarouselItem key={member.id} className="pl-2 basis-auto">
                                    <Button
                                        variant={selectedMember.id === member.id ? 'primary' : 'outline'}
                                        onClick={() => setSelectedMember(member)}
                                    >
                                        {member.name}
                                    </Button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
              
                <div className="w-full mt-4">
                    <Card className="bg-background border-border">
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
                                    <CardTitle className="font-headline text-2xl text-primary">{selectedMember.name}</CardTitle>
                                    <CardDescription className="text-lg mt-1 text-foreground">{selectedMember.role}</CardDescription>
                                    <p className="mt-4 text-foreground/80">
                                        Información detallada sobre el rol y las responsabilidades de {selectedMember.name} en el partido, destacando su compromiso con nuestros valores y su visión para el futuro de Misiones.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}


export function HomepageClient({ bannerSlides, mosaicItems, accordionItems, newsArticles, referentes, notification }: HomepageClientProps) {
    const [lightboxData, setLightboxData] = useState<LightboxData | null>(null);

    const handleTileClick = (item: MosaicItem, startIndex: number) => {
        setLightboxData({ 
            images: item.imageUrls,
            imageHints: item.imageHints,
            title: item.title,
            startIndex,
        });
    };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Banner bannerSlides={bannerSlides} referentes={referentes} notification={notification} />

      <OrganigramaSection />

      {/* Mosaic Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[500px]">
            {mosaicItems.map((item) => (
              <MosaicTile key={item.id} item={item} onClick={handleTileClick} />
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

      <Dialog 
        open={!!lightboxData} 
        onOpenChange={(isOpen) => !isOpen && setLightboxData(null)}
      >
        <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] p-2 bg-transparent border-0 shadow-none flex items-center justify-center">
          {lightboxData && (
            <Carousel
              opts={{
                  loop: lightboxData.images.length > 1,
                  startIndex: lightboxData.startIndex,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                  {lightboxData.images.map((imageSrc, index) => (
                      <CarouselItem key={index} className="flex items-center justify-center">
                          <Image
                              src={imageSrc}
                              alt={`${lightboxData.title} - Imagen ${index + 1}`}
                              width={1600}
                              height={900}
                              className="rounded-lg object-contain w-auto h-auto max-w-full max-h-full"
                              data-ai-hint={lightboxData.imageHints ? lightboxData.imageHints[index] : ''}
                          />
                      </CarouselItem>
                  ))}
              </CarouselContent>
              {lightboxData.images.length > 1 && (
                  <>
                      <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 border-none" />
                      <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 border-none" />
                  </>
              )}
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
