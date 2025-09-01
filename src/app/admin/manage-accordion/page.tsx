'use client';
import { useState, useEffect, useTransition } from 'react';
import { getAccordionItems } from '@/lib/data';
import { saveAccordion } from '@/actions/admin';
import type { AccordionItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function ManageAccordionPage() {
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getAccordionItems();
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveAccordion(items);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el acordeón.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof AccordionItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), title: 'Nuevo Título', content: 'Nuevo contenido...' }]);
  }
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Acordeón</h1>
        <p className="text-muted-foreground">Administra los items del acordeón de "Nuestra Identidad" en la página de inicio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items del Acordeón</CardTitle>
          <CardDescription>Edita, reordena y elimina los items. Los cambios se guardan todos juntos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? <p>Cargando...</p> : items.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-4 space-y-4 relative">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold font-headline">Item {index + 1}</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                            <Icons.ChevronUp className="w-4 h-4"/>
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>
                            <Icons.ChevronDown className="w-4 h-4"/>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
                    </div>
                </div>

              <div className="space-y-1">
                <Label htmlFor={`title-${index}`}>Título</Label>
                <Input id={`title-${index}`} value={item.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`content-${index}`}>Contenido</Label>
                <Textarea id={`content-${index}`} value={item.content} onChange={e => handleFieldChange(index, 'content', e.target.value)} rows={4} />
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
             <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Item</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
