
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getProposalsAction } from '@/actions/data';
import { saveProposals } from '@/actions/admin';
import type { Proposal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem as UiAccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ManageProposalsPage() {
  const [items, setItems] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getProposalsAction();
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveProposals(items);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar las propuestas.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof Proposal, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), title: 'Nueva Propuesta', content: 'Descripción de la propuesta...' }]);
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
        <h1 className="text-3xl font-bold font-headline">Gestionar Propuestas</h1>
        <p className="text-muted-foreground">Administra las propuestas de campaña que se muestran en el carrusel del banner.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items de Propuestas</CardTitle>
          <CardDescription>Edita el contenido de cada propuesta. Puedes usar HTML para incrustar videos, audios, imágenes o texto formateado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? <p>Cargando...</p> : (
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <UiAccordionItem key={item.id} value={item.id}>
                    <div className="flex justify-between items-center w-full pr-4">
                      <AccordionTrigger className="hover:no-underline flex-1 text-left">
                          <span>{item.title || `Propuesta ${index + 1}`}</span>
                      </AccordionTrigger>
                      <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                              <Icons.ChevronUp className="w-4 h-4"/>
                          </Button>
                            <Button variant="ghost" size="icon" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>
                              <Icons.ChevronDown className="w-4 h-4"/>
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  <AccordionContent className="p-4 border-t">
                      <div className="space-y-1">
                        <Label htmlFor={`title-${index}`}>Título</Label>
                        <Input id={`title-${index}`} value={item.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-1 mt-4">
                        <Label htmlFor={`content-${index}`}>Contenido (HTML)</Label>
                        <Textarea id={`content-${index}`} value={item.content} onChange={e => handleFieldChange(index, 'content', e.target.value)} rows={8} />
                        <p className="text-xs text-muted-foreground">
                          Pega aquí el código HTML. Para videos de YouTube, usa el código de inserción. Para audio/imágenes de la galería, usa las etiquetas &lt;audio controls src=&quot;/archivo.mp3&quot;&gt;&lt;/audio&gt; o &lt;img src=&quot;/imagen.jpg&quot; /&gt;.
                        </p>
                      </div>
                  </AccordionContent>
                </UiAccordionItem>
              ))}
            </Accordion>
          )}
          <div className="flex justify-between items-center pt-4">
             <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Propuesta</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
