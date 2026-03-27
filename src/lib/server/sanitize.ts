import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src') || '';
        try {
            const url = new URL(src);
            let isAllowed = false;

            // Allow YouTube
            if (['youtube.com', 'www.youtube.com'].includes(url.hostname)) isAllowed = true;
            // Allow Vimeo
            if (['vimeo.com', 'player.vimeo.com'].includes(url.hostname)) isAllowed = true;
            // Allow Datawrapper
            if (url.hostname === 'datawrapper.dwcdn.net') isAllowed = true;
            // Allow Google Maps
            if (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps/')) isAllowed = true;

            if (!isAllowed) {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        } catch (e) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }
});

export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
