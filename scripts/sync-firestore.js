const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length > 0) env[k] = v.join('=');
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'partido-libertario-mns.firebasestorage.app',
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'pl-misiones');

const urlMap = JSON.parse(fs.readFileSync('scratch/media-migration-map.json', 'utf8'));

const collectionsToUpdate = [
  'news', 
  'mosaic', 
  'candidates', 
  'banner_background', 
  'proposals', 
  'referentes', 
  'page_headers', 
  'notification', 
  'notifications', 
  'organigrama', 
  'streaming', 
  'settings'
];

async function updateFirestore() {
  console.log('--- Sincronizando Firestore con URLs de Firebase Storage ---');
  for (const colName of collectionsToUpdate) {
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        console.log(`Colección ${colName}: vacía o sin documentos.`);
        continue;
      }

      for (const docSnap of snapshot.docs) {
        let docDataStr = JSON.stringify(docSnap.data());
        let docModified = false;

        for (const [localRef, cloudUrl] of Object.entries(urlMap)) {
          if (localRef.startsWith('/') && docDataStr.includes(localRef)) {
            docDataStr = docDataStr.split(localRef).join(cloudUrl);
            docModified = true;
          }
        }

        if (docModified) {
          const updatedData = JSON.parse(docDataStr);
          await setDoc(doc(db, colName, docSnap.id), updatedData);
          console.log(`? Firestore [${colName}] -> Documento ${docSnap.id} actualizado exitosamente.`);
        }
      }
    } catch (err) {
      console.error(`Error en colección ${colName}:`, err.message);
    }
  }
  console.log('?? Firestore sincronizado al 100%.');
}

updateFirestore();
