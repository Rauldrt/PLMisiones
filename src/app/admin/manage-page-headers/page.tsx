
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getPageHeadersAction } from '@/actions/data';
import { savePageHeaders } from '@/actions/admin';
import type { PageHeader } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ManagePageHeadersPage() {
  const [headers, setHeaders] = useState<PageHeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getPageHeadersAction();
      setHeaders(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await savePageHeaders(headers);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar los encabezados.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof PageHeader, value: string) => {
    const newHeaders = [...headers];
    (newHeaders[index] as any)[field] = value;
    setHeaders(newHeaders);
  };
  
  const handleImageSelect = (imageUrl: string) => {
    if (editingIndex !== null) {
      handleFieldChange(editingIndex, 'imageUrl', imageUrl);
    }
    setGalleryOpen(false);
  };

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestionar Encabezados de Página</h1>
            <p className="text-muted-foreground">Administra la apariencia de los encabezados en las páginas interiores.</p>
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Encabezados</CardTitle>
            <CardDescription>Haz clic en un encabezado para expandirlo y editarlo. Los cambios se guardan todos juntos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
            {isLoading ? <p>Cargando...</p> : (
                <Accordion type="single" collapsible className="w-full">
                {headers.map((header, index) => (
                    <AccordionItem key={header.path} value={header.path}>
                        <div className="flex justify-between items-center w-full pr-4">
                        <AccordionTrigger className="hover:no-underline flex-1 text-left">
                            <div className="flex items-center gap-4">
                            {header.imageUrl && <Image src={header.imageUrl} alt={header.title} width={64} height={36} className="rounded-md object-cover" />}
                            <div>
                                <span className="font-semibold">{header.title}</span>
                                <p className="text-sm text-muted-foreground">{header.path}</p>
                            </div>
                            </div>
                        </AccordionTrigger>
                        </div>
                    <AccordionContent className="p-4 border-t space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`title-${index}`}>Título</Label>
                                <Input id={`title-${index}`} value={header.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`description-${index}`}>Descripción</Label>
                                <Input id={`description-${index}`} value={header.description} onChange={e => handleFieldChange(index, 'description', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor={`imageUrl-${index}`}>URL de Imagen</Label>
                            <div className="flex items-center gap-2">
                                <Input id={`imageUrl-${index}`} value={header.imageUrl || ''} onChange={e => handleFieldChange(index, 'imageUrl', e.target.value)} />
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
                                <Input id={`imageHint-${index}`} value={header.imageHint || ''} onChange={e => handleFieldChange(index, 'imageHint', e.target.value)} placeholder="Ej: landscape sunrise" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`icon-${index}`}>Icono (Nombre de Lucide)</Label>
                                <Input id={`icon-${index}`} value={header.icon} onChange={e => handleFieldChange(index, 'icon', e.target.value)} placeholder="Ej: Users" />
                            </div>
                        </div>
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            )}
            <div className="flex justify-end items-center pt-4">
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
