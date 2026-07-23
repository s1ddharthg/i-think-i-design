'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

const links = [
  { href: '/ui-ux', label: 'UI/UX' },
  { href: '/graphic-design', label: 'Graphic Design' },
];

const CTA = { href: '/contact', label: 'Work with me', shortLabel: 'Contact' };

export default function Nav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const projectsActive = links.some((l) => l.href === pathname);

  // Mobile "Projects" dropdown: close on an outside tap, same as any
  // standard menu (there's no hover to fall back on here).
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [menuOpen]);

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
          onClick={() => {
            if (pathname !== '/') return;
            const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0 });
          }}
          className="rounded-xl px-2.5 py-1.5 text-xs font-semibold tracking-tight text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-[0.97] motion-reduce:active:scale-100 sm:px-4 sm:py-2 sm:text-sm"
        >
          SG
        </Link>

        {/* Desktop: UI/UX and Graphic Design as their own capsule links. */}
        <div className="hidden sm:contents">
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
                  className="relative z-10 block rounded-xl px-4 py-2 text-sm whitespace-nowrap text-white/70 transition-[color,transform] duration-150 hover:text-white active:scale-[0.97] motion-reduce:active:scale-100"
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile: both project sections collapse into one "Projects" trigger,
            so the pill stays short enough to never run into the music toggle
            pinned top-right. */}
        <div ref={menuRef} className="relative sm:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs whitespace-nowrap transition-[color,background-color,transform] duration-150 active:scale-[0.97] motion-reduce:active:scale-100 ${
              projectsActive || menuOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Projects
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
            >
              <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 mt-2 min-w-[9.5rem] overflow-hidden rounded-xl border border-white/10 bg-black/90 p-1 backdrop-blur-xl"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-xs whitespace-nowrap transition-colors duration-150 ${
                    pathname === link.href ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </div>

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
