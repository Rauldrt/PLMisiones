import { Toaster } from '@/components/ui/toaster';
import { SiteLayout } from '@/components/SiteLayout';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import type { Metadata } from 'next'
import { getSocialLinksAction, getGoogleFormAction, getFooterContentAction, getBannerConfigAction } from '@/actions/data';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partidolibertariomisiones.com.ar';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Partido Libertario Misiones',
    template: '%s | Partido Libertario Misiones',
  },
  description: 'Sitio web oficial del Partido Libertario de Misiones. Sumate a las ideas de la libertad.',
  openGraph: {
    title: 'Partido Libertario Misiones',
    description: 'Sitio web oficial del Partido Libertario de Misiones. Sumate a las ideas de la libertad.',
    url: siteUrl,
    siteName: 'Partido Libertario Misiones',
    images: [
      {
        url: '/logo-banner.png',
        width: 1200,
        height: 630,
        alt: 'Logo del Partido Libertario Misiones',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partido Libertario Misiones',
    description: 'Sitio web oficial del Partido Libertario de Misiones. Sumate a las ideas de la libertad.',
    images: ['/logo-banner.png'],
  },
}


// Este ahora es un Componente de Servidor, lo cual es la práctica recomendada.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [socialLinks, contactForm, footerContent, bannerConfig] = await Promise.all([
    getSocialLinksAction(),
    getGoogleFormAction('contacto'),
    getFooterContentAction(),
    getBannerConfigAction()
  ]);

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4d1a66" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var mode = localStorage.getItem('theme');
              var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (mode === 'dark' || (!mode && supportDarkMode)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="font-body antialiased">
          <AuthProvider>
            <SiteLayout 
              footerContent={footerContent} 
              socialLinks={socialLinks} 
              contactForm={contactForm || { id: 'contacto', title: 'Contacto', embedUrl: '' }}
              bannerConfig={bannerConfig}
            >
              {children}
            </SiteLayout>
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
