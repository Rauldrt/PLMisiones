
'use server';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase-admin/firestore';
import type { FormSubmission } from '../types';

function getServiceAccount() {
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountB64) {
    if (process.env.NODE_ENV === 'production') {
       throw new Error('Firebase Admin service account is missing. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 in your environment variables.');
    }
    return null;
  }
  try {
    const decodedString = Buffer.from(serviceAccountB64, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Failed to parse Firebase service account JSON from Base64.", error);
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_BASE64 content.");
  }
}

let adminApp: App | null = null;

// This function is not exported, making it invisible to the Next.js compiler as a "server action".
function getFirebaseAdminApp(): App {
    if (adminApp) {
        return adminApp;
    }
    
    const appName = 'firebase-admin-app-PLM';
    const existingApp = getApps().find(app => app.name === appName);

    if (existingApp) {
        adminApp = existingApp;
        return adminApp;
    }

    const serviceAccount = getServiceAccount();

    if (!serviceAccount) {
        throw new Error('Firebase Admin service account is missing. Cannot initialize app.');
    }

    adminApp = initializeApp({
        credential: cert(serviceAccount)
    }, appName);

    return adminApp;
}

// We export a function to get the DB instance, ensuring the app is initialized "lazily" or "just-in-time".
const getDb = () => getFirestore(getFirebaseAdminApp());


export async function getSubmissions(collectionName: string): Promise<FormSubmission[]> {
  try {
    const db = getDb();
    const q = query(collection(db, collectionName), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const submissions: FormSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const submittedAt = data.submittedAt?.toDate()?.toISOString() ?? new Date().toISOString();
      
      submissions.push({
        id: doc.id,
        ...data,
        submittedAt,
      });
    });

    return submissions;
  } catch (error) {
    console.error(`Error fetching submissions from collection ${collectionName}:`, error);
    return [];
  }
}
