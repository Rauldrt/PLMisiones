
'use client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { SocialLink, FormDefinition, FooterContent } from '@/lib/types';


interface SiteLayoutProps {
  children: ReactNode;
  footerContent: FooterContent;
  socialLinks: SocialLink[];
  contactFormDefinition: FormDefinition;
}


export function SiteLayout({
  children,
  footerContent,
  socialLinks,
  contactFormDefinition
}: Readonly<SiteLayoutProps>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/login';
  
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer 
        footerContent={footerContent}
        socialLinks={socialLinks}
        contactFormDefinition={contactFormDefinition}
      />
    </div>
  );
}
