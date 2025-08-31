
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
  
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section with Integrated Tabs */}
      <Banner bannerSlides={bannerSlides} referentes={referentes} />

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
