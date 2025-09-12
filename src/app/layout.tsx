
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteLayout } from '@/components/SiteLayout';
import { usePathname } from 'next/navigation';

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
        <title>Partido Libertario Misiones</title>
        <meta name="description" content="Sitio web oficial del Partido Libertario de Misiones." />
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4d1a66" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
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
