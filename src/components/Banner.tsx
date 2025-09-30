
'use client';

import Link from 'next/link';
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
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface BannerProps {
    textSlides: BannerTextSlide[];
    backgroundSlides: BannerBackgroundSlide[];
    candidates: Candidate[];
    notifications: NotificationItem[];
    notificationSettings: Notification;
    proposals: Proposal[];
}

export function Banner({ textSlides, backgroundSlides, candidates, notifications, notificationSettings, proposals }: BannerProps) {
  
  return (
    <section className="relative w-full flex flex-col z-0 min-h-[600px] md:min-h-[720px] justify-between">
        <AnimatedBannerBackground slides={backgroundSlides} />
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-16 md:pt-20">
            <NotificationDropdown notifications={notifications} notificationSettings={notificationSettings} />
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
        
            <div className="w-full pb-8">
                <BannerContentTabs candidates={candidates} />
            </div>
        </div>
        
        {proposals && proposals.length > 0 && (
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
                    <DialogContent className="bg-transparent border-none shadow-none p-0">
                        <Carousel
                            opts={{
                                align: "center",
                                loop: proposals.length > 1,
                                dragFree: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {proposals.map((proposal) => (
                                    <CarouselItem key={proposal.id} className="w-full max-w-xs px-2">
                                        <div className="p-1">
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
                                                        dangerouslySetInnerHTML={{ __html: proposal.content }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
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
