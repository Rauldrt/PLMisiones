
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDFiIu41IeR0mveC3__GMA5SIs2w6T4beY",
  authDomain: "partidolibertariomisiones-9351b.firebaseapp.com",
  projectId: "partidolibertariomisiones-9351b",
  storageBucket: "partidolibertariomisiones-9351b.appspot.com",
  messagingSenderId: "956353982885",
  appId: "1:956353982885:web:5317ac07b129731633a299",
};


// Use a function to safely initialize and get the app instance.
// This prevents issues with Server-Side Rendering (SSR) and hot-reloading.
export function getFirebaseApp(): FirebaseApp {
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}
