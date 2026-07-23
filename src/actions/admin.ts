'use server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { 
    NewsArticle, 
    BannerTextSlide, 
    BannerBackgroundSlide, 
    MosaicItem, 
    AccordionItem, 
    Referente, 
    OrganigramaMember, 
    Candidate, 
    Notification, 
    Proposal, 
    FooterContent, 
    MapEmbed, 
    PageHeader, 
    SocialLink, 
    NotificationItem, 
    GoogleForm, 
    StreamingItem,
    BannerConfig 
} from '@/lib/types';
import { getNewsAction } from '@/actions/data';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import * as admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const isFirebaseConfigured = typeof process !== 'undefined' && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let adminDb: any = null;

function getAdminDb() {
  if (typeof process === 'undefined' || !process.env.FIREBASE_SERVICE_ACCOUNT) {
    return null;
  }
  
  if (!adminDb) {
    try {
      if (getApps().length === 0) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(serviceAccount)
        });
      }
      // Access the custom database 'pl-misiones'
      adminDb = getFirestore('pl-misiones');
    } catch (err) {
      console.error("Failed to parse or initialize Firebase Admin SDK:", err);
      return null;
    }
  }
  return adminDb;
}

async function syncFirestoreCollection(collectionName: string, newItems: any[]) {
  const adminDbInstance = getAdminDb();
  if (adminDbInstance) {
    console.log(`[Admin SDK] Syncing collection "${collectionName}" with ${newItems.length} items...`);
    const colRef = adminDbInstance.collection(collectionName);
    const snapshot = await colRef.get();
    
    const existingIds = new Set(snapshot.docs.map((d: any) => d.id));
    const newIds = new Set(newItems.map(item => item.id));
    
    const batch = adminDbInstance.batch();
    
    newItems.forEach((item, index) => {
      const docRef = colRef.doc(item.id);
      const { id, ...data } = item;
      batch.set(docRef, { ...data, position: index });
    });
    
    existingIds.forEach(id => {
      if (!newIds.has(id)) {
        const docRef = colRef.doc(id);
        batch.delete(docRef);
      }
    });
    
    await batch.commit();
    return;
  }

  // Fallback to client SDK
  const db = getFirestoreDb();
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const existingIds = new Set(snapshot.docs.map(d => d.id));
  const newIds = new Set(newItems.map(item => item.id));
  
  const batch = writeBatch(db);
  
  newItems.forEach((item, index) => {
    const docRef = doc(db, collectionName, item.id);
    const { id, ...data } = item;
    batch.set(docRef, { ...data, position: index });
  });
  
  existingIds.forEach(id => {
    if (!newIds.has(id)) {
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    }
  });
  
  await batch.commit();
}

async function setFirestoreDoc(collectionName: string, docId: string, data: any) {
  const adminDbInstance = getAdminDb();
  if (adminDbInstance) {
    console.log(`[Admin SDK] Setting doc "${collectionName}/${docId}"...`);
    const docRef = adminDbInstance.collection(collectionName).doc(docId);
    const { id, ...cleanData } = data;
    await docRef.set(cleanData);
    return;
  }

  // Fallback to client SDK
  const db = getFirestoreDb();
  const docRef = doc(db, collectionName, docId);
  const { id, ...cleanData } = data;
  await setDoc(docRef, cleanData);
}

async function writeData(collectionName: string, filePath: string, data: any, isObjectLike: boolean = false, docId?: string) {
  let firestoreSuccess = false;
  if (isFirebaseConfigured) {
    try {
      if (isObjectLike && docId) {
        await setFirestoreDoc(collectionName, docId, data);
      } else {
        await syncFirestoreCollection(collectionName, data);
      }
      firestoreSuccess = true;
    } catch (e) {
      console.error(`Firestore write failed for "${collectionName}":`, e);
      if (process.env.NODE_ENV === 'production') {
        throw e;
      }
    }
  }
  
  // Write to JSON file.
  // In serverless/Vercel environments, this will throw an error.
  // If Firestore succeeded, we catch and ignore the fs error.
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
  } catch (fsError) {
    if (firestoreSuccess) {
      console.warn(`Local JSON write failed (expected on read-only serverless filesystems), but Firestore succeeded.`);
    } else {
      throw fsError;
    }
  }
}

export async function saveNews(articles: NewsArticle[]) {
  await writeData('news', 'src/data/news.json', articles);
  revalidatePath('/');
  revalidatePath('/noticias', 'layout');
  return { success: true, message: 'Noticias guardadas con éxito.' };
}

export async function saveBannerText(slides: BannerTextSlide[]) {
    await writeData('banner', 'src/data/banner.json', slides);
    revalidatePath('/');
    return { success: true, message: 'Texto del banner guardado con éxito.' };
}

export async function saveBannerBackground(slides: BannerBackgroundSlide[]) {
    await writeData('banner_background', 'src/data/banner-background.json', slides);
    revalidatePath('/');
    return { success: true, message: 'Fondo del banner guardado con éxito.' };
}

export async function saveMosaic(items: MosaicItem[]) {
    await writeData('mosaic', 'src/data/mosaic.json', items);
    revalidatePath('/');
    return { success: true, message: 'Mosaico guardado con éxito.' };
}

export async function saveAccordion(items: AccordionItem[]) {
    await writeData('accordion', 'src/data/accordion.json', items);
    revalidatePath('/');
    return { success: true, message: 'Acordeón guardado con éxito.' };
}

export async function saveProposals(items: Proposal[]) {
    await writeData('proposals', 'src/data/proposals.json', items);
    revalidatePath('/');
    return { success: true, message: 'Propuestas guardadas con éxito.' };
}

export async function saveReferentes(items: Referente[]) {
    await writeData('referentes', 'src/data/referentes.json', items);
    revalidatePath('/');
    revalidatePath('/referentes');
    return { success: true, message: 'Referentes guardados con éxito.' };
}

export async function saveCandidates(items: Candidate[]) {
    await writeData('candidates', 'src/data/candidates.json', items);
    revalidatePath('/');
    return { success: true, message: 'Candidatos guardados con éxito.' };
}

export async function addNewsArticle(article: Omit<NewsArticle, 'id' | 'slug'>) {
    const articles = await getNewsAction();
    const newArticle: NewsArticle = {
        ...article,
        id: new Date().getTime().toString(),
        slug: article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    const updatedArticles = [newArticle, ...articles];
    await saveNews(updatedArticles);
    return { success: true, message: 'Artículo agregado con éxito.' };
}

export async function saveOrganigrama(items: OrganigramaMember[]) {
    await writeData('organigrama', 'src/data/organigrama.json', items);
    revalidatePath('/');
    return { success: true, message: 'Organigrama guardado con éxito.' };
}

export async function saveNotification(item: Notification) {
    await writeData('settings', 'src/data/notification.json', item, true, 'notification');
    revalidatePath('/');
    return { success: true, message: 'Notificación guardada con éxito.' };
}

export async function saveNotificationsPage(items: NotificationItem[]) {
    await writeData('notifications', 'src/data/notifications.json', items);
    revalidatePath('/notificaciones');
    return { success: true, message: 'Página de notificaciones guardada con éxito.' };
}

export async function saveFooterContent(item: FooterContent) {
    await writeData('settings', 'src/data/footer.json', item, true, 'footer');
    revalidatePath('/*');
    return { success: true, message: 'Contenido del pie de página guardado con éxito.' };
}

export async function saveMaps(items: MapEmbed[]) {
    await writeData('maps', 'src/data/maps.json', items);
    revalidatePath('/referentes');
    return { success: true, message: 'Mapas guardados con éxito.' };
}

export async function savePageHeaders(items: PageHeader[]) {
    await writeData('page_headers', 'src/data/page-headers.json', items);
    items.forEach(item => revalidatePath(item.path));
    return { success: true, message: 'Encabezados guardados con éxito.' };
}

export async function saveSocialLinks(items: SocialLink[]) {
    await writeData('social_links', 'src/data/social-links.json', items);
    revalidatePath('/*');
    return { success: true, message: 'Enlaces de redes sociales guardados con éxito.' };
}

export async function saveGoogleForms(items: GoogleForm[]) {
    await writeData('google_forms', 'src/data/google-forms.json', items);
    revalidatePath('/afiliacion');
    revalidatePath('/fiscales');
    revalidatePath('/*');
    return { success: true, message: 'Formularios de Google guardados con éxito.' };
}

export async function saveStreaming(items: StreamingItem[]) {
    await writeData('streaming', 'src/data/streaming.json', items);
    revalidatePath('/');
    return { success: true, message: 'Sección de Streaming guardada con éxito.' };
}

export async function saveBannerConfig(config: BannerConfig) {
    await writeData('settings', 'src/data/banner-config.json', config, true, 'banner_config');
    revalidatePath('/');
    return { success: true, message: 'Configuración del banner guardada con éxito.' };
}
