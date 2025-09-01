'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Icons } from '@/components/icons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Icons.Dashboard className="h-12 w-12 animate-pulse text-primary" />
            <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Esto previene que se renderice el contenido del admin brevemente antes de la redirección.
    // También puede mostrar un loader si se prefiere.
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
        {children}
      </main>
    </div>
  );
}
