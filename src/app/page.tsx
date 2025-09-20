
import { HomepageClient } from '@/components/HomepageClient';
import { 
    getBannerTextSlidesAction, 
    getBannerBackgroundSlidesAction, 
    getMosaicItemsAction, 
    getAccordionItemsAction, 
    getPublicNewsAction, 
    getCandidatesAction, 
    getPublicNotificationsAction, 
    getOrganigramaAction, 
    getProposalsAction 
} from '@/actions/data';

export default async function Home() {
  const [
    bannerTextSlides,
    bannerBackgroundSlides,
    mosaicItems,
    accordionItems,
    newsArticles,
    candidates,
    notifications,
    organigrama,
    proposals,
  ] = await Promise.all([
    getBannerTextSlidesAction(),
    getBannerBackgroundSlidesAction(),
    getMosaicItemsAction(),
    getAccordionItemsAction(),
    getPublicNewsAction(),
    getCandidatesAction(),
    getPublicNotificationsAction(),
    getOrganigramaAction(),
    getProposalsAction(),
  ]);

  const sortedNotifications = notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <HomepageClient
      bannerTextSlides={bannerTextSlides}
      bannerBackgroundSlides={bannerBackgroundSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      candidates={candidates}
      notifications={sortedNotifications}
      organigramaData={organigrama}
      proposals={proposals}
    />
  );
}
