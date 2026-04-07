'use client';
import { useState, useEffect } from 'react';
import { getFooterContentAction, getSocialLinksAction } from '@/actions/data';
import type { FooterContent, SocialLink } from '@/lib/types';
import { FooterContentForm } from './components/footer-content-form';
import { SocialLinksForm } from './components/social-links-form';

export default function ManageFooterPage() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [footerData, socialData] = await Promise.all([
        getFooterContentAction(),
        getSocialLinksAction()
      ]);
      setContent(footerData);
      setSocialLinks(socialData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) return <p>Cargando...</p>;
  if (!content) return <p>No se pudo cargar el contenido del footer.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Pie de Página</h1>
        <p className="text-muted-foreground">Administra los textos y enlaces del pie de página del sitio.</p>
      </div>

      <FooterContentForm initialContent={content} />
      <SocialLinksForm initialSocialLinks={socialLinks} />
    </div>
  );
}
