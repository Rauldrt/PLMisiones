
'use client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReactNode, createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { SocialLink, FooterContent, GoogleForm } from '@/lib/types';

interface BackgroundContextType {
  activeBg: string;
  setActiveBg: (url: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

interface SiteLayoutProps {
  children: ReactNode;
  footerContent: FooterContent;
  socialLinks: SocialLink[];
  contactForm: GoogleForm;
}

export function SiteLayout({
  children,
  footerContent,
  socialLinks,
  contactForm
}: Readonly<SiteLayoutProps>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/login';
  const [activeBg, setActiveBg] = useState<string>('');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <BackgroundContext.Provider value={{ activeBg, setActiveBg }}>
      <div className="flex min-h-screen flex-col relative">
        {/* Dynamic blurred fixed parallax background */}
        {activeBg && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0 opacity-65 filter blur-[50px]"
              style={{ 
                backgroundImage: `url(${activeBg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                transform: 'scale(1.2) translate3d(0, 0, 0)',
              }}
            />
            {/* Subtle light glassmorphism overlay that tints the background with our white-dominated theme */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[20px]" />
          </div>
        )}
        <Header socialLinks={socialLinks} />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer 
          footerContent={footerContent}
          socialLinks={socialLinks}
          contactForm={contactForm}
        />
      </div>
    </BackgroundContext.Provider>
  );
}
