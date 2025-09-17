
'use server';

import { 
    readNewsFile,
    readSocialLinksFile,
    readFormDefinitionFile,
    readBannerTextSlidesFile,
    readBannerBackgroundSlidesFile,
    readMosaicItemsFile,
    readAccordionItemsFile,
    readProposalsFile,
    readReferentesFile,
    readCandidatesFile,
    readOrganigramaFile,
    readNotificationFile,
    readNotificationsFile,
    readFooterContentFile,
    readMapsFile,
    readPageHeadersFile
} from '@/lib/server/data';
import { getSubmissions } from '@/lib/firebase/admin';
import type { NewsArticle } from '@/lib/types';


// These actions are safe to call from client components.
export async function getNewsAction() {
    return readNewsFile();
}
export async function getPublicNewsAction() {
    const allNews = await readNewsFile();
    return allNews.filter(article => !article.hidden);
}
export async function getNewsArticleBySlugAction(slug: string) {
  const news = await readNewsFile();
  return news.find(article => article.slug === slug);
}
export async function getSocialLinksAction() {
    return readSocialLinksFile();
}

export async function getFormDefinitionAction(formName: string) {
    return readFormDefinitionFile(formName);
}

export async function getBannerTextSlidesAction() {
    return readBannerTextSlidesFile();
}

export async function getBannerBackgroundSlidesAction() {
    return readBannerBackgroundSlidesFile();
}

export async function getMosaicItemsAction() {
    return readMosaicItemsFile();
}

export async function getAccordionItemsAction() {
    return readAccordionItemsFile();
}

export async function getProposalsAction() {
    return readProposalsFile();
}

export async function getReferentesAction() {
    return readReferentesFile();
}

export async function getCandidatesAction() {
    return readCandidatesFile();
}

export async function getOrganigramaAction() {
    return readOrganigramaFile();
}

export async function getFormSubmissionsAction(formName: string) {
    return getSubmissions(`submissions-${formName}`);
}

export async function getNotificationAction() {
    return readNotificationFile();
}

export async function getNotificationsAction() {
    return readNotificationsFile();
}

export async function getPublicNotificationsAction() {
    const allNotifications = await readNotificationsFile();
    return allNotifications.filter(notification => !notification.hidden);
}

export async function getFooterContentAction() {
    return readFooterContentFile();
}

export async function getMapsAction() {
    return readMapsFile();
}

export async function getPageHeadersAction() {
    return readPageHeadersFile();
}
export async function getPageHeaderByPathAction(path: string) {
  const headers = await readPageHeadersFile();
  return headers.find(header => header.path === path);
}

