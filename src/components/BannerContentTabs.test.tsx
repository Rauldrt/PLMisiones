import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BannerContentTabs } from './BannerContentTabs'

// Mock matchMedia which Embla Carousel needs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock the resize observer which Embla carousel uses
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: any = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

describe('BannerContentTabs', () => {
  const mockCandidates = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Developer',
      imageUrl: '/test-image.jpg',
      bio: 'Test bio',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Designer',
      imageUrl: '/test-image2.jpg',
      bio: 'Test bio 2',
    },
  ]

  it('renders nothing when candidates array is empty', () => {
    const { container } = render(<BannerContentTabs candidates={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly with candidates', () => {
    render(<BannerContentTabs candidates={mockCandidates} />)
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Jane Smith')[0]).toBeInTheDocument()
  })

  it('opens expanded view when a candidate is clicked', async () => {
    render(<BannerContentTabs candidates={mockCandidates} />)

    // Find the wrapper div that has the click handler
    const firstCandidateCard = screen.getAllByText('John Doe')[0].closest('div[class*="group"]')
    expect(firstCandidateCard).toBeInTheDocument()

    // We need to click the wrapper that contains the card
    const cardWrapper = firstCandidateCard?.parentElement
    if (cardWrapper) {
      fireEvent.click(cardWrapper)
    }

    // Wait for the modal/expanded view to appear
    await waitFor(() => {
      // Look for the close button
      expect(screen.getByLabelText('Cerrar candidato')).toBeInTheDocument()
    })
  })

  it('closes expanded view when close button is clicked', async () => {
    render(<BannerContentTabs candidates={mockCandidates} />)

    // Open the expanded view
    const firstCandidateCard = screen.getAllByText('John Doe')[0].closest('div[class*="group"]')
    const cardWrapper = firstCandidateCard?.parentElement
    if (cardWrapper) {
      fireEvent.click(cardWrapper)
    }

    // Wait for the close button to appear and click it
    let closeButton: HTMLElement | null = null
    await waitFor(() => {
      closeButton = screen.getByLabelText('Cerrar candidato')
      expect(closeButton).toBeInTheDocument()
    })

    if (closeButton) {
      fireEvent.click(closeButton)
    }

    // After animation delay (500ms), the expanded view should be removed
    // We'll advance timers to skip the setTimeout
    await waitFor(() => {
      expect(screen.queryByLabelText('Cerrar candidato')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('closes expanded view when clicking outside the card', async () => {
    render(<BannerContentTabs candidates={mockCandidates} />)

    // Open the expanded view
    const firstCandidateCard = screen.getAllByText('John Doe')[0].closest('div[class*="group"]')
    const cardWrapper = firstCandidateCard?.parentElement
    if (cardWrapper) {
      fireEvent.click(cardWrapper)
    }

    await waitFor(() => {
      expect(screen.getByLabelText('Cerrar candidato')).toBeInTheDocument()
    })

    // Find the backdrop (fixed container with bg-black/80)
    const backdrop = screen.getByLabelText('Cerrar candidato').closest('.fixed')
    expect(backdrop).toBeInTheDocument()

    if (backdrop) {
      fireEvent.click(backdrop)
    }

    // Should close after animation
    await waitFor(() => {
      expect(screen.queryByLabelText('Cerrar candidato')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })
})
