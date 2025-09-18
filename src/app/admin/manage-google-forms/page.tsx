'use client';
import { useState, useEffect, useTransition } from 'react';
import { getGoogleFormsAction } from '@/actions/data';
import { saveGoogleForms } from '@/actions/admin';
import type { GoogleForm } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ManageGoogleFormsPage() {
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getGoogleFormsAction();
      setForms(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveGoogleForms(forms);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los formularios.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof GoogleForm, value: string) => {
    const newForms = [...forms];
    (newForms[index] as any)[field] = value;
    setForms(newForms);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Google Forms</h1>
        <p className="text-muted-foreground">Administra los formularios de Google que se muestran en el sitio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Formularios</CardTitle>
          <CardDescription>Pega aquí los enlaces para incrustar tus formularios de Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? <p>Cargando...</p> : (
            <Accordion type="single" collapsible className="w-full" defaultValue={forms[0]?.id}>
              {forms.map((form, index) => (
                <AccordionItem key={form.id} value={form.id}>
                  <AccordionTrigger className="hover:no-underline flex-1 text-left">
                    <span className="capitalize">{form.title || `Formulario ${index + 1}`}</span>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border-t space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor={`title-${index}`}>Título</Label>
                        <Input id={`title-${index}`} value={form.title} onChange={e => handleFieldChange(index, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`description-${index}`}>Descripción (opcional)</Label>
                        <Input id={`description-${index}`} value={form.description || ''} onChange={e => handleFieldChange(index, 'description', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`embedUrl-${index}`}>URL para Incrustar (Embed URL)</Label>
                        <Input 
                          id={`embedUrl-${index}`} 
                          value={form.embedUrl} 
                          onChange={e => handleFieldChange(index, 'embedUrl', e.target.value)} 
                          placeholder='https://docs.google.com/forms/d/e/.../viewform?embedded=true'
                        />
                        <p className="text-xs text-muted-foreground">
                          En Google Forms, ve a "Enviar", selecciona la pestaña "&lt; &gt;", copia el "src" del iframe y pégalo aquí.
                        </p>
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
  );
}
