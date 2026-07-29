
export const dynamic = 'force-dynamic';

import { HomepageClient } from '@/components/HomepageClient';
import type { Candidate } from '@/lib/types';
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
    getStreamingAction,
    getReferentesAction,
    getBannerConfigAction
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
    referentes,
    bannerConfig,
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
    getReferentesAction(),
    getBannerConfigAction(),
  ]);

  // Resolving what content to display on the banner's bottom section based on configuration
  let bannerBottomItems: Candidate[] = [];
  if (bannerConfig.bottomContentType === 'candidates') {
    bannerBottomItems = candidates;
  } else if (bannerConfig.bottomContentType === 'referentes') {
    // Map Referente to Candidate layout (Candidate extends Referente, so they are structurally identical)
    bannerBottomItems = referentes;
  }

  return (
    <HomepageClient
      bannerTextSlides={bannerTextSlides}
      bannerBackgroundSlides={bannerBackgroundSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      candidates={bannerBottomItems}
      notifications={notifications}
      notificationSettings={notificationSettings}
      organigramaData={organigrama}
      proposals={proposals}
      streamingItems={streamingItems}
      showProposals={bannerConfig.showProposals}
      layoutMode={bannerConfig.layoutMode}
      institutionalBgType={bannerConfig.institutionalBgType}
      institutionalBgVal={bannerConfig.institutionalBgVal}
      bannerOverlayOpacity={bannerConfig.bannerOverlayOpacity}
      fuchsiaCardBgType={bannerConfig.fuchsiaCardBgType}
      fuchsiaPills={bannerConfig.fuchsiaPills}
      institutionalBgPosition={bannerConfig.institutionalBgPosition}
      institutionalBgSize={bannerConfig.institutionalBgSize}
    />
  );
}

