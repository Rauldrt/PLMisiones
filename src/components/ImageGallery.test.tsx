import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ImageGallery } from './ImageGallery';
import { getPublicImagesAction } from '@/actions/gallery';

// Mock the dependencies
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} alt={props.alt} data-fill={fill} />;
  },
}));

jest.mock('@/actions/gallery', () => ({
  getPublicImagesAction: jest.fn(),
}));

jest.mock('./ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="scroll-area">{children}</div>,
}));

jest.mock('./icons', () => ({
  Icons: {
    Media: () => <svg data-testid="media-icon" />,
    Music2: () => <svg data-testid="music-icon" />,
  },
}));

describe('ImageGallery', () => {
  const mockOnImageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (getPublicImagesAction as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves to keep it loading

    render(<ImageGallery onImageSelect={mockOnImageSelect} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(18);
  });

  it('renders empty state when no media is found', async () => {
    (getPublicImagesAction as jest.Mock).mockResolvedValue([]);

    render(<ImageGallery onImageSelect={mockOnImageSelect} />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron archivos en la carpeta /public.')).toBeInTheDocument();
    });
  });

  it('renders media items and handles clicks', async () => {
    const mockMedia = [
      '/public/image1.jpg',
      '/public/video.mp4',
      '/public/audio.mp3',
      '/public/image2.png'
    ];
    (getPublicImagesAction as jest.Mock).mockResolvedValue(mockMedia);

    render(<ImageGallery onImageSelect={mockOnImageSelect} />);

    // Wait for the scroll area to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    // Check if images are rendered
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    // Because it's sorted descending, 'video.mp4' (v) > 'image2.png' (i2) > 'image1.jpg' (i1) > 'audio.mp3' (a)
    // The exact order is: video.mp4, image2.png, image1.jpg, audio.mp3
    expect(images[0]).toHaveAttribute('src', '/public/image2.png');
    expect(images[1]).toHaveAttribute('src', '/public/image1.jpg');

    // Check if icons for other media types are rendered
    expect(screen.getByTestId('media-icon')).toBeInTheDocument();
    expect(screen.getByTestId('music-icon')).toBeInTheDocument();

    // Check labels
    expect(screen.getByText('image2.png')).toBeInTheDocument();
    expect(screen.getByText('video.mp4')).toBeInTheDocument();

    // Simulate click on the item (image2.png)
    const imageButton = screen.getByRole('button', { name: /image2\.png/i });
    fireEvent.click(imageButton);

    expect(mockOnImageSelect).toHaveBeenCalledWith('/public/image2.png');
    expect(mockOnImageSelect).toHaveBeenCalledTimes(1);
  });

  it('sorts media items in descending order', async () => {
    const mockMedia = [
      '/public/a.jpg',
      '/public/c.jpg',
      '/public/b.jpg'
    ];
    (getPublicImagesAction as jest.Mock).mockResolvedValue(mockMedia);

    render(<ImageGallery onImageSelect={mockOnImageSelect} />);

    await waitFor(() => {
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('c.jpg');
    expect(buttons[1]).toHaveTextContent('b.jpg');
    expect(buttons[2]).toHaveTextContent('a.jpg');
  });
});
