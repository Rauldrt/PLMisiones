
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/referentes', label: 'Referentes' },
  { href: '#contacto', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

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
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" onClick={(e) => handleLinkClick(e, '/')}>
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
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/admin" className={cn(
                  'relative overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:bg-muted',
                  pathname.startsWith('/admin') ? 'font-semibold text-foreground' : 'text-foreground/80'
                )}>
                Admin
              </Link>
            )}
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
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg"
              >
                  <div className={cn("absolute transition-transform duration-300 ease-in-out", isMobileMenuOpen ? "rotate-45" : "rotate-0")}>
                    <Icons.Plus className={cn("h-6 w-6 transition-opacity duration-300", isMobileMenuOpen ? "opacity-100" : "opacity-0")} />
                  </div>
                   <div className={cn("absolute transition-transform duration-300 ease-in-out", isMobileMenuOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100")}>
                     <Icons.Menu className="h-6 w-6" />
                  </div>
                <span className="sr-only">Abrir menú</span>
              </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px]">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                  <Link href="/" className="flex items-center gap-3" onClick={(e) => handleLinkClick(e, '/')}>
                      <span className="font-headline text-lg font-bold">Partido Libertario Misiones</span>
                  </Link>
              </div>
              <nav className="flex flex-col gap-4 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-base font-medium hover:bg-muted',
                      pathname === link.href ? 'font-semibold text-foreground' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                  {user && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={cn('block rounded-md px-3 py-2 text-base font-medium hover:bg-muted', pathname.startsWith('/admin') ? 'font-semibold text-foreground' : 'text-foreground/80')}>
                    Admin
                  </Link>
                )}
              </nav>
              <Separator/>
              <div className="p-4 flex flex-col gap-4">
                  <Button asChild variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/fiscales">Fiscalizá</Link>
                  </Button>
                  <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/afiliacion">Afiliarse</Link>
                  </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
