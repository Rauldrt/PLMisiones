import { getNews, getNewsArticleBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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

  return (
    <article className="container max-w-4xl py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Publicado el {new Date(article.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="relative my-8 h-96 w-full overflow-hidden rounded-lg">
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
      <div
        className="prose prose-invert mx-auto max-w-full prose-headings:font-headline prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
