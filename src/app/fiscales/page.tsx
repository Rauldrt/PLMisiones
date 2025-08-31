import { getFormDefinition, getPageHeaderByPath } from '@/lib/data';
import { DynamicForm } from '@/components/DynamicForm';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Inscripción de Fiscales',
};

export default async function FiscalesPage() {
  const formDefinition = await getFormDefinition('fiscales');
  const pageHeader = await getPageHeaderByPath('/fiscales');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <DynamicForm formDefinition={formDefinition} />
      </div>
    </div>
  );
}
