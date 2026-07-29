
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublicImagesAction, uploadPublicFilesAction } from "@/actions/gallery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Icons } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/client-utils";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ImageGalleryProps {
    onImageSelect: (url: string) => void;
    showUploadTab?: boolean;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mp3', '.wav', '.ogg'];

const getFileExtension = (url: string) => {
    const lastDot = url.lastIndexOf('.');
    return lastDot !== -1 ? url.substring(lastDot).toLowerCase() : '';
};

export function ImageGallery({ onImageSelect, showUploadTab = true }: ImageGalleryProps) {
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgressText, setUploadProgressText] = useState("");
    const { toast } = useToast();

    const loadMedia = async () => {
        setIsLoading(true);
        try {
            const media = await getPublicImagesAction();
            // Sort media to show newest first, assuming they might have date-like names
            const sortedMedia = media.sort((a, b) => b.localeCompare(a));
            setMediaUrls(sortedMedia);
        } catch (error) {
            console.error("Error al cargar multimedia:", error);
            toast({
                variant: "destructive",
                title: "Error al cargar",
                description: "No se pudieron obtener los archivos de la galería.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, []);

    const handleUploadFile = async (file: File) => {
        const ext = getFileExtension(file.name);
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            toast({
                variant: "destructive",
                title: "Tipo de archivo no permitido",
                description: `Solo se permiten archivos multimedia (${ALLOWED_EXTENSIONS.join(', ')}).`,
            });
            return;
        }

        // Límite de tamaño: 14 MB (evitar exceder el límite de 15 MB de Next.js Server Actions)
        const MAX_SIZE = 14 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast({
                variant: "destructive",
                title: "Archivo demasiado grande",
                description: "El archivo supera el límite máximo de 14 MB permitido para subidas.",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgressText(file.size > 5 * 1024 * 1024 && !file.type.startsWith('image/') 
            ? "Subiendo archivo grande, esto puede tardar un momento..." 
            : "Procesando...");

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                let base64Data = reader.result as string;

                // Optimizar imágenes en el cliente
                if (file.type.startsWith('image/')) {
                    setUploadProgressText("Optimizando imagen...");
                    try {
                        base64Data = await compressImage(base64Data, 1920, 1920, 0.8);
                    } catch (compressErr) {
                        console.warn('Fallo al optimizar la imagen, se subirá original:', compressErr);
                    }
                }

                setUploadProgressText("Subiendo archivo...");
                const uploadResult = await uploadPublicFilesAction([{
                    name: file.name,
                    data: base64Data
                }]);

                if (uploadResult.success) {
                    toast({
                        title: "Subida exitosa",
                        description: `El archivo ${file.name} se subió y optimizó correctamente.`,
                    });
                    
                    // Invocar la selección automática con la ruta final retornada
                    onImageSelect(uploadResult.url || `/${file.name}`);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error al subir",
                        description: uploadResult.message,
                    });
                }
                setIsUploading(false);
            };
            reader.onerror = () => {
                toast({
                    variant: "destructive",
                    title: "Error de lectura",
                    description: "No se pudo leer el archivo seleccionado.",
                });
                setIsUploading(false);
            };
        } catch (error) {
            console.error("Error al procesar subida:", error);
            toast({
                variant: "destructive",
                title: "Error inesperado",
                description: "Ocurrió un error al intentar procesar el archivo.",
            });
            setIsUploading(false);
        }
    };

    const getMediaIcon = (url: string) => {
        const extension = getFileExtension(url);
        if (['.mp4', '.webm'].includes(extension)) {
            return <Icons.Media className="h-10 w-10 text-muted-foreground" />;
        }
        if (['.mp3', '.wav', '.ogg'].includes(extension)) {
            return <Icons.Music2 className="h-10 w-10 text-muted-foreground" />;
        }
        return null;
    };

    const renderGalleryGrid = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full rounded-md" />
                    ))}
                </div>
            );
        }

        if (mediaUrls.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-48 text-muted-foreground">
                    <Icons.Inbox className="h-12 w-12 mb-2" />
                    <p>No se encontraron archivos en la galería pública.</p>
                </div>
            );
        }

        return (
            <ScrollArea className="h-[55vh]">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4">
                    {mediaUrls.map((url, index) => {
                        const extension = getFileExtension(url);
                        const isImage = IMAGE_EXTENSIONS.includes(extension);
                        const MediaIcon = getMediaIcon(url);

                        return (
                            <button
                                key={url}
                                onClick={() => onImageSelect(url)}
                                className="relative aspect-square w-full rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-muted border border-border/40 flex items-center justify-center transition-all hover:shadow-md"
                            >
                                {isImage ? (
                                    <Image
                                        src={url}
                                        alt={`Contenido de la galería ${index + 1}`}
                                        fill
                                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    MediaIcon
                                )}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-2">
                                    <p className="text-white text-xs truncate w-full text-center">{url.split('/').pop()}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>
        );
    };

    if (!showUploadTab) {
        return renderGalleryGrid();
    }

    return (
        <Tabs defaultValue="gallery" className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4 mx-auto bg-muted/40 p-1 rounded-lg border border-border/20">
                <TabsTrigger value="gallery" className="rounded-md">Explorar Galería</TabsTrigger>
                <TabsTrigger value="upload" className="rounded-md">Subir Archivo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="flex-1 min-h-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                {renderGalleryGrid()}
            </TabsContent>
            
            <TabsContent value="upload" className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0">
                <div 
                    className={cn(
                        "border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 bg-muted/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] group",
                        isDragOver && "border-primary bg-primary/5 scale-[0.99] shadow-inner",
                        isUploading && "pointer-events-none opacity-80"
                    )}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleUploadFile(e.dataTransfer.files[0]);
                        }
                    }}
                    onClick={() => !isUploading && document.getElementById('inline-file-upload')?.click()}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <div className="space-y-1">
                                <p className="font-semibold text-foreground text-sm">{uploadProgressText}</p>
                                <p className="text-xs text-muted-foreground">Por favor, no cierres este diálogo.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
                            <div className="p-4 bg-muted/40 rounded-full text-muted-foreground group-hover:text-primary transition-all duration-300 border border-border/20 shadow-sm">
                                <Icons.Upload className="h-10 w-10 text-muted-foreground transition-transform group-hover:-translate-y-0.5 duration-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-sm">Arrastra tu archivo aquí o haz clic para explorar</p>
                                <p className="text-xs text-muted-foreground">Soporta imágenes, videos y audios (Máx. 14 MB)</p>
                            </div>
                        </div>
                    )}
                    <input
                        id="inline-file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleUploadFile(e.target.files[0]);
                            }
                        }}
                        accept="image/*,video/*,audio/*"
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}

