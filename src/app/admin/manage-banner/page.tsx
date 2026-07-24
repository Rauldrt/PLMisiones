'use client';
import { useState, useEffect, useTransition } from 'react';
import { getBannerTextSlidesAction, getBannerConfigAction } from '@/actions/data';
import { saveBannerText, saveBannerConfig } from '@/actions/admin';
import type { BannerTextSlide, BannerConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageGallery } from '@/components/ImageGallery';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseApp } from '@/lib/firebase/client';

export default function ManageBannerPage() {
  const [slides, setSlides] = useState<BannerTextSlide[]>([]);
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const [isSavingConfig, startSavingConfigTransition] = useTransition();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storage = getStorage(getFirebaseApp());
      const fileExtension = file.name.split('.').pop();
      const fileName = `banner/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      if (config) {
        setConfig({ ...config, institutionalBgVal: downloadUrl });
      }
      
      toast({
        title: 'Éxito',
        description: 'Imagen subida a Firebase Storage con éxito.',
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo subir la imagen a Firebase Storage.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [slidesData, configData] = await Promise.all([
        getBannerTextSlidesAction(),
        getBannerConfigAction()
      ]);
      setSlides(slidesData);
      setConfig(configData);
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

  const handleSaveConfig = () => {
    if (!config) return;
    startSavingConfigTransition(async () => {
      const result = await saveBannerConfig(config);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la configuración del banner.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof BannerTextSlide, value: string) => {
    const newSlides = [...slides];
    (newSlides[index] as any)[field] = value;
    setSlides(newSlides);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (config) {
      setConfig({ ...config, institutionalBgVal: imageUrl });
    }
    setGalleryOpen(false);
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
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestionar Texto y Configuración del Banner</h1>
          <p className="text-muted-foreground">Administra la visualización del banner principal y las diapositivas de texto.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración Visual del Banner</CardTitle>
            <CardDescription>
              Controla el modo de diseño del banner y qué elementos se muestran en la página de inicio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading || !config ? (
              <p>Cargando configuración...</p>
            ) : (
              <>
                {/* Modo de Diseño */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Modo de Diseño</Label>
                    <p className="text-sm text-muted-foreground">
                      Cambia la estructura del banner: Centrado (Campaña) o Dividido (Institucional).
                    </p>
                  </div>
                  <div className="w-full md:w-[240px]">
                    <Select
                      value={config.layoutMode}
                      onValueChange={(val: 'campaign' | 'institutional') =>
                        setConfig({ ...config, layoutMode: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el modo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Modo Campaña (Centrado)</SelectItem>
                        <SelectItem value="institutional">Modo Institucional (Dividido)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fondo en Modo Institucional */}
                {config.layoutMode === 'institutional' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Tipo de Fondo</Label>
                        <p className="text-sm text-muted-foreground">
                          Elige si usar un degradado/color CSS o una imagen abstracta de fondo.
                        </p>
                      </div>
                      <div className="w-full md:w-[240px]">
                        <Select
                          value={config.institutionalBgType}
                          onValueChange={(val: 'color' | 'image') =>
                            setConfig({ ...config, institutionalBgType: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="color">Color o Degradado CSS</SelectItem>
                            <SelectItem value="image">Imagen de la Galería</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <Label htmlFor="bg-value">
                        {config.institutionalBgType === 'color' 
                          ? 'Degradado / Color CSS (Ej: linear-gradient(to right, #000, #502))' 
                          : 'Imagen de Fondo (URL)'}
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Input
                          id="bg-value"
                          value={config.institutionalBgVal}
                          onChange={(e) =>
                            setConfig({ ...config, institutionalBgVal: e.target.value })
                          }
                          placeholder={
                            config.institutionalBgType === 'color'
                              ? 'linear-gradient(to bottom right, #09090b, #180828, #09090b)'
                              : 'https://ejemplo.com/fondo.jpg'
                          }
                          className="flex-1"
                        />
                        {config.institutionalBgType === 'image' && (
                          <div className="flex gap-2 shrink-0">
                            <input
                              type="file"
                              id="banner-bg-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Button 
                              variant="outline" 
                              onClick={() => document.getElementById('banner-bg-upload')?.click()}
                              disabled={isUploading}
                              type="button"
                            >
                              <Icons.Upload className="w-4 h-4 mr-2" />
                              {isUploading ? 'Subiendo...' : 'Subir'}
                            </Button>
                            <DialogTrigger asChild>
                              <Button variant="outline" type="button">
                                <Icons.Gallery className="w-4 h-4 mr-2" />
                                Galería
                              </Button>
                            </DialogTrigger>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contenido Inferior */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Contenido Inferior</Label>
                    <p className="text-sm text-muted-foreground">
                      Elige si mostrar las tarjetas de candidatos, las de referentes o si ocultar la sección.
                    </p>
                  </div>
                  <div className="w-full md:w-[240px]">
                    <Select
                      value={config.bottomContentType}
                      onValueChange={(val: any) =>
                        setConfig({ ...config, bottomContentType: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidates">Mostrar Candidatos</SelectItem>
                        <SelectItem value="referentes">Mostrar Referentes</SelectItem>
                        <SelectItem value="hidden">Ocultar Sección</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Propuestas de Campaña */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Propuestas de Campaña</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilita o deshabilita el botón flotante "Ver Nuestras Propuestas" en la pantalla de inicio.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.showProposals}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, showProposals: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {config.showProposals ? 'Habilitado' : 'Desactivado'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveConfig} disabled={isSavingConfig}>
                    {isSavingConfig ? 'Guardando Configuración...' : 'Guardar Configuración'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diapositivas de Texto</CardTitle>
            <CardDescription>Haz clic en una diapositiva para expandirla y editarla. El fondo se gestiona en otra sección.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
             {isLoading ? <p>Cargando diapositivas...</p> : (
              <Accordion type="single" collapsible className="w-full">
                {slides.map((slide, index) => (
                  <AccordionItem key={slide.id} value={slide.id}>
                      <div className="flex justify-between items-center w-full pr-4">
                        <AccordionTrigger className="hover:no-underline flex-1 text-left">
                          <span>{slide.title || `Diapositiva ${index + 1}`}</span>
                        </AccordionTrigger>
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            <Button variant="destructive" size="icon" onClick={() => removeSlide(slide.id)} aria-label="Eliminar diapositiva"><Icons.Trash className="w-4 h-4"/></Button>
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

      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen de la Galería</DialogTitle>
        </DialogHeader>
        <ImageGallery onImageSelect={handleImageSelect} />
      </DialogContent>
    </Dialog>
  );
}
