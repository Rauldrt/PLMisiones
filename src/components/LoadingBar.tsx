'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, visible]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      while (target && target.tagName !== 'A') {
        if (target.parentElement) {
          target = target.parentElement;
        } else {
          break;
        }
      }

      if (target && target.tagName === 'A') {
        const anchor = target as HTMLAnchorElement;
        const href = anchor.getAttribute('href');

        if (
          href &&
          href.startsWith('/') &&
          !href.startsWith('/#') &&
          anchor.target !== '_blank' &&
          !anchor.hasAttribute('download')
        ) {
          try {
            const targetUrl = new URL(anchor.href);
            const currentUrl = new URL(window.location.href);

            if (targetUrl.pathname !== currentUrl.pathname) {
              setVisible(true);
              setProgress(15);

              const t1 = setTimeout(() => setProgress(45), 100);
              const t2 = setTimeout(() => setProgress(75), 250);
              const t3 = setTimeout(() => setProgress(90), 500);

              return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
              };
            }
          } catch (e) {
            // Safe fallback if URL parsing fails
          }
        }
      }
    };

    window.addEventListener('click', handleLinkClick);
    return () => window.removeEventListener('click', handleLinkClick);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 h-0.5 z-[9999] bg-gradient-to-r from-primary via-purple-500 to-yellow-500 transition-all duration-300 ease-out pointer-events-none"
      style={{
        width: `${progress}%`,
      }}
    />
  );
}
