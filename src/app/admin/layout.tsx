
'use client';
import { AdminSidebar } from '@/components/AdminSidebar';
import { withAuth } from '@/hoc/withAuth';
import { AuthProvider } from '@/context/AuthContext';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
                {children}
            </main>
        </div>
    </AuthProvider>
  );
}

export default withAuth(AdminLayout);
