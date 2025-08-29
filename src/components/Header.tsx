'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { NavLink } from './NavLink';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/referentes', label: 'Referentes' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <span className="font-headline text-xl font-bold">Libertario Misiones</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isActive={pathname === link.href}
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
             <NavLink href="/admin" isActive={pathname.startsWith('/admin')}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/afiliacion">Afiliarse</Link>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Icons.Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col gap-6 pt-8">
                <Link href="/" className="flex items-center gap-3 px-4 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-headline text-lg font-bold">Libertario Misiones</span>
                </Link>
                <nav className="flex flex-col gap-4 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={
                        pathname === link.href ? 'text-primary font-semibold' : 'text-foreground'
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                   {user && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={pathname.startsWith('/admin') ? 'text-primary font-semibold' : 'text-foreground'}>
                      Admin
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
