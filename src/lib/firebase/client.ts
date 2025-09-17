
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check will run on the server during the build process.
if (process.env.NODE_ENV === 'production' && !firebaseConfig.apiKey) {
  console.warn(
    'Firebase configuration warning: NEXT_PUBLIC_FIREBASE_API_KEY is not defined. This may cause issues if not set in the production environment.'
  );
}

// Use a function to safely initialize and get the app instance.
// This prevents issues with Server-Side Rendering (SSR) and hot-reloading.
export function getFirebaseApp(): FirebaseApp {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}
