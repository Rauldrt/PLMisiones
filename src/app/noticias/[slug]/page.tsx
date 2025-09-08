import { getNews, getNewsArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const article = await getNewsArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Noticia no encontrada' };
  }
  return {
    title: article.title,
    description: article.content.substring(0, 150),
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await getNewsArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Detect if the content is likely an embed code
  const isEmbed = /<iframe|<blockquote/.test(article.content.trim());

  return (
    <article className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Publicado el {new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      {article.imageUrl && !isEmbed && (
        <div className="relative my-8 h-64 md:h-96 w-full overflow-hidden rounded-lg">
            <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                data-ai-hint={article.imageHint}
            />
        </div>
      )}

      <div
        className={cn(
            'mt-8',
            isEmbed 
                ? 'flex justify-center' 
                : 'prose prose-invert mx-auto max-w-full prose-headings:font-headline prose-a:text-foreground/80 prose-strong:text-foreground'
        )}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
