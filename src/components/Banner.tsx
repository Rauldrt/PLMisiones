'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { BannerTextSlide, BannerBackgroundSlide, NotificationItem, Candidate, Proposal, Notification } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatedBannerBackground } from './AnimatedBannerBackground';
import { BannerContentTabs } from './BannerContentTabs';
import { NotificationDropdown } from './NotificationDropdown';
import { Icons } from './icons';
import { Dialog, DialogContent, DialogTrigger, DialogOverlay } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientSanitize } from '@/lib/client-sanitize';
import { cn } from '@/lib/utils';

interface BannerProps {
    textSlides: BannerTextSlide[];
    backgroundSlides: BannerBackgroundSlide[];
    candidates: Candidate[];
    notifications: NotificationItem[];
    notificationSettings: Notification;
    proposals: Proposal[];
    showProposals?: boolean;
    layoutMode?: 'campaign' | 'institutional';
    institutionalBgType?: 'color' | 'image';
    institutionalBgVal?: string;
}

export function Banner({ 
  textSlides, 
  backgroundSlides, 
  candidates, 
  notifications, 
  notificationSettings, 
  proposals, 
  showProposals,
  layoutMode = 'campaign',
  institutionalBgType = 'color',
  institutionalBgVal = 'linear-gradient(to bottom right, #09090b, #180828, #09090b)'
}: BannerProps) {
  
  const isInstitutional = layoutMode === 'institutional';

  return (
    <section className="relative w-full flex flex-col z-0 min-h-[600px] md:min-h-[720px] justify-between">
        {/* Background Rendering */}
        {isInstitutional ? (
          institutionalBgType === 'image' ? (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image 
                src={institutionalBgVal} 
                alt="Banner Background Abstract" 
                fill 
                className="object-cover opacity-25"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0" style={{ background: institutionalBgVal }} />
          )
        ) : (
          <AnimatedBannerBackground slides={backgroundSlides} />
        )}
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-2 md:pt-8 lg:pt-16">
            <div className="hidden md:block">
              <NotificationDropdown notifications={notifications} notificationSettings={notificationSettings} />
            </div>
            
            {isInstitutional ? (
              /* --- MODAL / SPLIT LAYOUT (Institutional) --- */
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-2 pb-8 lg:py-12 flex-1 w-full">
                
                {/* Columna Izquierda: Texto de la diapositiva */}
                <div className="flex flex-col justify-center text-center lg:text-left w-full">
                  <Carousel
                    opts={{ loop: textSlides.length > 1 }}
                    plugins={textSlides.length > 1 ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : []}
                    className="w-full"
                  >
                    <CarouselContent className="ml-0">
                      {textSlides.map((slide) => (
                        <CarouselItem key={slide.id} className="pl-0 group">
                          <div className="relative h-full w-full text-center lg:text-left">
                            <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
                              <h1 className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-7xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.2s' }}>
                                {slide.title}
                              </h1>
                              <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-lg text-white/80 md:text-xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.4s' }}>
                                {slide.subtitle}
                              </p>
                              <div className="opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.6s' }}>
                                {slide.ctaText && slide.ctaLink && (
                                  <Button asChild size="lg" className="mt-6">
                                    <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                {/* Columna Derecha: Tarjeta de imagen y botones visuales */}
                <div className="flex flex-col items-center justify-center w-full">
                  {/* Tarjeta de Foto Redondeada */}
                  <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
                    <AnimatedBannerBackground 
                      slides={backgroundSlides} 
                      disableParallax={true} 
                      disableOverlay={true} 
                    />
                  </div>
                  
                  {/* Botones Visuales tipo Píldoras (no funcionales por ahora) */}
                  <div className="flex gap-3 mt-6">
                    <button className="px-5 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-all border border-white/5 cursor-not-allowed">
                      Participá
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-all border border-white/5 cursor-not-allowed">
                      Intereses
                    </button>
                    <button className="px-5 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-all border border-white/5 cursor-not-allowed">
                      Comentá
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* --- LAYOUT CENTRADO (Campaign) --- */
              <Carousel
                opts={{ loop: textSlides.length > 1 }}
                plugins={textSlides.length > 1 ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : []}
                className="w-full"
              >
                <CarouselContent>
                  {textSlides.map((slide) => (
                    <CarouselItem key={slide.id} className="group">
                      <div className="relative h-full w-full">
                        <div className="w-full px-4 flex flex-col items-center justify-center text-center">
                          <h1 className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-7xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.2s' }}>
                            {slide.title}
                          </h1>
                          <p className="mt-4 max-w-3xl mx-auto text-lg text-white/80 md:text-xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.4s' }}>
                            {slide.subtitle}
                          </p>
                          <div className="opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.6s' }}>
                            {slide.ctaText && slide.ctaLink && (
                              <Button asChild size="lg" className="mt-4">
                                <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {textSlides.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            )}
        
            <div className="w-full pb-8">
              <BannerContentTabs candidates={candidates} />
            </div>
        </div>
        
        {showProposals !== false && proposals && proposals.length > 0 && (
          <div className="relative z-20 w-full flex flex-col items-center pb-20 md:pb-32 px-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center cursor-pointer group">
                  <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm">
                    <Icons.Proposals className="h-12 w-12 animate-icon-glow text-yellow-400" />
                  </div>
                  <div className="h-auto py-2 px-4 bg-black/20 border border-white/20 text-white group-hover:bg-black/40 backdrop-blur-sm rounded-r-md border-l-0">
                    Ver Nuestras Propuestas
                  </div>
                </button>
              </DialogTrigger>
              <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
              <DialogContent className="w-full max-w-xs sm:max-w-xl lg:max-w-6xl xl:max-w-7xl p-0 bg-transparent border-none shadow-none">
                <Carousel
                  opts={{
                    align: "center",
                    loop: proposals.length > 1,
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {proposals.map((proposal) => (
                      <CarouselItem key={proposal.id} className="w-full max-w-xs px-2">
                        <Card className="flex flex-col h-full bg-card/90 backdrop-blur-sm overflow-hidden">
                          <CardHeader>
                            <CardTitle className="font-headline text-xl whitespace-normal">{proposal.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col justify-center overflow-y-auto">
                            <div
                              className={cn(
                                "w-full whitespace-normal",
                                "[&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-md",
                                "[&_img]:rounded-md [&_img]:max-h-64 [&_img]:mx-auto",
                                "[&_audio]:w-full"
                              )}
                              dangerouslySetInnerHTML={{ __html: clientSanitize(proposal.content) }}
                            />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2" />
                </Carousel>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </section>
  )
}
