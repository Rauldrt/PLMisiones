
'use client';

import { useState } from 'react';
import type { NotificationItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { clientSanitize } from '@/lib/client-sanitize';
import { LinkPreviewCard } from './LinkPreviewCard';

interface NotificacionesClientProps {
  initialNotifications: NotificationItem[];
}

export function NotificacionesClient({ initialNotifications }: NotificacionesClientProps) {
  const [notifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
  }

  return (
    <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && closeLightbox()}>
        <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {notifications.length > 0 ? (
            <div className="space-y-8">
              {notifications.map((item) => {
                const hasTextContent = item.title || item.content;
                const isEmbed = item.content?.includes('<iframe');

                return (
                  <Card key={item.id} className="overflow-hidden">
                    {item.imageUrl && (
                      <DialogTrigger asChild>
                         <button className="relative h-96 w-full cursor-pointer" onClick={() => handleImageClick(item.imageUrl!)}>
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className={cn(
                                  "object-cover",
                                  hasTextContent ? "rounded-t-lg" : "rounded-lg"
                                )}
                                sizes="(max-width: 768px) 100vw, 33vw"
                                data-ai-hint={item.imageHint}
                            />
                         </button>
                      </DialogTrigger>
                    )}
                    
                    {hasTextContent && (
                      <>
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 gap-4">
                          <div>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>
                              {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </CardDescription>
                          </div>
                          {item.tag && (
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 border",
                              item.tag === 'Alerta' && 'bg-red-500/10 text-red-500 border-red-500/20',
                              item.tag === 'Evento' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                              item.tag === 'Institucional' && 'bg-green-500/10 text-green-500 border-green-500/20',
                              item.tag === 'Comunicado' && 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                            )}>
                              {item.tag}
                            </span>
                          )}
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {isEmbed ? (
                              <div className="responsive-video rounded-md overflow-hidden">
                                  <div dangerouslySetInnerHTML={{ __html: clientSanitize(item.content) }} />
                              </div>
                          ) : (
                              <div className="prose prose-sm prose-invert max-w-full" dangerouslySetInnerHTML={{ __html: clientSanitize(item.content) }} />
                          )}
                          {item.linkPreview && (
                            <LinkPreviewCard metadata={item.linkPreview} />
                          )}
                        </CardContent>
                      </>
                    )}
                  </Card>
                )
              })}
            </div>
          ) : (
               <Card>
                  <CardHeader>
                      <CardTitle>No hay anuncios</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">No hay notificaciones para mostrar en este momento.</p>
                  </CardContent>
              </Card>
          )}
        </div>
        
        {selectedImage && (
            <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] p-2 bg-transparent border-0 shadow-none flex items-center justify-center">
                <Image
                    src={selectedImage}
                    alt="Vista ampliada"
                    width={1600}
                    height={900}
                    className="rounded-lg object-contain w-auto h-auto max-w-full max-h-full"
                />
            </DialogContent>
        )}
    </Dialog>
  );
}
