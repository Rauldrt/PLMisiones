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
import type { BannerSlide, MosaicItem, AccordionItem, NewsArticle, Referente } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';

interface HomepageClientProps {
  bannerSlides: BannerSlide[];
  mosaicItems: MosaicItem[];
  accordionItems: AccordionItem[];
  newsArticles: NewsArticle[];
  referentes: Referente[];
}

const organigramaData = [
    { id: '1', name: 'Juan Pérez', role: 'Presidente', level: 0 },
    { id: '2', name: 'María Gómez', role: 'Vicepresidenta', level: 1 },
    { id: '3', name: 'Carlos Rodriguez', role: 'Secretario General', level: 1 },
    { id: '4', name: 'Ana Garcia', role: 'Tesorera', level: 2 },
    { id: '5', name: 'Luis Torres', role: 'Vocal Titular 1°', level: 2 },
    { id: '6', name: 'Marta Fernandez', role: 'Vocal Titular 2°', level: 2 },
];


export function HomepageClient({ bannerSlides, mosaicItems, accordionItems, newsArticles, referentes }: HomepageClientProps) {
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
                    <div className="container px-4 sm:px-6 lg:px-8">
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

      {/* Candidatos Section */}
      <section className="py-16 lg:py-24">
         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
            Nuestros Candidatos
          </h2>
           <p className="mt-4 text-center text-lg text-foreground/80">
            Conocé a quienes llevarán las ideas de la libertad al gobierno.
          </p>
          <div className="mt-12">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {referentes.map((referente) => (
                        <CarouselItem key={referente.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="bg-card border-border text-center h-full flex flex-col">
                                    <CardHeader>
                                        <div className="relative mx-auto h-32 w-32">
                                            <Image
                                            src={referente.imageUrl}
                                            alt={referente.name}
                                            fill
                                            className="rounded-full object-cover"
                                            sizes="128px"
                                            data-ai-hint={referente.imageHint}
                                            />
                                        </div>
                                        <CardTitle className="pt-4 font-headline text-2xl text-primary">{referente.name}</CardTitle>
                                        <p className="text-sm font-medium text-accent">{referente.role}</p>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-foreground/80 line-clamp-3">{referente.bio}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" />
                <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
            </Carousel>
          </div>
           <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/referentes">Ver todos los referentes</Link>
            </Button>
          </div>
         </div>
       </section>

      {/* Organigrama Section */}
      <section className="py-16 bg-card lg:py-24">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
                Organigrama del Partido
            </h2>
            <p className="mt-4 text-center text-lg text-foreground/80">
                Nuestra estructura organizativa.
            </p>
            <div className="mt-12 space-y-8">
                {organigramaData.map(member => (
                    <div key={member.id} className="text-center" style={{ marginLeft: `${member.level * 4}rem` }}>
                        <h3 className="font-headline text-xl font-semibold text-primary">{member.name}</h3>
                        <p className="text-accent">{member.role}</p>
                    </div>
                ))}
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
                  <h3 className="font-headline text-2xl font-bold text-white md:text-3xl">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Accordion Section */}
      <section className="py-16 bg-card lg:py-24">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-center font-headline text-3xl font-bold text-primary md:text-4xl">
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
