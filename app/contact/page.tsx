'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';

const EMAIL = 'hello@sid.design';
// Accent drawn from lib/projects.ts (#6C5CE7, FlowBank / Grove), lightened for contrast on black.
const ACCENT_GLOW = '#6C5CE7';
const ACCENT_TEXT = '#A79BFF';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

/** Oversized email CTA: each letter rolls up to a duplicate accent-colored copy on hover.
 *  Pure CSS transitions (transform only), staggered per letter via transition-delay.
 *  Reduced motion: roll disabled, falls back to an opacity hover. */
function RollingEmail() {
  return (
    <a
      href={`mailto:${EMAIL}`}
      aria-label={EMAIL}
      className="group block w-fit max-w-full whitespace-nowrap text-[clamp(2.4rem,9vw,8.5rem)] font-semibold leading-none tracking-tight text-white transition-opacity motion-reduce:hover:opacity-70"
    >
      <span aria-hidden className="flex">
        {EMAIL.split('').map((ch, i) => (
          <span key={i} className="relative inline-block h-[1.18em] overflow-hidden">
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              <span className="flex h-[1.18em] items-center">{ch}</span>
              <span className="flex h-[1.18em] items-center" style={{ color: ACCENT_TEXT }}>
                {ch}
              </span>
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  };
  const maskedLine = {
    hidden: { y: '110%' },
    show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <>
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-black px-6 pt-28 pb-24 text-white md:px-10">
        {/* Restrained accent bleed, palette from lib/projects.ts */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[45vh] left-1/2 h-[70vh] w-[95vw] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: ACCENT_GLOW, opacity: 0.13 }}
        />

        <motion.div
          className="relative mx-auto w-full max-w-[1400px]"
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <span className="block overflow-hidden">
            <motion.span
              variants={reduce ? undefined : maskedLine}
              className="block font-mono text-xs uppercase tracking-[0.3em] text-white/40"
            >
              Contact
            </motion.span>
          </span>

          <h1 className="mt-8 text-[clamp(2.8rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-tighter">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={reduce ? undefined : maskedLine} className="block">
                Have an idea
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={reduce ? undefined : maskedLine} className="block text-white/50">
                worth building?
              </motion.span>
            </span>
          </h1>

          <motion.div variants={reduce ? undefined : fadeUp} className="mt-14 md:mt-20">
            <RollingEmail />
          </motion.div>

          <motion.div
            variants={reduce ? undefined : fadeUp}
            className="mt-20 grid gap-14 border-t border-white/10 pt-12 md:mt-28 md:grid-cols-12 md:pt-16"
          >
            <div className="md:col-span-7">
              {sent ? (
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="max-w-md text-lg text-white/70"
                >
                  Thanks, your note is in.{' '}
                  <span style={{ color: ACCENT_TEXT }}>I&apos;ll get back to you soon.</span>
                </motion.p>
              ) : (
                <form
                  className="flex max-w-xl flex-col gap-10"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-sm text-white/50">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      required
                      className="border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-sm text-white/50">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      className="border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-sm text-white/50">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      className="resize-none border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-fit rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-black transition-[transform,background-color] duration-200 hover:bg-white/90 active:scale-[0.97] motion-reduce:active:scale-100"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>

            <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9">
              <span className="text-sm text-white/40">Elsewhere</span>
              {SOCIALS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="relative w-fit text-lg text-white/60 transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out hover:text-white hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
