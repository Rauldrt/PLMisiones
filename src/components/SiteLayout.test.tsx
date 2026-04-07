import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SiteLayout } from './SiteLayout'
import { usePathname } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// Mock Header and Footer components
vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}))

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Mock Footer</div>,
}))

describe('SiteLayout', () => {
  const mockProps = {
    children: <div data-testid="main-content">Main Content</div>,
    footerContent: {} as any,
    socialLinks: [],
    contactForm: {} as any,
  }

  it('renders standard layout (Header, Main, Footer) on non-admin routes', () => {
    vi.mocked(usePathname).mockReturnValue('/')

    render(<SiteLayout {...mockProps} />)

    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument()
  })

  it('renders only main content on /admin routes', () => {
    vi.mocked(usePathname).mockReturnValue('/admin/dashboard')

    render(<SiteLayout {...mockProps} />)

    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument()
  })

  it('renders only main content on /login route', () => {
    vi.mocked(usePathname).mockReturnValue('/login')

    render(<SiteLayout {...mockProps} />)

    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument()
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument()
  })
})
