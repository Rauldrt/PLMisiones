import { HomepageClient } from '@/components/HomepageClient';
import { getBannerSlides, getMosaicItems, getAccordionItems, getNews, getReferentes, getNotification } from '@/lib/data';

export default async function Home() {
  const bannerSlides = await getBannerSlides();
  const mosaicItems = await getMosaicItems();
  const accordionItems = await getAccordionItems();
  const newsArticles = await getNews();
  const referentes = await getReferentes();
  const notification = await getNotification();

  return (
    <HomepageClient
      bannerSlides={bannerSlides}
      mosaicItems={mosaicItems}
      accordionItems={accordionItems}
      newsArticles={newsArticles.slice(0, 3)} // Show latest 3 articles on home
      referentes={referentes.slice(0, 3)} // Show top 3 on home
      notification={notification}
    />
  );
}
