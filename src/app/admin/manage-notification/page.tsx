'use client';
import { useState, useEffect, useTransition } from 'react';
import { getNotificationAction } from '@/actions/data';
import { saveNotification } from '@/actions/admin';
import type { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function ManageNotificationPage() {
  const [item, setItem] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getNotificationAction();
      setItem(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    if (!item) return;
    startSavingTransition(async () => {
      const result = await saveNotification(item);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la notificación.' });
      }
    });
  };
  
  const handleFieldChange = (field: keyof Notification, value: string | boolean) => {
    if (!item) return;
    setItem({ ...item, [field]: value });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (!item) return <p>No se pudo cargar la configuración de notificación.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Notificación</h1>
        <p className="text-muted-foreground">Controla la burbuja de notificación que aparece en la esquina superior derecha de la página de inicio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de la Notificación</CardTitle>
          <CardDescription>Activa, desactiva y edita el contenido de la notificación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <Icons.Notification className="h-6 w-6" />
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                    Habilitar Notificación
                    </p>
                    <p className="text-sm text-muted-foreground">
                    Activa o desactiva la visibilidad de la burbuja de notificación en el sitio.
                    </p>
                </div>
                <Switch
                    checked={item.enabled}
                    onCheckedChange={(c) => handleFieldChange('enabled', c)}
                />
            </div>
          
            <div className="space-y-1">
                <Label htmlFor="notification-text">Texto de la Notificación</Label>
                <Input id="notification-text" value={item.text} onChange={e => handleFieldChange('text', e.target.value)} placeholder="¡Nuevo Evento!"/>
            </div>

             <div className="space-y-1">
                <Label htmlFor="notification-link">Enlace de la Notificación</Label>
                <Input id="notification-link" value={item.link} onChange={e => handleFieldChange('link', e.target.value)} placeholder="/noticias/evento-nuevo"/>
                <p className="text-xs text-muted-foreground">Si dejas este campo vacío, el enlace dirigirá a la página de notificaciones.</p>
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
