
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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import React from 'react';


interface BannerProps {
    textSlides: BannerTextSlide[];
    backgroundSlides: BannerBackgroundSlide[];
    candidates: Candidate[];
    notifications: NotificationItem[];
    notificationSettings: Notification;
    proposals: Proposal[];
}

export function Banner({ textSlides, backgroundSlides, candidates, notifications, notificationSettings, proposals }: BannerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <section className="relative w-full flex flex-col z-0 min-h-[600px] md:min-h-[720px]">
        <AnimatedBannerBackground slides={backgroundSlides} />
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-16 md:pt-20">
            <NotificationDropdown notifications={notifications} notificationSettings={notificationSettings} />
            <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
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
                <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
        
            <div className="w-full pb-8">
                <BannerContentTabs candidates={candidates} />
            </div>

            {proposals && proposals.length > 0 && (
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="w-full flex flex-col items-center pb-20 md:pb-32 px-4"
                >
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center cursor-pointer group">
                            <div className="p-2 rounded-full bg-black/20 backdrop-blur-sm">
                                <Icons.Proposals className="h-12 w-12 animate-icon-glow text-yellow-400" />
                            </div>
                            <Button variant="outline" className="h-auto py-2 bg-black/20 border-white/20 text-white group-hover:bg-black/40 backdrop-blur-sm rounded-l-none border-l-0">
                                {isOpen ? "Ocultar Propuestas" : "Ver Nuestras Propuestas"}
                            </Button>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="w-full max-w-6xl mt-8">
                         <Carousel
                            opts={{
                                align: "start",
                                loop: proposals.length > 2,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="">
                                {proposals.map((proposal) => (
                                    <CarouselItem key={proposal.id} className="basis-5/6 sm:basis-1/2 lg:basis-1/3 px-2">
                                        <div className="h-full">
                                            <Card className="flex flex-col h-[450px] bg-card/80 backdrop-blur-sm overflow-hidden">
                                                <CardHeader>
                                                    <CardTitle className="font-headline text-xl truncate">{proposal.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="flex-1 flex flex-col justify-center overflow-y-auto">
                                                    <div
                                                        className={cn(
                                                            "prose prose-sm prose-invert max-w-full",
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
                            <CarouselPrevious className="-left-4 sm:-left-12" />
                            <CarouselNext className="-right-4 sm:-right-12" />
                        </Carousel>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
      </section>
  )
}
