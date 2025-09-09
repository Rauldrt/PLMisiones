
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getMapsAction } from '@/actions/data';
import { saveMaps } from '@/actions/admin';
import type { MapEmbed } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ManageMapsPage() {
  const [items, setItems] = useState<MapEmbed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getMapsAction();
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveMaps(items);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el mapa.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof MapEmbed, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), title: 'Nuevo Mapa', embedCode: '<iframe src="..."></iframe>', enabled: true }]);
  }
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Mapas</h1>
        <p className="text-muted-foreground">Administra los mapas interactivos que se muestran en el sitio, como en la página de referentes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mapas Incrustados</CardTitle>
          <CardDescription>Haz clic en un mapa para expandirlo y editarlo. Puedes deshabilitarlos sin borrarlos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? <p>Cargando...</p> : (
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={item.id} value={item.id}>
                    <div className="flex justify-between items-center w-full pr-4">
                      <AccordionTrigger className="hover:no-underline flex-1 text-left">
                          <span className={`${!item.enabled && 'text-muted-foreground line-through'}`}>{item.title || `Mapa ${index + 1}`}</span>
                      </AccordionTrigger>
                      <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={(checked) => handleFieldChange(index, 'enabled', checked)}
                            aria-label="Habilitar mapa"
                          />
                          <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  <AccordionContent className="p-4 border-t">
                      <div className="space-y-1">
                        <Label htmlFor={`title-${index}`}>Título del Mapa</Label>
                        <Input id={`title-${index}`} value={item.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-1 mt-4">
                        <Label htmlFor={`embedCode-${index}`}>Código de Inserción (Embed)</Label>
                        <Textarea id={`embedCode-${index}`} value={item.embedCode} onChange={e => handleFieldChange(index, 'embedCode', e.target.value)} rows={8} placeholder='Pega aquí el código <iframe ...> y el <script>...'/>
                         <p className="text-xs text-muted-foreground">Pega el código completo proporcionado por la herramienta de mapas (ej. Datawrapper).</p>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="flex justify-between items-center pt-4">
             <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Mapa</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
