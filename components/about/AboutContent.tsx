'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';
import TravelMap from '@/components/about/TravelMap';
import GravityTrail from '@/components/about/GravityTrail';
import { useHeroSnap } from '@/components/about/useHeroSnap';

gsap.registerPlugin(ScrollTrigger);

// The masthead spec strip. Four cells, hairline-ruled, read like the header
// block on a drawing rather than a bio.
const SPEC = [
  { k: 'Name', v: 'Siddharth G' },
  { k: 'Practice', v: 'UI/UX · Product · Graphic' },
  { k: 'Based', v: 'Chennai, IN' },
  { k: 'Coordinates', v: '13.0827° N / 80.2707° E' },
];

/**
 * The four columns. Every icon is a real file pulled off the internet rather
 * than a path drawn here — the Barça crest from Wikimedia, the other three
 * from Microsoft's Fluent Emoji set (MIT). They carry their own colour, which
 * is the point: these four are objects on the page, not UI.
 */
const INTERESTS = [
  {
    label: 'Football',
    src: '/images/about/barca.svg',
    alt: 'FC Barcelona crest',
    body: "Midfield, eight years, school team then college team. I support Barça, which is less a hobby than a standing appointment with disappointment — and the reason I care how a thing gets done more than whether it worked.",
  },
  {
    label: 'Guitar',
    src: '/images/about/guitar.svg',
    alt: 'Electric guitar',
    body: 'Acoustic and electric, right through school and college. Badly out of practice now, a sentence I keep saying in the tone of something that happened to me rather than something I chose.',
  },
  {
    label: 'Music',
    src: '/images/about/headphones.svg',
    alt: 'Headphones',
    body: "AC/DC, Guns N' Roses, JPEGMAFIA, Tyler. No, that is not a coherent taste. Something is playing the entire time I work and it quietly decides how the file turns out.",
  },
  {
    label: 'Sneakers',
    src: '/images/about/sneaker.svg',
    alt: 'Sneaker',
    body: 'Not the resale. The tooling. Somebody argued for six weeks about that midsole stitch and lost the argument, and I would genuinely like to know who they were.',
  },
];

export default function AboutContent() {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useHeroSnap(heroRef);

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);
    // Reduced-motion users get the page exactly as it renders — animations are
    // only ever registered inside this branch, so there is nothing to undo.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Each headline line sits in its own overflow-hidden band, so the line
      // rises out from behind a hard edge instead of fading in on the spot.
      // Brutalist type wants a mask, not a dissolve.
      gsap.from('.mask-line > span', {
        yPercent: 115,
        duration: 1.15,
        stagger: 0.075,
        ease: 'expo.out',
      });
      gsap.from('.lede', { opacity: 0, y: 24, duration: 0.9, delay: 0.45, ease: 'expo.out' });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // The four columns arrive left to right rather than all at once, so the
      // row reads as a sentence instead of a table appearing.
      gsap.from('.interest', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.11,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.interests', start: 'top 78%' },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <main ref={rootRef} className="relative text-white">
        {/* -----------------------------------------------------------------
            Hero. One screen, nothing in it but the sentence and whatever the
            cursor knocks loose. The photograph that used to sit beside the
            words is gone, and with it the reason for the words to hug the
            left edge — so they take the middle of an empty screen, which is
            the only arrangement that survives having images fall through it.
        ----------------------------------------------------------------- */}
        <section
          ref={heroRef}
          className="relative flex h-[100svh] items-center justify-center overflow-hidden px-6 md:px-10"
        >
          <GravityTrail scope={heroRef} />

          <div className="relative z-10 w-full max-w-[62rem] text-center">
            <h1
              data-cursor="greet"
              data-cursor-label="hey there"
              className="text-[clamp(1.85rem,5vw,4.5rem)] leading-[0.94] font-semibold tracking-tighter"
            >
              <span className="mask-line block overflow-hidden pb-[0.06em]">
                <span className="block">I&apos;m Sid, and this</span>
              </span>
              <span className="mask-line block overflow-hidden pb-[0.06em]">
                <span className="block">little corner of the internet</span>
              </span>
              <span className="mask-line block overflow-hidden pb-[0.06em]">
                <span className="block">is where I showcase</span>
              </span>
              {/* Italic still carries the turn in the sentence; it does not
                  need colour to do it. */}
              <span className="mask-line block overflow-hidden pb-[0.06em] italic text-white/55">
                <span className="block">things I&apos;m proud of.</span>
              </span>
            </h1>

            <p
              data-cursor="greet"
              data-cursor-label="hi"
              className="lede mx-auto mt-10 max-w-[34rem] text-lg leading-relaxed text-white/70 md:text-xl"
            >
              The rest of the site is the work. This page is the person who
              made it, which is a harder brief and pays nothing.
            </p>
          </div>

          {/* The hero now ends in a hard edge and the next screen arrives in
              one jump, so there is no partial glimpse of what follows to do
              the work a scroll cue used to do for free. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center font-mono text-[0.55rem] tracking-[0.4em] text-white/25 uppercase"
          >
            Scroll
          </span>
        </section>

        {/* -----------------------------------------------------------------
            Masthead spec strip — what the hero snaps down onto.
        ----------------------------------------------------------------- */}
        <header className="relative px-6 pt-6 md:px-10 md:pt-10">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="grid grid-cols-2 border-y border-white/12 md:grid-cols-4">
              {SPEC.map(({ k, v }, i) => (
                <div
                  key={k}
                  className={`px-4 py-4 md:px-5 ${
                    i % 2 === 0 ? 'border-r border-white/12' : ''
                  } ${i < 2 ? 'border-b border-white/12 md:border-b-0' : ''} md:border-r md:last:border-r-0`}
                >
                  <span className="block font-mono text-[0.55rem] tracking-[0.3em] text-white/30 uppercase">
                    {k}
                  </span>
                  <span className="mt-2 block font-mono text-[0.68rem] tracking-[0.16em] text-white/70 uppercase">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* -----------------------------------------------------------------
            Four columns
        ----------------------------------------------------------------- */}
        <section className="px-6 pt-36 md:px-10 md:pt-56">
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="interests grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 md:grid-cols-4">
              {INTERESTS.map(({ label, src, alt, body }) => (
                <div key={label} className="interest">
                  <div className="flex h-24 items-end md:h-28">
                    <Image
                      src={src}
                      alt={alt}
                      width={256}
                      height={256}
                      className="h-20 w-auto md:h-24"
                    />
                  </div>

                  <h2 className="mt-9 font-mono text-[0.7rem] tracking-[0.3em] text-white/45 uppercase">
                    {label}
                  </h2>
                  <p
                    data-cursor="greet"
                    data-cursor-label="hi"
                    className="mt-5 text-[1.0625rem] leading-relaxed text-white/70"
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------
            Travel
        ----------------------------------------------------------------- */}
        <section className="px-6 pt-40 pb-16 md:px-10 md:pt-56 md:pb-24">
          <div className="mx-auto w-full max-w-[1600px]">
            <h2 className="reveal">
              <span className="block text-[clamp(1rem,2vw,1.5rem)] leading-none text-white/45">
                oh and did I mention,
              </span>
              <span
                className="mt-4 block text-[clamp(2.6rem,10vw,8.5rem)] leading-[0.86] font-semibold tracking-tighter uppercase"
                style={{ color: 'var(--accent)' }}
              >
                I love to travel
              </span>
            </h2>
          </div>
        </section>
      </main>

      <TravelMap />

      {/* The full footer already closes with "Have an idea worth building?"
          and the magnetic CTA, so this page does not repeat itself with a
          second call to action of its own. */}
      <Footer />
    </>
  );
}
