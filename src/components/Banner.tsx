
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
import type { BannerTextSlide, BannerBackgroundSlide, Notification, Candidate, Proposal } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AnimatedBannerBackground } from './AnimatedBannerBackground';
import { BannerContentTabs } from './BannerContentTabs';
import { NotificationBubble } from './NotificationBubble';
import { Icons } from './icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from '@/lib/utils';


interface BannerProps {
    textSlides: BannerTextSlide[];
    backgroundSlides: BannerBackgroundSlide[];
    candidates: Candidate[];
    notification: Notification;
    proposals: Proposal[];
}

export function Banner({ textSlides, backgroundSlides, candidates, notification, proposals }: BannerProps) {
  return (
    <section className="relative w-full flex flex-col z-0 min-h-[600px] md:min-h-[720px]">
        <AnimatedBannerBackground slides={backgroundSlides} />
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-16 md:pt-20">
            {notification && <NotificationBubble notification={notification} />}
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
                <div className="w-full flex justify-center pb-20 md:pb-32 px-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex items-center cursor-pointer group">
                                <div className="p-2 rounded-l-md">
                                    <Icons.Proposals className="h-12 w-12 animate-icon-glow text-yellow-400" />
                                </div>
                                <Button variant="outline" className="h-auto py-2 bg-black/20 border-white/20 text-white group-hover:bg-black/40 backdrop-blur-sm rounded-l-none border-l-0">
                                    Ver Nuestras Propuestas
                                </Button>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card">
                           <DialogHeader>
                               <DialogTitle className="font-headline text-2xl text-primary">Nuestras Propuestas</DialogTitle>
                           </DialogHeader>
                            <Card className="mt-2 bg-transparent border-none shadow-none">
                                <Accordion type="single" collapsible className="w-full">
                                    {proposals.map((proposal) => (
                                    <AccordionItem key={proposal.id} value={proposal.id}>
                                        <AccordionTrigger className="font-headline text-lg text-left hover:no-underline">
                                        {proposal.title}
                                        </AccordionTrigger>
                                        <AccordionContent 
                                            className={cn(
                                                "text-base text-foreground/80 pt-2",
                                                "prose prose-sm prose-invert max-w-full"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: proposal.content }}
                                        />
                                    </AccordionItem>
                                    ))}
                                </Accordion>
                            </Card>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
      </section>
  )
}
