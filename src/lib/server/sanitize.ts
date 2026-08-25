import DOMPurify from 'isomorphic-dompurify';

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

