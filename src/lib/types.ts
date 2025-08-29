export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  imageHint?: string;
  content: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageHint?: string;
  ctaText: string;
  ctaLink: string;
}

export interface MosaicItem {
  id: string;
  title: string;
  imageUrl: string;
  imageHint?: string;
  colSpan: number;
  rowSpan: number;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface PageHeader {
  path: string;
  title: string;
  description: string;
  icon: string;
}

export interface Referente {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageHint?: string;
  bio: string;
}

export interface SocialLink {
  id: string;
  name: 'Facebook' | 'Twitter' | 'Instagram' | 'YouTube';
  url: string;
}

export interface FormFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number';
  placeholder?: string;
  required: boolean;
}

export interface FormDefinition {
  name: string;
  title: string;
  description: string;
  fields: FormFieldDefinition[];
}

export type FormSubmission = Record<string, string | number>;

export interface OrganigramaMember {
    id: string;
    name: string;
    role: string;
    level: number;
    children?: OrganigramaMember[];
}
