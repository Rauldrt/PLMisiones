
'use client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReactNode, createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { SocialLink, FooterContent, GoogleForm, BannerConfig } from '@/lib/types';

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
  bannerConfig?: BannerConfig;
}

export function SiteLayout({
  children,
  footerContent,
  socialLinks,
  contactForm,
  bannerConfig
}: Readonly<SiteLayoutProps>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/login';
  const [activeBg, setActiveBg] = useState<string>('');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }

  const bgBlur = bannerConfig?.pageBgBlur ?? 50;
  const bgOpacity = bannerConfig?.pageBgOpacity ?? 0.65;
  const bgOverlayOpacity = bannerConfig?.pageBgOverlayOpacity ?? 0.4;

  return (
    <BackgroundContext.Provider value={{ activeBg, setActiveBg }}>
      <div className="flex min-h-screen flex-col relative">
        {/* Dynamic blurred fixed parallax background */}
        {activeBg && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${activeBg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                transform: 'scale(1.2) translate3d(0, 0, 0)',
                opacity: bgOpacity,
                filter: `blur(${bgBlur}px)`,
              }}
            />
            {/* Subtle light glassmorphism overlay that tints the background with our white-dominated theme */}
            <div className="absolute inset-0 bg-background" style={{ opacity: bgOverlayOpacity }} />
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
