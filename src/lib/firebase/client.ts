
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBX-buF-ifwTiMD64tOfQwi7PIw5IjnFyQ",
  authDomain: "libertario-misiones-web.firebaseapp.com",
  projectId: "libertario-misiones-web",
  storageBucket: "libertario-misiones-web.appspot.com",
  messagingSenderId: "1013928033094",
  appId: "1:1013928033094:web:1420849b97f6b54a5b8347"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
