
import { getPublicNotifications } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const metadata = {
  title: 'Notificaciones',
};

export default async function NotificacionesPage() {
  const notifications = (await getPublicNotifications()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
        <PageHeader 
            icon="Notification"
            title="Notificaciones"
            description="Aquí encontrarás las últimas novedades y anuncios importantes."
        />
      <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {notifications.length > 0 ? (
          <div className="space-y-8">
            {notifications.map((item) => (
              <Card key={item.id}>
                {item.imageUrl && (
                  <div className="relative h-64 w-full">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="rounded-t-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        data-ai-hint={item.imageHint}
                    />
                  </div>
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
  );
}
