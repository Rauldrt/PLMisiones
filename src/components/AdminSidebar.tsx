'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Icons, IconName } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const adminNavLinks = [
  { href: '/admin/manage-news', label: 'Noticias', icon: 'News' },
  { href: '/admin/manage-banner', label: 'Banner', icon: 'Banner' },
  { href: '/admin/manage-mosaic', label: 'Mosaico', icon: 'Mosaic' },
  { href: '/admin/manage-accordion', label: 'Acordeón', icon: 'Accordion' },
  { href: '/admin/manage-referentes', label: 'Referentes', icon: 'Referentes' },
  { href: '/admin/manage-organigrama', label: 'Organigrama', icon: 'Team' },
  { href: '/admin/manage-forms', label: 'Formularios', icon: 'Forms' },
  { href: '/admin/view-submissions', label: 'Envíos', icon: 'Submissions' },
];

function NavContent() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <Link href="/admin" className="flex items-center gap-2 text-primary">
          <span className="font-headline text-lg font-bold">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {adminNavLinks.map((link) => {
          const Icon = Icons[link.icon as IconName];
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/80 transition-all hover:text-foreground hover:bg-muted',
                pathname.startsWith(link.href) ? 'bg-muted font-semibold text-foreground' : ''
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
          <Icons.Logout className="h-5 w-5" />
          Cerrar Sesión
        </Button>
         <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/">
             <Icons.Close className="h-5 w-5" />
             Volver al Sitio
            </Link>
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <>
      <div className="hidden border-r bg-card md:block md:w-64">
        <NavContent/>
      </div>
      <div className="md:hidden absolute top-4 left-4 z-50">
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Icons.Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
               <NavContent/>
            </SheetContent>
          </Sheet>
      </div>
    </>
  );
}
