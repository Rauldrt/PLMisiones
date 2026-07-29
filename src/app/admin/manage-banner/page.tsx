'use client';
import { useState, useEffect, useTransition } from 'react';
import { getBannerTextSlidesAction, getBannerConfigAction } from '@/actions/data';
import { saveBannerText, saveBannerConfig, uploadBannerImageAction } from '@/actions/admin';
import type { BannerTextSlide, BannerConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { compressImage } from '@/lib/client-utils';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageGallery } from '@/components/ImageGallery';

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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        let base64Data = reader.result as string;
        
        if (file.type.startsWith('image/')) {
          try {
            base64Data = await compressImage(base64Data, 2048, 2048, 0.82);
          } catch (compressErr) {
            console.warn('Fallo al comprimir la imagen, se procederá a subir el archivo original:', compressErr);
          }
        }

        const result = await uploadBannerImageAction(base64Data, file.name);
        
        if (result.success && result.url) {
          if (config) {
            setConfig({ ...config, institutionalBgVal: result.url });
          }
          toast({
            title: 'Éxito',
            description: result.message,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.message,
          });
        }
        setIsUploading(false);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo leer el archivo seleccionado.',
        });
        setIsUploading(false);
      };
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo iniciar la subida de la imagen.',
      });
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
      setConfig({
        ...configData,
        fuchsiaPills: configData.fuchsiaPills || [
          {
            id: 'participa',
            label: 'Participá',
            title: 'Formá parte',
            description: 'Formá parte de la transformación. Podés afiliarte como miembro oficial, sumarte como fiscal de mesa o participar en las reuniones locales.',
            button1Text: 'Afiliarse',
            button1Link: '/afiliacion',
            button2Text: 'Fiscalizar',
            button2Link: '/fiscales'
          },
          {
            id: 'intereses',
            label: 'Intereses',
            title: 'Nuestros Intereses',
            description: 'Trabajamos activamente bajo pilares que representan la libertad, el crecimiento económico y la honestidad en la administración pública.',
            interestItems: [
              { icon: '🗽', title: 'Libertad Económica', desc: 'Reducción de tasas municipales, simplificación de trámites y desregulación comercial.' },
              { icon: '🌱', title: 'Desarrollo Local', desc: 'Apoyo a las PyMEs y productores de la provincia para fomentar empleo genuino.' },
              { icon: '🏛️', title: 'Transparencia', desc: 'Fuerte control de las cuentas públicas, garantizando licitaciones e información transparente.' }
            ]
          },
          {
            id: 'comenta',
            label: 'Comentá',
            title: 'Dejanos tu comentario',
            description: 'Dejanos tus ideas, dudas o sugerencias. Al completar el cuadro y enviar, se abrirá un chat pre-redactado de WhatsApp para hablar directamente con nuestro equipo de coordinación.',
            whatsappNumber: '+5493764000000'
          }
        ]
      });
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
                    {/* Estilo de la Tarjeta de Foto */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                      <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Fondo de la Tarjeta de Foto</Label>
                        <p className="text-xs text-muted-foreground">
                          Elige si usar el fondo translúcido (Glassmorphism) o un efecto animado de Aurora Boreal.
                        </p>
                      </div>
                      <div className="w-full md:w-[240px]">
                        <Select
                          value={config.fuchsiaCardBgType || 'glass'}
                          onValueChange={(val: 'glass' | 'aurora') =>
                            setConfig({ ...config, fuchsiaCardBgType: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el estilo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="glass">Cristal Translúcido (Glassmorphism)</SelectItem>
                            <SelectItem value="aurora">Aurora Boreal Animada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                    {/* Tarjetas Interactivas Fuchsia OS Settings */}
                    <div className="space-y-6 p-4 border rounded-lg bg-muted/5 mt-4">
                      <div className="space-y-1">
                        <Label className="text-base font-bold">Tarjetas Interactivas (Estilo Fuchsia OS)</Label>
                        <p className="text-xs text-muted-foreground">
                          Edita las píldoras de acción, títulos y descripciones que aparecen al pie de la foto en el modo Institucional.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 pt-2 border-t">
                        {config.fuchsiaPills?.map((pill, index) => (
                          <div key={pill.id} className="p-4 border rounded-xl bg-card space-y-4 shadow-sm text-foreground">
                            <div className="flex items-center gap-2 border-b pb-2">
                              <span className="text-lg font-bold text-primary">
                                {pill.id === 'participa' && '🤝 '}
                                {pill.id === 'intereses' && '⚡ '}
                                {pill.id === 'comenta' && '💬 '}
                              </span>
                              <h4 className="font-semibold text-sm capitalize">Tarjeta: {pill.label}</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor={`pill-label-${pill.id}`}>Texto del Botón (Píldora)</Label>
                                <Input
                                  id={`pill-label-${pill.id}`}
                                  value={pill.label}
                                  onChange={(e) => {
                                    const newPills = [...(config.fuchsiaPills || [])];
                                    newPills[index] = { ...pill, label: e.target.value };
                                    setConfig({ ...config, fuchsiaPills: newPills });
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`pill-title-${pill.id}`}>Título de la Subtarjeta</Label>
                                <Input
                                  id={`pill-title-${pill.id}`}
                                  value={pill.title}
                                  onChange={(e) => {
                                    const newPills = [...(config.fuchsiaPills || [])];
                                    newPills[index] = { ...pill, title: e.target.value };
                                    setConfig({ ...config, fuchsiaPills: newPills });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor={`pill-desc-${pill.id}`}>Descripción</Label>
                              <textarea
                                id={`pill-desc-${pill.id}`}
                                rows={2}
                                className="w-full text-sm p-3 rounded-lg border border-input bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                                value={pill.description}
                                onChange={(e) => {
                                  const newPills = [...(config.fuchsiaPills || [])];
                                  newPills[index] = { ...pill, description: e.target.value };
                                  setConfig({ ...config, fuchsiaPills: newPills });
                                }}
                              />
                            </div>

                            {/* Participa Specific Fields */}
                            {pill.id === 'participa' && (
                              <div className="border-t pt-3 space-y-4">
                                <h5 className="text-xs font-bold text-muted-foreground uppercase">Botones de Enlace</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label htmlFor="part-btn1-text">Botón Principal - Texto</Label>
                                    <Input
                                      id="part-btn1-text"
                                      value={pill.button1Text || ''}
                                      onChange={(e) => {
                                        const newPills = [...(config.fuchsiaPills || [])];
                                        newPills[index] = { ...pill, button1Text: e.target.value };
                                        setConfig({ ...config, fuchsiaPills: newPills });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="part-btn1-link">Botón Principal - Enlace (URL)</Label>
                                    <Input
                                      id="part-btn1-link"
                                      value={pill.button1Link || ''}
                                      onChange={(e) => {
                                        const newPills = [...(config.fuchsiaPills || [])];
                                        newPills[index] = { ...pill, button1Link: e.target.value };
                                        setConfig({ ...config, fuchsiaPills: newPills });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="part-btn2-text">Botón Secundario - Texto</Label>
                                    <Input
                                      id="part-btn2-text"
                                      value={pill.button2Text || ''}
                                      onChange={(e) => {
                                        const newPills = [...(config.fuchsiaPills || [])];
                                        newPills[index] = { ...pill, button2Text: e.target.value };
                                        setConfig({ ...config, fuchsiaPills: newPills });
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor="part-btn2-link">Botón Secundario - Enlace (URL)</Label>
                                    <Input
                                      id="part-btn2-link"
                                      value={pill.button2Link || ''}
                                      onChange={(e) => {
                                        const newPills = [...(config.fuchsiaPills || [])];
                                        newPills[index] = { ...pill, button2Link: e.target.value };
                                        setConfig({ ...config, fuchsiaPills: newPills });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Intereses Specific Fields */}
                            {pill.id === 'intereses' && (
                              <div className="border-t pt-3 space-y-4">
                                <h5 className="text-xs font-bold text-muted-foreground uppercase">Etiquetas de Pilares (Máx 3)</h5>
                                <div className="space-y-3">
                                  {(pill.interestItems || []).map((item, itemIdx) => (
                                    <div key={itemIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-muted/20 p-2 rounded-lg border">
                                      <div className="md:col-span-2 space-y-1">
                                        <Label className="text-[10px]">Icono</Label>
                                        <Input
                                          className="px-1 text-center"
                                          value={item.icon}
                                          onChange={(e) => {
                                            const newPills = [...(config.fuchsiaPills || [])];
                                            const newItems = [...(pill.interestItems || [])];
                                            newItems[itemIdx] = { ...item, icon: e.target.value };
                                            newPills[index] = { ...pill, interestItems: newItems };
                                            setConfig({ ...config, fuchsiaPills: newPills });
                                          }}
                                        />
                                      </div>
                                      <div className="md:col-span-3 space-y-1">
                                        <Label className="text-[10px]">Título</Label>
                                        <Input
                                          value={item.title}
                                          onChange={(e) => {
                                            const newPills = [...(config.fuchsiaPills || [])];
                                            const newItems = [...(pill.interestItems || [])];
                                            newItems[itemIdx] = { ...item, title: e.target.value };
                                            newPills[index] = { ...pill, interestItems: newItems };
                                            setConfig({ ...config, fuchsiaPills: newPills });
                                          }}
                                        />
                                      </div>
                                      <div className="md:col-span-7 space-y-1">
                                        <Label className="text-[10px]">Descripción Corta</Label>
                                        <Input
                                          value={item.desc}
                                          onChange={(e) => {
                                            const newPills = [...(config.fuchsiaPills || [])];
                                            const newItems = [...(pill.interestItems || [])];
                                            newItems[itemIdx] = { ...item, desc: e.target.value };
                                            newPills[index] = { ...pill, interestItems: newItems };
                                            setConfig({ ...config, fuchsiaPills: newPills });
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Comenta Specific Fields */}
                            {pill.id === 'comenta' && (
                              <div className="border-t pt-3 space-y-2">
                                <h5 className="text-xs font-bold text-muted-foreground uppercase">Destinatario de Mensaje</h5>
                                <div className="space-y-1">
                                  <Label htmlFor="com-wa-num">Número de WhatsApp (con código de país, sin + ni espacios)</Label>
                                  <Input
                                    id="com-wa-num"
                                    value={pill.whatsappNumber || ''}
                                    onChange={(e) => {
                                      const newPills = [...(config.fuchsiaPills || [])];
                                      newPills[index] = { ...pill, whatsappNumber: e.target.value };
                                      setConfig({ ...config, fuchsiaPills: newPills });
                                    }}
                                    placeholder="Ej: 5493764123456"
                                  />
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
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
                {/* Ajustes de Fondo y Opacidad */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                  <h3 className="text-base font-semibold">Fondo de Página y Efecto Parallax</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Configura los valores visuales del efecto de profundidad y desenfoque.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageBgBlur">Desenfoque del Fondo (px)</Label>
                      <Input
                        id="pageBgBlur"
                        type="number"
                        min={0}
                        max={100}
                        value={config.pageBgBlur ?? 50}
                        onChange={(e) =>
                          setConfig({ ...config, pageBgBlur: Number(e.target.value) })
                        }
                      />
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Determina el nivel de difuminado. Valores bajos (ej: 20px) muestran formas de la foto; valores altos (ej: 80px) crean gradientes suaves.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pageBgOpacity">Opacidad del Fondo (0 a 1)</Label>
                      <Input
                        id="pageBgOpacity"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={config.pageBgOpacity ?? 0.65}
                        onChange={(e) =>
                          setConfig({ ...config, pageBgOpacity: Number(e.target.value) })
                        }
                      />
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Controla la intensidad del brillo y color de la imagen difuminada que se muestra de fondo.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pageBgOverlayOpacity">Opacidad de Capa sobre Fondo (0 a 1)</Label>
                      <Input
                        id="pageBgOverlayOpacity"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={config.pageBgOverlayOpacity ?? 0.4}
                        onChange={(e) =>
                          setConfig({ ...config, pageBgOverlayOpacity: Number(e.target.value) })
                        }
                      />
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Controla el tinte blanco que suaviza el fondo. Un valor bajo (ej: 0.3) lo hace más colorido; un valor alto lo lava con blanco.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerOverlayOpacity">Opacidad de Capa del Banner (0 a 1)</Label>
                      <Input
                        id="bannerOverlayOpacity"
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={config.bannerOverlayOpacity ?? 0.31}
                        onChange={(e) =>
                          setConfig({ ...config, bannerOverlayOpacity: Number(e.target.value) })
                        }
                      />
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Ajusta la opacidad del velo claro del banner. Un valor de 0.3 a 0.45 permite ver la foto original manteniendo buena legibilidad.
                      </p>
                    </div>
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
