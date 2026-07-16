'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Site-wide cursor-follow glow. Spring-lagged so it trails the pointer with
 * weight instead of tracking 1:1. Skipped entirely on touch devices and for
 * prefers-reduced-motion users.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 90, damping: 18, mass: 0.5 });

  useEffect(() => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    // Deferred to an effect on purpose: matchMedia is unavailable during
    // SSR, so this stays false on the server and first client render, then
    // resolves post-mount — a lazy useState initializer would read window
    // during render and reintroduce a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40"
      style={{ x: sx, y: sy }}
    >
      <div
        className="h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(140,150,255,0.05) 35%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
