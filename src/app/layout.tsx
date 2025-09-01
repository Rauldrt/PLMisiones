
import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { SiteLayout } from '@/components/SiteLayout';

export const metadata: Metadata = {
  title: 'Libertario Misiones',
  description: 'Sitio web oficial del Partido Libertario de Misiones.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
