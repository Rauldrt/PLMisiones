'use server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, Referente, FormDefinition, OrganigramaMember, Candidate } from '@/lib/types';
import { getNews } from '@/lib/data';

async function writeJsonFile(filePath: string, data: any) {
  const fullPath = path.join(process.cwd(), filePath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
}

export async function saveNews(articles: NewsArticle[]) {
  await writeJsonFile('src/data/news.json', articles);
  revalidatePath('/');
  revalidatePath('/noticias');
  articles.forEach(article => {
    revalidatePath(`/noticias/${article.slug}`);
  });
  return { success: true, message: 'Noticias guardadas con éxito.' };
}

export async function saveBannerText(slides: BannerTextSlide[]) {
    await writeJsonFile('src/data/banner.json', slides);
    revalidatePath('/');
    return { success: true, message: 'Texto del banner guardado con éxito.' };
}

export async function saveBannerBackground(slides: BannerBackgroundSlide[]) {
    await writeJsonFile('src/data/banner-background.json', slides);
    revalidatePath('/');
    return { success: true, message: 'Fondo del banner guardado con éxito.' };
}

export async function saveMosaic(items: MosaicItem[]) {
    await writeJsonFile('src/data/mosaic.json', items);
    revalidatePath('/');
    return { success: true, message: 'Mosaico guardado con éxito.' };
}

export async function saveAccordion(items: AccordionItem[]) {
    await writeJsonFile('src/data/accordion.json', items);
    revalidatePath('/');
    return { success: true, message: 'Acordeón guardado con éxito.' };
}

export async function saveReferentes(items: Referente[]) {
    await writeJsonFile('src/data/referentes.json', items);
    revalidatePath('/');
    revalidatePath('/referentes');
    return { success: true, message: 'Referentes guardados con éxito.' };
}

export async function saveCandidates(items: Candidate[]) {
    await writeJsonFile('src/data/candidates.json', items);
    revalidatePath('/');
    return { success: true, message: 'Candidatos guardados con éxito.' };
}

export async function saveFormDefinition(formName: string, definition: FormDefinition) {
    await writeJsonFile(`src/data/form-def-${formName}.json`, definition);
    revalidatePath(`/${formName}`);
    revalidatePath('/contacto'); // Revalidate footer as well
    return { success: true, message: 'Formulario guardado con éxito.' };
}

export async function addNewsArticle(article: Omit<NewsArticle, 'id' | 'slug'>) {
    const articles = await getNews();
    const newArticle: NewsArticle = {
        ...article,
        id: new Date().getTime().toString(),
        slug: article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    };
    const updatedArticles = [newArticle, ...articles];
    await saveNews(updatedArticles);
    return { success: true, message: 'Artículo agregado con éxito.' };
}

export async function saveOrganigrama(items: OrganigramaMember[]) {
    await writeJsonFile('src/data/organigrama.json', items);
    revalidatePath('/');
    return { success: true, message: 'Organigrama guardado con éxito.' };
}
