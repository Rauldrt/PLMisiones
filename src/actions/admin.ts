'use server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, Referente, OrganigramaMember, Candidate, Notification, Proposal, FooterContent, MapEmbed, PageHeader, SocialLink, NotificationItem, GoogleForm, StreamingItem } from '@/lib/types';
import { getNewsAction } from '@/actions/data';

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

export async function saveProposals(items: Proposal[]) {
    await writeJsonFile('src/data/proposals.json', items);
    revalidatePath('/');
    return { success: true, message: 'Propuestas guardadas con éxito.' };
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

export async function addNewsArticle(article: Omit<NewsArticle, 'id' | 'slug'>) {
    const articles = await getNewsAction();
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

export async function saveNotification(item: Notification) {
    await writeJsonFile('src/data/notification.json', item);
    revalidatePath('/');
    return { success: true, message: 'Notificación guardada con éxito.' };
}

export async function saveNotificationsPage(items: NotificationItem[]) {
    await writeJsonFile('src/data/notifications.json', items);
    revalidatePath('/notificaciones');
    return { success: true, message: 'Página de notificaciones guardada con éxito.' };
}

export async function saveFooterContent(item: FooterContent) {
    await writeJsonFile('src/data/footer.json', item);
    revalidatePath('/*'); // Revalidate all pages since footer is global
    return { success: true, message: 'Contenido del pie de página guardado con éxito.' };
}

export async function saveMaps(items: MapEmbed[]) {
    await writeJsonFile('src/data/maps.json', items);
    revalidatePath('/referentes');
    return { success: true, message: 'Mapas guardados con éxito.' };
}

export async function savePageHeaders(items: PageHeader[]) {
    await writeJsonFile('src/data/page-headers.json', items);
    items.forEach(item => revalidatePath(item.path));
    return { success: true, message: 'Encabezados guardados con éxito.' };
}

export async function saveSocialLinks(items: SocialLink[]) {
    await writeJsonFile('src/data/social-links.json', items);
    revalidatePath('/*'); // Revalidate all pages since footer is global
    return { success: true, message: 'Enlaces de redes sociales guardados con éxito.' };
}

export async function saveGoogleForms(items: GoogleForm[]) {
    await writeJsonFile('src/data/google-forms.json', items);
    revalidatePath('/afiliacion');
    revalidatePath('/fiscales');
    revalidatePath('/*'); // revalidate all for footer
    return { success: true, message: 'Formularios de Google guardados con éxito.' };
}

export async function saveStreaming(items: StreamingItem[]) {
    await writeJsonFile('src/data/streaming.json', items);
    revalidatePath('/');
    return { success: true, message: 'Sección de Streaming guardada con éxito.' };
}
