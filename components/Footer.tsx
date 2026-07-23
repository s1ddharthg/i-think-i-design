'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import RollingEmail from '@/components/RollingEmail';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SOCIALS = [
  { label: 'Behance', href: 'https://www.behance.net/s1ddharthg' },
  { label: 'Dribbble', href: 'https://dribbble.com/sid1087' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siddharth-g-276158260/' },
];

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'UI/UX', href: '/ui-ux' },
  { label: 'Graphic Design', href: '/graphic-design' },
  { label: 'Work with me', href: '/contact' },
];

const SERVICES = ['Product design', 'UI/UX', 'Brand identity', 'Web design', 'Design systems'];

// Magnetic accent button — the primary "work with me" call, pulled toward the cursor.
function MagneticCTA() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  return (
    <motion.div style={{ x: sx, y: sy }} className="mt-12 w-fit">
      <Link
        ref={ref}
        href="/contact"
        data-cursor="arrow"
        onPointerEnter={(e) => {
          if (reduce) return;
          // Measured once per hover, not per move: reading layout on every
          // pointermove while this same element's transform is animating
          // forces a synchronous style recalc each frame (Lighthouse's
          // "forced reflow" warning). The rect barely changes mid-hover.
          rectRef.current = e.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = rectRef.current ?? e.currentTarget.getBoundingClientRect();
          x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 22);
          y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 22);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="group relative flex items-center gap-4 overflow-hidden rounded-full px-9 py-4 text-sm font-semibold text-accent-ink"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }}
      >
        <span className="relative z-10">Start a project</span>
        <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-accent-ink/15 transition-transform duration-300 group-hover:translate-x-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" /><path d="M8 7h9v9" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}

export default function Footer({ hideCta = false }: { hideCta?: boolean }) {
  const reduce = useReducedMotion();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <footer
      className={`relative overflow-hidden border-t border-white/10 bg-black text-white ${
        hideCta ? 'px-6 pt-10 pb-10 md:px-10' : ''
      }`}
    >
      {!hideCta && (
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[40vh] left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full blur-[150px]"
          style={{ background: 'var(--accent)', opacity: 0.1 }}
        />
      )}

      <div className={hideCta ? '' : 'px-6 pt-24 pb-16 md:px-10 md:pt-32'}>
        <motion.div
          className="relative mx-auto flex w-full max-w-[1400px] flex-col items-start"
          variants={fadeUp}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-10%' }}
        >
          {!hideCta && (
            <>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
                  Open to work · 2026
                </span>
              </div>

              <h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-tighter text-white/95">
                Have an idea worth building?{' '}
                <span className="italic" style={{ color: 'var(--accent)' }}>
                  Let&apos;s talk.
                </span>
              </h2>

              {/* Interactive service chips — light up on hover. */}
              <div className="mt-10 flex flex-wrap gap-2.5" onMouseLeave={() => setHoveredService(null)}>
                {SERVICES.map((s) => {
                  const on = hoveredService === s;
                  return (
                    <button
                      key={s}
                      onMouseEnter={() => setHoveredService(s)}
                      className="rounded-full border px-4 py-2 text-sm transition-colors duration-200"
                      style={{
                        borderColor: on ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                        backgroundColor: on ? 'var(--accent)' : 'transparent',
                        color: on ? 'var(--accent-ink)' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-12">
                <RollingEmail />
              </div>

              <MagneticCTA />

              <div className="mt-24 grid w-full grid-cols-2 gap-10 border-t border-white/10 pt-10 sm:grid-cols-4">
                <div className="col-span-2">
                  <span className="text-sm font-semibold tracking-tight text-white">Sid</span>
                  <p className="mt-2 max-w-xs text-sm text-white/50">
                    UI/UX &amp; graphic designer. Based in India, working with clients everywhere.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">Site</span>
                  {QUICK_LINKS.map(({ label, href }) => (
                    <Link key={href} href={href} className="w-fit text-sm text-white/60 transition-colors hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">Elsewhere</span>
                  {SOCIALS.map(({ label, href }) => (
                    <a key={label} href={href} className="w-fit text-sm text-white/60 transition-colors hover:text-white">
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          <div
            className={`flex w-full flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between ${
              hideCta ? '' : 'mt-16'
            }`}
          >
            <span className="text-sm text-white/50">© {new Date().getFullYear()} Sid</span>
            {hideCta && (
              <div className="flex gap-6">
                {SOCIALS.map(({ label, href }) => (
                  <a key={label} href={href} className="text-sm text-white/50 transition-colors hover:text-white">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
