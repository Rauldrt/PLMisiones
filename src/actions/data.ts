'use server';

import { getSocialLinks, getFormDefinition } from '@/lib/data';

// These actions are safe to call from client components.

export async function getSocialLinksAction() {
    return getSocialLinks();
}

export async function getFormDefinitionAction(formName: string) {
    return getFormDefinition(formName);
}
