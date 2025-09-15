'use client';
import { AdminSidebar } from '@/components/AdminSidebar';
import { withAuth } from '@/hoc/withAuth';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthProvider ya está en el layout raíz.
    // Este div ocupa toda la pantalla para "ocultar" el SiteLayout que lo envuelve.
    <div className="fixed inset-0 bg-background z-50 flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40 overflow-y-auto">
            {children}
        </main>
    </div>
  );
}

export default withAuth(AdminLayout);