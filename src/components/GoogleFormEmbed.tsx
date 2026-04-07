'use client';

import type { GoogleForm } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleFormEmbedProps {
  form: GoogleForm;
}

export function GoogleFormEmbed({ form }: GoogleFormEmbedProps) {
  return (
    <Card className="bg-card border-border w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">{form.title}</CardTitle>
        {form.description && <CardDescription>{form.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {form.embedUrl ? (
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
        ) : (
          <div className="flex items-center justify-center w-full h-[200px] bg-muted/50 rounded-md border border-dashed border-border">
            <p className="text-muted-foreground">Invalid or missing form URL.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
