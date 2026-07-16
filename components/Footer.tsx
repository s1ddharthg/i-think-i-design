'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import RollingEmail from '@/components/RollingEmail';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ACCENT_GLOW = '#6C5CE7';

const SOCIALS = [
  { label: 'Behance', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'UI/UX', href: '/ui-ux' },
  { label: 'Graphic Design', href: '/graphic-design' },
  { label: 'Work with me', href: '/contact' },
];

const MARQUEE_ITEM = 'Available for new projects';

export default function Footer({ hideCta = false }: { hideCta?: boolean }) {
  const reduce = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <footer
      className={`relative overflow-hidden border-t border-white/10 bg-black text-white ${
        hideCta ? 'pt-10 pb-10 px-6 md:px-10' : ''
      }`}
    >
      {!hideCta && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[40vh] left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full blur-[140px]"
            style={{ background: ACCENT_GLOW, opacity: 0.14 }}
          />

          {/* Signature move: an infinite marquee ticker up top — the one loud
              gesture in an otherwise quiet footer. */}
          <div className="relative overflow-hidden border-b border-white/10 py-4">
            <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
              {Array.from({ length: 2 }).map((_, rep) => (
                <div key={rep} className="flex shrink-0 gap-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/30"
                    >
                      {MARQUEE_ITEM}
                      <span aria-hidden className="h-1 w-1 rounded-full bg-white/20" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={hideCta ? '' : 'px-6 pt-20 pb-16 md:px-10 md:pt-28'}>
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
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                  Work with me
                </span>
              </div>

              <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-tighter text-white/90">
                Have an idea worth building? Let&apos;s talk.
              </h2>

              <div className="mt-12">
                <RollingEmail />
              </div>

              <Link
                href="/contact"
                className="mt-12 w-fit rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-black transition-[transform,background-color] duration-200 hover:bg-white/90 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                Work with me
              </Link>

              <div className="mt-24 grid w-full grid-cols-2 gap-10 border-t border-white/10 pt-10 sm:grid-cols-4">
                <div className="col-span-2 sm:col-span-2">
                  <span className="text-sm font-semibold tracking-tight text-white">Sid</span>
                  <p className="mt-2 max-w-xs text-sm text-white/50">
                    UI/UX &amp; graphic designer. Based in India, working with clients everywhere.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">Site</span>
                  {QUICK_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="w-fit text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">Elsewhere</span>
                  {SOCIALS.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-fit text-sm text-white/60 transition-colors hover:text-white"
                    >
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
            <span className="text-sm text-white/40">© {new Date().getFullYear()} Sid</span>
            {hideCta && (
              <div className="flex gap-6">
                {SOCIALS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
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
