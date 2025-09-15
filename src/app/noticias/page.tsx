
import Image from 'next/image';
import Link from 'next/link';
import { getPublicNewsAction, getPageHeaderByPathAction } from '@/lib/server/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { InstagramEmbedProcessor } from '@/components/InstagramEmbedProcessor';
import { NewsCard } from '@/components/NewsCard';

export const metadata = {
  title: 'Noticias',
};

export default async function NoticiasPage() {
  const [news, pageHeader] = await Promise.all([
    getPublicNewsAction(),
    getPageHeaderByPathAction('/noticias'),
  ]);

  const sortedNews = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedNews.map((article) => (
              <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
      <InstagramEmbedProcessor />
    </div>
  );
}
