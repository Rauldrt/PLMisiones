
import { getNotifications } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';

export const metadata = {
  title: 'Notificaciones',
};

export default async function NotificacionesPage() {
  const notifications = (await getNotifications()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
        <PageHeader 
            icon="Notification"
            title="Notificaciones"
            description="Aquí encontrarás las últimas novedades y anuncios importantes."
        />
      <div className="container max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {notifications.length > 0 ? (
          <Card>
            <CardHeader>
                <CardTitle>Historial de Anuncios</CardTitle>
                 <CardDescription>Todos los anuncios importantes, del más reciente al más antiguo.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {notifications.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="hover:no-underline text-left">
                                <div className="flex items-center gap-4">
                                {item.imageUrl && (
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="rounded-md object-cover"
                                            sizes="64px"
                                            data-ai-hint={item.imageHint}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{item.title}</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="prose prose-sm prose-invert max-w-full" dangerouslySetInnerHTML={{ __html: item.content }} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
          </Card>
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
