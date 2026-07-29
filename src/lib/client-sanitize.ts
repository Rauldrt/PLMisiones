import DOMPurify from 'isomorphic-dompurify';


DOMPurify.removeAllHooks('uponSanitizeElement');
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
        const element = node as Element;
        const src = element.getAttribute('src') || '';
        try {
            const url = new URL(src);
            const allowedHostnames = [
                'youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com',
                'vimeo.com', 'player.vimeo.com',
                'google.com', 'www.google.com',
                'datawrapper.dwcdn.net'
            ];
            if (!allowedHostnames.includes(url.hostname)) {
                node.parentNode?.removeChild(node);
            }
        } catch (e) {
            // Invalid URL
            node.parentNode?.removeChild(node);
        }
    }
});

export function clientSanitize(html: string): string {
    return DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe', 'blockquote'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
    });
}
