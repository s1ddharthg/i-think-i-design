'use client';

import { useEffect, useState } from 'react';

// Tracks document scroll as a 0..1 fraction, driven by native scroll events
// so it stays correct whether Lenis, native scroll, or reduced-motion
// instant-jump scrolling is active — it reads the resulting position, not
// the mechanism that produced it.
export function useScrollFraction(): number {
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setFraction(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return fraction;
}
