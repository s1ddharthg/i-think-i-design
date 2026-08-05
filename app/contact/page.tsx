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

type Status = 'idle' | 'sent';

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
 *
 * Neither control paints its own text. A native <input>/<select> clips
 * descenders (g, y, p) against its own box no matter what line-height is set
 * on it, because the browser lays that text out with internal metrics the
 * element's own CSS doesn't reach. A plain span doesn't have that problem, so
 * a third layer draws the visible text; the control underneath stays only for
 * its caret, focus ring, and — on the selects — the native picker.
 */
function FieldShell({
  mirror,
  display,
  displayClassName = '',
  displayStyle,
  className = '',
  children,
}: {
  mirror: string;
  display: string;
  displayClassName?: string;
  displayStyle?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`relative inline-block max-w-full align-baseline ${className}`}>
      <span aria-hidden className="invisible px-1 whitespace-pre">
        {mirror || ' '}
      </span>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center whitespace-pre px-1 ${displayClassName}`}
        style={displayStyle}
      >
        {display}
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
    ].join('\n');
  }, [name, email, service, budget]);

  // No backend: the visitor's own mail client sends it, so there is nothing
  // here to fail or to need a spam filter (a honeypot only matters once
  // something is submitting on the visitor's behalf).
  const mailtoHref = useMemo(() => {
    const subject = `${name.trim() || 'New inquiry'} — ${service} — ${budget}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`;
  }, [name, service, budget, composed]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.location.href = mailtoHref;
    setStatus('sent');
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
  // one baseline no matter which control a word happens to be. Text and
  // placeholder are transparent — FieldShell's display layer paints what the
  // visitor sees — but the caret stays white so a text field still shows
  // where typing lands.
  const fieldBase =
    'absolute inset-0 w-full min-w-0 rounded-none border-b-2 bg-transparent px-1 text-left text-transparent caret-white placeholder:text-transparent transition-colors focus:outline-none';

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
                Your email client should be open with everything filled in.{' '}
                <span style={{ color: 'var(--accent)' }}>Just hit send.</span>
              </p>
              <p className="mt-6 text-white/60">
                Nothing arrived? {CONTACT_EMAIL} reaches me directly.
              </p>
            </motion.div>
          ) : (
            <motion.form
              variants={reduce ? undefined : fadeUp}
              onSubmit={onSubmit}
              className="mt-16 max-w-3xl border-t border-white/10 pt-12"
            >
              <p className="text-[clamp(1.45rem,3.9vw,2.9rem)] leading-[1.7] font-medium tracking-tight text-white/85">
                Hi Sid, I&apos;m{' '}
                <FieldShell
                  mirror={name || 'your name'}
                  display={name || 'your name'}
                  displayClassName={name ? 'text-white' : 'text-white/30'}
                >
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="your name"
                    aria-label="Your name"
                    autoComplete="name"
                    className={`${fieldBase} border-white/25 focus:border-[var(--accent)]`}
                  />
                </FieldShell>{' '}
                and I&apos;m after{' '}
                {/* A native <select>, restyled — not a hand-rolled listbox.
                    It keeps full keyboard and screen-reader behaviour for
                    free, and on a phone it opens the OS picker, which beats
                    anything a custom overlay would do at that size. */}
                <FieldShell
                  mirror={service}
                  display={service}
                  displayClassName="font-semibold"
                  displayStyle={{ color: 'var(--accent)' }}
                >
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    aria-label="What you are looking for"
                    className={`${fieldBase} cursor-pointer appearance-none border-[var(--accent)] font-semibold focus:border-white`}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-neutral-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </FieldShell>{' '}
                help. My budget is{' '}
                <FieldShell
                  mirror={budget}
                  display={budget}
                  displayClassName="font-semibold"
                  displayStyle={{ color: 'var(--accent)' }}
                >
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    aria-label="Your budget"
                    className={`${fieldBase} cursor-pointer appearance-none border-[var(--accent)] font-semibold focus:border-white`}
                  >
                    {BUDGETS.map((b) => (
                      <option key={b} value={b} className="bg-neutral-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                . Reach me at{' '}
                <FieldShell
                  mirror={email || 'you@company.com'}
                  display={email || 'you@company.com'}
                  displayClassName={email ? 'text-white' : 'text-white/30'}
                >
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-label="Your email address"
                    autoComplete="email"
                    className={`${fieldBase} border-white/25 focus:border-[var(--accent)]`}
                  />
                </FieldShell>
                .
              </p>

              <button
                type="submit"
                className="mt-14 w-fit rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-black transition-[transform,background-color] duration-200 hover:bg-white/90 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                Send it
              </button>
            </motion.form>
          )}
        </motion.div>
      </section>
      <Footer hideCta />
    </>
  );
}
