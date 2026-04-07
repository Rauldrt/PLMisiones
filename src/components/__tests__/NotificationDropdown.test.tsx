import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationDropdown } from '../NotificationBubble';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  },
}));

const mockNotifications = [
  {
    id: '1',
    title: 'Latest Notification',
    content: 'This is the latest notification content.',
    date: '2023-10-27T10:00:00Z',
  },
  {
    id: '2',
    title: 'Older Notification 1',
    content: 'This is older notification 1.',
    date: '2023-10-26T10:00:00Z',
  },
  {
    id: '3',
    title: 'Older Notification 2',
    content: 'This is older notification 2.',
    date: '2023-10-25T10:00:00Z',
  },
];

// Mock Radix UI Dialog and Popover for simpler testing without interaction complexities
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div data-testid="dialog">{children}</div>,
  DialogTrigger: ({ children, asChild }: any) => asChild ? children : <button>{children}</button>,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => asChild ? children : <button>{children}</button>,
  PopoverContent: ({ children }: any) => <div data-testid="popover-content">{children}</div>,
}));

// Mock clientSanitize
vi.mock('@/lib/client-sanitize', () => ({
  clientSanitize: (html: string) => html,
}));

describe('NotificationDropdown', () => {
  it('renders nothing when notifications are undefined', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={undefined as any}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when notifications array is empty', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={[]}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders trigger button with latest notification title', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
      />
    );
    // Since it's in the button and the dialog multiple times, we just assert > 0
    const titles = screen.getAllByText('Latest Notification');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('renders popover content with latest and older notifications', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
      />
    );

    // Check if the popover content is rendered. We might have multiple if mocked badly, let's get the first one or use getAllBy
    const popoverContents = screen.getAllByTestId('popover-content');
    expect(popoverContents[0]).toBeInTheDocument();

    // Check latest notification details in the list
    const latestTitles = screen.getAllByText('Latest Notification');
    expect(latestTitles.length).toBeGreaterThan(0);

    // Check older notifications are listed
    const older1Titles = screen.getAllByText('Older Notification 1');
    expect(older1Titles.length).toBeGreaterThan(0);
    const older2Titles = screen.getAllByText('Older Notification 2');
    expect(older2Titles.length).toBeGreaterThan(0);

    // Check "Ver Todas" link
    const verTodasLinks = screen.getAllByText('Ver Todas');
    expect(verTodasLinks.length).toBeGreaterThan(0);
  });

  it('handles image-only notifications correctly', () => {
    const imageOnlyNotifications = [
      {
        id: 'img1',
        imageUrl: 'http://example.com/image.jpg',
        title: '',
        content: '',
        date: '2023-10-27T10:00:00Z',
      }
    ];

    render(
      <NotificationDropdown
        notifications={imageOnlyNotifications}
      />
    );

    // We should find the trigger and it shouldn't crash
    const triggers = screen.getAllByRole('button');
    expect(triggers.length).toBeGreaterThan(0);
  });
});
