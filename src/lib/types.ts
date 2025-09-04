
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  imageHint?: string;
  content: string;
}

export interface BannerTextSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface BannerBackgroundSlide {
  id: string;
  imageUrl: string;
  imageHint?: string;
  animationType?: 'zoom-in' | 'fade' | 'slide-from-left' | 'slide-from-right';
  animationDuration?: number;
  overlayOpacity?: number;
  objectPosition?: string;
}


export interface MosaicItem {
  id: string;
  title: string;
  imageUrls: string[];
  imageHints?: string[];
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

export interface Candidate extends Referente {}

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
    imageUrl: string;
    imageHint: string;
}

export interface Notification {
  enabled: boolean;
  text: string;
  link: string;
}

export interface Proposal {
  id: string;
  title: string;
  content: string;
}
