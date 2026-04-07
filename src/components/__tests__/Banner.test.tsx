import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Banner } from '../Banner';
import React from 'react';

// Mock clientSanitize
vi.mock('@/lib/client-sanitize', () => ({
  clientSanitize: (str: string) => str
}));

// Mock components
vi.mock('../AnimatedBannerBackground', () => ({
  AnimatedBannerBackground: () => <div data-testid="animated-background" />
}));

vi.mock('../NotificationDropdown', () => ({
  NotificationDropdown: () => <div data-testid="notification-dropdown" />
}));

vi.mock('../BannerContentTabs', () => ({
  BannerContentTabs: () => <div data-testid="banner-content-tabs" />
}));

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
  CarouselNext: () => <div data-testid="carousel-next" />,
  CarouselPrevious: () => <div data-testid="carousel-previous" />,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
  DialogTrigger: ({ children }: any) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogOverlay: () => <div data-testid="dialog-overlay" />,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

// Mock icons
vi.mock('../icons', () => ({
  Icons: {
    Proposals: () => <div data-testid="icon-proposals" />
  }
}));

// Mock embla-carousel-autoplay
vi.mock('embla-carousel-autoplay', () => {
  return {
    default: () => ({ name: 'autoplay', init: vi.fn(), destroy: vi.fn() })
  };
});

describe('Banner', () => {
  const defaultProps = {
    textSlides: [
      { id: '1', title: 'Slide 1', subtitle: 'Subtitle 1', ctaText: 'Click here', ctaLink: '/link1' },
      { id: '2', title: 'Slide 2', subtitle: 'Subtitle 2' }
    ],
    backgroundSlides: [
      { id: '1', imageUrl: '/bg1.jpg' },
    ],
    candidates: [],
    notifications: [],
    notificationSettings: {
      enabled: true,
      title: 'Notificaciones',
      message: 'Tienes nuevas notificaciones',
      link: '/notificaciones',
      linkText: 'Ver todas',
    },
    proposals: []
  };

  it('renders correctly with basic props', () => {
    render(<Banner {...defaultProps} />);

    // Check main components are rendered
    expect(screen.getByTestId('animated-background')).toBeInTheDocument();
    expect(screen.getByTestId('notification-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('banner-content-tabs')).toBeInTheDocument();

    // Check text slides content
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 1')).toBeInTheDocument();
    expect(screen.getByText('Click here')).toBeInTheDocument();

    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 2')).toBeInTheDocument();

    // Check navigation buttons are rendered (since length > 1)
    expect(screen.getByTestId('carousel-next')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-previous')).toBeInTheDocument();
  });

  it('renders proposals button when proposals are provided', () => {
    const propsWithProposals = {
      ...defaultProps,
      proposals: [
        { id: '1', title: 'Proposal 1', content: '<p>Content 1</p>' }
      ]
    };

    render(<Banner {...propsWithProposals} />);

    expect(screen.getByText('Ver Nuestras Propuestas')).toBeInTheDocument();
    expect(screen.getAllByTestId('dialog').length).toBeGreaterThan(0);
  });

  it('does not render proposals button when no proposals are provided', () => {
    render(<Banner {...defaultProps} />);

    expect(screen.queryByText('Ver Nuestras Propuestas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('does not render navigation buttons when there is only one text slide', () => {
    const propsWithOneSlide = {
      ...defaultProps,
      textSlides: [{ id: '1', title: 'Slide 1', subtitle: 'Subtitle 1' }]
    };

    render(<Banner {...propsWithOneSlide} />);

    expect(screen.queryByTestId('carousel-next')).not.toBeInTheDocument();
    expect(screen.queryByTestId('carousel-previous')).not.toBeInTheDocument();
  });
});
