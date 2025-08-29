'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { generateNewsContent } from '@/ai/flows/generate-news-from-url';

interface AIGeneratorProps {
  onContentGenerated: (title: string, content: string) => void;
}

export function AIGenerator({ onContentGenerated }: AIGeneratorProps) {
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!url || !URL.canParse(url)) {
      toast({
        variant: 'destructive',
        title: 'URL Inválida',
        description: 'Por favor, ingrese una URL válida.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await generateNewsContent({ url });
        onContentGenerated(result.title, result.content);
        toast({
          title: 'Contenido Generado',
          description: 'El contenido ha sido generado y añadido al formulario.',
        });
        setUrl('');
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          variant: 'destructive',
          title: 'Error de Generación',
          description: 'No se pudo generar el contenido desde la URL.',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.AI className="h-5 w-5 text-primary" />
          Generador de Noticias con IA
        </CardTitle>
        <CardDescription>
          Pegue la URL de una noticia para generar automáticamente el título y el contenido.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="news-url">URL de la Noticia</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="news-url"
              placeholder="https://ejemplo.com/noticia"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleGenerate} disabled={isPending || !url}>
              {isPending ? 'Generando...' : 'Generar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
