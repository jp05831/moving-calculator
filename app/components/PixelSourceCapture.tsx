'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PixelSourceCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fbSource = searchParams.get('fb');
    if (fbSource) {
      sessionStorage.setItem('fb_source', fbSource);
    }
  }, [searchParams]);

  return null;
}
