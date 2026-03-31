import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src');
        if (!src) {
            element.remove();
            return;
        }

        try {
            const parsedUrl = new URL(src);
            const hostname = parsedUrl.hostname;
            const isAllowed =
                hostname === 'www.youtube.com' ||
                hostname === 'youtube.com' ||
                hostname === 'player.vimeo.com' ||
                hostname === 'www.google.com' || // For Google Maps
                hostname === 'datawrapper.dwcdn.net';

            if (!isAllowed) {
                element.remove();
            }
        } catch (e) {
            // Invalid URL (or relative URL which we want to block for iframes here)
            element.remove();
        }
    }
});

export function clientSanitize(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
