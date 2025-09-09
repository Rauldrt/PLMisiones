import { getReferentes, getPageHeaderByPath } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { DatawrapperMap } from '@/components/DatawrapperMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata = {
  title: 'Nuestros Referentes',
};

export default async function ReferentesPage() {
  const pageHeader = await getPageHeaderByPath('/referentes');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Mapa de Referentes</CardTitle>
            <CardDescription>
              Explorá el mapa para encontrar a nuestros referentes en cada rincón de la provincia de Misiones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatawrapperMap 
              title="Misiones por dptos" 
              src="https://datawrapper.dwcdn.net/FeapF/2/"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
