/**
 * @fileOverview A server-side-only service to interact with the filesystem
 * and retrieve a list of public images.
 */
import { promises as fs } from 'fs';
import path from 'path';

// Note: This module should only be imported and used in server-side components or actions.

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

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
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const allFiles = await getFilesRecursively(publicDir);

        const imageUrls = allFiles
            .filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => path.relative(publicDir, file))
            .map(file => `/${file.replace(/\\/g, '/')}`); // Ensure forward slashes for URLs

        return imageUrls;
    } catch (error) {
        // If the public directory doesn't exist, it's not a critical error.
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn("The 'public' directory does not exist. No images will be loaded for the gallery.");
            return [];
        }
        console.error("Error scanning public directory for images:", error);
        return [];
    }
}
