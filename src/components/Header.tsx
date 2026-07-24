
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Icons, getIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import Image from 'next/image';
import type { SocialLink, NotificationItem, Notification } from '@/lib/types';
import { getPublicNotificationsAction, getNotificationAction } from '@/actions/data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { clientSanitize } from '@/lib/client-sanitize';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/referentes', label: 'Referentes' },
  { href: '#contacto', label: 'Contacto' },
];

interface HeaderProps {
    socialLinks: SocialLink[];
}

export function Header({ socialLinks }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<Notification | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const [notifs, settings] = await Promise.all([
          getPublicNotificationsAction(),
          getNotificationAction()
        ]);
        setNotifications(notifs);
        setNotificationSettings(settings);
      } catch (err) {
        console.error("Failed to load notifications in Header:", err);
      }
    }
    loadNotifications();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false); // Always close mobile menu

    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else if (href === '/' && pathname === '/') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={(e) => handleLinkClick(e, '/')}>
            <Image src="/logo.png" alt="Logo del Partido" width={50} height={50} />
            <span className="font-headline text-xl font-bold">Partido Libertario Misiones</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={cn(
                  'relative overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:bg-muted',
                  (pathname === link.href) ? 'font-semibold text-foreground' : 'text-foreground/80'
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="outline">
                  <Link href="/fiscales">Fiscalizá</Link>
              </Button>
              <Button asChild>
                  <Link href="/afiliacion">Afiliarse</Link>
              </Button>
          </div>
        </div>
      </header>

      <div className="md:hidden">
        {/* Backdrop overlay */}
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-in-out",
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* FAB / Modal Container */}
        <div 
          className={cn(
            "fixed z-50 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl border",
            isMobileMenuOpen 
              ? "bottom-6 right-6 w-[calc(100vw-2rem)] max-w-xs rounded-[2rem] bg-card border-border p-5 flex flex-col max-h-[80vh]" 
              : "bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-primary-foreground border-transparent flex items-center justify-center cursor-pointer hover:scale-105"
          )}
          onClick={() => {
            if (!isMobileMenuOpen) {
              setIsMobileMenuOpen(true);
            }
          }}
        >
          {!isMobileMenuOpen ? (
            /* --- FAB CERRADO --- */
            <div className="relative w-full h-full flex items-center justify-center">
              <Icons.Menu className="h-6 w-6 text-primary-foreground" />
              {notificationSettings?.enabled && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-[10px] font-bold text-white items-center justify-center shadow border border-background">
                    {notifications.length}
                  </span>
                </span>
              )}
            </div>
          ) : (
            /* --- MODAL ABIERTO --- */
            <div className="flex flex-col h-full w-full overflow-hidden animate-fade-in-up" style={{ animationDuration: '300ms' }} onClick={(e) => e.stopPropagation()}>
              {/* Scrollable Container (Notificaciones + Links de Navegación) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                
                {/* Notificaciones en Acordeón */}
                {notificationSettings?.enabled && notifications.length > 0 && (
                  <div className="p-3 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      <span className="text-xs font-bold text-orange-500 tracking-wide uppercase">
                        {notificationSettings.text || 'Notificaciones'}
                      </span>
                    </div>
                    <Accordion type="single" collapsible className="w-full space-y-1">
                      {notifications.map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="border-b-0">
                          <AccordionTrigger className="text-xs hover:no-underline py-1.5 px-2 rounded hover:bg-muted text-left text-foreground font-medium flex justify-between items-center w-full">
                            <span className="truncate pr-4 flex-1">{item.title}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-3 px-2 text-xs text-muted-foreground bg-muted/40 rounded border border-border/10 mt-1">
                            {item.imageUrl && (
                              <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {item.content && (
                              <div
                                className="whitespace-normal [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded [&_img]:rounded [&_img]:max-h-32 [&_img]:mx-auto [&_a]:text-orange-500 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: clientSanitize(item.content) }}
                              />
                            )}
                            <p className="text-[10px] text-muted-foreground/60 mt-2 text-right">
                              {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Logo y Encabezado */}
                <div className="p-2 border-b flex items-center gap-3">
                  <Image src="/logo.png" alt="Logo del Partido" width={36} height={36} />
                  <span className="font-headline text-base font-bold text-foreground">Libertario Misiones</span>
                </div>

                {/* Enlaces Principales */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted',
                        pathname === link.href ? 'font-semibold text-foreground' : 'text-foreground/80'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* Botones de Acción */}
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/fiscales">Fiscalizá</Link>
                  </Button>
                  <Button asChild size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/afiliacion">Afiliarse</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/admin">Admin</Link>
                  </Button>
                </div>

                <Separator />

                {/* Redes Sociales */}
                <div className="flex justify-center gap-5 py-2">
                  {socialLinks.map((link) => {
                    const IconComponent = getIcon(link.name);
                    return (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/60 hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.Social className="h-5 w-5" />}
                      </Link>
                    )
                  })}
                </div>

              </div>

              {/* Botón Flotante para Cerrar el Modal */}
              <div className="flex justify-end pt-3 mt-1 border-t border-border/40">
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-md hover:scale-105 transition-transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icons.Close className="h-5 w-5 text-primary-foreground" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
