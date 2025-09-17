
'use server';

import { 
    readNewsFile,
    readSocialLinksFile,
    readFormDefinitionFile,
    readBannerTextSlidesFile,
    readBannerBackgroundSlidesFile,
    readMosaicItemsFile,
    readAccordionItemsFile,
    readProposalsFile,
    readReferentesFile,
    readCandidatesFile,
    readOrganigramaFile,
    readNotificationFile,
    readNotificationsFile,
    readFooterContentFile,
    readMapsFile,
    readPageHeadersFile
} from '@/lib/server/data';
import type { FormSubmission } from '@/lib/types';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase-admin/firestore';

// These actions are safe to call from client components.
export async function getNewsAction() {
    return readNewsFile();
}
export async function getPublicNewsAction() {
    const allNews = await readNewsFile();
    return allNews.filter(article => !article.hidden);
}
export async function getNewsArticleBySlugAction(slug: string) {
  const news = await readNewsFile();
  return news.find(article => article.slug === slug);
}
export async function getSocialLinksAction() {
    return readSocialLinksFile();
}

export async function getFormDefinitionAction(formName: string) {
    return readFormDefinitionFile(formName);
}

export async function getBannerTextSlidesAction() {
    return readBannerTextSlidesFile();
}

export async function getBannerBackgroundSlidesAction() {
    return readBannerBackgroundSlidesFile();
}

export async function getMosaicItemsAction() {
    return readMosaicItemsFile();
}

export async function getAccordionItemsAction() {
    return readAccordionItemsFile();
}

export async function getProposalsAction() {
    return readProposalsFile();
}

export async function getReferentesAction() {
    return readReferentesFile();
}

export async function getCandidatesAction() {
    return readCandidatesFile();
}

export async function getOrganigramaAction() {
    return readOrganigramaFile();
}

function getAdminApp(): App | null {
    const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!serviceAccountB64) {
        if (process.env.NODE_ENV === 'production') {
            console.error('Firebase Admin service account is missing. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 in your environment variables.');
        } else {
            console.warn("Firebase Admin service account is not set. This is expected for local development if not using admin features.");
        }
        return null;
    }
    
    try {
        const serviceAccount = JSON.parse(Buffer.from(serviceAccountB64, 'base64').toString('utf-8'));
        const appName = 'firebase-admin-app-PLM-submissions';
        const existingApp = getApps().find(app => app.name === appName);
        
        if (existingApp) {
            return existingApp;
        }

        return initializeApp({
            credential: cert(serviceAccount)
        }, appName);

    } catch (error) {
        console.error("Failed to initialize Firebase Admin app:", error);
        return null;
    }
}


export async function getFormSubmissionsAction(formName: string): Promise<FormSubmission[]> {
  const adminApp = getAdminApp();
  if (!adminApp) {
    console.error("Firebase Admin App is not initialized. Cannot fetch form submissions.");
    return [];
  }

  try {
    const db = getFirestore(adminApp);
    const q = query(collection(db, `submissions-${formName}`), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const submissions: FormSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Firestore Timestamps need to be converted to a serializable format (ISO string)
      const submittedAt = data.submittedAt?.toDate ? data.submittedAt.toDate().toISOString() : new Date().toISOString();
      
      submissions.push({
        id: doc.id,
        ...data,
        submittedAt,
      });
    });

    return submissions;
  } catch (error) {
    console.error(`Error fetching submissions from collection ${formName}:`, error);
    if (error instanceof Error && error.message.includes('permission-denied')) {
        console.error("Firestore permission denied. Check your Firestore rules and admin SDK initialization.");
    }
    return [];
  }
}

export async function getNotificationAction() {
    return readNotificationFile();
}

export async function getNotificationsAction() {
    return readNotificationsFile();
}

export async function getPublicNotificationsAction() {
    const allNotifications = await readNotificationsFile();
    return allNotifications.filter(notification => !notification.hidden);
}

export async function getFooterContentAction() {
    return readFooterContentFile();
}

export async function getMapsAction() {
    return readMapsFile();
}

export async function getPageHeadersAction() {
    return readPageHeadersFile();
}
export async function getPageHeaderByPathAction(path: string) {
  const headers = await readPageHeadersFile();
  return headers.find(header => header.path === path);
}

