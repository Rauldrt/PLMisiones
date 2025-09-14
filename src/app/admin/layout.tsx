'use client';
import { AdminSidebar } from '@/components/AdminSidebar';
import { withAuth } from '@/hoc/withAuth';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthProvider ya está en el layout raíz, no es necesario aquí.
    <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
            {children}
        </main>
    </div>
  );
}

export default withAuth(AdminLayout);
