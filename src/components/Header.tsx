
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Icons, getIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import Image from 'next/image';
import type { SocialLink, NotificationItem, Notification } from '@/lib/types';
import { getPublicNotificationsAction, getNotificationAction } from '@/actions/data';
import { clientSanitize } from '@/lib/client-sanitize';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { NotificationDialog } from './NotificationDropdown';

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
  const [isMobileNotifsOpen, setIsMobileNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<Notification | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  useEffect(() => {
    const applyTheme = (currentTheme: 'light' | 'dark' | 'system') => {
      const root = document.documentElement;
      if (currentTheme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-10 h-10 transition-all duration-300 active:scale-95 hover:bg-muted mr-1"
                    aria-label="Cambiar tema"
                  >
                    {theme === 'light' && (
                      <Sun className="h-[1.2rem] w-[1.2rem] text-foreground transition-all duration-300 hover:rotate-12" />
                    )}
                    {theme === 'dark' && (
                      <Moon className="h-[1.2rem] w-[1.2rem] text-yellow-400 transition-all duration-300 hover:rotate-12" />
                    )}
                    {theme === 'system' && (
                      <Laptop className="h-[1.2rem] w-[1.2rem] text-foreground opacity-80" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-36 p-1.5 rounded-xl border border-border/60 shadow-lg" align="end">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-muted text-left w-full transition-all",
                        theme === 'light' ? "bg-primary/10 text-primary" : "text-foreground/80"
                      )}
                    >
                      <Sun className="h-3.5 w-3.5" />
                      <span>Claro</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-muted text-left w-full transition-all",
                        theme === 'dark' ? "bg-primary/10 text-primary" : "text-foreground/80"
                      )}
                    >
                      <Moon className="h-3.5 w-3.5" />
                      <span>Oscuro</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-muted text-left w-full transition-all",
                        theme === 'system' ? "bg-primary/10 text-primary" : "text-foreground/80"
                      )}
                    >
                      <Laptop className="h-3.5 w-3.5" />
                      <span>Sistema</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button asChild variant="outline">
                  <Link href="/fiscales">Fiscalizá</Link>
              </Button>
              <Button asChild className="animate-shimmer">
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

        {/* Mobile Floating Notification Bubble */}
        {notificationSettings?.enabled && notifications.length > 0 && !isMobileMenuOpen && (
          <div className="fixed bottom-[96px] right-6 z-50 md:hidden animate-fade-in duration-300">
            <Dialog open={isMobileNotifsOpen} onOpenChange={setIsMobileNotifsOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsMobileNotifsOpen(true)}
                  className={cn(
                    "relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 active:scale-95",
                    notificationSettings.glowColor === 'orange' && 'bg-orange-500 text-white border-orange-400/50 shadow-orange-500/30',
                    notificationSettings.glowColor === 'blue' && 'bg-blue-500 text-white border-blue-400/50 shadow-blue-500/30',
                    notificationSettings.glowColor === 'green' && 'bg-green-500 text-white border-green-400/50 shadow-green-500/30',
                    notificationSettings.glowColor === 'red' && 'bg-red-500 text-white border-red-400/50 shadow-red-500/30'
                  )}
                >
                  <span className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                    notificationSettings.glowColor === 'orange' && 'bg-orange-400',
                    notificationSettings.glowColor === 'blue' && 'bg-blue-400',
                    notificationSettings.glowColor === 'green' && 'bg-green-400',
                    notificationSettings.glowColor === 'red' && 'bg-red-400',
                    notificationSettings.glowSpeed === 'slow' && 'animate-ping-slow',
                    notificationSettings.glowSpeed === 'normal' && 'animate-ping',
                    notificationSettings.glowSpeed === 'fast' && 'animate-ping-fast'
                  )}></span>
                  
                  <Icons.Notification className="h-6 w-6 relative z-10 animate-bounce" style={{ animationDuration: '2.5s' }} />
                  
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 rounded-full bg-red-600 text-[10px] font-bold text-white items-center justify-center shadow border border-background z-20">
                    {notifications.length}
                  </span>
                </button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md w-[calc(100vw-2rem)] rounded-2xl p-5">
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl text-accent flex items-center gap-2">
                    <Icons.Notification className="h-5 w-5 text-primary" />
                    {notificationSettings.text || 'Notificaciones'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pr-1">
                  {notifications.map((item, index) => (
                    <NotificationDialog item={item} key={item.id}>
                      <button className="w-full text-left focus:outline-none">
                        <div className={cn("space-y-1.5 rounded-xl p-3 hover:bg-muted bg-muted/20 border border-border/10 transition-all", index === 0 && "border-primary/20 bg-primary/5")}>
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("truncate text-sm flex-1 font-medium", index === 0 ? "text-foreground font-semibold" : "text-foreground/80")}>
                              {item.title}
                            </p>
                            {item.tag && (
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 border",
                                item.tag === 'Alerta' && 'bg-red-500/10 text-red-500 border-red-500/20',
                                item.tag === 'Evento' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                                item.tag === 'Institucional' && 'bg-green-500/10 text-green-500 border-green-500/20',
                                item.tag === 'Comunicado' && 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                              )}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(item.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                          </p>
                        </div>
                      </button>
                    </NotificationDialog>
                  ))}
                </div>

                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 rounded-xl"
                  onClick={() => setIsMobileNotifsOpen(false)}
                >
                  <Link href="/notificaciones">Ver Todas las Notificaciones</Link>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* FAB / Modal Container */}
        <div 
          className={cn(
            "fixed z-50 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl border",
            isMobileMenuOpen 
              ? "bottom-6 right-6 w-[calc(100vw-2rem)] max-w-xs rounded-[2.5rem] bg-card border-border p-5 flex flex-col max-h-[80vh]" 
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
            </div>
          ) : (
            /* --- MODAL ABIERTO --- */
            <div className="flex flex-col h-full w-full overflow-hidden animate-fade-in-up" style={{ animationDuration: '300ms' }} onClick={(e) => e.stopPropagation()}>
              {/* Scrollable Container (Notificaciones + Links de Navegación) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                
                {/* Espacio superior para compensar que no hay acordeón de notificaciones */}
                <div className="pt-2" />

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
                  <Button asChild size="sm" className="animate-shimmer" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/afiliacion">Afiliarse</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/admin">Admin</Link>
                  </Button>
                  
                  {/* Selector de Tema en Móvil */}
                  <div className="flex items-center justify-between p-2 mt-1 rounded-xl bg-muted/40 border">
                    <span className="text-xs font-medium text-foreground/80">Tema del Sitio</span>
                    <div className="flex gap-1 bg-background/50 p-1 rounded-lg border border-border/40">
                      <button
                        onClick={() => handleThemeChange('light')}
                        className={cn(
                          "p-1.5 rounded-md transition-all",
                          theme === 'light' ? "bg-primary/20 text-primary" : "text-muted-foreground"
                        )}
                        title="Tema Claro"
                      >
                        <Sun className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className={cn(
                          "p-1.5 rounded-md transition-all",
                          theme === 'dark' ? "bg-primary/20 text-primary" : "text-muted-foreground"
                        )}
                        title="Tema Oscuro"
                      >
                        <Moon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleThemeChange('system')}
                        className={cn(
                          "p-1.5 rounded-md transition-all",
                          theme === 'system' ? "bg-primary/20 text-primary" : "text-muted-foreground"
                        )}
                        title="Seguir Sistema"
                      >
                        <Laptop className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
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
