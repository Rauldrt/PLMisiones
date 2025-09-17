
'use server';

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';

// IMPORTANT: This file should only be imported on the server-side.

function getServiceAccount() {
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!serviceAccountB64) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Firebase Admin SDK configuration error: FIREBASE_SERVICE_ACCOUNT_BASE64 is not set.'
      );
    }
    console.warn(
      'Firebase Admin SDK not configured. Server-side Firebase features will not work.'
    );
    return null;
  }

  try {
    const decodedString = Buffer.from(serviceAccountB64, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Failed to parse Firebase service account JSON.", error);
    throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_BASE64 content.");
  }
}

let adminApp: App | null = null;
export function getFirebaseAdminApp(): App {
    if (adminApp) {
        return adminApp;
    }
    
    // Use a unique app name to avoid conflicts
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
