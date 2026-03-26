import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src');
        if (src) {
            try {
                // new URL(src) without a base URL intentionally throws an error for relative URLs,
                // automatically removing them.
                const url = new URL(src);
                const allowedDomains = [
                    'youtube.com', 'www.youtube.com',
                    'vimeo.com', 'www.vimeo.com',
                    'google.com', 'www.google.com',
                    'datawrapper.dwcdn.net'
                ];
                if (!allowedDomains.includes(url.hostname)) {
                    element.parentNode?.removeChild(element);
                }
            } catch (e) {
                element.parentNode?.removeChild(element);
            }
        }
    }
});

export function clientSanitize(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
