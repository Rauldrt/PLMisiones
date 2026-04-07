import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { NotificationDropdown } from './NotificationDropdown';
import type { NotificationItem, Notification as TNotification } from '@/lib/types';

describe('NotificationDropdown', () => {
  const mockSettings: TNotification = {
    enabled: true,
    text: 'Novedades',
    glowColor: 'orange',
    glowSpeed: 'normal'
  };

  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Test Notification',
      content: 'Test Content',
      date: '2024-03-20T10:00:00.000Z',
    }
  ];

  it('renders null when notifications array is empty', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={[]}
        notificationSettings={mockSettings}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when notifications array is null', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={null as unknown as NotificationItem[]}
        notificationSettings={mockSettings}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when settings is disabled', () => {
    const { container } = render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={{ ...mockSettings, enabled: false }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with notifications and enabled settings', () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={mockSettings}
      />
    );

    // The trigger button should be visible with the configured text
    expect(screen.getByText('Novedades')).toBeTruthy();
  });

  it('renders correctly when clicked', async () => {
    const user = userEvent.setup();
    const { getAllByText } = render(
      <NotificationDropdown
        notifications={mockNotifications}
        notificationSettings={mockSettings}
      />
    );

    // Use getAllByText and pick the first one since it might be preserved across re-renders
    const trigger = getAllByText('Novedades')[0];
    expect(trigger).toBeTruthy();

    // Click to open dropdown
    await user.click(trigger);

    // Wait for the dropdown content
    const notificationTitle = await screen.findByText('Test Notification');
    expect(notificationTitle).toBeTruthy();

    // Verify date is rendered (roughly, it formats locally so we just check it exists)
    // 2024-03-20T10:00:00.000Z formatted in es-AR might be something like "20 de marzo"
    const regex = /marzo|3|20/; // simple check, robust enough for our test
    const dateEles = screen.queryAllByText(regex);
    expect(dateEles.length).toBeGreaterThan(0);
  });
});
