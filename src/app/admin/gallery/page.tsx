
'use client';

import { useState, useTransition } from 'react';
import { uploadPublicFilesAction } from '@/actions/gallery';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FileWithPreview extends File {
    preview: string;
}

export default function GalleryPage() {
    const [filesToUpload, setFilesToUpload] = useState<FileWithPreview[]>([]);
    const [isUploading, startUploadTransition] = useTransition();
    const { toast } = useToast();
    const [isDragOver, setIsDragOver] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [galleryKey, setGalleryKey] = useState(Date.now()); // To force re-render

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setFilesToUpload(prev => [...prev, ...newFiles]);
        }
    };
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
        if (event.dataTransfer.files) {
             const newFiles = Array.from(event.dataTransfer.files).map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setFilesToUpload(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (fileName: string) => {
        setFilesToUpload(prev => prev.filter(file => file.name !== fileName));
    };

    const handleUpload = () => {
        if (filesToUpload.length === 0) return;
        setShowConfirmDialog(true);
    };

    const confirmUpload = () => {
        setShowConfirmDialog(false);
        startUploadTransition(async () => {
            const fileDataPromises = filesToUpload.map(file => {
                return new Promise<{ name: string, data: string }>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ name: file.name, data: reader.result as string });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            try {
                const fileData = await Promise.all(fileDataPromises);
                const result = await uploadPublicFilesAction(fileData);
                if (result.success) {
                    toast({ title: 'Éxito', description: result.message });
                    setFilesToUpload([]);
                    setGalleryKey(Date.now()); // Refresh gallery
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.message });
                }
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error de Lectura', description: 'No se pudieron procesar los archivos para la subida.' });
            }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Gestor de Archivos</h1>
                <p className="text-muted-foreground">Sube imágenes a la carpeta `public` y visualiza la galería.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Subir Archivos</CardTitle>
                    <CardDescription>Arrastra y suelta archivos o haz clic para seleccionarlos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div 
                        className={cn(
                            "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors",
                            isDragOver && "bg-accent border-accent-foreground"
                        )}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                        <Icons.Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Haz clic aquí o arrastra archivos para subir.</p>
                        <input
                            id="file-upload-input"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                        />
                    </div>

                    {filesToUpload.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Archivos para subir ({filesToUpload.length}):</h3>
                            <ScrollArea className="h-64 border rounded-md">
                                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filesToUpload.map(file => (
                                    <div key={file.name} className="relative group">
                                        <Image src={file.preview} alt={file.name} width={150} height={150} className="rounded-md object-cover w-full aspect-square" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="destructive" size="icon" onClick={() => removeFile(file.name)}>
                                                <Icons.Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-xs truncate mt-1 text-center">{file.name}</p>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? 'Subiendo...' : `Subir ${filesToUpload.length} Archivo(s)`}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Galería Pública</CardTitle>
                    <CardDescription>Estas son las imágenes disponibles en tu carpeta `public`. Haz clic en una para copiar su URL.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="max-h-[80vh] overflow-y-auto">
                        <ImageGallery key={galleryKey} onImageSelect={(url) => {
                            navigator.clipboard.writeText(url);
                            toast({ title: "Copiado", description: `URL de la imagen copiada al portapapeles.` });
                        }} />
                    </div>
                </CardContent>
            </Card>

             <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar subida</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de subir {filesToUpload.length} archivo(s) a la carpeta pública. Los archivos con el mismo nombre serán sobreescritos. ¿Deseas continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmUpload}>Subir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
