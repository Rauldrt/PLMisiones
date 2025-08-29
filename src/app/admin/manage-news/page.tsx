'use client';
import { useState, useEffect, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { getNews } from '@/lib/data';
import { saveNews } from '@/actions/admin';
import type { NewsArticle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { AIGenerator } from './AIGenerator';
import { NewsForm } from './NewsForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    const newsData = await getNews();
    setArticles(newsData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSetFormContent = (data: { title: string, content: string }) => {
    // This is a dummy function to pass to NewsForm. 
    // The actual logic is inside NewsForm component itself.
    // A more robust solution might use context or lifting state up properly.
  }

  const handleDelete = (id: string) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    setArticles(updatedArticles);
    startSavingTransition(async () => {
        const result = await saveNews(updatedArticles);
        if (result.success) {
            toast({ title: 'Éxito', description: 'Artículo eliminado.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el artículo.' });
            fetchNews(); // Revert changes on failure
        }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Noticias</h1>
        <p className="text-muted-foreground">Agrega, edita o elimina artículos del sitio.</p>
      </div>

      <AIGenerator onContentGenerated={(title, content) => handleSetFormContent({ title, content })} />
      
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Artículo</CardTitle>
        </CardHeader>
        <CardContent>
           <NewsForm onArticleAdded={fetchNews} setFormContent={handleSetFormContent} formContent={{title: '', date: '', imageUrl: '', content: ''}}/>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Artículos Existentes</CardTitle>
          <CardDescription>Lista de todos los artículos publicados.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Cargando artículos...</p> : (
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article.id} className="flex items-center justify-between gap-4 rounded-md border p-4">
                   <div className="flex items-center gap-4">
                    <Image src={article.imageUrl} alt={article.title} width={64} height={64} className="rounded-md object-cover h-16 w-16" data-ai-hint={article.imageHint} />
                    <div>
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(article.date).toLocaleDateString('es-AR')}</p>
                    </div>
                   </div>
                  
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon" disabled={isSaving}>
                            <Icons.Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(article.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
