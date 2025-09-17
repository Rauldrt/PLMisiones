
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBX-buF-ifwTiMD64tOfQwi7PIw5IjnFyQ",
  authDomain: "libertario-misiones-web.firebaseapp.com",
  projectId: "libertario-misiones-web",
  storageBucket: "libertario-misiones-web.firebasestorage.app",
  messagingSenderId: "1013928033094",
  appId: "1:1013928033094:web:c4b837db41cace055b8347"
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
