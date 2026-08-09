'use client';

import { useEffect } from 'react';

// This is a client component that will handle the Instagram embed script processing.
// It can be included in any page that might display Instagram embeds.

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export function InstagramEmbedProcessor() {
  useEffect(() => {
    const processInstagram = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // Check if the Instagram embed script is already on the page.
    const script = document.querySelector('script[src="//www.instagram.com/embed.js"]');
    
    // The script might already be loaded from the HTML content, or we might need to load it.
    if (window.instgrm) {
        processInstagram();
    } else if (!script) {
      const newScript = document.createElement('script');
      newScript.async = true;
      newScript.src = '//www.instagram.com/embed.js';
      newScript.onload = processInstagram;
      document.body.appendChild(newScript);
    }
    
    // ⚡ Bolt: Replace setInterval polling with a MutationObserver to avoid continuous CPU usage
    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver((mutations) => {
      let hasNewInstagramEmbed = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement) {
              if (
                node.classList.contains('instagram-media') ||
                node.querySelector('.instagram-media:not(.instagram-media-rendered)')
              ) {
                hasNewInstagramEmbed = true;
                break;
              }
            }
          }
        }
        if (hasNewInstagramEmbed) break;
      }

      if (hasNewInstagramEmbed) {
        // Debounce the processing to avoid multiple calls if multiple embeds are injected rapidly
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          processInstagram();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };

  }, []);

  return null; // This component does not render anything itself.
}
