
'use client';

import { useState } from 'react';
import type { NotificationItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
                        <CardHeader className="p-4">
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>
                            {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {isEmbed ? (
                              <div className="responsive-video rounded-md overflow-hidden">
                                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                              </div>
                          ) : (
                              <div className="prose prose-sm prose-invert max-w-full" dangerouslySetInnerHTML={{ __html: item.content }} />
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
