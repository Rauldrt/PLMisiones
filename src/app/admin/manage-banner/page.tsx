
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getBannerTextSlidesAction } from '@/actions/data';
import { saveBannerText } from '@/actions/admin';
import type { BannerTextSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ManageBannerPage() {
  const [slides, setSlides] = useState<BannerTextSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getBannerTextSlidesAction();
      setSlides(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveBannerText(slides);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el texto del banner.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof BannerTextSlide, value: string) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };
  
  const addSlide = () => {
    setSlides([...slides, { 
        id: new Date().getTime().toString(), 
        title: 'Nueva Diapositiva', 
        subtitle: '', 
        ctaText: 'Botón', 
        ctaLink: '#',
    }]);
  }
  
  const removeSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Texto del Banner</h1>
        <p className="text-muted-foreground">Administra las diapositivas de texto del carrusel principal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diapositivas de Texto</CardTitle>
          <CardDescription>Haz clic en una diapositiva para expandirla y editarla. El fondo se gestiona en otra sección.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
           {isLoading ? <p>Cargando...</p> : (
            <Accordion type="single" collapsible className="w-full">
              {slides.map((slide, index) => (
                <AccordionItem key={slide.id} value={slide.id}>
                    <div className="flex justify-between items-center w-full pr-4">
                      <AccordionTrigger className="hover:no-underline flex-1 text-left">
                        <span>{slide.title || `Diapositiva ${index + 1}`}</span>
                      </AccordionTrigger>
                      <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                          <Button variant="destructive" size="icon" onClick={() => removeSlide(slide.id)}><Icons.Trash className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  <AccordionContent className="p-4 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor={`title-${index}`}>Título</Label>
                          <Input id={`title-${index}`} value={slide.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`subtitle-${index}`}>Subtítulo</Label>
                          <Input id={`subtitle-${index}`} value={slide.subtitle} onChange={e => handleFieldChange(index, 'subtitle', e.target.value)} />
                        </div>
                         <div className="space-y-1">
                          <Label htmlFor={`ctaText-${index}`}>Texto del Botón (CTA)</Label>
                          <Input id={`ctaText-${index}`} value={slide.ctaText} onChange={e => handleFieldChange(index, 'ctaText', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`ctaLink-${index}`}>Enlace del Botón (CTA)</Label>
                          <Input id={`ctaLink-${index}`} value={slide.ctaLink} onChange={e => handleFieldChange(index, 'ctaLink', e.target.value)} />
                        </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="flex justify-between items-center pt-4">
             <Button variant="outline" onClick={addSlide}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Diapositiva</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
