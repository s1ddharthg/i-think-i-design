'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

const links = [
  { href: '/ui-ux', label: 'UI/UX', shortLabel: 'UI/UX' },
  { href: '/graphic-design', label: 'Graphic Design', shortLabel: 'Design' },
];

const CTA = { href: '/contact', label: 'Work with me', shortLabel: 'Contact' };

export default function Nav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        initial={reduceMotion ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-0.5 rounded-2xl border border-white/10 bg-black/50 p-1.5 backdrop-blur-xl sm:gap-1"
      >
        <Link
          href="/"
          className="rounded-xl px-2.5 py-1.5 text-xs font-semibold tracking-tight text-white transition-colors hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm"
        >
          SG
        </Link>
        {links.map((link) => {
          const active = pathname === link.href;
          const showCapsule = hovered ? hovered === link.href : active;
          return (
            <div key={link.href} className="relative" onMouseEnter={() => setHovered(link.href)}>
              {showCapsule && (
                <motion.div
                  layoutId="nav-capsule"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={
                    reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                  }
                />
              )}
              <Link
                href={link.href}
                className="relative z-10 block rounded-xl px-2.5 py-1.5 text-xs whitespace-nowrap text-white/70 transition-colors hover:text-white sm:px-4 sm:py-2 sm:text-sm"
              >
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            </div>
          );
        })}

        {/* Primary CTA — the one splash of accent in the whole nav. */}
        <Link
          href={CTA.href}
          className="ml-0.5 rounded-xl bg-accent px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-accent-ink transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.97] motion-reduce:active:scale-100 sm:px-4 sm:py-2 sm:text-sm"
          style={{ color: 'var(--accent-ink)', backgroundColor: 'var(--accent)' }}
        >
          <span className="sm:hidden">{CTA.shortLabel}</span>
          <span className="hidden sm:inline">{CTA.label}</span>
        </Link>
      </motion.div>
    </nav>
  );
}
