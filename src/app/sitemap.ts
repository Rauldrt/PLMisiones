import { getPublicNewsAction, getReferentesAction } from '@/actions/data';
import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://partidolibertariomisiones.com.ar';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/noticias',
    '/referentes',
    '/afiliacion',
    '/fiscales',
    '/notificaciones',
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const news = await getPublicNewsAction();
  const newsEntries = news.map((article) => ({
    url: `${siteUrl}/noticias/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...newsEntries];
}
