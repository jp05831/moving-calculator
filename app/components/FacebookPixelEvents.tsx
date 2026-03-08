'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

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
      window.fbq('track', 'ViewContent');
    } else if (path === '/success') {
      window.fbq('track', 'Lead');
    }
  }, [pathname]);

  return null;
}
