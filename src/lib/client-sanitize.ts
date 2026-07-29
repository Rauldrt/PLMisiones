import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src') || '';
        try {
            const url = new URL(src);
            const hostname = url.hostname;
            const isAllowed =
                hostname === 'youtube.com' || hostname.endsWith('.youtube.com') ||
                hostname === 'vimeo.com' || hostname.endsWith('.vimeo.com') ||
                hostname === 'google.com' || hostname.endsWith('.google.com') ||
                hostname === 'datawrapper.dwcdn.net' || hostname.endsWith('.datawrapper.dwcdn.net');

            if (!isAllowed) {
                element.parentNode?.removeChild(node);
            }
        } catch (e) {
            // URL constructor throws if src is relative or invalid, so we remove the node
            element.parentNode?.removeChild(node);
        }
    }
});

export function clientSanitize(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
