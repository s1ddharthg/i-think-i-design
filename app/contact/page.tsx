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

// The old slider ran a log scale from $600 to $150k because a linear one
// crushed the low end. Rungs do the same job without asking a visitor to
// aim a slider at a number they have not decided on yet.
const BUDGETS = [
  'under $1k',
  '$1k – $5k',
  '$5k – $15k',
  '$15k – $50k',
  '$50k+',
  'still working it out',
];

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * An input that is exactly as wide as its own content.
 *
 * A mirror span holding the same text sets the width, and the real control is
 * absolutely positioned on top of it — no measuring, no resize listeners, no
 * font-metric guesswork, because the mirror inherits the same font as the
 * sentence it sits in. The mirror falls back to the placeholder so an empty
 * field still reserves room.
 *
 * The control has to be taken out of flow rather than sharing a grid cell with
 * the mirror: an <input> contributes its `size` attribute (20 characters by
 * default) to intrinsic width and a <select> contributes its longest option,
 * so either would have won the sizing and blown the field out to several times
 * the width of the text actually in it.
 */
function FieldShell({
  mirror,
  className = '',
  children,
}: {
  mirror: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`relative inline-block max-w-full align-baseline ${className}`}>
      <span aria-hidden className="invisible px-1 whitespace-pre">
        {mirror || ' '}
      </span>
      {children}
    </span>
  );
}

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGETS[2]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const reduce = useReducedMotion();

  // The mail body is the sentence the visitor actually composed, then the
  // same facts as a block — the sentence reads well in a phone notification,
  // the block is what you scan when you come back to it later.
  const composed = useMemo(() => {
    const who = name.trim() || 'Someone';
    return [
      `${who} is looking for ${service.toLowerCase()} help.`,
      `Budget: ${budget}. Reach them at ${email.trim()}.`,
      '',
      '—',
      `Name     ${name.trim()}`,
      `Email    ${email.trim()}`,
      `Service  ${service}`,
      `Budget   ${budget}`,
      '',
      `Sent from the contact form at designedbysid.work`,
    ].join('\n');
  }, [name, email, service, budget]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    // Honeypot: bots fill every field they find, humans never see this one.
    const form = e.currentTarget;
    if ((form.elements.namedItem('company') as HTMLInputElement | null)?.value) return;

    if (!ACCESS_KEY) {
      setStatus('error');
      setError(
        'The form is not connected yet. Email me directly and it will reach me just the same.'
      );
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `${name.trim() || 'New inquiry'} — ${service} — ${budget}`,
          from_name: name.trim(),
          email: email.trim(),
          message: composed,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');
      setStatus('sent');
    } catch {
      setStatus('error');
      setError('That did not go through. Try again, or email me directly.');
    }
  }

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

  // Shared between both text inputs and both selects, so the sentence keeps
  // one baseline no matter which control a word happens to be.
  const fieldBase =
    'absolute inset-0 w-full min-w-0 rounded-none border-b-2 bg-transparent px-1 text-left transition-colors focus:outline-none';

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
          <h1 className="text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] font-semibold tracking-tighter">
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
            Fill in the blanks. That is the whole form.
          </motion.p>

          {status === 'sent' ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-16 max-w-xl border-t border-white/10 pt-12"
            >
              <p className="text-[clamp(1.5rem,3.4vw,2.5rem)] leading-snug font-medium tracking-tight">
                Got it, {name.trim().split(' ')[0] || 'and thank you'}.{' '}
                <span style={{ color: 'var(--accent)' }}>I&apos;ll come back to you shortly.</span>
              </p>
              <p className="mt-6 text-white/60">
                If it is urgent, {CONTACT_EMAIL} reaches me faster.
              </p>
            </motion.div>
          ) : (
            <motion.form
              variants={reduce ? undefined : fadeUp}
              onSubmit={onSubmit}
              className="mt-16 max-w-3xl border-t border-white/10 pt-12"
            >
              {/* Honeypot. Hidden from sight and from assistive tech, so only
                  something crawling the DOM will ever fill it. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute h-0 w-0 opacity-0"
              />

              <p className="text-[clamp(1.45rem,3.9vw,2.9rem)] leading-[1.7] font-medium tracking-tight text-white/85">
                Hi Sid, I&apos;m{' '}
                <FieldShell mirror={name || 'your name'}>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    aria-label="Your name"
                    autoComplete="name"
                    className={`${fieldBase} border-white/25 text-white placeholder:text-white/30 focus:border-[var(--accent)]`}
                  />
                </FieldShell>{' '}
                and I&apos;m after{' '}
                {/* A native <select>, restyled — not a hand-rolled listbox.
                    It keeps full keyboard and screen-reader behaviour for
                    free, and on a phone it opens the OS picker, which beats
                    anything a custom overlay would do at that size. */}
                <FieldShell mirror={service}>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    aria-label="What you are looking for"
                    className={`${fieldBase} cursor-pointer appearance-none border-[var(--accent)] font-semibold focus:border-white`}
                    style={{ color: 'var(--accent)' }}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-neutral-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </FieldShell>{' '}
                help. My budget is{' '}
                <FieldShell mirror={budget}>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    aria-label="Your budget"
                    className={`${fieldBase} cursor-pointer appearance-none border-[var(--accent)] font-semibold focus:border-white`}
                    style={{ color: 'var(--accent)' }}
                  >
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-neutral-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                . Reach me at{' '}
                <FieldShell mirror={email || 'you@company.com'}>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-label="Your email address"
                    autoComplete="email"
                    className={`${fieldBase} border-white/25 text-white placeholder:text-white/30 focus:border-[var(--accent)]`}
                  />
                </FieldShell>
                .
              </p>

              <div className="mt-14 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-fit rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-black transition-[transform,background-color,opacity] duration-200 hover:bg-white/90 active:scale-[0.97] disabled:opacity-60 motion-reduce:active:scale-100"
                >
                  {status === 'sending' ? 'Sending…' : 'Send it'}
                </button>

                {status === 'error' && (
                  <p role="alert" className="max-w-sm text-sm text-white/70">
                    {error}{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="underline underline-offset-4"
                      style={{ color: 'var(--accent)' }}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </motion.div>
      </section>
      <Footer hideCta />
    </>
  );
}
