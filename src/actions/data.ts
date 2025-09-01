'use server';

import { 
    getSocialLinks, 
    getFormDefinition,
    getNews,
    getBannerSlides,
    getMosaicItems,
    getAccordionItems,
    getReferentes,
    getOrganigrama,
    getFormSubmissions,
    getCandidates
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

export async function getBannerSlidesAction() {
    return getBannerSlides();
}

export async function getMosaicItemsAction() {
    return getMosaicItems();
}

export async function getAccordionItemsAction() {
    return getAccordionItems();
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
