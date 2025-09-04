
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getFooterContentAction } from '@/actions/data';
import { saveFooterContent } from '@/actions/admin';
import type { FooterContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ManageFooterPage() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getFooterContentAction();
      setContent(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    if (!content) return;
    startSavingTransition(async () => {
      const result = await saveFooterContent(content);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el contenido del footer.' });
      }
    });
  };

  const handleFieldChange = (field: keyof FooterContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (!content) return <p>No se pudo cargar el contenido del footer.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Pie de Página</h1>
        <p className="text-muted-foreground">Administra los textos del pie de página del sitio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido del Pie de Página</CardTitle>
          <CardDescription>Edita los campos y guarda los cambios.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactTitle">Título de Contacto</Label>
                    <Input id="contactTitle" value={content.contactTitle} onChange={e => handleFieldChange('contactTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contactDescription">Descripción de Contacto</Label>
                    <Input id="contactDescription" value={content.contactDescription} onChange={e => handleFieldChange('contactDescription', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="headquartersTitle">Título Sede</Label>
                    <Input id="headquartersTitle" value={content.headquartersTitle} onChange={e => handleFieldChange('headquartersTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={content.address} onChange={e => handleFieldChange('address', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactInfoTitle">Título Email/Teléfono</Label>
                    <Input id="contactInfoTitle" value={content.contactInfoTitle} onChange={e => handleFieldChange('contactInfoTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={content.email} onChange={e => handleFieldChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={content.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" value={content.whatsapp || ''} onChange={e => handleFieldChange('whatsapp', e.target.value)} placeholder="Ej: +5491122334455" />
                    <p className="text-xs text-muted-foreground">Incluir código de país, sin espacios ni símbolos.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="socialsTitle">Título Redes Sociales</Label>
                    <Input id="socialsTitle" value={content.socialsTitle} onChange={e => handleFieldChange('socialsTitle', e.target.value)} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="copyright">Texto de Copyright</Label>
                    <Input id="copyright" value={content.copyright} onChange={e => handleFieldChange('copyright', e.target.value)} />
                    <p className="text-xs text-muted-foreground">Usa {'{year}'} para mostrar el año actual.</p>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Texto de Créditos</Label>
                    <Input id="credits" value={content.credits} onChange={e => handleFieldChange('credits', e.target.value)} />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
