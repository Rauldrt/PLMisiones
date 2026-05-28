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
    
    // ⚡ Bolt: Replace setInterval with MutationObserver to avoid main-thread blocking
    // Re-run processing when new embeds are loaded via navigation or dynamic injection
    let debounceTimer: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver((mutations) => {
      // Check if any added node might be or contain an instagram-media element
      const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);

      if (hasAddedNodes) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (document.querySelector('.instagram-media:not(.instagram-media-rendered)')) {
            processInstagram();
          }
        }, 300); // Debounce to prevent layout thrashing
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
    };

  }, []);

  return null; // This component does not render anything itself.
}
