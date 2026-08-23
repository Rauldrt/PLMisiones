
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
import { getYouTubeChannelVideosAction } from '@/actions/youtube';
import { getWhatsappConfigAction } from '@/actions/submissions';

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
    whatsappConfig,
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
    getYouTubeChannelVideosAction(),
    getReferentesAction(),
    getBannerConfigAction(),
    getWhatsappConfigAction(),
  ]);

  // Resolving what content to display on the banner's bottom section based on configuration
  let bannerBottomItems: Candidate[] = [];
  if (bannerConfig.bottomContentType === 'candidates') {
    bannerBottomItems = candidates;
  } else if (bannerConfig.bottomContentType === 'referentes') {
    // Map Referente to Candidate layout (Candidate extends Referente, so they are structurally identical)
    bannerBottomItems = referentes;
  }

  // Resolve WhatsApp number configured in alerts settings
  const whatsappAlertNumber = whatsappConfig?.numbers 
    ? whatsappConfig.numbers.split(',')[0]?.trim() 
    : '+5493757629729';

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
      whatsappNumber={whatsappAlertNumber}
    />
  );
}

