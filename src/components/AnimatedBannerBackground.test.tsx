import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AnimatedBannerBackground } from './AnimatedBannerBackground';
import type { BannerBackgroundSlide } from '@/lib/types';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { fill, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe('AnimatedBannerBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock requestAnimationFrame for scroll tests
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const mockSlides: BannerBackgroundSlide[] = [
    {
      id: 'slide-1',
      imageUrl: '/image1.jpg',
      imageHint: 'Hint 1',
      animationDuration: 5, // 5 seconds
      overlayOpacity: 0.5,
    },
    {
      id: 'slide-2',
      imageUrl: '/image2.jpg',
      animationDuration: 10, // 10 seconds
    },
  ];

  it('renders fallback when slides is empty', () => {
    const { container } = render(<AnimatedBannerBackground slides={[]} />);
    expect(container.firstChild).toHaveClass('absolute inset-0 bg-background z-0');
  });

  it('renders an Image component for each slide', () => {
    render(<AnimatedBannerBackground slides={mockSlides} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockSlides.length);
    expect(images[0]).toHaveAttribute('src', '/image1.jpg');
    expect(images[1]).toHaveAttribute('src', '/image2.jpg');
  });

  it('cycles through slides based on animationDuration', () => {
    render(<AnimatedBannerBackground slides={mockSlides} />);
    const images = screen.getAllByRole('img');

    // Initially, the first slide should be active (opacity-100)
    expect(images[0]).toHaveClass('opacity-100');
    expect(images[1]).toHaveClass('opacity-0');

    // Advance timers by the duration of the first slide (5 seconds)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Now the second slide should be active
    expect(images[0]).toHaveClass('opacity-0');
    expect(images[1]).toHaveClass('opacity-100');

    // Advance timers by the duration of the second slide (10 seconds)
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Back to the first slide
    expect(images[0]).toHaveClass('opacity-100');
    expect(images[1]).toHaveClass('opacity-0');
  });

  it('applies parallax scroll effect', () => {
    const { container } = render(<AnimatedBannerBackground slides={mockSlides} />);

    const divWithParallax = container.firstChild as HTMLDivElement;

    // Trigger scroll event
    // window.scrollY is read-only, but we can override it using defineProperty
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      writable: true
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // wait for requestAnimationFrame mocked callback execution
    // which modifies the inline style
    expect(divWithParallax.style.transform).toBe('translateY(50px)');
  });

});
