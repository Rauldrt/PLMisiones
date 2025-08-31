import { promises as fs } from 'fs';
import path from 'path';
import type { NewsArticle, BannerSlide, MosaicItem, AccordionItem, PageHeader, Referente, SocialLink, FormDefinition, FormSubmission } from './types';

// Helper function to read and parse a JSON file
async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const jsonData = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(jsonData) as T;
  } catch (error) {
    // If the file doesn't exist, it's not an error in this context, just return empty.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
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
export const getBannerSlides = () => readJsonFile<BannerSlide[]>('src/data/banner.json');
export const getMosaicItems = () => readJsonFile<MosaicItem[]>('src/data/mosaic.json');
export const getAccordionItems = () => readJsonFile<AccordionItem[]>('src/data/accordion.json');
export const getPageHeaders = () => readJsonFile<PageHeader[]>('src/data/page-headers.json');
export const getReferentes = () => readJsonFile<Referente[]>('src/data/referentes.json');
export const getSocialLinks = () => readJsonFile<SocialLink[]>('src/data/social-links.json');

export const getFormDefinition = (formName: string) => readJsonFile<FormDefinition>(`src/data/form-def-${formName}.json`);
export const getFormSubmissions = (formName: string) => readJsonFile<FormSubmission[]>(`src/data/form-submissions-${formName}.json`);

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const news = await getNews();
  return news.find(article => article.slug === slug);
}

export async function getPageHeaderByPath(path: string): Promise<PageHeader | undefined> {
  const headers = await getPageHeaders();
  return headers.find(header => header.path === path);
}
