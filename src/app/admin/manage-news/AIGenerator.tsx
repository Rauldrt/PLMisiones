'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateNewsContent } from '@/ai/flows/generate-news-from-url';
import { Loader2 } from 'lucide-react';

interface AIGeneratorProps {
  onContentGenerated: (title: string, content: string) => void;
}

export function AIGenerator({ onContentGenerated }: AIGeneratorProps) {
  const [url, setUrl] = useState('');
  const [tone, setTone] = useState('Informativo');
  const [instructions, setInstructions] = useState('');
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
        const result = await generateNewsContent({ 
          url,
          tone,
          instructions: instructions.trim() || undefined
        });
        
        onContentGenerated(result.title, result.content);
        toast({
          title: 'Contenido Generado',
          description: 'El contenido ha sido generado y añadido al formulario.',
        });
        
        setUrl('');
        setInstructions('');
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          variant: 'destructive',
          title: 'Error de Generación',
          description: 'No se pudo generar el contenido desde la URL. Verifique su API Key o que el sitio permita el acceso.',
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
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="news-url">URL de la Noticia</Label>
            <Input
              id="news-url"
              placeholder="https://ejemplo.com/noticia"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-1">
              <Label>Tono del Resumen</Label>
              <Select value={tone} onValueChange={setTone} disabled={isPending}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona un tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informativo">Informativo / Neutral</SelectItem>
                  <SelectItem value="Institucional">Institucional / Formal</SelectItem>
                  <SelectItem value="Entusiasta">Entusiasta / Llamativo</SelectItem>
                  <SelectItem value="Crítico">Crítico / Analítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="news-instructions">Instrucciones Adicionales (Opcional)</Label>
              <Input
                id="news-instructions"
                placeholder="Ej: Resumir en 2 párrafos, enfocarse en..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={isPending}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleGenerate} disabled={isPending || !url} className="w-full md:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando con IA...
                </>
              ) : 'Generar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
