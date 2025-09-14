
import type { PageHeader as PageHeaderType } from '@/lib/types';
import { getReferentesAction, getMapsAction, getPageHeadersAction } from '@/lib/server/data';
import { PageHeader } from '@/components/PageHeader';
import { ReferentesClient } from '@/components/ReferentesClient';
import { Skeleton } from '@/components/ui/skeleton';


export default async function ReferentesPage() {
    const [referentesData, mapsData, headersData] = await Promise.all([
        getReferentesAction(),
        getMapsAction(),
        getPageHeadersAction()
    ]);
    
    const enabledMaps = mapsData.filter(m => m.enabled);
    const currentHeader = headersData.find(h => h.path === '/referentes');

    return (
        <div>
            {currentHeader ? <PageHeader {...currentHeader} /> : <Skeleton className="h-96 w-full"/>}
            <ReferentesClient initialReferentes={referentesData} initialMaps={enabledMaps} />
        </div>
    );
}

