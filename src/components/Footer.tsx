import Link from 'next/link';
import { getSocialLinks, getFormDefinition } from '@/lib/data';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { DynamicForm } from './DynamicForm';

export async function Footer() {
  const socialLinks = await getSocialLinks();
  const contactFormDefinition = await getFormDefinition('contacto');

  const getSocialIcon = (name: 'Facebook' | 'Twitter' | 'Instagram' | 'YouTube') => {
    switch (name) {
      case 'Facebook': return <Icons.Facebook className="h-6 w-6" />;
      case 'Twitter': return <Icons.Twitter className="h-6 w-6" />;
      case 'Instagram': return <Icons.Instagram className="h-6 w-6" />;
      case 'YouTube': return <Icons.Youtube className="h-6 w-6" />;
      default: return null;
    }
  };

  return (
    <footer className="bg-card" id="contacto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-background border-border p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <div className="space-y-8">
                    <div>
                        <h2 className="font-headline text-2xl font-bold text-primary">Ponete en Contacto</h2>
                        <p className="text-foreground/80 mt-2">Estamos para escucharte. Envianos tu consulta o sumate a nuestro equipo.</p>
                    </div>
                    <div className="space-y-4 text-foreground/90">
                        <div className="flex items-start gap-4">
                            <Icons.Location className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Nuestra Sede</h3>
                                <p className="text-foreground/80">Av. Corrientes 1234, Posadas, Misiones, Argentina</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Icons.Contact className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Email y Teléfono</h3>
                                <p className="text-foreground/80">contacto@libertariomisiones.com</p>
                                <p className="text-foreground/80">+54 9 376 412-3456</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Icons.Social className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Redes Sociales</h3>
                                <div className="flex items-center gap-4 mt-2">
                                     {socialLinks.map((link) => (
                                        <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                                            {getSocialIcon(link.name)}
                                            <span className="sr-only">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <DynamicForm formDefinition={contactFormDefinition} />
                </div>
            </div>
        </Card>
      </div>
      <div className="bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
                <span className="font-headline text-lg font-bold text-primary">Libertario Misiones</span>
            </div>
            <div className="text-center text-sm text-foreground/60 sm:text-right">
                <p>&copy; {new Date().getFullYear()} Partido Libertario Misiones. Todos los derechos reservados.</p>
                <p className="mt-1">
                    Desarrollado con ♥ por la comunidad.
                </p>
            </div>
            </div>
        </div>
      </div>
    </footer>
  );
}