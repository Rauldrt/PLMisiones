const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

// Load environment variables
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
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

console.log('--- Conectando a Firebase ---');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Storage Bucket:', firebaseConfig.storageBucket);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app, env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || 'pl-misiones');

// MIME types helper
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.mp4':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.mp3':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
}

// Protected files that MUST remain in public/
const SYSTEM_FILES = [
  'logo.png',
  'logo-banner.png',
  'logo-512.png',
  'favicon.ico',
  'manifest.json',
  'robots.txt',
  'sw.js',
  'sw.js.map',
  'workbox-*.js',
  'workbox-*.js.map',
];

function isSystemFile(fileName) {
  if (SYSTEM_FILES.includes(fileName)) return true;
  if (fileName.startsWith('workbox-')) return true;
  if (fileName.endsWith('.txt') || fileName.endsWith('.json')) return true;
  return false;
}

async function migrate() {
  const publicDir = path.join(process.cwd(), 'public');
  const allFiles = fs.readdirSync(publicDir);

  const filesToMigrate = allFiles.filter(f => {
    const fullPath = path.join(publicDir, f);
    if (!fs.statSync(fullPath).isFile()) return false;
    return !isSystemFile(f);
  });

  console.log(`\nSe encontraron ${filesToMigrate.length} archivos para migrar.`);
  let totalBytes = 0;
  filesToMigrate.forEach(f => {
    totalBytes += fs.statSync(path.join(publicDir, f)).size;
  });
  console.log(`Tamaño total a liberar: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB\n`);

  const urlMap = {}; // original relative path -> Firebase Storage URL

  let completed = 0;
  for (const fileName of filesToMigrate) {
    const filePath = path.join(publicDir, fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(fileName);
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `media/${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    console.log(`[${completed + 1}/${filesToMigrate.length}] Subiendo ${fileName} (${(fileBuffer.length / 1024).toFixed(1)} KB)...`);

    try {
      await uploadBytes(storageRef, fileBuffer, { contentType });
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Store mappings for various ways the file might be referenced
      urlMap[`/${fileName}`] = downloadUrl;
      urlMap[fileName] = downloadUrl;
      urlMap[encodeURI(`/${fileName}`)] = downloadUrl;
      urlMap[encodeURIComponent(fileName)] = downloadUrl;

      completed++;
    } catch (err) {
      console.error(`Error al subir ${fileName}:`, err.message);
    }
  }

  console.log(`\n? ${completed} archivos subidos exitosamente a Firebase Storage.`);

  // Save url map to scratch
  const scratchDir = path.join(process.cwd(), 'scratch');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
  fs.writeFileSync(path.join(scratchDir, 'media-migration-map.json'), JSON.stringify(urlMap, null, 2));

  // Step 2: Update all JSON files in src/data/
  console.log('\n--- Actualizando archivos JSON locales en src/data/ ---');
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  jsonFiles.forEach(jFile => {
    const jPath = path.join(dataDir, jFile);
    let content = fs.readFileSync(jPath, 'utf8');
    let modified = false;

    for (const [localRef, cloudUrl] of Object.entries(urlMap)) {
      if (localRef.startsWith('/') && content.includes(`"${localRef}"`)) {
        content = content.split(`"${localRef}"`).join(`"${cloudUrl}"`);
        modified = true;
      } else if (localRef.startsWith('/') && content.includes(localRef)) {
        content = content.split(localRef).join(cloudUrl);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(jPath, content, 'utf8');
      console.log(`? Actualizado ${jFile}`);
    }
  });

  // Step 3: Update Firestore documents
  console.log('\n--- Actualizando colecciones en Firestore ---');
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

  for (const colName of collectionsToUpdate) {
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) continue;

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
          console.log(`? Firestore [${colName}] -> Documento ${docSnap.id} actualizado.`);
        }
      }
    } catch (err) {
      console.warn(`Aviso en colección Firestore ${colName}:`, err.message);
    }
  }

  // Step 4: Delete heavy files from public/
  console.log('\n--- Limpiando archivos pesados de public/ ---');
  let deletedCount = 0;
  for (const fileName of filesToMigrate) {
    const filePath = path.join(publicDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedCount++;
    }
  }

  console.log(`? ${deletedCount} archivos pesados eliminados de public/.`);
  console.log('?? Migración completada con éxito.');
}

migrate().catch(console.error);
