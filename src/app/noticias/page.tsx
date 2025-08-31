import Image from 'next/image';
import Link from 'next/link';
import { getNews, getPageHeaderByPath } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Noticias',
};

export default async function NoticiasPage() {
  const news = (await getNews()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pageHeader = await getPageHeaderByPath('/noticias');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <Card key={article.id} className="flex flex-col overflow-hidden bg-card border-border transition-transform hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint={article.imageHint}
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-foreground/60 mb-2">{new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <CardTitle className="font-headline text-xl leading-tight">
                    <Link href={`/noticias/${article.slug}`} className="hover:text-accent transition-colors">{article.title}</Link>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6 pt-0">
                <div className="text-foreground/80 line-clamp-4" dangerouslySetInnerHTML={{ __html: article.content.split('</p>')[0] + '</p>'}} />
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button asChild variant="link" className="p-0 h-auto">
                  <Link href={`/noticias/${article.slug}`}>
                    Leer más
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
