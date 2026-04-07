import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatawrapperMap } from '../DatawrapperMap';

describe('DatawrapperMap', () => {
    it('renders an iframe with the given src and title', () => {
        render(<DatawrapperMap src="https://datawrapper.dwcdn.net/example/1/" title="Test Map" />);
        const iframe = screen.getByTitle('Test Map');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://datawrapper.dwcdn.net/example/1/');
        expect(iframe).toHaveAttribute('aria-label', 'Mapa coroplético');
    });

    it('does not render if src is missing', () => {
        const { container } = render(<DatawrapperMap src="" title="Test Map" />);
        expect(container.firstChild).toBeNull();
    });

    it('uses a fallback title if title is missing', () => {
        render(<DatawrapperMap src="https://datawrapper.dwcdn.net/example/1/" title="" />);
        const iframe = screen.getByTitle('Mapa interactivo');
        expect(iframe).toBeInTheDocument();
    });

    it('updates iframe height on valid postMessage', () => {
        render(<DatawrapperMap src="https://datawrapper.dwcdn.net/example/1/" title="Test Map" />);
        const iframe = screen.getByTitle('Test Map');

        // Mock the initial height to ensure it changes
        expect(iframe).toHaveStyle({ height: '627px' });

        // Simulate a message event that matches what Datawrapper sends
        const event = new MessageEvent('message', {
            data: {
                'datawrapper-height': {
                    'example': 800
                }
            },
            source: (iframe as HTMLIFrameElement).contentWindow
        });

        window.dispatchEvent(event);

        expect(iframe).toHaveStyle({ height: '800px' });
    });

    it('ignores invalid or null postMessages gracefully without throwing', () => {
        render(<DatawrapperMap src="https://datawrapper.dwcdn.net/example/1/" title="Test Map" />);
        const iframe = screen.getByTitle('Test Map');

        // Start height
        expect(iframe).toHaveStyle({ height: '627px' });

        // Simulate null data
        const eventNull = new MessageEvent('message', {
            data: null,
            source: (iframe as HTMLIFrameElement).contentWindow
        });
        window.dispatchEvent(eventNull);

        // Simulate string data
        const eventString = new MessageEvent('message', {
            data: "some random string message",
            source: (iframe as HTMLIFrameElement).contentWindow
        });
        window.dispatchEvent(eventString);

        // Simulate wrong source
        const eventWrongSource = new MessageEvent('message', {
            data: {
                'datawrapper-height': {
                    'example': 900
                }
            },
            source: null // Wrong source
        });
        window.dispatchEvent(eventWrongSource);

        // Height should remain unchanged
        expect(iframe).toHaveStyle({ height: '627px' });
    });
});
