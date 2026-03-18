'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Pixel IDs
const PIXEL_1 = '1670410903956553';
const PIXEL_2 = '3148215738696597';

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

export default function FacebookPixelEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.fbq !== 'function') return;

    const path = pathname.toLowerCase();

    if (path === '/moving-calculator' || path === '/check-availability') {
      // ViewContent fires to both pixels (engagement tracking)
      window.fbq('track', 'ViewContent');
    } else if (path === '/success') {
      // Lead fires to specific pixel based on ad source
      const fbSource = sessionStorage.getItem('fb_source');
      
      if (fbSource === '1') {
        window.fbq('trackSingle', PIXEL_1, 'Lead');
      } else if (fbSource === '2') {
        window.fbq('trackSingle', PIXEL_2, 'Lead');
      } else {
        // No source param — fire to both (fallback for organic/direct traffic)
        window.fbq('track', 'Lead');
      }
    }
  }, [pathname]);

  return null;
}
