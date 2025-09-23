
import { HomepageClient } from '@/components/HomepageClient';
import { 
    getBannerTextSlidesAction, 
    getBannerBackgroundSlidesAction, 
    getMosaicItemsAction, 
    getAccordionItemsAction, 
    getPublicNewsAction, 
    getCandidatesAction, 
    getPublicNotificationsAction,
    getNotificationAction,
    getOrganigramaAction, 
    getProposalsAction,
    getStreamingAction
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
    notificationSettings,
    organigrama,
    proposals,
    streamingItems,
  ] = await Promise.all([
    getBannerTextSlidesAction(),
    getBannerBackgroundSlidesAction(),
    getMosaicItemsAction(),
    getAccordionItemsAction(),
    getPublicNewsAction(),
    getCandidatesAction(),
    getPublicNotificationsAction(),
    getNotificationAction(),
    getOrganigramaAction(),
    getProposalsAction(),
    getStreamingAction(),
  ]);

  return (
    <HomepageClient
      bannerTextSlides={bannerTextSlides}
      bannerBackgroundSlides={bannerBackgroundSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      candidates={candidates}
      notifications={notifications}
      notificationSettings={notificationSettings}
      organigramaData={organigrama}
      proposals={proposals}
      streamingItems={streamingItems}
    />
  );
}
