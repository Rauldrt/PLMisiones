
import { HomepageClient } from '@/components/HomepageClient';
import { getBannerTextSlidesAction, getBannerBackgroundSlidesAction, getMosaicItemsAction, getAccordionItemsAction, getPublicNewsAction, getCandidatesAction, getNotificationAction, getOrganigramaAction, getProposalsAction } from '@/actions/data';

export default async function Home() {
  const [
    bannerTextSlides,
    bannerBackgroundSlides,
    mosaicItems,
    accordionItems,
    newsArticles,
    candidates,
    notification,
    organigrama,
    proposals,
  ] = await Promise.all([
    getBannerTextSlidesAction(),
    getBannerBackgroundSlidesAction(),
    getMosaicItemsAction(),
    getAccordionItemsAction(),
    getPublicNewsAction(),
    getCandidatesAction(),
    getNotificationAction(),
    getOrganigramaAction(),
    getProposalsAction(),
  ]);

  return (
    <HomepageClient
      bannerTextSlides={bannerTextSlides}
      bannerBackgroundSlides={bannerBackgroundSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      candidates={candidates}
      notification={notification}
      organigramaData={organigrama}
      proposals={proposals}
    />
  );
}
