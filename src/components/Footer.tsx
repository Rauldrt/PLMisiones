import Link from 'next/link';
import { getSocialLinks } from '@/lib/data';
import { Icons } from '@/components/icons';

export async function Footer() {
  const socialLinks = await getSocialLinks();

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
    <footer className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Icons.Logo />
            <span className="font-headline text-lg font-bold text-primary">Libertario Misiones</span>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-foreground/60 transition-colors hover:text-primary"
              >
                {getSocialIcon(link.name)}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Partido Libertario Misiones. Todos los derechos reservados.</p>
          <p className="mt-2">
            Desarrollado con ♥ por la comunidad.
          </p>
        </div>
      </div>
    </footer>
  );
}
