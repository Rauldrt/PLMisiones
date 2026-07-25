'use client';

import type { GoogleForm } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleFormEmbedProps {
  form: GoogleForm;
}

export function GoogleFormEmbed({ form }: GoogleFormEmbedProps) {
  return (
    <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2rem] backdrop-blur-lg w-full text-foreground">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">{form.title}</CardTitle>
        {form.description && <CardDescription>{form.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[800px] overflow-hidden rounded-md">
            <iframe
            src={form.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="absolute top-0 left-0"
            >
            Cargando…
            </iframe>
        </div>
      </CardContent>
    </Card>
  );
}
