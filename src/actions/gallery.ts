
'use server';

import { getPublicImages } from "@/lib/gallery-service";

export async function getPublicImagesAction() {
    return getPublicImages();
}
