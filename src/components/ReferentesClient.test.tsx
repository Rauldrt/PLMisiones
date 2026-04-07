import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReferentesClient } from './ReferentesClient'
import type { Referente, MapEmbed } from '@/lib/types'

// Mock icons
vi.mock('@/components/icons', () => ({
  Icons: {
    Location: () => <div data-testid="location-icon" />
  }
}))

// Mock InteractiveMap
vi.mock('@/components/InteractiveMap', () => ({
  InteractiveMap: ({ map }: { map: MapEmbed }) => <div data-testid={`map-${map.id}`}>{map.title} map</div>
}))

const mockReferentes: Referente[] = [
  {
    id: '1',
    name: 'Juan Perez',
    role: 'Coordinador',
    locality: 'Posadas',
    bio: 'Biografía de Juan.',
    imageUrl: '/juan.jpg'
  },
  {
    id: '2',
    name: 'Maria Gomez',
    role: 'Referente',
    locality: 'Oberá',
    bio: 'Biografía de Maria.',
    imageUrl: '/maria.jpg'
  }
]

const mockMaps: MapEmbed[] = [
  {
    id: 'm1',
    title: 'Mapa Provincial',
    url: 'https://example.com/map1'
  }
]

describe('ReferentesClient', () => {
    it('renders search input and initial state', () => {
        render(<ReferentesClient initialReferentes={mockReferentes} initialMaps={mockMaps} />)
        expect(screen.getByPlaceholderText('Buscá por nombre o localidad...')).toBeInTheDocument()
        expect(screen.getByText('Ingresá un nombre o localidad para encontrar un referente.')).toBeInTheDocument()

        // Maps should always be visible
        expect(screen.getByText('Mapa Provincial')).toBeInTheDocument()
        expect(screen.getByTestId('map-m1')).toBeInTheDocument()
    })

    it('filters referentes by name', async () => {
        render(<ReferentesClient initialReferentes={mockReferentes} initialMaps={mockMaps} />)
        const input = screen.getByPlaceholderText('Buscá por nombre o localidad...')

        await userEvent.type(input, 'juan')

        expect(screen.getByText('Juan Perez')).toBeInTheDocument()
        expect(screen.getByText('Coordinador')).toBeInTheDocument()
        expect(screen.getByText('Posadas')).toBeInTheDocument()
        expect(screen.queryByText('Maria Gomez')).not.toBeInTheDocument()
    })

    it('filters referentes by locality', async () => {
        render(<ReferentesClient initialReferentes={mockReferentes} initialMaps={mockMaps} />)
        const input = screen.getByPlaceholderText('Buscá por nombre o localidad...')

        await userEvent.type(input, 'oberá')

        expect(screen.getByText('Maria Gomez')).toBeInTheDocument()
        expect(screen.getByText('Referente')).toBeInTheDocument()
        expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument()
    })

    it('shows no results message when search matches nothing', async () => {
        render(<ReferentesClient initialReferentes={mockReferentes} initialMaps={mockMaps} />)
        const input = screen.getByPlaceholderText('Buscá por nombre o localidad...')

        await userEvent.type(input, 'xyz')

        expect(screen.getByText('No se encontraron referentes con ese criterio de búsqueda.')).toBeInTheDocument()
        expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument()
        expect(screen.queryByText('Maria Gomez')).not.toBeInTheDocument()
    })
})
