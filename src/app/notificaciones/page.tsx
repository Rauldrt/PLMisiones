
import { getPublicNotificationsAction } from '@/actions/data';
import { getPageHeaderByPathAction } from '@/lib/server/data';
import { NotificacionesClient } from '@/components/NotificacionesClient';
import { PageHeader } from '@/components/PageHeader';


export default async function NotificacionesPage() {
  const [notifications, pageHeader] = await Promise.all([
    getPublicNotificationsAction(),
    getPageHeaderByPathAction('/notificaciones')
  ]);
  
  return (
    <div>
        {pageHeader ? (
            <PageHeader {...pageHeader} />
        ) : (
            <div className="bg-card py-8">
                <div className="container text-center px-4 sm:px-6 lg:px-8">
                    <h1 className="mt-4 font-headline text-3xl font-bold md:text-4xl">Notificaciones</h1>
                    <p className="mt-2 max-w-2xl mx-auto text-base text-foreground/80">Aquí encontrarás las últimas novedades y anuncios importantes.</p>
                </div>
            </div>
        )}
        <NotificacionesClient initialNotifications={notifications} />
    </div>
  );
}
