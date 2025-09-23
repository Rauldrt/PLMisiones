
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getNotificationAction } from '@/actions/data';
import { saveNotification } from '@/actions/admin';
import type { Notification } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManageNotificationPage() {
  const [item, setItem] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [galleryOpen, setGalleryOpen] = useState(false);

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
  
  const handleImageSelect = (imageUrl: string) => {
    if (!item) return;
    setItem({ ...item, imageUrl: imageUrl });
    setGalleryOpen(false);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (!item) return <p>No se pudo cargar la configuración de notificación.</p>;

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestionar Burbuja de Notificación</h1>
          <p className="text-muted-foreground">Controla la burbuja de notificación que aparece en la esquina superior derecha de la página de inicio.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de la Notificación</CardTitle>
            <CardDescription>Activa, desactiva y edita el contenido de la burbuja y su comportamiento.</CardDescription>
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
                  <Label htmlFor="notification-text">Texto de la Burbuja</Label>
                  <Input id="notification-text" value={item.text} onChange={e => handleFieldChange('text', e.target.value)} placeholder="¡Nuevo Evento!"/>
              </div>
               <div className="space-y-1">
                  <Label>Color del Destello (Glow)</Label>
                   <Select value={item.glowColor || 'orange'} onValueChange={(v) => handleFieldChange('glowColor', v)}>
                      <SelectTrigger>
                          <SelectValue placeholder="Selecciona un color" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="orange">Naranja (Alerta)</SelectItem>
                          <SelectItem value="blue">Azul (Informativo)</SelectItem>
                          <SelectItem value="green">Verde (Éxito)</SelectItem>
                          <SelectItem value="red">Rojo (Urgente)</SelectItem>
                      </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Elige el color para el resplandor animado de la burbuja.</p>
              </div>
              <div className="space-y-1">
                  <Label htmlFor="notification-title">Título del Modal</Label>
                  <Input id="notification-title" value={item.title || ''} onChange={e => handleFieldChange('title', e.target.value)} placeholder="Título de la notificación"/>
              </div>
              <div className="space-y-1">
                  <Label htmlFor="notification-content">Contenido del Modal (HTML permitido)</Label>
                  <Textarea id="notification-content" value={item.content || ''} onChange={e => handleFieldChange('content', e.target.value)} placeholder="Contenido detallado de la notificación..." rows={5}/>
              </div>

               <div className="space-y-1">
                  <Label htmlFor="notification-link">Enlace de la Burbuja (Opcional)</Label>
                  <Input id="notification-link" value={item.link} onChange={e => handleFieldChange('link', e.target.value)} placeholder="/noticias/evento-nuevo"/>
                  <p className="text-xs text-muted-foreground">Si dejas este campo vacío, la burbuja abrirá un modal. Si no, redirigirá al enlace.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="imageUrl">URL de Imagen del Modal (Opcional)</Label>
                <div className="flex items-center gap-2">
                    <Input id="imageUrl" value={item.imageUrl || ''} onChange={e => handleFieldChange('imageUrl', e.target.value)} />
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Icons.Gallery className="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="imageHint">Pista de Imagen (para IA)</Label>
                <Input id="imageHint" value={item.imageHint || ''} onChange={e => handleFieldChange('imageHint', e.target.value)} placeholder="Ej: people meeting" />
              </div>


              <div className="flex justify-end pt-4">
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
