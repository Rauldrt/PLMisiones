
'use client';

import type { StreamingItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface StreamingSectionProps {
    items: StreamingItem[];
}

export function StreamingSection({ items }: StreamingSectionProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-card lg:py-24">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold md:text-4xl">
                        Streaming Ágora
                    </h2>
                    <p className="mt-4 text-lg text-foreground/80">
                        Reviví nuestros últimos programas y debates.
                    </p>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: items.length > 2,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {items.map((item) => (
                            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Card className="flex flex-col h-full overflow-hidden bg-background">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-xl truncate">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex items-center justify-center">
                                        <div
                                            className="responsive-video w-full rounded-md overflow-hidden"
                                            dangerouslySetInnerHTML={{ __html: item.embedCode }}
                                        />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
                    <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex" />
                </Carousel>
            </div>
        </section>
    );
}
