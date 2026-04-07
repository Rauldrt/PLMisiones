import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificacionesClient } from './NotificacionesClient';
import type { NotificationItem } from '@/lib/types';

// Mock the Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    const { fill, sizes, priority, style, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock the sanitize function
vi.mock('@/lib/client-sanitize', () => ({
  clientSanitize: (html: string) => html,
}));

describe('NotificacionesClient', () => {
  it('renders empty state when there are no notifications', () => {
    render(<NotificacionesClient initialNotifications={[]} />);

    expect(screen.getByText('No hay anuncios')).toBeInTheDocument();
    expect(screen.getByText('No hay notificaciones para mostrar en este momento.')).toBeInTheDocument();
  });

  it('renders a list of notifications correctly', () => {
    const notifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Test Notification 1',
        content: '<p>Test content 1</p>',
        date: '2023-10-27T10:00:00Z',
      },
      {
        id: '2',
        title: 'Test Notification 2',
        content: '<p>Test content 2</p>',
        date: '2023-10-28T10:00:00Z',
      },
    ];

    render(<NotificacionesClient initialNotifications={notifications} />);

    // Check titles
    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 2')).toBeInTheDocument();

    // Check dates (formatted for es-AR locale)
    expect(screen.getByText(/27 de octubre de 2023/)).toBeInTheDocument();
    expect(screen.getByText(/28 de octubre de 2023/)).toBeInTheDocument();

    // Check content (due to dangerouslySetInnerHTML, we look for text inside elements)
    // Testing library's getByText might not match across HTML boundaries directly if complex,
    // but here we have simple P tags so it should work or we can query the DOM.
    expect(screen.getByText('Test content 1')).toBeInTheDocument();
    expect(screen.getByText('Test content 2')).toBeInTheDocument();
  });

  it('renders images when imageUrl is provided', () => {
    const notifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Image Notification',
        content: '<p>Content with image</p>',
        date: '2023-10-27T10:00:00Z',
        imageUrl: '/test-image.jpg',
      },
    ];

    render(<NotificacionesClient initialNotifications={notifications} />);

    const image = screen.getByAltText('Image Notification');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('opens lightbox when an image is clicked', () => {
    const notifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Image Notification',
        content: '<p>Content with image</p>',
        date: '2023-10-27T10:00:00Z',
        imageUrl: '/test-image.jpg',
      },
    ];

    render(<NotificacionesClient initialNotifications={notifications} />);

    // The image itself isn't what's clicked necessarily (it's the button), but let's click the button
    const imageButton = screen.getByRole('button');

    // Lightbox image shouldn't be there initially
    expect(screen.queryByAltText('Vista ampliada')).not.toBeInTheDocument();

    // Click the image button
    fireEvent.click(imageButton);

    // Lightbox should now be visible with the image
    const lightboxImage = screen.getByAltText('Vista ampliada');
    expect(lightboxImage).toBeInTheDocument();
    expect(lightboxImage).toHaveAttribute('src', '/test-image.jpg');
  });
});
