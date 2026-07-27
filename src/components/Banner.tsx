'use client';
import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
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
import type { BannerTextSlide, BannerBackgroundSlide, NotificationItem, Candidate, Proposal, Notification, FuchsiaPillConfig } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatedBannerBackground } from './AnimatedBannerBackground';
import { BannerContentTabs } from './BannerContentTabs';
import { NotificationDropdown } from './NotificationDropdown';
import { Icons } from './icons';
import { Dialog, DialogContent, DialogTrigger, DialogOverlay } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clientSanitize } from '@/lib/client-sanitize';
import { cn } from '@/lib/utils';

const DEFAULT_FUCHSIA_PILLS: FuchsiaPillConfig[] = [
  {
    id: 'participa',
    label: 'Participá',
    title: 'Formá parte',
    description: 'Formá parte de la transformación. Podés afiliarte como miembro oficial, sumarte como fiscal de mesa o participar en las reuniones locales.',
    button1Text: 'Afiliarse',
    button1Link: '/afiliacion',
    button2Text: 'Fiscalizar',
    button2Link: '/fiscales'
  },
  {
    id: 'intereses',
    label: 'Intereses',
    title: 'Nuestros Intereses',
    description: 'Trabajamos activamente bajo pilares que representan la libertad, el crecimiento económico y la honestidad en la administración pública.',
    interestItems: [
      { icon: '🗽', title: 'Libertad Económica', desc: 'Reducción de tasas municipales, simplificación de trámites y desregulación comercial.' },
      { icon: '🌱', title: 'Desarrollo Local', desc: 'Apoyo a las PyMEs y productores de la provincia para fomentar empleo genuino.' },
      { icon: '🏛️', title: 'Transparencia', desc: 'Fuerte control de las cuentas públicas, garantizando licitaciones e información transparente.' }
    ]
  },
  {
    id: 'comenta',
    label: 'Comentá',
    title: 'Dejanos tu comentario',
    description: 'Dejanos tus ideas, dudas o sugerencias. Al completar el cuadro y enviar, se abrirá un chat pre-redactado de WhatsApp para hablar directamente con nuestro equipo de coordinación.',
    whatsappNumber: '+5493764000000'
  }
];

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
    onBgChange?: (url: string) => void;
    bannerOverlayOpacity?: number;
    fuchsiaPills?: FuchsiaPillConfig[];
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
  institutionalBgVal = 'linear-gradient(to bottom right, #09090b, #180828, #09090b)',
  onBgChange,
  bannerOverlayOpacity,
  fuchsiaPills
}: BannerProps) {
  
  const [activeFuchsiaTab, setActiveFuchsiaTab] = useState<'participa' | 'intereses' | 'comenta' | null>(null);
  const [commentText, setCommentText] = useState('');

  const pills = fuchsiaPills || DEFAULT_FUCHSIA_PILLS;
  const participaPill = pills.find(p => p.id === 'participa') || DEFAULT_FUCHSIA_PILLS[0];
  const interesesPill = pills.find(p => p.id === 'intereses') || DEFAULT_FUCHSIA_PILLS[1];
  const comentaPill = pills.find(p => p.id === 'comenta') || DEFAULT_FUCHSIA_PILLS[2];

  const isInstitutional = layoutMode === 'institutional';
  const isBgImage = institutionalBgType === 'image';
  const textColorClass = (!isInstitutional || isBgImage) ? 'text-foreground' : 'text-white';
  const textMutedColorClass = (!isInstitutional || isBgImage) ? 'text-foreground/80' : 'text-white/80';
  const pillsColorClass = (!isInstitutional || isBgImage)
    ? 'bg-card/60 text-foreground/75 hover:bg-card/90 hover:text-foreground border-border/40 shadow-sm'
    : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/5';

  const bannerBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInstitutional) return;
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          if (bannerBgRef.current) {
            bannerBgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.35}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (bannerBgRef.current) {
      bannerBgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.35}px, 0)`;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInstitutional]);

  useEffect(() => {
    if (isInstitutional) {
      if (institutionalBgType === 'image' && institutionalBgVal) {
        onBgChange?.(institutionalBgVal);
      } else {
        onBgChange?.('');
      }
    }
  }, [isInstitutional, institutionalBgType, institutionalBgVal, onBgChange]);

  return (
    <section className="relative w-full flex flex-col z-0 min-h-[600px] md:min-h-[720px] justify-between">
        {/* Background Rendering */}
        {isInstitutional ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div 
              ref={bannerBgRef}
              className="absolute inset-0 w-full h-full"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              {institutionalBgType === 'image' ? (
                <Image 
                  src={institutionalBgVal} 
                  alt="Banner Background Abstract" 
                  fill 
                  className="object-cover opacity-25 scale-110"
                  priority
                />
              ) : (
                <div className="absolute inset-0 w-full h-full scale-115" style={{ background: institutionalBgVal }} />
              )}
            </div>
            {/* Smooth bottom fade mask to blend perfectly with the page background color */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10 pointer-events-none" />
          </div>
        ) : (
          <AnimatedBannerBackground slides={backgroundSlides} onImageChange={onBgChange} bannerOverlayOpacity={bannerOverlayOpacity} parallaxFactor={0.35} />
        )}
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-2 md:pt-8 lg:pt-16">
            <div className="hidden md:block">
              <NotificationDropdown notifications={notifications} notificationSettings={notificationSettings} />
            </div>
            
            {isInstitutional ? (
              /* --- MODAL / SPLIT LAYOUT (Institutional) --- */
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-2 pb-8 lg:py-12 flex-1 w-full">
                
                {/* Columna Izquierda: Texto de la diapositiva */}
                <div className="flex flex-col justify-center text-center w-full">
                  <Carousel
                    opts={{ loop: textSlides.length > 1 }}
                    plugins={textSlides.length > 1 ? [Autoplay({ delay: 5000, stopOnInteraction: true })] : []}
                    className="w-full"
                  >
                    <CarouselContent className="ml-0">
                      {textSlides.map((slide) => (
                        <CarouselItem key={slide.id} className="pl-0 group">
                          <div className="relative h-full w-full text-center">
                            <div className="w-full flex flex-col items-center text-center">
                              <h1 className={cn("font-headline text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-in-up group-data-[active]:opacity-100", textColorClass)} style={{ animationDelay: '0.2s' }}>
                                {slide.title}
                              </h1>
                              <p className={cn("mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base md:text-xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100", textMutedColorClass)} style={{ animationDelay: '0.4s' }}>
                                {slide.subtitle}
                              </p>
                              <div className="opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.6s' }}>
                                {slide.ctaText && slide.ctaLink && (
                                  <Button asChild className="mt-3 sm:mt-6 h-9 px-4 sm:h-11 sm:px-8 text-xs sm:text-base font-semibold animate-shimmer">
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

                {/* Columna Derecha: Tarjeta de imagen y botones visuales acoplados elásticamente (estilo Fuchsia OS) */}
                <div className="flex flex-col items-center justify-center w-full">
                  
                  {/* Contenedor Acoplador con Transición de Resorte */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl min-h-[340px] md:min-h-[400px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    
                    {/* Tarjeta de Foto Redondeada (Se encoge elásticamente si hay panel abierto) */}
                    <div className={cn(
                      "relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-sm flex-shrink-0",
                      activeFuchsiaTab 
                        ? "w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px]" 
                        : "w-full aspect-square max-w-[340px] sm:max-w-[400px]"
                    )}>
                      <AnimatedBannerBackground 
                        slides={backgroundSlides} 
                        disableParallax={true}
                        disableOverlay={true} 
                      />
                    </div>

                    {/* Subtarjeta de Contenido Fuchsia (Se expande elásticamente) */}
                    {activeFuchsiaTab && (
                      <div 
                        className="w-full md:w-[360px] p-6 rounded-[2.5rem] bg-card/85 dark:bg-zinc-950/75 border border-white/20 dark:border-violet-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25),0_15px_30px_-20px_rgba(139,31,164,0.3)] backdrop-blur-md animate-fade-in-up flex flex-col justify-between min-h-[260px] md:min-h-[280px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ animationDuration: '450ms' }}
                      >
                        <div>
                          {/* Cabecera de la Tarjeta */}
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-headline text-lg font-bold text-primary">
                              {activeFuchsiaTab === 'participa' && participaPill.title}
                              {activeFuchsiaTab === 'intereses' && interesesPill.title}
                              {activeFuchsiaTab === 'comenta' && comentaPill.title}
                            </h3>
                            <button 
                              onClick={() => setActiveFuchsiaTab(null)}
                              className="p-1.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors active:scale-90"
                              aria-label="Cerrar"
                            >
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          {/* Descripción */}
                          <p className="text-xs text-foreground/85 leading-relaxed mb-4">
                            {activeFuchsiaTab === 'participa' && participaPill.description}
                            {activeFuchsiaTab === 'intereses' && interesesPill.description}
                            {activeFuchsiaTab === 'comenta' && comentaPill.description}
                          </p>

                          {/* Contenido Dinámico según la Píldora */}
                          {activeFuchsiaTab === 'participa' && (
                            <div className="flex flex-col gap-2 mt-2">
                              {participaPill.button1Text && participaPill.button1Link && (
                                <Button asChild size="sm" className="w-full rounded-full py-5 text-xs font-semibold animate-shimmer">
                                  <Link href={participaPill.button1Link}>{participaPill.button1Text}</Link>
                                </Button>
                              )}
                              {participaPill.button2Text && participaPill.button2Link && (
                                <Button asChild size="sm" variant="outline" className="w-full rounded-full py-5 text-xs font-semibold border-primary/40 hover:bg-primary/5">
                                  <Link href={participaPill.button2Link}>{participaPill.button2Text}</Link>
                                </Button>
                              )}
                            </div>
                          )}

                          {activeFuchsiaTab === 'intereses' && (
                            <div className="space-y-3 mt-2">
                              {(interesesPill.interestItems || DEFAULT_FUCHSIA_PILLS[1].interestItems)?.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex gap-2.5 p-2.5 rounded-2xl bg-muted/40 border border-border/10 animate-fade-in-up"
                                  style={{ animationDelay: `${idx * 0.08}s`, animationDuration: '350ms' }}
                                >
                                  <span className="text-xl self-start">{item.icon}</span>
                                  <div>
                                    <h4 className="font-headline text-xs font-bold text-foreground">{item.title}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{item.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeFuchsiaTab === 'comenta' && (
                            <div className="space-y-3 mt-2 flex flex-col w-full">
                              <textarea
                                className="w-full text-xs p-3 rounded-2xl border border-input/60 bg-muted/30 focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none resize-none min-h-[90px] text-foreground"
                                placeholder="Escribí tu mensaje acá..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                              <Button
                                size="sm"
                                className="w-full rounded-full py-5 text-xs font-semibold flex items-center justify-center gap-1.5 animate-shimmer"
                                disabled={!commentText.trim()}
                                onClick={() => {
                                  const num = (comentaPill.whatsappNumber || '+5493764000000').replace(/[+\s-]/g, '');
                                  window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(commentText)}`, '_blank');
                                  setCommentText('');
                                }}
                              >
                                <span>Enviar por WhatsApp</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botones Visuales tipo Píldoras Interactivas */}
                  <div className="flex gap-3 mt-6 relative z-10">
                    {pills.map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setActiveFuchsiaTab(activeFuchsiaTab === pill.id ? null : pill.id)}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border active:scale-95 shadow-md",
                          activeFuchsiaTab === pill.id
                            ? "bg-primary text-white border-primary shadow-[0_4px_15px_rgba(139,31,164,0.4)]"
                            : cn("hover:scale-105", pillsColorClass)
                        )}
                      >
                        {pill.label}
                      </button>
                    ))}
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
                          <h1 className={cn("font-headline text-3xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-in-up group-data-[active]:opacity-100", textColorClass)} style={{ animationDelay: '0.2s' }}>
                            {slide.title}
                          </h1>
                          <p className={cn("mt-2 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base md:text-xl opacity-0 animate-fade-in-up group-data-[active]:opacity-100", textMutedColorClass)} style={{ animationDelay: '0.4s' }}>
                            {slide.subtitle}
                          </p>
                          <div className="opacity-0 animate-fade-in-up group-data-[active]:opacity-100" style={{ animationDelay: '0.6s' }}>
                            {slide.ctaText && slide.ctaLink && (
                              <Button asChild className="mt-3 sm:mt-4 h-9 px-4 sm:h-11 sm:px-8 text-xs sm:text-base font-semibold animate-shimmer">
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
              <DialogContent className="w-full max-w-xs sm:max-w-xl lg:max-w-6xl xl:max-w-7xl p-0 bg-transparent border-none shadow-none animate-dialog-spring">
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
