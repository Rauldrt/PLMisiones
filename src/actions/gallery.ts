
'use server';

import { getPublicImages } from "@/lib/gallery-service";
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function getPublicImagesAction() {
    return getPublicImages();
}

export async function uploadPublicFilesAction(files: { name: string; data: string }[]): Promise<{ success: boolean; message: string }> {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        
        for (const file of files) {
            // Sanitize file name to prevent directory traversal
            const sanitizedFileName = path.basename(file.name);
            if (sanitizedFileName !== file.name) {
                throw new Error(`Nombre de archivo inválido: ${file.name}`);
            }

            const filePath = path.join(publicDir, sanitizedFileName);
            const base64Data = file.data.split(';base64,').pop();

            if (!base64Data) {
                throw new Error(`Datos inválidos para el archivo: ${file.name}`);
            }

            await fs.writeFile(filePath, base64Data, 'base64');
        }

        revalidatePath('/admin/gallery');
        return { success: true, message: `${files.length} archivo(s) subido(s) con éxito.` };

    } catch (error) {
        console.error('Error al subir archivos:', error);
        return { success: false, message: `Error al subir archivos: ${error instanceof Error ? error.message : 'Error desconocido'}` };
    }
}
