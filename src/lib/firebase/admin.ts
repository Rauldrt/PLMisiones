
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';

// IMPORTANT: This file should only be imported on the server-side.

// Check if the required environment variables are set.
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Firebase Admin SDK configuration error: Make sure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your Vercel environment variables.'
      );
  }
   // In development, we can allow this to fail silently as it might not be needed immediately.
  console.warn(
    'Firebase Admin SDK not configured. This is normal for client-side development, but server-side Firebase features will not work. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your .env.local file to enable them.'
  );
}

// The private key needs to be parsed correctly from the environment variable.
// Vercel and other platforms sometimes escape newlines. This handles that.
// It also removes potential surrounding quotes.
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '')
  .replace(/\\n/g, '\n')
  .replace(/^"|"$/g, '');


const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: privateKey,
};

let adminApp: App;
export function getFirebaseAdminApp(): App {
    if (!adminApp) {
        // Use a unique app name to avoid conflicts
        const appName = 'firebase-admin-app-PLM';
        const existingApp = getApps().find(app => app.name === appName);
        adminApp = existingApp || initializeApp({
            credential: cert(serviceAccount)
        }, appName);
    }
    return adminApp;
}
