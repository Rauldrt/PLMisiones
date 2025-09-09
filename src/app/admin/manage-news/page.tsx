
'use client';
import { useState, useEffect, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { getNewsAction } from '@/actions/data';
import { saveNews } from '@/actions/admin';
import type { NewsArticle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { AIGenerator } from './AIGenerator';
import { NewsForm } from './NewsForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';


export default function ManageNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    const newsData = await getNewsAction();
    setArticles(newsData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSetFormContent = (data: { title: string, content: string }) => {
    // This is a dummy function to pass to NewsForm. 
    // The actual logic is inside NewsForm component itself.
  }
  
  const handleSaveChanges = (updatedArticles: NewsArticle[], successMessage: string) => {
    setArticles(updatedArticles);
    startSavingTransition(async () => {
        const result = await saveNews(updatedArticles);
        if (result.success) {
            toast({ title: 'Éxito', description: successMessage });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los cambios.' });
            fetchNews(); // Revert changes on failure
        }
    });
  }

  const handleDelete = (id: string) => {
    const updatedArticles = articles.filter(article => article.id !== id);
    handleSaveChanges(updatedArticles, 'Artículo eliminado.');
  };
  
  const handleToggleHidden = (id: string, isHidden: boolean) => {
      const updatedArticles = articles.map(article => 
        article.id === id ? { ...article, hidden: isHidden } : article
      );
      handleSaveChanges(updatedArticles, `Artículo ${isHidden ? 'ocultado' : 'mostrado'}.`);
  };
  
  const moveArticle = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === articles.length - 1)) {
        return;
    }
    const newArticles = [...articles];
    const article = newArticles.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newArticles.splice(newIndex, 0, article);
    handleSaveChanges(newArticles, 'Orden de artículos actualizado.');
  };
  
  const handleEdit = (article: NewsArticle) => {
      const updatedArticles = articles.map(a => a.id === article.id ? article : a);
      handleSaveChanges(updatedArticles, "Artículo actualizado con éxito.");
      setEditingArticle(null);
  }

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
          <CardDescription>Lista de todos los artículos publicados. Haz clic en uno para ver más detalles.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Cargando artículos...</p> : (
            <Dialog>
                <Accordion type="single" collapsible className="w-full space-y-2">
                {articles.map((article, index) => (
                    <AccordionItem key={article.id} value={article.id} className={cn("border rounded-md px-4", article.hidden && "bg-muted/30")}>
                    <div className="flex justify-between items-center w-full">
                        <AccordionTrigger className="hover:no-underline py-2 flex-1">
                        <div className="flex items-center gap-4 text-left">
                            <Image src={article.imageUrl || '/placeholder.png'} alt={article.title} width={40} height={40} className="rounded-md object-cover h-10 w-10" data-ai-hint={article.imageHint} />
                            <div>
                                <h3 className={cn("font-semibold", article.hidden && "text-muted-foreground line-through")}>{article.title}</h3>
                                <p className="text-sm text-muted-foreground">{new Date(article.date).toLocaleDateString('es-AR')}</p>
                            </div>
                        </div>
                        </AccordionTrigger>
                        <div className="flex items-center gap-1.5 pr-2">
                            <Button variant="ghost" size="icon" onClick={() => moveArticle(index, 'up')} disabled={index === 0 || isSaving}>
                                <Icons.ChevronUp className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => moveArticle(index, 'down')} disabled={index === articles.length - 1 || isSaving}>
                                <Icons.ChevronDown className="h-4 w-4" />
                            </Button>
                             <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setEditingArticle(article)}>
                                    <Icons.Edit className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                             <Switch
                                checked={!article.hidden}
                                onCheckedChange={(checked) => handleToggleHidden(article.id, !checked)}
                                aria-label={article.hidden ? 'Mostrar artículo' : 'Ocultar artículo'}
                            />
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
                    </div>
                    <AccordionContent className="pt-2 pb-4">
                        <div
                            className="prose prose-sm prose-invert max-w-full line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
                {editingArticle && (
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Editar Artículo</DialogTitle>
                             <DialogDescription>
                                Realiza los cambios necesarios y haz clic en guardar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
                            <NewsForm
                                key={editingArticle.id}
                                onArticleAdded={() => {}} // Not used for editing
                                setFormContent={() => {}} // Not used for editing
                                formContent={editingArticle}
                                isEditing={true}
                                onEditSubmit={handleEdit}
                                onCancel={() => setEditingArticle(null)}
                            />
                        </div>
                    </DialogContent>
                )}
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
