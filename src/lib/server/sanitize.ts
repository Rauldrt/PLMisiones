import DOMPurify from 'isomorphic-dompurify';

DOMPurify.removeAllHooks();
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src');
        if (!src) return;

        try {
            // Using new URL(src) without a base URL automatically throws for relative URLs
            const url = new URL(src);
            const hostname = url.hostname;

            const isWhitelisted =
                hostname === 'youtube.com' || hostname.endsWith('.youtube.com') ||
                hostname === 'youtu.be' || hostname.endsWith('.youtu.be') ||
                hostname === 'vimeo.com' || hostname.endsWith('.vimeo.com') ||
                hostname === 'google.com' || hostname.endsWith('.google.com') ||
                hostname === 'datawrapper.dwcdn.net' || hostname.endsWith('.datawrapper.dwcdn.net');

            if (!isWhitelisted) {
                element.removeAttribute('src');
                element.parentNode?.removeChild(element);
            }
        } catch (e) {
            // Invalid URL (including relative ones)
            element.removeAttribute('src');
            element.parentNode?.removeChild(element);
        }
    }
});

export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
