'use client';

import { useEffect } from 'react';

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
      // Fix any blockquotes that might have lost their data-instgrm-permalink attribute
      const blockquotes = document.querySelectorAll<HTMLElement>('blockquote.instagram-media');
      blockquotes.forEach((bq) => {
        if (!bq.getAttribute('data-instgrm-permalink')) {
          const anchor = bq.querySelector<HTMLAnchorElement>('a[href*="instagram.com/"]');
          if (anchor && anchor.href) {
            bq.setAttribute('data-instgrm-permalink', anchor.href);
          }
        }
        if (!bq.getAttribute('data-instgrm-version')) {
          bq.setAttribute('data-instgrm-version', '14');
        }
      });

      if (window.instgrm) {
        try {
          window.instgrm.Embeds.process();
        } catch (e) {
          console.warn('Instagram Embeds processing error:', e);
        }
      }
    };

    const loadScript = () => {
      if (window.instgrm) {
        processInstagram();
        return;
      }

      const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]') as HTMLScriptElement;
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://www.instagram.com/embed.js';
        script.onload = () => {
          setTimeout(processInstagram, 100);
        };
        document.body.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => {
          setTimeout(processInstagram, 100);
        });
      }
    };

    loadScript();

    // Observe DOM additions (e.g. Opening dialogs, popovers, navigation)
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement) {
              if (
                node.classList?.contains('instagram-media') ||
                node.querySelector?.('.instagram-media') ||
                node.getAttribute?.('role') === 'dialog'
              ) {
                shouldProcess = true;
                break;
              }
            }
          }
        }
        if (shouldProcess) break;
      }

      if (shouldProcess) {
        loadScript();
        setTimeout(processInstagram, 200);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback interval to catch any unprocessed media
    const interval = setInterval(() => {
      const unprocessed = document.querySelectorAll('.instagram-media:not(.instagram-media-rendered)');
      if (unprocessed.length > 0) {
        processInstagram();
      }
    }, 1500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}

