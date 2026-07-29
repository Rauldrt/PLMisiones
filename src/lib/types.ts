

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
  name: string;
  url: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface GoogleForm {
  id: string;
  title: string;
  description?: string;
  embedUrl: string;
  sheetUrl?: string;
  fields?: FormField[];
}


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
  title: string;
  content: string;
  link: string;
  imageUrl?: string;
  imageHint?: string;
  glowColor?: 'orange' | 'blue' | 'green' | 'red';
  glowSpeed?: 'slow' | 'normal' | 'fast';
}

export interface NotificationItem {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  hidden?: boolean;
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

export interface StreamingItem {
  id: string;
  title: string;
  embedCode: string;
}

export interface FuchsiaPillConfig {
  id: 'participa' | 'intereses' | 'comenta';
  label: string;
  title: string;
  description: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  interestItems?: { icon: string; title: string; desc: string }[];
  whatsappNumber?: string;
}

export interface BannerConfig {
  bottomContentType: 'candidates' | 'referentes' | 'hidden';
  showProposals: boolean;
  layoutMode: 'campaign' | 'institutional';
  institutionalBgType: 'color' | 'image';
  institutionalBgVal: string;
  pageBgBlur?: number;
  pageBgOpacity?: number;
  pageBgOverlayOpacity?: number;
  bannerOverlayOpacity?: number;
  fuchsiaCardBgType?: 'glass' | 'aurora';
  fuchsiaPills?: FuchsiaPillConfig[];
  pageBgPosition?: string;
  pageBgSize?: string;
  institutionalBgPosition?: string;
  institutionalBgSize?: string;
}

export interface FormSubmission {
  id: string;
  type: 'contacto' | 'afiliacion' | 'fiscales';
  data: Record<string, any>;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  read?: boolean;
}

export interface WhatsappConfig {
  enabled: boolean;
  provider: 'callmebot' | 'webhook' | 'telegram' | 'discord' | 'greenapi';
  apiKey?: string;
  numbers?: string;
  webhookUrl?: string;
  telegramToken?: string;
  telegramChatId?: string;
  greenApiInstanceId?: string;
  greenApiToken?: string;
}

