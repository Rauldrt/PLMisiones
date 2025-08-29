'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Accordion as UiAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import type { BannerSlide, MosaicItem, AccordionItem, NewsArticle } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

interface HomepageClientProps {
  bannerSlides: BannerSlide[];
  mosaicItems: MosaicItem[];
  accordionItems: AccordionItem[];
  newsArticles: NewsArticle[];
}

export function HomepageClient({ bannerSlides, mosaicItems, accordionItems, newsArticles }: HomepageClientProps) {
  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <section className="w-full">
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
          className="relative"
        >
          <CarouselContent>
            {bannerSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[60vh] min-h-[400px] w-full md:h-[80vh]">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={slide.id === '1'}
                    data-ai-hint={slide.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                    <div className="container">
                      <h1 className="font-headline text-4xl font-bold md:text-6xl lg:text-7xl">
                        {slide.title}
                      </h1>
                      <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80 md:text-xl">
                        {slide.subtitle}
                      </p>
                      <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90">
                        <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
        </Carousel>
      </section>

      {/* Mosaic Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-headline text-2xl font-bold text-white md:text-3xl">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Accordion Section */}
      <section className="py-16 bg-card lg:py-24">
        <div className="container max-w-4xl">
           <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
            Nuestra Identidad
          </h2>
           <p className="mt-4 text-center text-lg text-foreground/80">
            Los pilares que guían nuestro accionar.
          </p>
          <UiAccordion type="single" collapsible className="w-full mt-12">
            {accordionItems.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="font-headline text-xl hover:no-underline">
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
        <div className="container">
          <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
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
                      Leer más <Icons.ChevronRight className="ml-1 h-4 w-4" />
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
