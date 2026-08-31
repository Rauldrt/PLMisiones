
'use server';

import { getPublicImages } from "@/lib/gallery-service";
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import crypto from 'crypto';

export async function getPublicImagesAction() {
    return getPublicImages();
}

// Security: Removed .svg from ALLOWED_EXTENSIONS to prevent Stored XSS via malicious SVG uploads.
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.webm', '.mp3', '.wav', '.ogg'];

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
    console.error("Fallo al inicializar Firebase Admin Storage:", err);
    return null;
  }
}

export async function uploadPublicFilesAction(files: { name: string; data: string }[]): Promise<{ success: boolean; message: string; url?: string }> {
    try {
        const bucket = initFirebaseAdmin();
        const urls: string[] = [];
        
        for (const file of files) {
            // Security: Validate file extension to prevent unrestricted file upload (e.g., .html, .js)
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                throw new Error(`Tipo de archivo no permitido: ${ext || 'sin extensión'}. Solo se permiten archivos multimedia.`);
            }
            // Sanitize file name to prevent directory traversal
            const sanitizedFileName = path.basename(file.name);
            if (sanitizedFileName !== file.name) {
                throw new Error(`Nombre de archivo inválido: ${file.name}`);
            }

            const base64Content = file.data.split(';base64,').pop();

            if (!base64Content) {
                throw new Error(`Datos inválidos para el archivo: ${file.name}`);
            }

            const buffer = Buffer.from(base64Content, 'base64');

            if (bucket) {
                // Modo Producción / Firebase Storage
                // Guardar en la carpeta "gallery/" del bucket
                const cleanFileName = `gallery/${Date.now()}-${sanitizedFileName}`;
                const storageFile = bucket.file(cleanFileName);
                const downloadToken = crypto.randomUUID();

                let contentType = 'application/octet-stream';
                if (file.data.startsWith('data:')) {
                    const match = file.data.match(/data:([^;]+);/);
                    if (match) {
                        contentType = match[1];
                    }
                }

                await storageFile.save(buffer, {
                    metadata: {
                        contentType: contentType,
                        metadata: {
                            firebaseStorageDownloadTokens: downloadToken
                        }
                    }
                });

                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(cleanFileName)}?alt=media&token=${downloadToken}`;
                urls.push(publicUrl);
            } else {
                // Modo Local
                const publicDir = path.join(process.cwd(), 'public');
                const filePath = path.join(publicDir, sanitizedFileName);
                await fs.writeFile(filePath, buffer);
                urls.push(`/${sanitizedFileName}`);
            }
        }

        revalidatePath('/admin/gallery');
        return { 
            success: true, 
            message: `${files.length} archivo(s) subido(s) con éxito.`,
            url: urls[0]
        };

    } catch (error) {
        console.error('Error al subir archivos:', error);
        return { success: false, message: `Error al subir archivos: ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
}
