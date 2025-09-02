'use client';
import { useState, useEffect, useTransition } from 'react';
import { getBannerBackgroundSlidesAction } from '@/actions/data';
import { saveBannerBackground } from '@/actions/admin';
import type { BannerBackgroundSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ManageBannerBackgroundPage() {
  const [slides, setSlides] = useState<BannerBackgroundSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getBannerBackgroundSlidesAction();
      setSlides(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveBannerBackground(slides);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el fondo del banner.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof BannerBackgroundSlide, value: string | number | undefined) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (editingIndex !== null) {
      handleFieldChange(editingIndex, 'imageUrl', imageUrl);
    }
    setGalleryOpen(false);
  };
  
  const addSlide = () => {
    setSlides([...slides, { 
        id: new Date().getTime().toString(), 
        imageUrl: '/placeholder.png', 
        imageHint: '', 
        animationType: 'zoom-in',
        animationDuration: 10,
        overlayOpacity: 0.7,
        objectPosition: 'center'
    }]);
  }
  
  const removeSlide = (id: string) => {
    setSlides(slides.filter(slide => slide.id !== id));
  }

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Fondo del Banner</h1>
            <p className="text-muted-foreground">Administra las imágenes de fondo, sus animaciones y apariencia.</p>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Imágenes del Fondo</CardTitle>
            <CardDescription>Haz clic en una imagen para expandirla y editarla. Los cambios se guardan todos juntos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
            {isLoading ? <p>Cargando...</p> : (
                <Accordion type="single" collapsible className="w-full">
                {slides.map((slide, index) => (
                    <AccordionItem key={slide.id} value={slide.id}>
                        <div className="flex justify-between items-center w-full pr-4">
                        <AccordionTrigger className="hover:no-underline flex-1 text-left">
                            <div className="flex items-center gap-4">
                            <Image src={slide.imageUrl} alt={`Fondo ${index + 1}`} width={64} height={36} className="rounded-md object-cover" />
                            <span>{`Imagen de Fondo ${index + 1}`}</span>
                            </div>
                        </AccordionTrigger>
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            <Button variant="destructive" size="icon" onClick={() => removeSlide(slide.id)}><Icons.Trash className="w-4 h-4"/></Button>
                        </div>
                        </div>
                    <AccordionContent className="p-4 border-t space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor={`imageUrl-${index}`}>URL de Imagen</Label>
                            <div className="flex items-center gap-2">
                                <Input id={`imageUrl-${index}`} value={slide.imageUrl} onChange={e => handleFieldChange(index, 'imageUrl', e.target.value)} />
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => setEditingIndex(index)}>
                                        <Icons.Gallery className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`imageHint-${index}`}>Pista de la Imagen (para IA)</Label>
                                <Input id={`imageHint-${index}`} value={slide.imageHint} onChange={e => handleFieldChange(index, 'imageHint', e.target.value)} placeholder="Ej: landscape sunrise" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`objectPosition-${index}`}>Posición de Objeto</Label>
                                <Input id={`objectPosition-${index}`} value={slide.objectPosition || 'center'} onChange={e => handleFieldChange(index, 'objectPosition', e.target.value)} placeholder="Ej: center, top, 50% 25%" />
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-4 space-y-4">
                            <h4 className="text-base font-semibold">Animación y Apariencia</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Tipo de Animación</Label>
                                    <Select value={slide.animationType || 'zoom-in'} onValueChange={(v) => handleFieldChange(index, 'animationType', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="zoom-in">Zoom In</SelectItem>
                                            <SelectItem value="fade">Fade</SelectItem>
                                            <SelectItem value="slide-from-left">Slide From Left</SelectItem>
                                            <SelectItem value="slide-from-right">Slide From Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Duración (segundos)</Label>
                                    <Input type="number" value={slide.animationDuration || 10} onChange={e => handleFieldChange(index, 'animationDuration', Number(e.target.value))} />
                                </div>
                                <div className="space-y-1 col-span-1 md:col-span-2">
                                    <Label>Opacidad de Superposición (0-100%)</Label>
                                    <div className="flex items-center gap-4">
                                    <Slider
                                        value={[(slide.overlayOpacity ?? 0.7) * 100]}
                                        onValueChange={(v) => handleFieldChange(index, 'overlayOpacity', v[0] / 100)}
                                        max={100}
                                        step={1}
                                    />
                                    <span>{Math.round((slide.overlayOpacity ?? 0.7) * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            )}
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={addSlide}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Imagen</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
            </CardContent>
        </Card>
        </div>
        <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
                <DialogTitle>Seleccionar Imagen de la Galería</DialogTitle>
            </DialogHeader>
            <ImageGallery onImageSelect={handleImageSelect} />
        </DialogContent>
    </Dialog>
  );
}
