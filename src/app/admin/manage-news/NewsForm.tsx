'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { addNewsArticle } from '@/actions/admin';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';

const formSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  date: z.string().date('Fecha inválida.'),
  imageUrl: z.string().url('URL de imagen inválida.'),
  imageHint: z.string().optional(),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onArticleAdded: () => void;
  setFormContent: (data: { title: string, content: string }) => void;
}

export function NewsForm({ onArticleAdded, setFormContent }: NewsFormProps & { formContent: NewsFormValues }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [galleryOpen, setGalleryOpen] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '/placeholder.png',
      imageHint: '',
      content: '',
    },
  });

  setFormContent = ({ title, content }) => {
    form.setValue('title', title);
    form.setValue('content', content);
  };
  
  const handleImageSelect = (imageUrl: string) => {
    form.setValue('imageUrl', imageUrl);
    setGalleryOpen(false);
  };

  const onSubmit = (values: NewsFormValues) => {
    startTransition(async () => {
      const result = await addNewsArticle(values);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
        form.reset({ 
            title: '',
            date: new Date().toISOString().split('T')[0],
            imageUrl: '/placeholder.png',
            imageHint: '',
            content: '',
        });
        onArticleAdded();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo agregar el artículo.' });
      }
    });
  };

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormLabel>URL de la Imagen</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
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
                  <FormControl><Input placeholder="ej: political event" {...field} /></FormControl>
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
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Artículo'}
          </Button>
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
