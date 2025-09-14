
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBX-buF-ifwTiMD64tOfQwi7PIw5IjnFyQ",
  authDomain: "libertario-misiones-web.firebaseapp.com",
  projectId: "libertario-misiones-web",
  storageBucket: "libertario-misiones-web.appspot.com",
  messagingSenderId: "1013928033094",
  appId: "1:1013928033094:web:1420849b97f6b54a5b8347"
};

// Use a function to safely initialize and get the app instance.
// This prevents issues with Server-Side Rendering (SSR) and hot-reloading.
let app: FirebaseApp;
export function getFirebaseApp(): FirebaseApp {
    if (!app) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    return app;
}
