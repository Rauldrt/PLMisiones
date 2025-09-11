
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getNotificationsAction } from '@/actions/data';
import { saveNotificationsPage } from '@/actions/admin';
import type { NotificationItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem as UiAccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function ManageNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getNotificationsAction();
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = (itemsToSave: NotificationItem[]) => {
    startSavingTransition(async () => {
      const result = await saveNotificationsPage(itemsToSave);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la página de notificaciones.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof NotificationItem, value: string | boolean) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };
  
  const handleImageSelect = (imageUrl: string) => {
    if (editingIndex !== null) {
      handleFieldChange(editingIndex, 'imageUrl', imageUrl);
    }
    setGalleryOpen(false);
  };

   const handleToggleHidden = (id: string, isHidden: boolean) => {
      const updatedItems = items.map(item => 
        item.id === id ? { ...item, hidden: isHidden } : item
      );
      setItems(updatedItems);
      handleSave(updatedItems);
  };
  
  const addItem = () => {
    const newItem: NotificationItem = { 
        id: new Date().getTime().toString(), 
        title: 'Nueva Notificación', 
        content: 'Contenido de la notificación...',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        imageHint: '',
        hidden: false
    };
    setItems([newItem, ...items]);
  }
  
  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    handleSave(newItems);
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) {
        return;
    }
    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newItems.splice(newIndex, 0, item);
    setItems(newItems);
  };

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestionar Página de Notificaciones</h1>
          <p className="text-muted-foreground">Administra la lista de notificaciones que se muestran en la página pública de /notificaciones.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Crea, edita y elimina las notificaciones. Se ordenarán por fecha en la página pública.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? <p>Cargando...</p> : (
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                  <UiAccordionItem key={item.id} value={item.id} className={cn(item.hidden && "bg-muted/30")}>
                      <div className="flex justify-between items-center w-full pr-4">
                        <AccordionTrigger className="hover:no-underline flex-1 text-left">
                            <span className={cn(item.hidden && "text-muted-foreground line-through")}>{item.title || `Notificación ${index + 1}`}</span>
                        </AccordionTrigger>
                        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                                <Icons.ChevronUp className="w-4 h-4"/>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>
                                <Icons.ChevronDown className="w-4 h-4"/>
                            </Button>
                            <Switch
                                checked={!item.hidden}
                                onCheckedChange={(checked) => handleToggleHidden(item.id, !checked)}
                                aria-label={item.hidden ? 'Mostrar notificación' : 'Ocultar notificación'}
                            />
                            <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
                        </div>
                      </div>
                    <AccordionContent className="p-4 border-t space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor={`title-${index}`}>Título</Label>
                            <Input id={`title-${index}`} value={item.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`date-${index}`}>Fecha</Label>
                            <Input id={`date-${index}`} type="date" value={item.date} onChange={e => handleFieldChange(index, 'date', e.target.value)} />
                          </div>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor={`imageUrl-${index}`}>URL de Imagen (Opcional)</Label>
                            <div className="flex items-center gap-2">
                                <Input id={`imageUrl-${index}`} value={item.imageUrl || ''} onChange={e => handleFieldChange(index, 'imageUrl', e.target.value)} />
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => setEditingIndex(index)}>
                                        <Icons.Gallery className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor={`imageHint-${index}`}>Pista de Imagen (para IA)</Label>
                            <Input id={`imageHint-${index}`} value={item.imageHint || ''} onChange={e => handleFieldChange(index, 'imageHint', e.target.value)} placeholder="Ej: people meeting" />
                          </div>
                        <div className="space-y-1 mt-4">
                          <Label htmlFor={`content-${index}`}>Contenido (HTML permitido)</Label>
                          <Textarea id={`content-${index}`} value={item.content} onChange={e => handleFieldChange(index, 'content', e.target.value)} rows={6} />
                        </div>
                    </AccordionContent>
                  </UiAccordionItem>
                ))}
              </Accordion>
            )}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Notificación</Button>
              <Button onClick={() => handleSave(items)} disabled={isSaving}>
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
