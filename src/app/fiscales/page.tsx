
import { getFormDefinitionAction, getPageHeaderByPathAction } from '@/lib/server/data';
import { DynamicForm } from '@/components/DynamicForm';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Inscripción de Fiscales',
};

export default async function FiscalesPage() {
  const formDefinition = await getFormDefinitionAction('fiscales');
  const pageHeader = await getPageHeaderByPathAction('/fiscales');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <DynamicForm formDefinition={formDefinition} />
      </div>
    </div>
  );
}
