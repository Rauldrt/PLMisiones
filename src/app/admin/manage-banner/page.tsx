'use client';
import { useState, useEffect, useTransition } from 'react';
import { getBannerSlidesAction } from '@/actions/data';
import { saveBanner } from '@/actions/admin';
import type { BannerSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function ManageBannerPage() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getBannerSlidesAction();
      setSlides(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveBanner(slides);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el banner.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof BannerSlide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };
  
  const addSlide = () => {
    setSlides([...slides, { id: new Date().getTime().toString(), title: '', subtitle: '', imageUrl: 'https://picsum.photos/1920/1080', imageHint: '', ctaText: '', ctaLink: '' }]);
  }
  
  const removeSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Banner Principal</h1>
        <p className="text-muted-foreground">Administra las diapositivas del carrusel de la página de inicio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Diapositivas del Banner</CardTitle>
          <CardDescription>Edita los campos de cada diapositiva. Los cambios se guardan todos juntos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? <p>Cargando...</p> : slides.map((slide, index) => (
            <div key={slide.id} className="rounded-lg border p-4 space-y-4 relative">
              <h3 className="font-semibold font-headline">Diapositiva {index + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`title-${index}`}>Título</Label>
                  <Input id={`title-${index}`} value={slide.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`subtitle-${index}`}>Subtítulo</Label>
                  <Input id={`subtitle-${index}`} value={slide.subtitle} onChange={e => handleFieldChange(index, 'subtitle', e.target.value)} />
                </div>
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <Label htmlFor={`imageUrl-${index}`}>URL de Imagen</Label>
                  <Input id={`imageUrl-${index}`} value={slide.imageUrl} onChange={e => handleFieldChange(index, 'imageUrl', e.target.value)} />
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
              <Button variant="destructive" size="icon" className="absolute top-4 right-4" onClick={() => removeSlide(slide.id)}><Icons.Trash className="w-4 h-4"/></Button>
            </div>
          ))}
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
