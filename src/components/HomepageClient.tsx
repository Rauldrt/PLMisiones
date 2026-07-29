
'use client';

import React, { useState, useEffect } from 'react';
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
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem as AccordionItemType, NewsArticle, Candidate, NotificationItem, OrganigramaMember, Proposal, StreamingItem, Notification, FuchsiaPillConfig } from '@/lib/types';
import { Banner } from './Banner';
import { MosaicTile } from './MosaicTile';
import { NewsCard } from './NewsCard';
import { useBackground } from './SiteLayout';
import { InstagramEmbedProcessor } from './InstagramEmbedProcessor';
import { StreamingSection } from './StreamingSection';
import { cn } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';


interface HomepageClientProps {
    bannerTextSlides: BannerTextSlide[];
    bannerBackgroundSlides: BannerBackgroundSlide[];
    mosaicItems: MosaicItem[];
    accordionItems: AccordionItemType[];
    newsArticles: NewsArticle[];
    candidates: Candidate[];
    notifications: NotificationItem[];
    notificationSettings: Notification;
    organigramaData: OrganigramaMember[];
    proposals: Proposal[];
    streamingItems: StreamingItem[];
    showProposals?: boolean;
    layoutMode?: 'campaign' | 'institutional';
    institutionalBgType?: 'color' | 'image';
    institutionalBgVal?: string;
    bannerOverlayOpacity?: number;
    fuchsiaCardBgType?: 'glass' | 'aurora';
    fuchsiaPills?: FuchsiaPillConfig[];
    institutionalBgPosition?: string;
    institutionalBgSize?: string;
}

interface LightboxData {
    images: string[];
    imageHints?: string[];
    title: string;
    startIndex: number;
}

function OrganigramaSection({ organigramaData }: { organigramaData: OrganigramaMember[] }) {
    const [selectedMember, setSelectedMember] = useState<OrganigramaMember | null>(null);

    useEffect(() => {
        if(organigramaData.length > 0 && !selectedMember) {
            setSelectedMember(organigramaData[0]);
        }
    }, [organigramaData, selectedMember]);

    if (!organigramaData || organigramaData.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-transparent relative z-10 lg:py-24">
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-card/90 border border-white/80 dark:border-white/5 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg p-6 md:p-10 w-full text-foreground flex flex-col gap-8">
                    
                    <div className="text-center">
                        <h2 className="font-headline text-3xl font-bold md:text-4xl text-foreground">
                            Organigrama del Partido
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-muted-foreground">
                            Conocé la estructura que nos organiza y nos impulsa a nivel provincial.
                        </p>
                    </div>

                    {/* Muelle de Avatares (Estilo Fuchsia OS Taskbar) y Panel de Detalles */}
                    <div className="flex flex-col md:flex-row gap-8 items-stretch w-full min-h-[380px]">
                        
                        {/* LEFT COLUMN: Dock de Miembros */}
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto pb-4 md:pb-0 pr-0 md:pr-2 md:w-[35%] w-full no-scrollbar shrink-0 max-h-[420px]">
                          {organigramaData.map((member) => (
                            <button
                              key={member.id}
                              onClick={() => setSelectedMember(member)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 active:scale-95 text-left shrink-0 md:shrink md:w-full",
                                selectedMember?.id === member.id
                                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-102"
                                  : "bg-background/40 hover:bg-muted/80 text-foreground border-border/40 hover:scale-102"
                              )}
                            >
                              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-muted">
                                <Image
                                  src={member.imageUrl}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div className="hidden sm:block md:block leading-tight pr-2">
                                <h4 className="font-headline text-sm font-bold truncate max-w-[150px] md:max-w-none">
                                  {member.name}
                                </h4>
                                <p className={cn(
                                  "text-[10px] truncate max-w-[150px] md:max-w-none mt-0.5",
                                  selectedMember?.id === member.id ? "text-white/80" : "text-muted-foreground"
                                )}>
                                  {member.role}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* RIGHT COLUMN: Detalle del Miembro (Expansión Elástica con rebote) */}
                        <div className="flex-grow md:w-[65%] min-h-[280px]">
                          {selectedMember ? (
                            <div 
                              key={selectedMember.id}
                              className="h-full rounded-[2rem] bg-background/40 border border-border/40 p-6 md:p-8 shadow-inner animate-fade-in-up flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                              style={{ animationDuration: '450ms' }}
                            >
                              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="relative h-32 w-32 md:h-44 md:w-44 flex-shrink-0 rounded-[1.5rem] overflow-hidden shadow-xl border border-white/10 bg-black/10">
                                  <Image
                                    src={selectedMember.imageUrl}
                                    alt={selectedMember.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 128px, 176px"
                                    data-ai-hint={selectedMember.imageHint}
                                  />
                                </div>
                                <div className="text-center md:text-left flex-grow">
                                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    Referente del Partido
                                  </span>
                                  <h3 className="font-headline text-2xl md:text-3xl font-bold text-foreground mt-3">
                                    {selectedMember.name}
                                  </h3>
                                  <p className="text-base font-semibold text-muted-foreground mt-1">
                                    {selectedMember.role}
                                  </p>
                                  <p className="mt-4 text-xs md:text-sm text-foreground/80 leading-relaxed">
                                    {selectedMember.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center border border-dashed rounded-[2rem] p-8 text-muted-foreground text-sm">
                              Selecciona un miembro del organigrama para ver los detalles.
                            </div>
                          )}
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    )
}

export function HomepageClient({ bannerTextSlides, bannerBackgroundSlides, mosaicItems, accordionItems, newsArticles, candidates, notifications, notificationSettings, organigramaData, proposals, streamingItems, showProposals, layoutMode, institutionalBgType, institutionalBgVal, bannerOverlayOpacity, fuchsiaCardBgType, fuchsiaPills, institutionalBgPosition, institutionalBgSize }: HomepageClientProps) {
    const [lightboxData, setLightboxData] = useState<LightboxData | null>(null);
    const [api, setApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { setActiveBg } = useBackground();

    useEffect(() => {
        if (!api) return;
        
        setCurrentIndex(api.selectedScrollSnap());
        
        const onSelect = () => {
            setCurrentIndex(api.selectedScrollSnap());
        };
        
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const handleTileClick = (item: MosaicItem, startIndex: number) => {
        setLightboxData({ 
            images: item.imageUrls,
            imageHints: item.imageHints,
            title: item.title,
            startIndex,
        });
        setCurrentIndex(startIndex);
    };

  return (
    <div className="flex flex-col overflow-x-hidden relative min-h-screen">

      <Banner 
        textSlides={bannerTextSlides}
        backgroundSlides={bannerBackgroundSlides} 
        candidates={candidates} 
        notifications={notifications}
        notificationSettings={notificationSettings}
        proposals={proposals}
        showProposals={showProposals}
        layoutMode={layoutMode}
        institutionalBgType={institutionalBgType}
        institutionalBgVal={institutionalBgVal}
        onBgChange={setActiveBg}
        bannerOverlayOpacity={bannerOverlayOpacity}
        fuchsiaCardBgType={fuchsiaCardBgType}
        fuchsiaPills={fuchsiaPills}
        institutionalBgPosition={institutionalBgPosition}
        institutionalBgSize={institutionalBgSize}
      />

      <div className={cn(
        "relative z-10",
        layoutMode === 'institutional' && "-mt-16 md:-mt-24"
      )}>
        <OrganigramaSection organigramaData={organigramaData} />

        {/* Mosaic Section */}
        <section className="py-16 lg:py-24 relative z-10">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[500px]">
                {mosaicItems.map((item) => (
                <MosaicTile key={item.id} item={item} onClick={handleTileClick} />
                ))}
            </div>
            </div>
        </section>
        
        {/* Accordion Section */}
        <section className="py-16 lg:py-24 bg-transparent relative z-10">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg p-6 md:p-10 w-full text-foreground">
                    <h2 className="text-center font-headline text-3xl font-bold md:text-4xl text-foreground">
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
                </Card>
            </div>
        </section>

        {/* Streaming Section */}
        <StreamingSection items={streamingItems} />

        {/* News Section */}
        <section className="py-16 lg:py-24 relative z-10">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-headline text-3xl font-bold md:text-4xl text-foreground">
                Últimas Noticias
            </h2>
            <p className="mt-4 text-center text-lg text-foreground/80">
                Mantenete al tanto de nuestras últimas actividades y comunicados.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {newsArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
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

      <Dialog 
        open={!!lightboxData} 
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setLightboxData(null);
                setApi(undefined);
            }
        }}
      >
        <DialogContent className="max-w-5xl w-[95vw] h-auto p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
          {lightboxData && (
            <div className="w-full flex flex-col bg-card/95 dark:bg-zinc-950/95 border border-white/10 dark:border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in-up" style={{ animationDuration: '300ms' }}>
              
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 shrink-0">
                <div>
                  <h3 className="font-headline text-lg font-bold text-foreground">
                    {lightboxData.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Imagen {currentIndex + 1} de {lightboxData.images.length}
                  </p>
                </div>
                <button
                  onClick={() => {
                      setLightboxData(null);
                      setApi(undefined);
                  }}
                  className="p-2 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 border border-transparent hover:border-border/50"
                >
                  <X className="w-5 h-5" />
                  <span className="sr-only">Cerrar</span>
                </button>
              </div>

              {/* Main Viewer Area (Standardized Height and Aspect Ratio) */}
              <div className="relative w-full h-[55vh] md:h-[60vh] max-h-[500px] min-h-[300px] flex items-center justify-center bg-black/30 dark:bg-black/60 overflow-hidden">
                <Carousel
                  setApi={setApi}
                  opts={{
                      loop: lightboxData.images.length > 1,
                      startIndex: lightboxData.startIndex,
                  }}
                  className="w-full h-full [&>div]:h-full"
                >
                  <CarouselContent className="h-full ml-0">
                      {lightboxData.images.map((imageSrc, index) => (
                          <CarouselItem key={index} className="relative h-full flex items-center justify-center pl-0">
                              <div className="relative w-full h-full p-4 flex items-center justify-center">
                                  <Image
                                      src={imageSrc}
                                      alt={`${lightboxData.title} - Imagen ${index + 1}`}
                                      fill
                                      className="object-contain p-2 select-none"
                                      sizes="(max-width: 1024px) 100vw, 1024px"
                                      data-ai-hint={lightboxData.imageHints ? lightboxData.imageHints[index] : ''}
                                      priority={index === 0}
                                  />
                              </div>
                          </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>

                {/* Floating Navigation Controls */}
                {lightboxData.images.length > 1 && (
                  <>
                    <button
                      onClick={() => api?.scrollPrev()}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 text-white transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => api?.scrollNext()}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/45 hover:bg-black/75 border border-white/10 text-white transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption & Thumbnail Strip */}
              <div className="px-6 py-4 bg-white/5 dark:bg-black/20 border-t border-white/10 dark:border-white/5 flex flex-col gap-4 shrink-0">
                {/* Caption */}
                {lightboxData.imageHints && lightboxData.imageHints[currentIndex] && (
                  <p className="text-sm text-foreground/80 font-medium text-center italic">
                    {lightboxData.imageHints[currentIndex]}
                  </p>
                )}

                {/* Thumbnail list */}
                {lightboxData.images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
                    {lightboxData.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => api?.scrollTo(idx)}
                        className={cn(
                          "relative w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 select-none",
                          currentIndex === idx 
                            ? "border-primary opacity-100 scale-105 shadow-md shadow-primary/20" 
                            : "border-transparent opacity-50 hover:opacity-85 hover:scale-102"
                        )}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
      <InstagramEmbedProcessor />
    </div>
  );
}
