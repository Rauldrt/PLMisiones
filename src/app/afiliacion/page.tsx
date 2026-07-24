
import { getPageHeaderByPathAction } from '@/actions/data';
import { PageHeader } from '@/components/PageHeader';
import { AffiliationForm } from '@/components/forms/AffiliationForm';

export const metadata = {
  title: 'Afiliación',
};

export default async function AfiliacionPage() {
  const pageHeader = await getPageHeaderByPathAction('/afiliacion');
  
  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <AffiliationForm />
      </div>
    </div>
  );
}
