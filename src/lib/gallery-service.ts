/**
 * @fileOverview A server-side-only service to interact with the filesystem
 * and retrieve a list of public images.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Note: This module should only be imported and used in server-side components or actions.

const MEDIA_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm', '.mp3', '.wav', '.ogg'];

function initFirebaseAdmin() {
  if (typeof process === 'undefined' || !process.env.FIREBASE_SERVICE_ACCOUNT) {
    return null;
  }
  try {
    if (getApps().length === 0) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'partido-libertario-mns.firebasestorage.app'
      });
    }
    return getStorage().bucket();
  } catch (err) {
    console.error("Fallo al inicializar Firebase Admin Storage en el servicio:", err);
    return null;
  }
}

/**
 * Recursively scans a directory and returns a list of all file paths.
 * @param dir The directory to scan.
 * @returns A promise that resolves to an array of file paths.
 */
async function getFilesRecursively(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFilesRecursively(res) : res;
        })
    );
    return Array.prototype.concat(...files);
}

/**
 * Scans the `public` directory for image files and returns their public URLs.
 * @returns A promise that resolves to an array of public image URLs (e.g., '/images/my-image.png').
 */
export async function getPublicImages(): Promise<string[]> {
    const mediaUrls: string[] = [];

    // 1. Intentar cargar archivos locales del directorio /public
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const allFiles = await getFilesRecursively(publicDir);

        const localUrls = allFiles
            .filter(file => MEDIA_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => path.relative(publicDir, file))
            .map(file => `/${file.replace(/\\/g, '/')}`);

        mediaUrls.push(...localUrls);
    } catch (error) {
        // En producción serverless local public folder podría no existir, no es error crítico
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn("La carpeta local 'public' no existe. No se cargarán archivos locales.");
        } else {
            console.error("Error al escanear la carpeta local 'public':", error);
        }
    }

    // 2. Intentar cargar archivos de Firebase Storage si está disponible
    try {
        const bucket = initFirebaseAdmin();
        if (bucket) {
            const [files] = await bucket.getFiles();
            const firebaseUrls = files
                .filter(file => {
                    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
                    return MEDIA_EXTENSIONS.includes(ext);
                })
                .map(file => {
                    const token = file.metadata?.metadata?.firebaseStorageDownloadTokens || '';
                    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media${token ? `&token=${token}` : ''}`;
                });

            mediaUrls.push(...firebaseUrls);
        }
    } catch (error) {
        console.error("Error al escanear Firebase Storage:", error);
    }

    return mediaUrls;
}

