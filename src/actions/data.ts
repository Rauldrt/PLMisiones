
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, PageHeader, Referente, SocialLink, FormDefinition, FormSubmission, Notification, OrganigramaMember, Candidate, Proposal, FooterContent, MapEmbed, NotificationItem } from '@/lib/types';


// Helper function to read and parse a JSON file
async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const jsonData = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(jsonData) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const defaultContent = filePath.endsWith('.json') && (filePath.includes('notification.json') || filePath.includes('footer.json')) ? '{}' : '[]';
        try {
            await fs.writeFile(path.join(process.cwd(), filePath), defaultContent);
            return JSON.parse(defaultContent);
        } catch (writeError) {
            console.error(`Failed to create empty file ${filePath}:`, writeError);
        }
    } else {
        console.error(`Error reading file ${filePath}:`, error);
    }
    return (filePath.endsWith('.json') && (filePath.includes('notification.json') || filePath.includes('footer.json'))) ? {} as T : [] as T;
  }
}

// These actions are safe to call from client components.
export async function getNewsAction() {
    return readJsonFile<NewsArticle[]>('src/data/news.json');
}
export async function getSocialLinksAction() {
    return readJsonFile<SocialLink[]>('src/data/social-links.json');
}

export async function getFormDefinitionAction(formName: string) {
    return readJsonFile<FormDefinition>(`src/data/form-def-${formName}.json`);
}

export async function getBannerTextSlidesAction() {
    return readJsonFile<BannerTextSlide[]>('src/data/banner.json');
}

export async function getBannerBackgroundSlidesAction() {
    return readJsonFile<BannerBackgroundSlide[]>('src/data/banner-background.json');
}

export async function getMosaicItemsAction() {
    return readJsonFile<MosaicItem[]>('src/data/mosaic.json');
}

export async function getAccordionItemsAction() {
    return readJsonFile<AccordionItem[]>('src/data/accordion.json');
}

export async function getProposalsAction() {
    return readJsonFile<Proposal[]>('src/data/proposals.json');
}

export async function getReferentesAction() {
    return readJsonFile<Referente[]>('src/data/referentes.json');
}

export async function getCandidatesAction() {
    return readJsonFile<Candidate[]>('src/data/candidates.json');
}

export async function getOrganigramaAction() {
    return readJsonFile<OrganigramaMember[]>('src/data/organigrama.json');
}

export async function getFormSubmissionsAction(formName: string) {
    return readJsonFile<FormSubmission[]>(`src/data/form-submissions-${formName}.json`);
}

export async function getNotificationAction() {
    return readJsonFile<Notification>('src/data/notification.json');
}

export async function getNotificationsAction() {
    return readJsonFile<NotificationItem[]>('src/data/notifications.json');
}

export async function getFooterContentAction() {
    return readJsonFile<FooterContent>('src/data/footer.json');
}

export async function getMapsAction() {
    return readJsonFile<MapEmbed[]>('src/data/maps.json');
}

export async function getPageHeadersAction() {
    return readJsonFile<PageHeader[]>('src/data/page-headers.json');
}
