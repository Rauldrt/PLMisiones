
import { getPageHeaderByPathAction } from '@/actions/data';
import { PageHeader } from '@/components/PageHeader';
import { DynamicForm } from '@/components/forms/DynamicForm';

export const metadata = {
  title: 'Inscripción de Fiscales',
};

export default async function FiscalesPage() {
  const pageHeader = await getPageHeaderByPathAction('/fiscales');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <DynamicForm formId="fiscales" />
      </div>
    </div>
  );
}
