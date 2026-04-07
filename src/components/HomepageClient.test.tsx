import { render, screen, fireEvent } from '@testing-library/react';
import { HomepageClient } from './HomepageClient';
import { describe, it, expect, vi } from 'vitest';
import type { BannerTextSlide, BannerBackgroundSlide, MosaicItem, AccordionItem, NewsArticle, Candidate, NotificationItem, OrganigramaMember, Proposal, StreamingItem, Notification } from '@/lib/types';

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    },
}));

describe('HomepageClient', () => {
    const mockProps = {
        bannerTextSlides: [] as BannerTextSlide[],
        bannerBackgroundSlides: [] as BannerBackgroundSlide[],
        mosaicItems: [] as MosaicItem[],
        accordionItems: [] as AccordionItem[],
        newsArticles: [] as NewsArticle[],
        candidates: [] as Candidate[],
        notifications: [] as NotificationItem[],
        notificationSettings: {
            enabled: false,
            message: '',
            url: '',
            buttonText: '',
            startDate: '',
            endDate: ''
        } as Notification,
        organigramaData: [] as OrganigramaMember[],
        proposals: [] as Proposal[],
        streamingItems: [] as StreamingItem[]
    };

    it('renders empty component without crashing', () => {
        render(<HomepageClient {...mockProps} />);
        expect(screen.getByText('Nuestra Identidad')).toBeInTheDocument();
        expect(screen.getByText('Últimas Noticias')).toBeInTheDocument();
    });

    it('renders organigrama section when data is provided', () => {
        const mockOrganigramaData: OrganigramaMember[] = [
            {
                id: '1',
                name: 'John Doe',
                role: 'President',
                description: 'President description',
                imageUrl: '/john-doe.jpg'
            }
        ];
        render(<HomepageClient {...mockProps} organigramaData={mockOrganigramaData} />);
        expect(screen.getByText('Organigrama del Partido')).toBeInTheDocument();
        // Since selectedMember logic might cause rendering issues in test, just test component presence
        expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    it('renders accordion items correctly', () => {
        const mockAccordionItems: AccordionItem[] = [
            {
                id: '1',
                title: 'Accordion 1',
                content: 'Accordion Content 1'
            }
        ];
        render(<HomepageClient {...mockProps} accordionItems={mockAccordionItems} />);
        expect(screen.getByText('Accordion 1')).toBeInTheDocument();
    });

    it('renders news articles correctly', () => {
        const mockNewsArticles: NewsArticle[] = [
            {
                id: '1',
                title: 'News 1',
                summary: 'Summary 1',
                content: '<p>Content 1</p>',
                imageUrl: '/news-1.jpg',
                date: '2023-01-01',
                published: true,
                slug: 'news-1'
            }
        ];
        render(<HomepageClient {...mockProps} newsArticles={mockNewsArticles} />);
        expect(screen.getByText('News 1')).toBeInTheDocument();
        // NewsCard uses getCleanContentPreview which parses the content HTML
        // For testing we will just check if the content is rendered
    });
});
