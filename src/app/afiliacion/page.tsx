import { getFormDefinition, getPageHeaderByPath } from '@/lib/data';
import { DynamicForm } from '@/components/DynamicForm';
import { PageHeader } from '@/components/PageHeader';

export const metadata = {
  title: 'Afiliación',
};

export default async function AfiliacionPage() {
  const formDefinition = await getFormDefinition('afiliacion');
  const pageHeader = await getPageHeaderByPath('/afiliacion');

  return (
    <div>
      {pageHeader && <PageHeader {...pageHeader} />}
      <div className="container max-w-2xl py-16">
        <DynamicForm formDefinition={formDefinition} />
      </div>
    </div>
  );
}
