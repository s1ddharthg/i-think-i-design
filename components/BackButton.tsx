'use client';

import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

// Fixed to the same vertical band as the nav pill, offset to the left edge
// instead of competing with it for center space — stays reachable the whole
// way down a case study instead of scrolling away with the breadcrumb.
// router.back() returns to wherever the visitor actually came from — the
// home page vortex if that's the entry point, or the category grid if they
// came from there — rather than a hardcoded destination.
export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className ?? 'fixed top-6 left-6 z-40'}
    >
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 py-2.5 pr-4 pl-2.5 text-sm text-white/70 backdrop-blur-xl transition-[color,transform] duration-150 hover:text-white active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-white/15">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </span>
        <span className="hidden sm:inline">Back</span>
      </button>
    </motion.div>
  );
}
