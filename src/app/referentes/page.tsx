import Image from 'next/image';
import { getReferentes, getPageHeaderByPath } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Nuestros Referentes',
};

export default async function ReferentesPage() {
  const referentes = await getReferentes();
  const pageHeader = await getPageHeaderByPath('/referentes');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {referentes.map((referente) => (
            <Card key={referente.id} className="bg-card border-border text-center">
              <CardHeader>
                <div className="relative mx-auto h-32 w-32">
                  <Image
                    src={referente.imageUrl}
                    alt={referente.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="128px"
                    data-ai-hint={referente.imageHint}
                  />
                </div>
                <CardTitle className="pt-4 font-headline text-2xl text-primary">{referente.name}</CardTitle>
                <p className="text-sm font-medium text-accent">{referente.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{referente.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
