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
    
    // Re-run processing when navigation occurs, in case new embeds are loaded.
    // ⚡ Bolt: Replace setInterval with MutationObserver to avoid continuous main-thread blocking
    let frameId: number;
    const observer = new MutationObserver(() => {
      // Debounce using requestAnimationFrame to prevent multiple rapid executions within a single frame
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        if (document.querySelector('.instagram-media:not(.instagram-media-rendered)')) {
          processInstagram();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };

  }, []);

  return null; // This component does not render anything itself.
}
