
import { getPublicNewsAction, getPageHeaderByPathAction } from '@/actions/data';
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

  // ⚡ Bolt: Use direct string comparison for ISO 8601 dates to avoid O(N log N) Date object instantiations
  const sortedNews = news.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

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
