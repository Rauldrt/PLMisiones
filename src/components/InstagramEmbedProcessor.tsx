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
    
    // ⚡ Bolt: Use MutationObserver instead of setInterval to avoid polling the DOM and blocking the main thread
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          if (document.querySelector('.instagram-media:not(.instagram-media-rendered)')) {
            processInstagram();
            break; // Stop checking other mutations once we process
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();

  }, []);

  return null; // This component does not render anything itself.
}
