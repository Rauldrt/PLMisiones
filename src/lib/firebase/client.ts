
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREbase_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check will run on the server during the build process.
if (!firebaseConfig.apiKey) {
  throw new Error(
    'Firebase configuration error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined. Please add it to your environment variables.'
  );
}

// Use a function to safely initialize and get the app instance.
// This prevents issues with Server-Side Rendering (SSR) and hot-reloading.
let app: FirebaseApp;
export function getFirebaseApp(): FirebaseApp {
    if (!app) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    return app;
}
