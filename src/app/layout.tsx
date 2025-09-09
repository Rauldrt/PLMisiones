'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteLayout } from '@/components/SiteLayout';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="es">
      <head>
        <title>Libertario Misiones</title>
        <meta name="description" content="Sitio web oficial del Partido Libertario de Misiones." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
        <Script src="//www.instagram.com/embed.js" strategy="afterInteractive" />
      </head>
      <body className="font-body antialiased">
          {isAdminRoute ? (
            <div className="flex min-h-screen flex-col">{children}</div>
          ) : (
            <SiteLayout>
              {children}
            </SiteLayout>
          )}
          <Toaster />
      </body>
    </html>
  );
}
