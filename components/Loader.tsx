'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const WORDS = ['Good', 'things', 'take', 'time'];

export default function Loader({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(
          containerRef.current,
          reduceMotion
            ? { autoAlpha: 0, duration: 0.4, onComplete: onDone }
            : { yPercent: -100, duration: 0.9, ease: 'power4.inOut', onComplete: onDone }
        );
      },
    });

    if (!reduceMotion && containerRef.current) {
      const words = containerRef.current.querySelectorAll('.loader-word');
      gsap.set(words, { yPercent: 120 });
      tl.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0);
    }

    tl.to(
      counter,
      {
        value: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => setProgress(Math.round(counter.value)),
      },
      0
    );

    tl.to(barRef.current, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0);

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <h1
        aria-label="Good things take time"
        className="flex flex-wrap justify-center gap-x-[0.28em] px-6 text-center text-[clamp(2.4rem,7.5vw,5.75rem)] leading-[1.05] font-semibold tracking-tight"
      >
        {WORDS.map((word, i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.1em]">
            <span
              className={`loader-word inline-block will-change-transform ${
                i === WORDS.length - 1 ? 'font-normal italic text-white/80' : ''
              }`}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>
      <div className="mt-12 flex items-center gap-4">
        <div className="h-px w-40 overflow-hidden bg-white/15">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-white/70" />
        </div>
        <span className="text-xs tabular-nums text-white/40">{progress}%</span>
      </div>
    </div>
  );
}
