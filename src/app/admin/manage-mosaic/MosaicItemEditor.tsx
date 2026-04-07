import React from 'react';
import type { MosaicItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccordionContent, AccordionItem as UiAccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DialogTrigger } from '@/components/ui/dialog';

interface MosaicItemEditorProps {
  item: MosaicItem;
  index: number;
  onUpdate: <T extends keyof MosaicItem>(index: number, field: T, value: MosaicItem[T]) => void;
  onRemove: (id: string) => void;
  onImageSelectTrigger: (itemIndex: number, imageIndex: number) => void;
}

export function MosaicItemEditor({ item, index, onUpdate, onRemove, onImageSelectTrigger }: MosaicItemEditorProps) {

  const handleImageChange = (imageIndex: number, value: string) => {
    const newImageUrls = [...item.imageUrls];
    newImageUrls[imageIndex] = value;
    onUpdate(index, 'imageUrls', newImageUrls);
  };

  const addImage = () => {
    const newImageUrls = [...item.imageUrls, `https://placehold.co/600x400`];
    onUpdate(index, 'imageUrls', newImageUrls);
  };

  const removeImage = (imageIndex: number) => {
    const newImageUrls = item.imageUrls.filter((_, i) => i !== imageIndex);
    onUpdate(index, 'imageUrls', newImageUrls);
  };

  const moveImage = (imageIndex: number, direction: 'up' | 'down') => {
    const newImageUrls = [...item.imageUrls];
    if ((direction === 'up' && imageIndex === 0) || (direction === 'down' && imageIndex === newImageUrls.length - 1)) {
        return;
    }
    const image = newImageUrls.splice(imageIndex, 1)[0];
    const newIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
    newImageUrls.splice(newIndex, 0, image);
    onUpdate(index, 'imageUrls', newImageUrls);
  };

  return (
    <UiAccordionItem value={item.id}>
      <div className="flex justify-between items-center w-full pr-4">
        <AccordionTrigger className="hover:no-underline flex-1 text-left">
          <span>{item.title || `Mosaico ${index + 1}`}</span>
        </AccordionTrigger>
        <div className="flex gap-2 items-center">
            <Button variant="destructive" size="icon" onClick={() => onRemove(item.id)} aria-label="Eliminar"><Icons.Trash className="w-4 h-4"/></Button>
        </div>
      </div>
      <AccordionContent className="p-4 border-t space-y-4">
        <div className="space-y-1">
          <Label htmlFor={`title-${index}`}>Título</Label>
          <Input id={`title-${index}`} value={item.title} onChange={e => onUpdate(index, 'title', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
              <Label>Ancho (Columnas)</Label>
              <Select value={String(item.colSpan)} onValueChange={(v) => onUpdate(index, 'colSpan', Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="1">1 Columna</SelectItem>
                      <SelectItem value="2">2 Columnas</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="space-y-1">
              <Label>Alto (Filas)</Label>
              <Select value={String(item.rowSpan)} onValueChange={(v) => onUpdate(index, 'rowSpan', Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="1">1 Fila</SelectItem>
                      <SelectItem value="2">2 Filas</SelectItem>
                  </SelectContent>
              </Select>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 space-y-4">
            <h4 className="text-base font-semibold">Animación y Apariencia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Tipo de Transición</Label>
                    <Select value={item.animationType || 'fade'} onValueChange={(v) => onUpdate(index, 'animationType', v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide-left">Slide Left</SelectItem>
                            <SelectItem value="slide-right">Slide Right</SelectItem>
                            <SelectItem value="zoom">Zoom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>Duración de cada imagen (ms)</Label>
                    <Input type="number" value={item.animationDuration || 7000} onChange={e => onUpdate(index, 'animationDuration', Number(e.target.value))} placeholder="Ej: 7000" />
                </div>
            </div>
        </div>

        <div className="space-y-2 border-t pt-4 mt-4">
          <Label>Imágenes</Label>
          {item.imageUrls.map((url, imgIndex) => (
              <div key={imgIndex} className="flex items-center gap-2">
                  <Input value={url} onChange={e => handleImageChange(imgIndex, e.target.value)} />
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Abrir galería" onClick={() => onImageSelectTrigger(index, imgIndex)}>
                        <Icons.Gallery className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <div className="flex flex-col">
                    <Button variant="ghost" size="icon" className="h-5" onClick={() => moveImage(imgIndex, 'up')} disabled={imgIndex === 0} aria-label="Subir imagen">
                        <Icons.ChevronUp className="w-4 h-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5" onClick={() => moveImage(imgIndex, 'down')} disabled={imgIndex === item.imageUrls.length - 1} aria-label="Bajar imagen">
                        <Icons.ChevronDown className="w-4 h-4"/>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeImage(imgIndex)} aria-label="Eliminar imagen">
                      <Icons.Trash className="w-4 h-4 text-destructive"/>
                  </Button>
              </div>
          ))}
          <Button variant="outline" size="sm" onClick={addImage}>
              <Icons.Plus className="mr-2 h-4 w-4" /> Agregar Imagen
          </Button>
        </div>
      </AccordionContent>
    </UiAccordionItem>
  );
}
