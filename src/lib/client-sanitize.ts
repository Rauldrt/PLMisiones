import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node: any, data: any) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src');
        if (!src) {
            element.remove();
            return;
        }
        try {
            // Intentionally throws for relative URLs
            const url = new URL(src);
            const hostname = url.hostname;

            const isWhitelisted =
                hostname === 'youtube.com' || hostname.endsWith('.youtube.com') ||
                hostname === 'vimeo.com' || hostname.endsWith('.vimeo.com') ||
                hostname === 'google.com' || hostname.endsWith('.google.com') ||
                hostname === 'datawrapper.dwcdn.net';

            if (!isWhitelisted) {
                element.remove();
            }
        } catch (e) {
            // Invalid or relative URL
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
