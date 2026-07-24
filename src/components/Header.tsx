
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
import { NotificationDialog } from '@/components/NotificationDropdown';

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
        <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <div className="fixed bottom-6 right-6 z-50 overflow-visible">
            <PopoverTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="h-16 w-16 rounded-full shadow-lg"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu-content"
                >
                    <Icons.Menu className={cn("absolute h-6 w-6 transition-all duration-300", isMobileMenuOpen && "opacity-0 rotate-90")} />
                    <Icons.Close className={cn("absolute h-6 w-6 transition-all duration-300", !isMobileMenuOpen && "opacity-0 rotate-90")} />
                  <span className="sr-only">{isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
                </Button>
            </PopoverTrigger>
            {notificationSettings?.enabled && notifications.length > 0 && !isMobileMenuOpen && (
              <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 z-[60] pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 text-[11px] font-bold text-white items-center justify-center shadow-lg border-2 border-background">
                  {notifications.length}
                </span>
              </span>
            )}
          </div>
          <PopoverContent id="mobile-menu-content" side="top" align="end" className="w-64 p-0 mb-2" sideOffset={12}>
            <div className="flex flex-col h-full">
              {notificationSettings?.enabled && notifications.length > 0 && (
                <div className="p-3 bg-accent/5 border-b border-border/40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-orange-500">{notificationSettings.text}</span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((item) => (
                      <NotificationDialog item={item} key={item.id}>
                        <button 
                          className="w-full text-left rounded p-1.5 hover:bg-muted text-xs block truncate text-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.title}
                        </button>
                      </NotificationDialog>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 border-b">
                  <Link href="/" className="flex items-center gap-3" onClick={(e) => handleLinkClick(e, '/')}>
                      <Image src="/logo.png" alt="Logo del Partido" width={40} height={40} />
                      <span className="font-headline text-lg font-bold">Libertario Misiones</span>
                  </Link>
              </div>
              <nav className="flex flex-col gap-1 p-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-base font-medium hover:bg-muted',
                      pathname === link.href ? 'font-semibold text-foreground' : 'text-foreground/80'
                    )}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Separator/>
              <div className="p-2 flex flex-col gap-2">
                  <Button asChild variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/fiscales">Fiscalizá</Link>
                  </Button>
                  <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/afiliacion">Afiliarse</Link>
                  </Button>
                   <Button asChild variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/admin">Admin</Link>
                  </Button>
              </div>
              <Separator />
               <div className="p-4">
                    <div className="flex justify-center gap-6">
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
                                    {IconComponent ? <IconComponent className="h-6 w-6" /> : <Icons.Social className="h-6 w-6" />}
                                    <span className="sr-only">{link.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
