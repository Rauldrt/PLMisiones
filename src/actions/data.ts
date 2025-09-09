
'use server';

import { 
    getSocialLinks, 
    getFormDefinition,
    getNews,
    getBannerTextSlides,
    getBannerBackgroundSlides,
    getMosaicItems,
    getAccordionItems,
    getReferentes,
    getOrganigrama,
    getFormSubmissions,
    getCandidates,
    getNotification,
    getProposals,
    getFooterContent,
    getMaps,
    getPageHeaders
} from '@/lib/data';

// These actions are safe to call from client components.

export async function getSocialLinksAction() {
    return getSocialLinks();
}

export async function getFormDefinitionAction(formName: string) {
    return getFormDefinition(formName);
}

export async function getNewsAction() {
    return getNews();
}

export async function getBannerTextSlidesAction() {
    return getBannerTextSlides();
}

export async function getBannerBackgroundSlidesAction() {
    return getBannerBackgroundSlides();
}

export async function getMosaicItemsAction() {
    return getMosaicItems();
}

export async function getAccordionItemsAction() {
    return getAccordionItems();
}

export async function getProposalsAction() {
    return getProposals();
}

export async function getReferentesAction() {
    return getReferentes();
}

export async function getCandidatesAction() {
    return getCandidates();
}

export async function getOrganigramaAction() {
    return getOrganigrama();
}

export async function getFormSubmissionsAction(formName: string) {
    return getFormSubmissions(formName);
}

export async function getNotificationAction() {
    return getNotification();
}

export async function getFooterContentAction() {
    return getFooterContent();
}

export async function getMapsAction() {
    return getMaps();
}

export async function getPageHeadersAction() {
    return getPageHeaders();
}
