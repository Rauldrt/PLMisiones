
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
import { Accordion } from '@/components/ui/accordion';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MosaicItemEditor } from './MosaicItemEditor';

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

  const handleImageSelect = (imageUrl: string) => {
    if (editingItemIndex !== null && editingImageIndex !== null) {
      const newImageUrls = [...items[editingItemIndex].imageUrls];
      newImageUrls[editingImageIndex] = imageUrl;
      handleFieldChange(editingItemIndex, 'imageUrls', newImageUrls);
    }
    setGalleryOpen(false);
  };

  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), title: 'Nuevo Mosaico', imageUrls: ['https://placehold.co/600x400'], imageHints: [], colSpan: 1, rowSpan: 1, animationType: 'fade', animationDuration: 7000 }]);
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
                  <MosaicItemEditor
                    key={item.id}
                    item={item}
                    index={index}
                    onUpdate={handleFieldChange}
                    onRemove={removeItem}
                    onImageSelectTrigger={(itemIndex, imageIndex) => {
                      setEditingItemIndex(itemIndex);
                      setEditingImageIndex(imageIndex);
                    }}
                  />
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
