'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';
import AboutPhoto from './AboutPhoto';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// The three things on this page only Sid can supply. Everything else is
// written; these are left as data so filling them in is a one-line edit.
// ---------------------------------------------------------------------------

// Drop files into /public/images/about/ and set the paths here. Until then
// each slot renders a framed placeholder at its final aspect ratio.
const PHOTOS = {
  one: undefined as string | undefined, // e.g. '/images/about/portrait.jpg'
  two: undefined as string | undefined,
  three: undefined as string | undefined,
};

// EDIT ME — the level and position, in your own words. Anything specific
// beats anything general here; "left back, state league" reads as true in a
// way "played competitively" never will.
const FOOTBALL_DETAIL = 'competitively, and have for about as long as I have designed';

// EDIT ME — three or four artists you would actually name out loud.
const ARTISTS = ['—', '—', '—'];

const DISCIPLINES = [
  'UI/UX design',
  'Web & landing pages',
  'SaaS & dashboards',
  'Mobile apps',
  'Wireframing & prototyping',
  'User research',
  'Interaction design',
  'Visual design',
  'Branding',
  'Design systems',
  'Responsive design',
];

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
              I&apos;m Sid, and I am{' '}
              <span className="italic" style={{ color: 'var(--accent)' }}>
                extremely nosy
              </span>{' '}
              about why people do what they do.
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/70">
              That is the whole job, really. Watch someone hesitate over a
              button, work out what they were bracing for, and take the reason
              away. Everything else — the type, the grid, the motion — is in
              service of that one moment going smoothly.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              I work across design, technology and product. Good design is not
              decoration on top of a product; it is the part that decides
              whether the product is worth anyone&apos;s afternoon.
            </p>
          </section>

          {/* ---------------------------------------------------------------
              Photo 1 — wide, sets the register before the work talk
          --------------------------------------------------------------- */}
          <AboutPhoto
            src={PHOTOS.one}
            alt="Sid"
            caption="Photo 1"
            ratio="16 / 10"
            sizes="(max-width: 1100px) 100vw, 1100px"
            priority
            className="reveal mt-24"
          />

          {/* ---------------------------------------------------------------
              What I do
          --------------------------------------------------------------- */}
          <section className="reveal mt-28 grid gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-20">
            <div>
              <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-tight">
                What I actually do
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Interfaces, mostly. Startup sites, landing pages that have to
                convert, e-commerce flows, SaaS products, dashboards dense
                enough to be genuinely hard. I live in Figma, from the first
                scrappy wireframe through research, prototyping and the design
                system that keeps it all from drifting six months later.
              </p>
              <p className="mt-6 text-base leading-relaxed text-white/70">
                The part I care about is the journey — whether someone can get
                where they were going without being clever. Usability and
                engagement are the honest measures of that, and they happen to
                be what the business wants too.
              </p>
            </div>

            {/* Skills, deliberately quiet — a scannable column, not a tag
                cloud. Recruiters need the keywords; the page does not need
                to shout them. */}
            <ul className="flex flex-col gap-0 self-start">
              {DISCIPLINES.map((d) => (
                <li
                  key={d}
                  className="border-b border-white/10 py-3 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white"
                >
                  {d}
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------------------------------------------------------
              Off the clock
          --------------------------------------------------------------- */}
          <section className="reveal mt-32">
            <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-semibold tracking-tight">
              Off the clock
            </h2>

            <div className="mt-12 grid gap-12 sm:grid-cols-3 sm:gap-10">
              <div>
                <span
                  className="text-xs tracking-[0.24em] uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  Football
                </span>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  I play football {FOOTBALL_DETAIL}. Eleven people solving one problem in
                  real time, with no time to explain yourself — it has taught me
                  more about working with a team than any process doc ever has.
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
                  Something is always playing while I work.{' '}
                  {ARTISTS.filter((a) => a && a !== '—').length
                    ? `${ARTISTS.slice(0, -1).join(', ')} and ${ARTISTS[ARTISTS.length - 1]} do a lot of the heavy lifting.`
                    : 'The playlist swings hard depending on whether I am exploring or executing.'}{' '}
                  There is a whole toggle for it in the corner of this site, if
                  you want the exact mood.
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
                  Full sneakerhead, and not sorry about it. It is the same
                  instinct as the day job: someone agonised over that midsole
                  stitch, and I want to know why they chose it.
                </p>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------------------------
              Photos 2 and 3 — offset pair, deliberately unequal
          --------------------------------------------------------------- */}
          <section className="reveal mt-28 grid gap-6 sm:grid-cols-12 sm:gap-8">
            <AboutPhoto
              src={PHOTOS.two}
              alt="Sid, off the clock"
              caption="Photo 2"
              ratio="4 / 5"
              sizes="(max-width: 640px) 100vw, 58vw"
              className="sm:col-span-7"
            />
            <AboutPhoto
              src={PHOTOS.three}
              alt="Sid, off the clock"
              caption="Photo 3"
              ratio="1 / 1"
              sizes="(max-width: 640px) 100vw, 38vw"
              className="sm:col-span-5 sm:mt-24"
            />
          </section>

          {/* ---------------------------------------------------------------
              Close
          --------------------------------------------------------------- */}
          <section className="reveal mt-32 border-t border-white/10 pt-16">
            <p className="max-w-2xl text-[clamp(1.4rem,3vw,2.25rem)] leading-snug font-medium tracking-tight text-white/90">
              If any of that sounds like the kind of person you want on the
              other side of the problem —
            </p>
            <Link
              href="/contact"
              className="group mt-10 inline-flex w-fit items-center gap-4 rounded-full px-8 py-4 text-sm font-semibold transition-[transform,filter] duration-200 hover:brightness-110 active:scale-[0.97] motion-reduce:active:scale-100"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-ink)' }}
            >
              Say hello
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/15 transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </Link>
          </section>
        </div>
      </main>
      <Footer hideCta />
    </>
  );
}
