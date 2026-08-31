import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src') || '';
        const isAllowed =
            src.startsWith('https://www.youtube.com/') ||
            src.startsWith('https://player.vimeo.com/') ||
            src.startsWith('https://www.google.com/maps/') ||
            src.startsWith('https://datawrapper.dwcdn.net/');

        if (!isAllowed) {
            node.parentNode?.removeChild(node);
        }
    }
});

export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote', 'svg', 'path', 'g', 'script'],
        ADD_ATTR: [
            'allow',
            'allowfullscreen',
            'frameborder',
            'scrolling',
            'src',
            'target',
            'style',
            'class',
            'data-instgrm-permalink',
            'data-instgrm-version',
            'data-instgrm-captioned',
            'xmlns',
            'viewBox',
            'version',
            'fill',
            'fill-rule',
            'stroke',
            'stroke-width',
        ],
        ALLOW_DATA_ATTR: true,
    });
}

