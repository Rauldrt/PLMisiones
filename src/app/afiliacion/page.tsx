
import { getFormDefinitionAction, getPageHeaderByPathAction } from '@/lib/server/data';
import { DynamicForm } from '@/components/DynamicForm';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Afiliación',
};

export default async function AfiliacionPage() {
  const formDefinition = await getFormDefinitionAction('afiliacion');
  const pageHeader = await getPageHeaderByPathAction('/afiliacion');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <DynamicForm formDefinition={formDefinition} />
      </div>
    </div>
  );
}
