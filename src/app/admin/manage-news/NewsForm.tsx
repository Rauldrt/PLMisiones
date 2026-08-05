
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition, useEffect } from 'react';
import { addNewsArticle } from '@/actions/admin';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import type { NewsArticle } from '@/lib/types';
import { LinkPreviewCard } from '@/components/LinkPreviewCard';
import { fetchUrlMetadataAction } from '@/actions/url-metadata';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha inválida.' }),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
  hidden: z.boolean().optional(),
  linkPreview: z.object({
    url: z.string().url().or(z.literal('')),
    title: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    siteName: z.string().optional(),
  }).optional(),
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onArticleAdded: () => void;
  formContent: Partial<NewsArticle>;
  isEditing?: boolean;
  onEditSubmit?: (data: NewsArticle) => void;
  onCancel?: () => void;
}

export function NewsForm({ 
    onArticleAdded, 
    formContent,
    isEditing = false,
    onEditSubmit,
    onCancel
}: NewsFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      title: formContent.title || '',
      date: formContent.date ? new Date(formContent.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      imageUrl: formContent.imageUrl || '',
      imageHint: formContent.imageHint || '',
      content: formContent.content || '',
      hidden: formContent.hidden || false,
      linkPreview: formContent.linkPreview || undefined,
    },
  });

  const linkPreview = form.watch('linkPreview');
  
  const handleImageSelect = (imageUrl: string) => {
    form.setValue('imageUrl', imageUrl);
    setGalleryOpen(false);
  };

  const onSubmit = (values: NewsFormValues) => {
    const cleanLinkPreview = values.linkPreview?.url
      ? {
          url: values.linkPreview.url,
          title: values.linkPreview.title,
          description: values.linkPreview.description,
          imageUrl: values.linkPreview.imageUrl,
          siteName: values.linkPreview.siteName,
        }
      : undefined;

    const cleanValues = {
      ...values,
      linkPreview: cleanLinkPreview,
    };

    startTransition(async () => {
        if (isEditing && onEditSubmit && formContent.id) {
            const slug = values.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            onEditSubmit({ ...cleanValues, id: formContent.id, slug } as NewsArticle);
        } else {
            const result = await addNewsArticle(cleanValues as Omit<NewsArticle, 'id' | 'slug'>);
            if (result.success) {
                toast({ title: 'Éxito', description: result.message });
                form.reset({ 
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    imageUrl: '',
                    imageHint: '',
                    content: '',
                    hidden: false,
                    linkPreview: undefined
                });
                onArticleAdded();
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'No se pudo agregar el artículo.' });
            }
        }
    });
  };

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <Form {...form}>
        <form id="news-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input placeholder="Título del artículo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>URL de la Imagen (Opcional)</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl><Input placeholder="https://... o /ruta/local.jpg" {...field} value={field.value || ''}/></FormControl>
                      <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Abrir galería">
                              <Icons.Gallery className="w-4 h-4" />
                          </Button>
                      </DialogTrigger>
                    </div>
                  <FormMessage />
                  </FormItem>
              )}
              />
          </div>
          <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Pista de Imagen (para IA, 1-2 palabras)</FormLabel>
                  <FormControl><Input placeholder="ej: political event" {...field} value={field.value || ''}/></FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenido (HTML permitido)</FormLabel>
                <FormControl><Textarea placeholder="Escriba el contenido del artículo aquí..." {...field} rows={10} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ENLACE ADJUNTO ENRIQUECIDO */}
          <div className="border p-4 rounded-lg bg-muted/10 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-bold text-xs">Enlace Adjunto (Estilo WhatsApp con Metadatos)</Label>
              {linkPreview?.url && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-destructive px-2 text-xs"
                  onClick={() => form.setValue('linkPreview', undefined)}
                >
                  Quitar Enlace
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={linkPreview?.url || ''}
                onChange={e => {
                  const prev = linkPreview || { url: '' };
                  form.setValue('linkPreview', { ...prev, url: e.target.value });
                }}
                placeholder="https://ejemplo.com/pagina-anuncio"
                className="text-xs h-9"
              />
              <Button
                type="button"
                size="sm"
                className="h-9 px-3 shrink-0"
                disabled={isFetchingMetadata || !linkPreview?.url}
                onClick={async () => {
                  const url = linkPreview?.url;
                  if (!url) return;
                  setIsFetchingMetadata(true);
                  try {
                    const res = await fetchUrlMetadataAction(url);
                    if (res.success && res.metadata) {
                      form.setValue('linkPreview', res.metadata);
                      toast({ title: 'Éxito', description: 'Metadatos del enlace cargados.' });
                    } else {
                      toast({ variant: 'destructive', title: 'Error', description: res.message });
                    }
                  } catch (err) {
                    console.error(err);
                    toast({ variant: 'destructive', title: 'Error', description: 'Fallo al obtener metadatos.' });
                  } finally {
                    setIsFetchingMetadata(false);
                  }
                }}
              >
                {isFetchingMetadata ? (
                  <>
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    Obteniendo...
                  </>
                ) : 'Autocompletar'}
              </Button>
            </div>

            {linkPreview && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-border/40">
                <div className="md:col-span-2 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Título del Enlace</Label>
                    <Input
                      value={linkPreview.title || ''}
                      onChange={e => {
                        const prev = linkPreview;
                        form.setValue('linkPreview', { ...prev, title: e.target.value });
                      }}
                      placeholder="Título de la previsualización"
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Descripción del Enlace</Label>
                    <Textarea
                      value={linkPreview.description || ''}
                      onChange={e => {
                        const prev = linkPreview;
                        form.setValue('linkPreview', { ...prev, description: e.target.value });
                      }}
                      placeholder="Descripción corta de la página"
                      rows={2}
                      className="text-xs resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">URL de Imagen</Label>
                      <Input
                        value={linkPreview.imageUrl || ''}
                        onChange={e => {
                          const prev = linkPreview;
                          form.setValue('linkPreview', { ...prev, imageUrl: e.target.value });
                        }}
                        placeholder="https://... o /imagen.jpg"
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Nombre del Sitio</Label>
                      <Input
                        value={linkPreview.siteName || ''}
                        onChange={e => {
                          const prev = linkPreview;
                          form.setValue('linkPreview', { ...prev, siteName: e.target.value });
                        }}
                        placeholder="Ej: YouTube, Infobae..."
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center p-3 rounded-lg bg-background/20 border border-white/5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-wider">Vista Previa (WhatsApp Style)</span>
                  <LinkPreviewCard metadata={linkPreview} className="mt-0 scale-[0.95]" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Guardar Artículo'}
            </Button>
             {isEditing && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
            )}
          </div>
        </form>
      </Form>
      <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
              <DialogTitle>Seleccionar Imagen de la Galería</DialogTitle>
          </DialogHeader>
          <ImageGallery onImageSelect={handleImageSelect} />
      </DialogContent>
    </Dialog>
  );
}
