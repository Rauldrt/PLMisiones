
'use client';
import { AdminSidebar } from '@/components/AdminSidebar';
import { withAuth } from '@/hoc/withAuth';
import { useEffect, useState } from 'react';
import type { SocialLink } from '@/lib/types';
import { getSocialLinksAction } from '@/actions/data';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    async function fetchSocials() {
      const links = await getSocialLinksAction();
      setSocialLinks(links);
    }
    fetchSocials();
  }, []);

  return (
    <div className="flex min-h-screen">
        <AdminSidebar socialLinks={socialLinks} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40 overflow-y-auto">
            {children}
        </main>
    </div>
  );
}

export default withAuth(AdminLayout);
