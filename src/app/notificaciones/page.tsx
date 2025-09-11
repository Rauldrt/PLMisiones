import { getNotification } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata = {
  title: 'Notificaciones',
};

// This is a simple implementation. In the future, this could read a list of notifications.
export default async function NotificacionesPage() {
  const notification = await getNotification();

  return (
    <div>
        <PageHeader 
            icon="Notification"
            title="Notificaciones"
            description="Aquí encontrarás las últimas novedades y anuncios importantes."
        />
      <div className="container max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card>
            <CardHeader>
                <CardTitle>Anuncio Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                {notification && notification.enabled ? (
                    <p className="text-lg">{notification.text}</p>
                ) : (
                    <p className="text-muted-foreground">No hay notificaciones activas en este momento.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
