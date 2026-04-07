import { render, screen } from '@testing-library/react';
import { SiteLayout } from '../SiteLayout';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Header and Footer components
jest.mock('@/components/Header', () => ({
  Header: ({ socialLinks }: any) => <header data-testid="mock-header">Header</header>,
}));

jest.mock('@/components/Footer', () => ({
  Footer: ({ footerContent, socialLinks, contactForm }: any) => <footer data-testid="mock-footer">Footer</footer>,
}));

describe('SiteLayout', () => {
  const mockProps = {
    children: <div data-testid="mock-children">Content</div>,
    footerContent: {} as any,
    socialLinks: [],
    contactForm: {} as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without Header and Footer on /admin route', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin');

    render(<SiteLayout {...mockProps} />);

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('renders without Header and Footer on /admin/dashboard route', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');

    render(<SiteLayout {...mockProps} />);

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('renders without Header and Footer on /login route', () => {
    (usePathname as jest.Mock).mockReturnValue('/login');

    render(<SiteLayout {...mockProps} />);

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('renders with Header and Footer on public routes', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<SiteLayout {...mockProps} />);

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});
