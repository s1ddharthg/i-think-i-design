'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Headline split into tokens; `accent` tokens get the yellow highlight.
const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: 'I' }, { text: 'design' }, { text: 'interfaces', accent: true }, { text: '&' },
  { text: 'brands', accent: true }, { text: 'worth' }, { text: 'staying' }, { text: 'up' }, { text: 'for.' },
];

const BIO_LINES = [
  "I'm Sid — a UI/UX and graphic designer.",
  'and nothing beats designing at 1 AM with some music on.',
];

export default function Hero({ intro }: { intro: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set('.hero-word', { yPercent: 115 });
      gsap.set(['.hero-bio', '.hero-cue'], { opacity: 0, y: 16 });
      gsap.to(contentRef.current, {
        yPercent: -30,
        opacity: 0,
        scale: 0.94,
        filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!intro || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero-word', { yPercent: 0, duration: 1.2, stagger: { each: 0.05, ease: 'power2.in' } })
      .to('.hero-bio', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero-cue', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
    return () => {
      tl.kill();
    };
  }, [intro]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <div ref={contentRef} className="flex max-w-5xl flex-col items-center will-change-transform">
        <h1 className="text-balance text-[clamp(2.6rem,7.5vw,6rem)] font-semibold leading-[0.95] tracking-tight text-white">
          {HEADLINE.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span
                className="hero-word inline-block will-change-transform"
                style={w.accent ? { color: 'var(--accent)', fontStyle: 'italic' } : undefined}
              >
                {w.text}
                {i < HEADLINE.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-bio mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg">
          {BIO_LINES.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="hero-cue absolute bottom-10 flex flex-col items-center gap-2 text-white/50">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll to enter</span>
        <div className="h-10 w-px animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
