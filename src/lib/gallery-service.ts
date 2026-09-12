/**
 * @fileOverview A server-side-only service to interact with the filesystem
 * and retrieve a list of public images.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Note: This module should only be imported and used in server-side components or actions.

const MEDIA_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mp3', '.wav', '.ogg'];

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
 * Scans the `public` directory and Firebase Storage for media files.
 * @returns A promise that resolves to an array of public media URLs.
 */
export async function getPublicImages(): Promise<string[]> {
    const mediaUrls: string[] = [];
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'partido-libertario-mns.firebasestorage.app';

    // 1. Intentar cargar archivos de Firebase Storage vía REST API / Admin
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
        } else {
            // Fallback vía Firebase Storage REST API (público)
            const response = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucketName}/o`, {
                next: { revalidate: 60 }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.items && Array.isArray(data.items)) {
                    const restUrls = data.items
                        .filter((item: any) => {
                            const ext = '.' + item.name.split('.').pop()?.toLowerCase();
                            return MEDIA_EXTENSIONS.includes(ext);
                        })
                        .map((item: any) => {
                            const token = item.downloadTokens || '';
                            return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(item.name)}?alt=media${token ? `&token=${token}` : ''}`;
                        });
                    mediaUrls.push(...restUrls);
                }
            }
        }
    } catch (error) {
        console.error("Error al obtener imágenes de Firebase Storage:", error);
    }

    // 2. Cargar archivos locales que permanezcan en /public
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const allFiles = await getFilesRecursively(publicDir);

        const localUrls = allFiles
            .filter(file => MEDIA_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => path.relative(publicDir, file))
            .map(file => `/${file.replace(/\\/g, '/')}`);

        mediaUrls.push(...localUrls);
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Folder not found in serverless
        } else {
            console.error("Error al escanear la carpeta local 'public':", error);
        }
    }

    // Deduplicate URLs
    return Array.from(new Set(mediaUrls));
}


