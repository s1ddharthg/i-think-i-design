'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// The bits only Sid can supply. Everything else is written; these stay as data
// so filling them in is a one-line edit.
// ---------------------------------------------------------------------------

// EDIT ME — the level and position, in your own words. Anything specific beats
// anything general here; "left back, state league" reads as true in a way
// "played competitively" never will.
const FOOTBALL_DETAIL = 'competitively, and have for about as long as I have designed';

// EDIT ME — three or four artists you would actually name out loud.
const ARTISTS = ['—', '—', '—'];

// EDIT ME — whatever you would have scrawled on the white strip.
const PHOTO_CAPTION = 'Tokyo';

export default function AboutContent() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    // Reduced-motion users get the page exactly as it renders — animations are
    // only ever registered inside this branch, so there is nothing to undo.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-lead > *', {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
      });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      // The polaroid lands rather than fades: the wrapper arrives rotated
      // further than it rests and unwinds to zero, which reads against the
      // figure's own static -2deg as the card settling like something dropped
      // on a desk.
      gsap.from('.polaroid', {
        opacity: 0,
        y: 60,
        rotate: -7,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.polaroid', start: 'top 85%' },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <main ref={rootRef} className="relative px-6 pt-36 pb-24 text-white md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[24vh] left-1/2 h-[52vh] w-[90vw] -translate-x-1/2 rounded-full blur-[150px]"
          style={{ background: 'var(--accent)', opacity: 0.1 }}
        />

        <div className="relative mx-auto w-full max-w-[1100px]">
          {/* ---------------------------------------------------------------
              Opening
          --------------------------------------------------------------- */}
          <section className="about-lead">
            <h1 className="max-w-4xl text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[0.98] font-semibold tracking-tighter">
              I&apos;m Sid. I want to know{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                why you clicked that one
              </span>{' '}
              and not the other.
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/70">
              Watch someone hesitate over a button. Work out what they were
              bracing for. Take the reason away. That is most of the job.
            </p>
          </section>

          {/* ---------------------------------------------------------------
              Fourth wall
          --------------------------------------------------------------- */}
          <section className="reveal mt-28 border-t border-white/10 pt-16 sm:mt-36">
            <p className="max-w-3xl text-[clamp(1.15rem,2.4vw,1.75rem)] leading-snug text-white/60">
              You&apos;re probably thinking, &ldquo;omg this page has no
              correlation to the entire website, such
            </p>
            <p
              className="-ml-[0.04em] mt-2 text-[clamp(2.6rem,11vw,8.5rem)] leading-[0.86] font-semibold tracking-tighter"
              style={{ color: 'var(--accent)' }}
            >
              lack of
              <br />
              consistency&rdquo;
            </p>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/70">
              But no. On purpose. This is about as close as I&apos;ll ever get
              to a personal vlog, and this corner of the internet is where I
              talk about myself.
            </p>
          </section>

          {/* ---------------------------------------------------------------
              The photo. One, and it gets to be an object rather than a slot.
          --------------------------------------------------------------- */}
          <section className="mt-24 flex justify-center sm:mt-32">
            {/* The wrapper is what GSAP animates; the tilt lives on the figure
                inside it as an inline style. Putting both on one element let
                the entrance tween overwrite the resting angle, and the card
                landed square. */}
            <div className="polaroid">
              {/* Fixed paddings, not percentages: percentage padding resolves
                  against the containing block's inline size, which here is the
                  full centred row rather than the card, so 5% would have been
                  ~55px of white on a 352px photo. */}
              <figure
                style={{ rotate: '-2deg' }}
                className="w-[22rem] max-w-[78vw] bg-[#f6f4ef] p-4 pb-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src="/images/about/sid.jpg"
                    alt="Sid, sitting on a wall below Tokyo Tower"
                    fill
                    sizes="(max-width: 640px) 78vw, 22rem"
                    priority
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-5 text-center font-mono text-[0.7rem] tracking-[0.28em] text-neutral-500 uppercase">
                  {PHOTO_CAPTION}
                </figcaption>
              </figure>
            </div>
          </section>

          {/* ---------------------------------------------------------------
              The work
          --------------------------------------------------------------- */}
          <section className="reveal mt-28 sm:mt-36">
            <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-tight">
              The work
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              Interfaces. Startup sites, landing pages carrying a conversion
              target, e-commerce checkouts, SaaS products, dashboards with far
              too much on screen at once. Figma from the first scrappy wireframe
              through to the design system that stops the whole thing drifting
              six months later.
            </p>
          </section>

          {/* ---------------------------------------------------------------
              Off the clock
          --------------------------------------------------------------- */}
          <section className="reveal mt-24">
            <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-tight">
              Off the clock
            </h2>

            <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-10">
              <div>
                <span
                  className="text-xs tracking-[0.24em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Football
                </span>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  I play football {FOOTBALL_DETAIL}. Eleven people solving one
                  problem with no time to explain themselves.
                </p>
              </div>

              <div>
                <span
                  className="text-xs tracking-[0.24em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Sound
                </span>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  Something plays the entire time I work.{' '}
                  {ARTISTS.filter((a) => a && a !== '—').length
                    ? `${ARTISTS.slice(0, -1).join(', ')} and ${ARTISTS[ARTISTS.length - 1]} carry most of it.`
                    : 'Hit the toggle in the corner for the mood.'}
                </p>
              </div>

              <div>
                <span
                  className="text-xs tracking-[0.24em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Sneakers
                </span>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  I collect sneakers. Somebody argued for weeks over that
                  midsole stitch and I want to know who won.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
      {/* The full footer already closes with "Have an idea worth building?"
          and the magnetic CTA, so this page does not repeat itself with a
          second call to action of its own. */}
      <Footer />
    </>
  );
}
