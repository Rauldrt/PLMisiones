
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// This check will run on the server during the build process.
if (process.env.NODE_ENV === 'production' && firebaseConfig.apiKey === 'YOUR_API_KEY') {
  console.warn(
    'Firebase configuration warning: The Firebase config is using placeholder values. Please replace them with your actual project credentials in src/lib/firebase/client.ts'
  );
}

// Use a function to safely initialize and get the app instance.
// This prevents issues with Server-Side Rendering (SSR) and hot-reloading.
export function getFirebaseApp(): FirebaseApp {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}
