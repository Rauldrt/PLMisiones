import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { ReactNode } from 'react';

export async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
