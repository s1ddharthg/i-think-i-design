'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useScrollFraction } from '@/lib/useScrollFraction';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// A flat-illustration character climbing a rope fixed to the right edge of
// the viewport. Its position is the scroll fraction itself — the rope above
// it is "traveled," the rope below is "remaining" — so it doubles as the
// site's scroll-progress indicator instead of needing a separate bar.
export default function RopeClimber() {
  const fraction = useScrollFraction();
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState(false);

  const say = () => {
    setGreeting(true);
    window.setTimeout(() => setGreeting(false), 1600);
  };

  return (
    <div className="pointer-events-none fixed right-3 top-0 z-40 hidden h-full w-10 sm:right-5 sm:block md:right-8">
      {/* The rope itself */}
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />

      <motion.button
        type="button"
        aria-label="Say hi"
        onClick={say}
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        animate={{ top: `${fraction * 100}%` }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence>
          {greeting && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute -left-14 -top-2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-black"
            >
              Hi!
            </motion.span>
          )}
        </AnimatePresence>

        {/* Character: white t-shirt, red sneakers, headphones — flat line-icon style */}
        <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
          {/* head */}
          <circle cx="13" cy="6" r="5" fill="#f2c9a0" />
          {/* headphones */}
          <path d="M6 6a7 7 0 0 1 14 0" stroke="#111" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="4.5" y="5" width="3" height="5" rx="1.4" fill="#111" />
          <rect x="18.5" y="5" width="3" height="5" rx="1.4" fill="#111" />
          {/* t-shirt */}
          <path d="M7 12 L13 15 L19 12 L23 16 L19.5 19 L18 17.5 V29 H8 V17.5 L6.5 19 L3 16 Z" fill="#ffffff" stroke="#111" strokeWidth="1" />
          {/* legs */}
          <rect x="9" y="27" width="3" height="6" fill="#2b2b2b" />
          <rect x="14" y="27" width="3" height="6" fill="#2b2b2b" />
          {/* red sneakers */}
          <rect x="8" y="32" width="5.5" height="2.4" rx="1" fill="#e3342f" />
          <rect x="13.5" y="32" width="5.5" height="2.4" rx="1" fill="#e3342f" />
        </svg>
      </motion.button>
    </div>
  );
}
