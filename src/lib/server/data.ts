
import { promises as fs } from 'fs';
import path from 'path';
import type { NewsArticle, BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, PageHeader, Referente, SocialLink, FormDefinition, FormSubmission, Notification, OrganigramaMember, Candidate, Proposal, FooterContent, MapEmbed, NotificationItem } from '../types';

// Helper function to read and parse a JSON file
async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const jsonData = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(jsonData) as T;
  } catch (error) {
    // If the file doesn't exist, it's not an error in this context, just return empty.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        if(filePath.endsWith('.json') && !filePath.includes('-')) { // check if it's a file that should exist
             try {
                // If the file is expected to be an object, create it empty
                if (filePath.includes('notification.json') || filePath.includes('footer.json')) {
                    await fs.writeFile(path.join(process.cwd(), filePath), '{}');
                    return {} as T;
                }
                // Otherwise assume it's an array
                await fs.writeFile(path.join(process.cwd(), filePath), '[]');
                return [] as T;
             } catch (writeError) {
                 console.error(`Failed to create empty file ${filePath}:`, writeError);
                 return [] as T;
             }
        }
        return [] as T;
    }
    console.error(`Error reading file ${filePath}:`, error);
    // Return a default value or throw error, depending on desired behavior.
    // For this app, returning an empty array is a safe default.
    return [] as T;
  }
}

// Service functions for each data type
export const getNews = () => readJsonFile<NewsArticle[]>('src/data/news.json');

export const getPublicNews = async () => {
    const allNews = await getNews();
    return allNews.filter(article => !article.hidden);
}

export const getBannerTextSlides = () => readJsonFile<BannerTextSlide[]>('src/data/banner.json');
export const getBannerBackgroundSlides = () => readJsonFile<BannerBackgroundSlide[]>('src/data/banner-background.json');
export const getMosaicItems = () => readJsonFile<MosaicItem[]>('src/data/mosaic.json');
export const getAccordionItems = () => readJsonFile<AccordionItem[]>('src/data/accordion.json');
export const getPageHeaders = () => readJsonFile<PageHeader[]>('src/data/page-headers.json');
export const getReferentes = () => readJsonFile<Referente[]>('src/data/referentes.json');
export const getCandidates = () => readJsonFile<Candidate[]>('src/data/candidates.json');
export const getSocialLinks = () => readJsonFile<SocialLink[]>('src/data/social-links.json');
export const getNotification = () => readJsonFile<Notification>('src/data/notification.json');
export const getNotifications = () => readJsonFile<NotificationItem[]>('src/data/notifications.json');

export const getPublicNotifications = async () => {
    const allNotifications = await getNotifications();
    return allNotifications.filter(notification => !notification.hidden);
}

export const getOrganigrama = () => readJsonFile<OrganigramaMember[]>('src/data/organigrama.json');
export const getProposals = () => readJsonFile<Proposal[]>('src/data/proposals.json');
export const getFooterContent = () => readJsonFile<FooterContent>('src/data/footer.json');
export const getMaps = () => readJsonFile<MapEmbed[]>('src/data/maps.json');

export const getFormDefinition = (formName: string) => readJsonFile<FormDefinition>(`src/data/form-def-${formName}.json`);
export const getFormSubmissions = (formName: string) => readJsonFile<FormSubmission[]>(`src/data/form-submissions-${formName}.json`);

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const news = await getNews();
  const article = news.find(article => article.slug === slug);
  // On public pages, don't show hidden articles unless it's a direct link
  if (article && article.hidden) {
      return undefined;
  }
  return article;
}

export async function getPageHeaderByPath(path: string): Promise<PageHeader | undefined> {
  const headers = await getPageHeaders();
  return headers.find(header => header.path === path);
}
