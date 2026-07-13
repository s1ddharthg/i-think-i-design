'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BIO =
  "I'm sid, a UI/UX designer and graphic designer and i believe nothing is better than designing at 1AM with some music.";

export default function Hero({ intro }: { intro: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Hide words + set up scroll-out parallax. Reduced-motion users never get the
  // hidden state, so content stays visible with zero motion.
  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('.hero-word', { yPercent: 115 });
      gsap.set('.hero-cue', { opacity: 0 });
      gsap.to(contentRef.current, {
        yPercent: -35,
        opacity: 0,
        scale: 0.96,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  // Entrance plays once the loader has finished.
  useEffect(() => {
    if (!intro || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = sectionRef.current.querySelectorAll('.hero-word');
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(words, { yPercent: 0, duration: 1.1, stagger: 0.035 }).to(
      '.hero-cue',
      { opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );
    return () => {
      tl.kill();
    };
  }, [intro]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <div ref={contentRef} className="flex flex-col items-center">
        <h1 className="max-w-3xl text-3xl font-medium leading-snug tracking-tight text-white sm:text-5xl">
          {BIO.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <span className="hero-word inline-block will-change-transform">
                {word}
                {' '}
              </span>
            </span>
          ))}
        </h1>
      </div>
      <div className="hero-cue absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px animate-pulse bg-white/40" />
      </div>
    </section>
  );
}
