import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationDropdown } from '../NotificationDropdown';
import { NotificationItem, Notification } from '@/lib/types';
import { expect, vi, describe, it } from 'vitest';

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Test Notification 1',
    content: 'This is the first notification content.',
    date: '2023-10-26T12:00:00Z',
  },
  {
    id: '2',
    title: 'Test Notification 2',
    content: 'This is the second notification content.',
    date: '2023-10-27T12:00:00Z',
  },
];

const mockSettings: Notification = {
  enabled: true,
  text: 'New updates',
  title: 'Settings Title',
  content: 'Settings Content',
  link: '/settings',
  glowColor: 'orange',
  glowSpeed: 'normal',
};

describe('NotificationDropdown', () => {
  it('renders nothing when there are no notifications', () => {
    const { container } = render(
      <NotificationDropdown notifications={[]} notificationSettings={mockSettings} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when notifications are disabled', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={{ ...mockSettings, enabled: false }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the trigger button with the correct text', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={mockSettings}
      />
    );
    expect(screen.getByText('New updates')).toBeInTheDocument();
  });

  it('opens the popover and displays notification titles', async () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={mockSettings}
      />
    );

    const triggerButton = screen.getByRole('button');
    await userEvent.click(triggerButton);

    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
  });

  it('opens the dialog when a notification is clicked', async () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={mockSettings}
      />
    );

    const triggerButton = screen.getByRole('button');
    await userEvent.click(triggerButton);

    const notificationButton = screen.getByText('Test Notification 1').closest('button');
    await userEvent.click(notificationButton!);

    // Dialog title should match notification title
    const dialogTitles = screen.getAllByText('Test Notification 1');
    expect(dialogTitles.length).toBeGreaterThan(1);

    // Dialog content should be present
    expect(screen.getByText('This is the first notification content.')).toBeInTheDocument();
  });
});
