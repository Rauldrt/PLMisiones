
import { HomepageClient } from '@/components/HomepageClient';
import { getBannerTextSlides, getBannerBackgroundSlides, getMosaicItems, getAccordionItems, getPublicNews, getCandidates, getNotification, getOrganigrama, getProposals } from '@/lib/data';

export default async function Home() {
  const bannerTextSlides = await getBannerTextSlides();
  const bannerBackgroundSlides = await getBannerBackgroundSlides();
  const mosaicItems = await getMosaicItems();
  const accordionItems = await getAccordionItems();
  const newsArticles = await getPublicNews();
  const candidates = await getCandidates();
  const notification = await getNotification();
  const organigrama = await getOrganigrama();
  const proposals = await getProposals();

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
