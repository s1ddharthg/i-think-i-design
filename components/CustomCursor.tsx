'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

type Mode = 'default' | 'link' | 'arrow' | 'send';

function modeFor(el: Element | null): Mode {
  if (!el) return 'default';
  if (el.closest('[data-cursor="send"], button[type="submit"]')) return 'send';
  if (el.closest('a[href^="/work/"], [data-cursor="arrow"]')) return 'arrow';
  if (el.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="link"]'))
    return 'link';
  return 'default';
}

function onLightSurface(el: Element | null): boolean {
  return !!el?.closest('[data-cursor-surface="light"]');
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [light, setLight] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element;
      setMode(modeFor(target));
      setLight(onLightSurface(target));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  const isPill = mode === 'arrow' || mode === 'send';
  const size = mode === 'default' ? 14 : mode === 'link' ? 46 : 58;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        animate={{
          width: isPill ? 64 : size,
          height: isPill ? 64 : size,
          backgroundColor:
            mode === 'arrow' || mode === 'send'
              ? 'var(--accent)'
              : mode === 'link'
                ? light
                  ? 'rgba(0,0,0,0.14)'
                  : 'rgba(255,255,255,0.10)'
                : 'rgba(255,255,255,0)',
          borderColor:
            mode === 'default' || mode === 'link'
              ? light
                ? 'rgba(0,0,0,0.55)'
                : 'rgba(255,255,255,0.7)'
              : 'rgba(255,211,78,0)',
          borderWidth: mode === 'default' || mode === 'link' ? 1.5 : 0,
          scale: down ? 0.82 : 1,
          x: '-50%',
          y: '-50%',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.5 }}
        style={{ borderStyle: 'solid' }}
      >
        <AnimatePresence mode="wait">
          {mode === 'arrow' && (
            <motion.svg
              key="arrow"
              initial={{ opacity: 0, rotate: -35, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent-ink)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7" />
              <path d="M8 7h9v9" />
            </motion.svg>
          )}
          {mode === 'send' && (
            <motion.span
              key="send"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="text-[11px] font-semibold uppercase tracking-wide text-accent-ink"
              style={{ color: 'var(--accent-ink)' }}
            >
              Send
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* faint trailing glow — kept subtle so the ring stays crisp */}
      <div
        className="absolute -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(255,211,78,0.05) 0%, transparent 70%)' }}
      />
    </motion.div>
  );
}
