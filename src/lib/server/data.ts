import { promises as fs } from 'fs';
import path from 'path';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, PageHeader, Referente, SocialLink, Notification, OrganigramaMember, Candidate, Proposal, FooterContent, MapEmbed, NotificationItem, GoogleForm, StreamingItem } from '../types';

async function readJsonFile<T>(filePath: string, isObjectLike: boolean = false): Promise<T> {
  const fullPath = path.join(process.cwd(), filePath);
  const defaultContent = isObjectLike ? '{}' : '[]';

  try {
    const jsonData = await fs.readFile(fullPath, 'utf-8');
    if (jsonData.trim() === '') {
      return JSON.parse(defaultContent);
    }
    return JSON.parse(jsonData) as T;
  } catch (error) {
    if (error instanceof SyntaxError) { // Catches JSON.parse errors
        console.error(`Malformed JSON in ${filePath}. Returning default content.`, error);
        return JSON.parse(defaultContent);
    }
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try {
        await fs.writeFile(fullPath, defaultContent);
      } catch (writeError) {
        console.error(`Failed to create empty file ${filePath}:`, writeError);
      }
      return JSON.parse(defaultContent);
    } 
    
    console.error(`Unhandled error reading or parsing file ${filePath}:`, error);
    return JSON.parse(defaultContent); // Fallback for other errors
  }
}

// Functions to be used in SERVER COMPONENTS
export async function readNewsFile(): Promise<NewsArticle[]> {
    return readJsonFile<NewsArticle[]>('src/data/news.json');
}
export async function getPublicNewsAction(): Promise<NewsArticle[]> {
    const allNews = await readNewsFile();
    return allNews.filter(article => !article.hidden);
}
export async function getNewsArticleBySlugAction(slug: string): Promise<NewsArticle | undefined> {
  const news = await readNewsFile();
  return news.find(article => article.slug === slug);
}
export async function getNewsAction(): Promise<NewsArticle[]> {
    return readNewsFile();
}

export async function readSocialLinksFile(): Promise<SocialLink[]> {
    return readJsonFile<SocialLink[]>('src/data/social-links.json');
}
export async function getSocialLinksAction(): Promise<SocialLink[]> {
    return readSocialLinksFile();
}

export async function readBannerTextSlidesFile(): Promise<BannerTextSlide[]> {
    return readJsonFile<BannerTextSlide[]>('src/data/banner.json');
}
export async function getBannerTextSlidesAction(): Promise<BannerTextSlide[]> {
    return readBannerTextSlidesFile();
}

export async function readBannerBackgroundSlidesFile(): Promise<BannerBackgroundSlide[]> {
    return readJsonFile<BannerBackgroundSlide[]>('src/data/banner-background.json');
}
export async function getBannerBackgroundSlidesAction(): Promise<BannerBackgroundSlide[]> {
    return readBannerBackgroundSlidesFile();
}

export async function readMosaicItemsFile(): Promise<MosaicItem[]> {
    return readJsonFile<MosaicItem[]>('src/data/mosaic.json');
}
export async function getMosaicItemsAction(): Promise<MosaicItem[]> {
    return readMosaicItemsFile();
}

export async function readAccordionItemsFile(): Promise<AccordionItem[]> {
    return readJsonFile<AccordionItem[]>('src/data/accordion.json');
}
export async function getAccordionItemsAction(): Promise<AccordionItem[]> {
    return readAccordionItemsFile();
}

export async function readProposalsFile(): Promise<Proposal[]> {
    return readJsonFile<Proposal[]>('src/data/proposals.json');
}
export async function getProposalsAction(): Promise<Proposal[]> {
    return readProposalsFile();
}

export async function readReferentesFile(): Promise<Referente[]> {
    return readJsonFile<Referente[]>('src/data/referentes.json');
}
export async function getReferentesAction(): Promise<Referente[]> {
    return readReferentesFile();
}

export async function readCandidatesFile(): Promise<Candidate[]> {
    return readJsonFile<Candidate[]>('src/data/candidates.json');
}
export async function getCandidatesAction(): Promise<Candidate[]> {
    return readCandidatesFile();
}

export async function readOrganigramaFile(): Promise<OrganigramaMember[]> {
    return readJsonFile<OrganigramaMember[]>('src/data/organigrama.json');
}
export async function getOrganigramaAction(): Promise<OrganigramaMember[]> {
    return readOrganigramaFile();
}

export async function readNotificationFile(): Promise<Notification> {
    return readJsonFile<Notification>('src/data/notification.json', true);
}
export async function getNotificationAction(): Promise<Notification> {
    return readNotificationFile();
}

export async function readNotificationsFile(): Promise<NotificationItem[]> {
    return readJsonFile<NotificationItem[]>('src/data/notifications.json');
}
export async function getNotificationsAction(): Promise<NotificationItem[]> {
    return readNotificationsFile();
}

export async function readFooterContentFile(): Promise<FooterContent> {
    return readJsonFile<FooterContent>('src/data/footer.json', true);
}
export async function getFooterContentAction(): Promise<FooterContent> {
    return readFooterContentFile();
}

export async function readMapsFile(): Promise<MapEmbed[]> {
    return readJsonFile<MapEmbed[]>('src/data/maps.json');
}
export async function getMapsAction(): Promise<MapEmbed[]> {
    return readMapsFile();
}

export async function readPageHeadersFile(): Promise<PageHeader[]> {
    return readJsonFile<PageHeader[]>('src/data/page-headers.json');
}
export async function getPageHeadersAction(): Promise<PageHeader[]> {
    return readPageHeadersFile();
}
export async function getPageHeaderByPathAction(path: string): Promise<PageHeader | undefined> {
  const headers = await readPageHeadersFile();
  return headers.find(header => header.path === path);
}

export async function readGoogleFormsFile(): Promise<GoogleForm[]> {
    return readJsonFile<GoogleForm[]>('src/data/google-forms.json');
}
export async function getGoogleFormsAction(): Promise<GoogleForm[]> {
    return readGoogleFormsFile();
}

export async function getGoogleFormAction(id: string): Promise<GoogleForm | undefined> {
    const forms = await readGoogleFormsFile();
    return forms.find(f => f.id === id);
}

export async function readStreamingFile(): Promise<StreamingItem[]> {
    return readJsonFile<StreamingItem[]>('src/data/streaming.json');
}
