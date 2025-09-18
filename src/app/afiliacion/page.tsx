
import { getGoogleFormAction, getPageHeaderByPathAction } from '@/actions/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleFormEmbed } from '@/components/GoogleFormEmbed';

export const metadata = {
  title: 'Afiliación',
};

export default async function AfiliacionPage() {
  const [form, pageHeader] = await Promise.all([
    getGoogleFormAction('afiliacion'),
    getPageHeaderByPathAction('/afiliacion')
  ]);
  
  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {form && form.embedUrl ? (
          <GoogleFormEmbed form={form} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Formulario no disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <p>El formulario de afiliación no está disponible en este momento. Por favor, intente más tarde.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
