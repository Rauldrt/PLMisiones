
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl?: string;
  imageHint?: string;
  content: string;
  hidden?: boolean;
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
  animationType?: 'fade' | 'slide-left' | 'slide-right' | 'zoom';
  animationDuration?: number;
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
  imageUrl?: string;
  imageHint?: string;
}

export interface Referente {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  imageHint?: string;
  bio: string;
  locality?: string;
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
    description: string;
}

export interface Notification {
  enabled: boolean;
  text: string;
  link: string;
}

export interface NotificationItem {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
}

export interface Proposal {
  id: string;
  title: string;
  content: string;
}

export interface FooterContent {
  contactTitle: string;
  contactDescription: string;
  headquartersTitle: string;
  address: string;
  contactInfoTitle: string;
  email: string;
  phone: string;
  whatsapp?: string;
  socialsTitle: string;
  copyright: string;
  credits: string;
}

export interface MapEmbed {
  id: string;
  title: string;
  embedCode: string;
  enabled: boolean;
}
