import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';

function getServiceAccount() {
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!serviceAccountB64) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Firebase Admin service account is missing. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 in your environment variables.');
    }
    return null; 
  }
  try {
    const decodedString = Buffer.from(serviceAccountB64, 'base64').toString('utf-8');
    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Failed to parse Firebase service account JSON from Base64.", error);
    return null;
  }
}

export function getAdminApp(): App | null {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
        console.log("Service account is not available.");
        return null;
    }

    const appName = 'firebase-admin-app-PLM-submissions';
    const existingApp = getApps().find(app => app.name === appName);
    if (existingApp) {
        return existingApp;
    }

    try {
        return initializeApp({
            credential: cert(serviceAccount)
        }, appName);
    } catch (error) {
        console.error("Failed to initialize Firebase Admin app:", error);
        return null;
    }
}
