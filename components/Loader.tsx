'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Fill (0.4s) + exit (1s) always run after this, so the floor below keeps
// total time on screen at 3s+ even on an instant load.
const MIN_VISIBLE_MS = 1700;

export default function Loader({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    const counter = { value: 0 };
    let rafId = 0;
    let settled = false;

    const setBar = (v: number) => {
      counter.value = v;
      setProgress(Math.round(v));
      if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
    };

    // Trickle toward 90% on a decaying curve — real elapsed time, never
    // completes on its own. Actual completion is gated on real load signals
    // below, so total shown duration always reflects real load time.
    const trickle = () => {
      if (settled) return;
      const elapsed = performance.now() - start;
      const target = 90 * (1 - Math.exp(-elapsed / 1400));
      if (target > counter.value) setBar(target);
      rafId = requestAnimationFrame(trickle);
    };
    rafId = requestAnimationFrame(trickle);

    const loaded = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true })),
    ]);

    const finish = () => {
      settled = true;
      cancelAnimationFrame(rafId);
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(
            containerRef.current,
            reduceMotion
              ? { autoAlpha: 0, duration: 0.4, onComplete: onDone }
              : {
                  yPercent: -100,
                  scale: 1.03,
                  filter: 'blur(6px)',
                  duration: 1,
                  ease: 'power4.inOut',
                  onComplete: onDone,
                }
          );
        },
      });
      tl.to(counter, { value: 100, duration: 0.4, ease: 'power2.out', onUpdate: () => setBar(counter.value) });
      tl.to(barRef.current, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, '<');
      if (!reduceMotion) {
        // The frame that boxed the whole thing in now opens wide — the
        // bars double as both the entrance's cinematic aspect ratio and
        // the exit's curtain-opening payoff, instead of two unrelated effects.
        tl.to([topBarRef.current, bottomBarRef.current], { scaleY: 0, duration: 0.6, ease: 'power3.inOut' }, '<0.1');
      }
    };

    if (!reduceMotion && containerRef.current) {
      const words = containerRef.current.querySelectorAll('.loader-word');
      const progressRow = containerRef.current.querySelector('.loader-progress');
      gsap.set([topBarRef.current, bottomBarRef.current], { scaleY: 1 });
      gsap.set(fillRef.current, { clipPath: 'inset(100% 0 0 0)' });
      gsap.set(words, { yPercent: 120 });
      gsap.set(progressRow, { autoAlpha: 0 });
      gsap
        .timeline()
        .from(containerRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
        .from([topBarRef.current, bottomBarRef.current], { scaleY: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
        .to(
          fillRef.current,
          { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.inOut' },
          0.35
        )
        .to(words, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.7)
        .to(progressRow, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 1.1);
    }

    Promise.all([loaded, new Promise((res) => setTimeout(res, MIN_VISIBLE_MS))]).then(finish);

    return () => {
      settled = true;
      cancelAnimationFrame(rafId);
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 48%, rgba(238,255,0,0.05) 0%, rgba(0,0,0,0) 70%)',
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* SG mark: a static ghost outline with a neon-yellow fill that rises
            in via clip-path — the loader's one signature move, tying it to
            the same mark used for the favicon and OG image. */}
        <div className="relative select-none" aria-hidden>
          <span
            className="block text-[clamp(4.5rem,16vw,11rem)] leading-none font-black tracking-tighter"
            style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.18)' }}
          >
            SG
          </span>
          <span
            ref={fillRef}
            className="absolute inset-0 block text-[clamp(4.5rem,16vw,11rem)] leading-none font-black tracking-tighter"
            style={{ color: 'var(--accent)' }}
          >
            SG
          </span>
        </div>

        <h1
          aria-label="Siddharth G, UI/UX and Graphic Designer"
          className="mt-3 flex flex-wrap justify-center gap-x-[0.5em] text-[11px] font-medium tracking-[0.35em] text-white/50 uppercase"
        >
          {['UI/UX &', 'Graphic Design'].map((word) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.15em]">
              <span className="loader-word inline-block will-change-transform">{word}</span>
            </span>
          ))}
        </h1>

        <div className="loader-progress mt-10 flex items-center gap-3">
          <div className="h-px w-40 overflow-hidden bg-white/15">
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0"
              style={{ background: 'var(--accent)', boxShadow: '0 0 8px rgba(238,255,0,0.6)' }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-white/40">{String(progress).padStart(2, '0')}%</span>
        </div>
      </div>

      {/* Letterbox bars — the cinematic frame for the whole sequence. They
          rise in on entrance and, on exit, double as the curtain that opens
          to reveal the page, rather than being purely decorative. */}
      <div
        ref={topBarRef}
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[clamp(2.5rem,9vh,6rem)] origin-top border-b border-white/10 bg-black"
      />
      <div
        ref={bottomBarRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-[clamp(2.5rem,9vh,6rem)] origin-bottom border-t border-white/10 bg-black"
      />
    </div>
  );
}
