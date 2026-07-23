import { promises as fs } from 'fs';
import path from 'path';
import type { 
    NewsArticle, 
    BannerTextSlide, 
    BannerBackgroundSlide, 
    MosaicItem, 
    AccordionItem, 
    PageHeader, 
    Referente, 
    SocialLink, 
    Notification, 
    OrganigramaMember, 
    Candidate, 
    Proposal, 
    FooterContent, 
    MapEmbed, 
    NotificationItem, 
    GoogleForm, 
    StreamingItem 
} from '../types';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/client';

const isFirebaseConfigured = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

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
    if (error instanceof SyntaxError) {
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
    return JSON.parse(defaultContent);
  }
}

async function readFirestoreCollection<T>(collectionName: string): Promise<T[]> {
  const db = getFirestoreDb();
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  
  if (items.length > 0 && 'position' in items[0]) {
    items.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }
  return items as T[];
}

async function readFirestoreDoc<T>(collectionName: string, docId: string): Promise<T | null> {
  const db = getFirestoreDb();
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

async function readData<T>(collectionName: string, filePath: string, isObjectLike: boolean = false, docId?: string): Promise<T> {
  if (isFirebaseConfigured) {
    try {
      if (isObjectLike && docId) {
        const data = await readFirestoreDoc<any>(collectionName, docId);
        if (data) return data as T;
      } else {
        const data = await readFirestoreCollection<any>(collectionName);
        if (data && data.length > 0) return data as T;
      }
    } catch (e) {
      console.warn(`Firestore read failed for "${collectionName}", falling back to JSON file:`, e);
    }
  }
  return readJsonFile<T>(filePath, isObjectLike);
}

// Functions to be used in SERVER COMPONENTS
export async function readNewsFile(): Promise<NewsArticle[]> {
    return readData<NewsArticle[]>('news', 'src/data/news.json');
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
    return readData<SocialLink[]>('social_links', 'src/data/social-links.json');
}
export async function getSocialLinksAction(): Promise<SocialLink[]> {
    return readSocialLinksFile();
}

export async function readBannerTextSlidesFile(): Promise<BannerTextSlide[]> {
    return readData<BannerTextSlide[]>('banner', 'src/data/banner.json');
}
export async function getBannerTextSlidesAction(): Promise<BannerTextSlide[]> {
    return readBannerTextSlidesFile();
}

export async function readBannerBackgroundSlidesFile(): Promise<BannerBackgroundSlide[]> {
    return readData<BannerBackgroundSlide[]>('banner_background', 'src/data/banner-background.json');
}
export async function getBannerBackgroundSlidesAction(): Promise<BannerBackgroundSlide[]> {
    return readBannerBackgroundSlidesFile();
}

export async function readMosaicItemsFile(): Promise<MosaicItem[]> {
    return readData<MosaicItem[]>('mosaic', 'src/data/mosaic.json');
}
export async function getMosaicItemsAction(): Promise<MosaicItem[]> {
    return readMosaicItemsFile();
}

export async function readAccordionItemsFile(): Promise<AccordionItem[]> {
    return readData<AccordionItem[]>('accordion', 'src/data/accordion.json');
}
export async function getAccordionItemsAction(): Promise<AccordionItem[]> {
    return readAccordionItemsFile();
}

export async function readProposalsFile(): Promise<Proposal[]> {
    return readData<Proposal[]>('proposals', 'src/data/proposals.json');
}
export async function getProposalsAction(): Promise<Proposal[]> {
    return readProposalsFile();
}

export async function readReferentesFile(): Promise<Referente[]> {
    return readData<Referente[]>('referentes', 'src/data/referentes.json');
}
export async function getReferentesAction(): Promise<Referente[]> {
    return readReferentesFile();
}

export async function readCandidatesFile(): Promise<Candidate[]> {
    return readData<Candidate[]>('candidates', 'src/data/candidates.json');
}
export async function getCandidatesAction(): Promise<Candidate[]> {
    return readCandidatesFile();
}

export async function readOrganigramaFile(): Promise<OrganigramaMember[]> {
    return readData<OrganigramaMember[]>('organigrama', 'src/data/organigrama.json');
}
export async function getOrganigramaAction(): Promise<OrganigramaMember[]> {
    return readOrganigramaFile();
}

export async function readNotificationFile(): Promise<Notification> {
    return readData<Notification>('settings', 'src/data/notification.json', true, 'notification');
}
export async function getNotificationAction(): Promise<Notification> {
    return readNotificationFile();
}

export async function readNotificationsFile(): Promise<NotificationItem[]> {
    return readData<NotificationItem[]>('notifications', 'src/data/notifications.json');
}
export async function getNotificationsAction(): Promise<NotificationItem[]> {
    return readNotificationsFile();
}

export async function readFooterContentFile(): Promise<FooterContent> {
    return readData<FooterContent>('settings', 'src/data/footer.json', true, 'footer');
}
export async function getFooterContentAction(): Promise<FooterContent> {
    return readFooterContentFile();
}

export async function readMapsFile(): Promise<MapEmbed[]> {
    return readData<MapEmbed[]>('maps', 'src/data/maps.json');
}
export async function getMapsAction(): Promise<MapEmbed[]> {
    return readMapsFile();
}

export async function readPageHeadersFile(): Promise<PageHeader[]> {
    return readData<PageHeader[]>('page_headers', 'src/data/page-headers.json');
}
export async function getPageHeadersAction(): Promise<PageHeader[]> {
    return readPageHeadersFile();
}
export async function getPageHeaderByPathAction(path: string): Promise<PageHeader | undefined> {
  const headers = await readPageHeadersFile();
  return headers.find(header => header.path === path);
}

export async function readGoogleFormsFile(): Promise<GoogleForm[]> {
    return readData<GoogleForm[]>('google_forms', 'src/data/google-forms.json');
}
export async function getGoogleFormsAction(): Promise<GoogleForm[]> {
    return readGoogleFormsFile();
}

export async function getGoogleFormAction(id: string): Promise<GoogleForm | undefined> {
    const forms = await readGoogleFormsFile();
    return forms.find(f => f.id === id);
}

export async function readStreamingFile(): Promise<StreamingItem[]> {
    return readData<StreamingItem[]>('streaming', 'src/data/streaming.json');
}
