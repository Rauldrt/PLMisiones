
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, PageHeader, Referente, SocialLink, FormDefinition, FormSubmission, Notification, OrganigramaMember, Candidate, Proposal, FooterContent, MapEmbed, NotificationItem } from '@/lib/types';

// Helper function to read and parse a JSON file
async function readJsonFile<T>(filePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), filePath);
  const isObjectLike = filePath.includes('notification.json') || filePath.includes('footer.json');
  const defaultContent = isObjectLike ? '{}' : '[]';

  try {
    const jsonData = await fs.readFile(fullPath, 'utf-8');
    // If the file is empty, return the default content
    if (jsonData.trim() === '') {
        return JSON.parse(defaultContent);
    }
    // Try to parse the JSON data
    try {
        return JSON.parse(jsonData) as T;
    } catch (parseError) {
        console.error(`Error parsing JSON from ${filePath}:`, parseError);
        // If parsing fails, return the default content
        return JSON.parse(defaultContent);
    }
  } catch (error) {
    // If the file doesn't exist, create it with default content
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        try {
            await fs.writeFile(fullPath, defaultContent);
            return JSON.parse(defaultContent);
        } catch (writeError) {
            console.error(`Failed to create empty file ${filePath}:`, writeError);
        }
    } else {
        console.error(`Error reading file ${filePath}:`, error);
    }
    // Fallback for any other errors
    return JSON.parse(defaultContent);
  }
}

// These actions are safe to call from client components.
export async function getNewsAction(): Promise<NewsArticle[]> {
    return readJsonFile<NewsArticle[]>('src/data/news.json');
}
export async function getPublicNewsAction(): Promise<NewsArticle[]> {
    const allNews = await getNewsAction();
    return allNews.filter(article => !article.hidden);
}
export async function getNewsArticleBySlugAction(slug: string): Promise<NewsArticle | undefined> {
  const news = await getNewsAction();
  return news.find(article => article.slug === slug);
}
export async function getSocialLinksAction(): Promise<SocialLink[]> {
    return readJsonFile<SocialLink[]>('src/data/social-links.json');
}

export async function getFormDefinitionAction(formName: string): Promise<FormDefinition> {
    return readJsonFile<FormDefinition>(`src/data/form-def-${formName}.json`);
}

export async function getBannerTextSlidesAction(): Promise<BannerTextSlide[]> {
    return readJsonFile<BannerTextSlide[]>('src/data/banner.json');
}

export async function getBannerBackgroundSlidesAction(): Promise<BannerBackgroundSlide[]> {
    return readJsonFile<BannerBackgroundSlide[]>('src/data/banner-background.json');
}

export async function getMosaicItemsAction(): Promise<MosaicItem[]> {
    return readJsonFile<MosaicItem[]>('src/data/mosaic.json');
}

export async function getAccordionItemsAction(): Promise<AccordionItem[]> {
    return readJsonFile<AccordionItem[]>('src/data/accordion.json');
}

export async function getProposalsAction(): Promise<Proposal[]> {
    return readJsonFile<Proposal[]>('src/data/proposals.json');
}

export async function getReferentesAction(): Promise<Referente[]> {
    return readJsonFile<Referente[]>('src/data/referentes.json');
}

export async function getCandidatesAction(): Promise<Candidate[]> {
    return readJsonFile<Candidate[]>('src/data/candidates.json');
}

export async function getOrganigramaAction(): Promise<OrganigramaMember[]> {
    return readJsonFile<OrganigramaMember[]>('src/data/organigrama.json');
}

export async function getFormSubmissionsAction(formName: string): Promise<FormSubmission[]> {
    return readJsonFile<FormSubmission[]>(`src/data/form-submissions-${formName}.json`);
}

export async function getNotificationAction(): Promise<Notification> {
    return readJsonFile<Notification>('src/data/notification.json');
}

export async function getNotificationsAction(): Promise<NotificationItem[]> {
    return readJsonFile<NotificationItem[]>('src/data/notifications.json');
}

export async function getPublicNotificationsAction(): Promise<NotificationItem[]> {
    const allNotifications = await getNotificationsAction();
    return allNotifications.filter(notification => !notification.hidden);
}

export async function getFooterContentAction(): Promise<FooterContent> {
    return readJsonFile<FooterContent>('src/data/footer.json');
}

export async function getMapsAction(): Promise<MapEmbed[]> {
    return readJsonFile<MapEmbed[]>('src/data/maps.json');
}

export async function getPageHeadersAction(): Promise<PageHeader[]> {
    return readJsonFile<PageHeader[]>('src/data/page-headers.json');
}
export async function getPageHeaderByPathAction(path: string): Promise<PageHeader | undefined> {
  const headers = await getPageHeadersAction();
  return headers.find(header => header.path === path);
}
