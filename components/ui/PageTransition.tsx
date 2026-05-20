'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Reset exiting state when route successfully changes
    setIsExiting(false);
  }, [pathname]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');
      const hasDownload = anchor.hasAttribute('download');

      const isRelative = href && href.startsWith('/') && !href.startsWith('//');
      const isHash = href && (href.startsWith('#') || href.includes('#'));

      if (
        href &&
        isRelative &&
        !isHash &&
        !hasDownload &&
        (!targetAttr || targetAttr === '_self') &&
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // Prevent looping/stuck transitions when navigating to the active route
        const targetFullPath = href.split('#')[0];
        const currentFullPath = window.location.pathname + window.location.search;

        if (targetFullPath === currentFullPath) {
          return;
        }

        e.preventDefault();
        setIsExiting(true);

        setTimeout(() => {
          router.push(href);
        }, 250); // Matches the pageFadeOut animation duration (250ms)
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [router]);

  return (
    <div
      key={pathname}
      className={isExiting ? 'animate-page-fade-out pointer-events-none' : 'animate-page-fade-in'}
    >
      {children}
    </div>
  );
}
