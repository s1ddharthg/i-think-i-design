'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';
import { CONTACT_EMAIL } from '@/components/RollingEmail';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SERVICES = [
  'Web design',
  'App design',
  'Marketing',
  'Media',
  'Posters',
  'Brochures',
  'Logo',
  'Frontend development',
];

const MIN_BUDGET = 600;
const MAX_BUDGET = 150000;

// Log-scale so the low end (where most inquiries land) isn't crushed into
// the first few pixels of a linear slider spanning $600 to $150k.
function sliderToBudget(t: number) {
  return MIN_BUDGET * Math.pow(MAX_BUDGET / MIN_BUDGET, t / 100);
}

function formatBudget(v: number) {
  if (v >= MAX_BUDGET - 1) return '$150k+';
  if (v >= 1000) return `$${Math.round(v / 100) / 10}k`;
  return `$${Math.round(v / 10) * 10}`;
}

export default function ContactPage() {
  const [services, setServices] = useState<string[]>([]);
  const [budgetSlider, setBudgetSlider] = useState(0);
  const budget = useMemo(() => sliderToBudget(budgetSlider), [budgetSlider]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();

  const toggleService = (s: string) =>
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const mailtoHref = useMemo(() => {
    const subject = `New project inquiry from ${name || 'a visitor'}`;
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Looking for: ${services.length ? services.join(', ') : '—'}`,
      `Budget: ${formatBudget(budget)}`,
      '',
      'Project:',
      message,
    ];
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [name, email, message, services, budget]);

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
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-black px-6 pt-32 pb-24 text-white md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[30vh] left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: 'var(--accent)', opacity: 0.13 }}
        />

        <motion.div
          className="relative mx-auto w-full max-w-[1100px]"
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <h1 className="text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-tighter">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={reduce ? undefined : maskedLine} className="block">
                Start the conversation
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={reduce ? undefined : fadeUp}
            className="mt-6 max-w-lg text-lg text-white/60"
          >
            Let&apos;s make something amazing together. Share your goals with me, and I&apos;ll
            help you turn them into reality.
          </motion.p>

          {sent ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-16 max-w-md text-lg text-white/70"
            >
              Your email client should be open with everything filled in —{' '}
              <span style={{ color: 'var(--accent)' }}>just hit send.</span>
            </motion.p>
          ) : (
            <motion.form
              variants={reduce ? undefined : fadeUp}
              className="mt-16 flex max-w-2xl flex-col gap-12 border-t border-white/10 pt-12"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailtoHref;
                setSent(true);
              }}
            >
              <div className="flex flex-col gap-4">
                <span className="text-sm text-white/50">What are you looking for?</span>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => {
                    const active = services.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
                          active
                            ? 'border-white bg-white text-black'
                            : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-sm text-white/50">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-sm text-white/50">
                    Work email address
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-sm text-white/50">
                  Tell us about your project
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none border-b border-white/20 bg-transparent py-3 text-lg text-white transition-colors focus:border-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/50">What&apos;s your budget?</span>
                  <span className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
                    {formatBudget(budget)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={budgetSlider}
                  onChange={(e) => setBudgetSlider(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-white"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>$600</span>
                  <span>$150k+</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-fit rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-black transition-[transform,background-color] duration-200 hover:bg-white/90 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                Send
              </button>
            </motion.form>
          )}
        </motion.div>
      </section>
      <Footer hideCta />
    </>
  );
}
