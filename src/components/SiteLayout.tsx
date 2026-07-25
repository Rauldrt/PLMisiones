
'use client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingBar } from './LoadingBar';
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (isAdminRoute) return;
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute]);
  
  if (isAdminRoute) {
    return <>{children}</>;
  }

  const bgBlur = bannerConfig?.pageBgBlur ?? 50;
  const bgOpacity = bannerConfig?.pageBgOpacity ?? 0.65;
  const bgOverlayOpacity = bannerConfig?.pageBgOverlayOpacity ?? 0.4;

  return (
    <BackgroundContext.Provider value={{ activeBg, setActiveBg }}>
      <div className="flex min-h-screen flex-col relative overflow-hidden bg-background">
        {/* Floating Glowing Orbs (Auroras) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-60">
          <div className="absolute top-[15%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 dark:bg-primary/30 blur-[100px] md:blur-[150px] animate-blob-1" />
          <div className="absolute bottom-[15%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-yellow-500/10 dark:bg-violet-600/20 blur-[110px] md:blur-[160px] animate-blob-2" />
        </div>

        {/* Dynamic blurred fixed parallax background */}
        {activeBg && (
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${activeBg})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                transform: `scale(1.25) translate3d(0, ${scrollY * -0.1}px, 0)`,
                opacity: bgOpacity,
                filter: `blur(${bgBlur}px)`,
              }}
            />
            {/* Subtle light glassmorphism overlay that tints the background with our white-dominated theme */}
            <div className="absolute inset-0 bg-background" style={{ opacity: bgOverlayOpacity }} />
          </div>
        )}
        <LoadingBar />
        <Header socialLinks={socialLinks} />
        <main key={pathname} className="flex-grow relative z-10 animate-fade-in-up" style={{ animationDuration: '400ms' }}>
          {children}
        </main>
        <Footer 
          footerContent={footerContent}
          socialLinks={socialLinks}
          contactForm={contactForm}
        />
      </div>
    </BackgroundContext.Provider>
  );
}
