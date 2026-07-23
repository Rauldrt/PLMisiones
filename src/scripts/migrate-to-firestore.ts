import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Variables de entorno de Firebase faltantes.');
  console.error('Asegúrate de tener un archivo .env.local o .env configurado con las credenciales de tu proyecto.');
  process.exit(1);
}

console.log(`🚀 Iniciando migración de datos a Firestore para el proyecto: ${firebaseConfig.projectId}...`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`⚠️ Archivo local no encontrado: ${filePath}. Omitiendo.`);
      return null;
    }
    throw error;
  }
}

async function migrateCollection(collectionName: string, jsonPath: string) {
  const items = await readJsonFile(jsonPath);
  if (!items) return;

  if (!Array.isArray(items)) {
     console.error(`❌ Los datos de ${jsonPath} no tienen formato de array. Omitiendo.`);
     return;
  }

  console.log(`Subiendo ${items.length} elementos a la colección "${collectionName}"...`);
  const batch = writeBatch(db);

  items.forEach((item, index) => {
    // Generate an ID if missing, otherwise use item.id or fallback
    const id = item.id || item.slug || `item_${index}`;
    const docRef = doc(db, collectionName, id);
    const { id: _, ...data } = item;
    // Add position to maintain order
    batch.set(docRef, { ...data, position: index });
  });

  await batch.commit();
  console.log(`✅ Colección "${collectionName}" migrada con éxito.`);
}

async function migrateDoc(collectionName: string, docId: string, jsonPath: string) {
  const item = await readJsonFile(jsonPath);
  if (!item) return;

  console.log(`Subiendo documento único a "${collectionName}/${docId}"...`);
  const docRef = doc(db, collectionName, docId);
  const { id: _, ...data } = item;
  await setDoc(docRef, data);
  console.log(`✅ Documento "${collectionName}/${docId}" migrado con éxito.`);
}

async function runMigration() {
  try {
    // Colecciones de arrays
    await migrateCollection('news', 'src/data/news.json');
    await migrateCollection('candidates', 'src/data/candidates.json');
    await migrateCollection('organigrama', 'src/data/organigrama.json');
    await migrateCollection('proposals', 'src/data/proposals.json');
    await migrateCollection('notifications', 'src/data/notifications.json');
    await migrateCollection('banner', 'src/data/banner.json');
    await migrateCollection('banner_background', 'src/data/banner-background.json');
    await migrateCollection('mosaic', 'src/data/mosaic.json');
    await migrateCollection('accordion', 'src/data/accordion.json');
    await migrateCollection('referentes', 'src/data/referentes.json');
    await migrateCollection('social_links', 'src/data/social-links.json');
    await migrateCollection('maps', 'src/data/maps.json');
    await migrateCollection('page_headers', 'src/data/page-headers.json');
    await migrateCollection('google_forms', 'src/data/google-forms.json');
    await migrateCollection('streaming', 'src/data/streaming.json');

    // Documentos individuales (Configuración global)
    await migrateDoc('settings', 'notification', 'src/data/notification.json');
    await migrateDoc('settings', 'footer', 'src/data/footer.json');

    console.log('\n🎉 ¡Migración completada con éxito!');
  } catch (error) {
    console.error('❌ Error en el proceso de migración:', error);
    process.exit(1);
  }
}

runMigration();
