
'use client';

import { useState, useEffect } from 'react';
import type { NotificationItem } from '@/lib/types';
import { getNotificationsAction } from '@/actions/data';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = (await getNotificationsAction()).filter(n => !n.hidden).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNotifications(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
  }

  return (
    <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && closeLightbox()}>
        <div>
            <PageHeader 
                icon="Notification"
                title="Notificaciones"
                description="Aquí encontrarás las últimas novedades y anuncios importantes."
            />
          <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            {isLoading ? (
                <div className="space-y-8">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-8">
                {notifications.map((item) => (
                  <Card key={item.id}>
                    {item.imageUrl && (
                      <DialogTrigger asChild>
                         <button className="relative h-64 w-full cursor-pointer" onClick={() => handleImageClick(item.imageUrl!)}>
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="rounded-t-lg object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                data-ai-hint={item.imageHint}
                            />
                         </button>
                      </DialogTrigger>
                    )}
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>
                        {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm prose-invert max-w-full" dangerouslySetInnerHTML={{ __html: item.content }} />
                    </CardContent>
                  </Card>
                ))}
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
