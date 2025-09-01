import { HomepageClient } from '@/components/HomepageClient';
import { getBannerTextSlides, getBannerBackgroundSlides, getMosaicItems, getAccordionItems, getNews, getCandidates, getNotification, getOrganigrama } from '@/lib/data';

export default async function Home() {
  const bannerTextSlides = await getBannerTextSlides();
  const bannerBackgroundSlides = await getBannerBackgroundSlides();
  const mosaicItems = await getMosaicItems();
  const accordionItems = await getAccordionItems();
  const newsArticles = await getNews();
  const candidates = await getCandidates();
  const notification = await getNotification();
  const organigrama = await getOrganigrama();

  return (
    <HomepageClient
      bannerTextSlides={bannerTextSlides}
      bannerBackgroundSlides={bannerBackgroundSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      candidates={candidates.slice(0, 3)} // Show top 3 on home
      notification={notification}
      organigramaData={organigrama}
    />
  );
}
