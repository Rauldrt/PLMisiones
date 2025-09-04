
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Icons } from './icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card } from './ui/card';


interface BannerProps {
    textSlides: BannerTextSlide[];
    backgroundSlides: BannerBackgroundSlide[];
    candidates: Candidate[];
    notification: Notification;
    proposals: Proposal[];
}

export function Banner({ textSlides, backgroundSlides, candidates, notification, proposals }: BannerProps) {
  return (
    <section className="relative w-full flex flex-col z-0">
        <div className="absolute inset-0 w-full h-full min-h-[600px] md:h-[720px]">
            <AnimatedBannerBackground slides={backgroundSlides} />
        </div>
        
        {notification && <NotificationBubble notification={notification} />}
        
        <div className="relative z-20 h-full w-full flex flex-col justify-between flex-1 pt-16 md:pt-20">
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
                <div className="w-full pb-20 md:pb-32 px-4">
                    <Collapsible className="max-w-4xl mx-auto">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full bg-black/20 border-white/20 text-white hover:bg-black/40 backdrop-blur-sm">
                                <Icons.Proposals className="mr-2 animate-icon-glow text-yellow-400" />
                                Ver Propuestas de Campaña
                                <Icons.ChevronDown className="ml-auto h-5 w-5 transition-transform data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <Card className="mt-2 bg-background/80 backdrop-blur-md border-border">
                                <Accordion type="single" collapsible className="w-full p-4 md:p-6">
                                    {proposals.map((proposal) => (
                                    <AccordionItem key={proposal.id} value={proposal.id}>
                                        <AccordionTrigger className="font-headline text-lg text-left hover:no-underline">
                                        {proposal.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-base text-foreground/80 pt-2">
                                        {proposal.content}
                                        </AccordionContent>
                                    </AccordionItem>
                                    ))}
                                </Accordion>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            )}
        </div>
      </section>
  )
}
