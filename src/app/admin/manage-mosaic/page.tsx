'use client';
import { useState, useEffect, useTransition } from 'react';
import { getMosaicItemsAction } from '@/actions/data';
import { saveMosaic } from '@/actions/admin';
import type { MosaicItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem as UiAccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ManageMosaicPage() {
  const [items, setItems] = useState<MosaicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getMosaicItemsAction();
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveMosaic(items);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el mosaico.' });
      }
    });
  };

  const handleFieldChange = <T extends keyof MosaicItem>(index: number, field: T, value: MosaicItem[T]) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const handleImageChange = (itemIndex: number, imageIndex: number, value: string) => {
    const newItems = [...items];
    const newImageUrls = [...newItems[itemIndex].imageUrls];
    newImageUrls[imageIndex] = value;
    handleFieldChange(itemIndex, 'imageUrls', newImageUrls);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (editingItemIndex !== null && editingImageIndex !== null) {
      handleImageChange(editingItemIndex, editingImageIndex, imageUrl);
    }
    setGalleryOpen(false);
  };

  const addImage = (itemIndex: number) => {
    const newItems = [...items];
    const newImageUrls = [...newItems[itemIndex].imageUrls, `/placeholder.png`];
    handleFieldChange(itemIndex, 'imageUrls', newImageUrls);
  };

  const removeImage = (itemIndex: number, imageIndex: number) => {
    const newItems = [...items];
    const newImageUrls = newItems[itemIndex].imageUrls.filter((_, i) => i !== imageIndex);
    handleFieldChange(itemIndex, 'imageUrls', newImageUrls);
  };

  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), title: 'Nuevo Mosaico', imageUrls: ['/placeholder.png'], imageHints: [], colSpan: 1, rowSpan: 1 }]);
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestionar Mosaico</h1>
          <p className="text-muted-foreground">Administra los items del mosaico de la página de inicio.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Items del Mosaico</CardTitle>
            <CardDescription>Haz clic en un mosaico para expandirlo y editarlo. Los cambios se guardan todos juntos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? <p>Cargando...</p> : (
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                  <UiAccordionItem key={item.id} value={item.id}>
                      <div className="flex justify-between items-center w-full pr-4">
                        <AccordionTrigger className="hover:no-underline flex-1 text-left">
                          <span>{item.title || `Mosaico ${index + 1}`}</span>
                        </AccordionTrigger>
                        <div className="flex gap-2 items-center">
                            <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    <AccordionContent className="p-4 border-t space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor={`title-${index}`}>Título</Label>
                          <Input id={`title-${index}`} value={item.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <Label>Ancho (Columnas)</Label>
                              <Select value={String(item.colSpan)} onValueChange={(v) => handleFieldChange(index, 'colSpan', Number(v))}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="1">1 Columna</SelectItem>
                                      <SelectItem value="2">2 Columnas</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="space-y-1">
                              <Label>Alto (Filas)</Label>
                              <Select value={String(item.rowSpan)} onValueChange={(v) => handleFieldChange(index, 'rowSpan', Number(v))}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="1">1 Fila</SelectItem>
                                      <SelectItem value="2">2 Filas</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Imágenes</Label>
                          {item.imageUrls.map((url, imgIndex) => (
                              <div key={imgIndex} className="flex items-center gap-2">
                                  <Input value={url} onChange={e => handleImageChange(index, imgIndex, e.target.value)} />
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => {
                                        setEditingItemIndex(index);
                                        setEditingImageIndex(imgIndex);
                                    }}>
                                        <Icons.Gallery className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <Button variant="ghost" size="icon" onClick={() => removeImage(index, imgIndex)}>
                                      <Icons.Trash className="w-4 h-4 text-destructive"/>
                                  </Button>
                              </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={() => addImage(index)}>
                              <Icons.Plus className="mr-2 h-4 w-4" /> Agregar Imagen
                          </Button>
                        </div>
                    </AccordionContent>
                  </UiAccordionItem>
                ))}
              </Accordion>
            )}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Mosaico</Button>
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
