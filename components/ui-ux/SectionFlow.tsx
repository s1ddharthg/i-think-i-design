'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { Screen, Section } from '@/lib/uiux';
import DeviceMockup from '@/components/ui-ux/DeviceMockup';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Lenis owns the scroll position when smooth scroll is active — native
// window.scrollTo is ignored, so route programmatic jumps through it.
function scrollToY(top: number) {
  const lenis = (window as unknown as { lenis?: { resize: () => void; scrollTo: (t: number, o?: object) => void } }).lenis;
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { duration: 1.1 });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function SectionFlow({
  section,
  onActive,
}: {
  section: Section;
  onActive: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticFlow section={section} />;
  if (section.device === 'iphone') return <PhoneFlow section={section} onActive={onActive} />;
  return <MacFlow section={section} onActive={onActive} />;
}

function Label({ section }: { section: Section }) {
  return (
    <div className="max-w-xs text-center lg:hidden">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{section.label}</span>
      <p className="mt-1.5 text-pretty text-sm text-white/60">{section.blurb}</p>
    </div>
  );
}

function Controls({
  n,
  idx,
  onJump,
}: {
  n: number;
  idx: number;
  onJump: (i: number) => void;
}) {
  if (n < 2) return null;
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onJump(Math.max(0, idx - 1))}
        disabled={idx === 0}
        aria-label="Previous screen"
        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-white/50">
          {String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: n }).map((_, i) => (
            <button
              key={i}
              onClick={() => onJump(i)}
              aria-label={`Go to screen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
              style={i === idx ? { backgroundColor: 'var(--accent)' } : undefined}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => onJump(Math.min(n - 1, idx + 1))}
        disabled={idx === n - 1}
        aria-label="Next screen"
        className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

// iPhone — discrete screens. Scroll steps through them; each transition is a
// horizontal wipe/fade, not a continuous crawl. Arrows and dots jump directly.
function PhoneFlow({ section, onActive }: { section: Section; onActive: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = section.screens.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.999)));
    setIdx((prev) => {
      if (i !== prev) setDir(i > prev ? 1 : -1);
      return i;
    });
    if (v > 0.02 && v < 0.98) onActive(section.id);
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el || n < 2) return;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(el.offsetTop + ((i + 0.5) / n) * travel);
  };

  const heightVh = 100 + (n - 1) * 55;

  return (
    <section ref={ref} id={section.id} className="relative scroll-mt-28" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-5">
        <Label section={section} />
        <DeviceMockup device="iphone">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir > 0 ? '35%' : '-35%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? '-35%' : '35%' }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0"
            >
              <Image src={section.screens[idx].src} alt={section.screens[idx].alt} fill sizes="360px" draggable={false} className="select-none object-cover" />
            </motion.div>
          </AnimatePresence>
        </DeviceMockup>
        <Controls n={n} idx={idx} onJump={jumpTo} />
      </div>
    </section>
  );
}

// Mac — a long page reads best as a continuous vertical pan through the frame.
function MacFlow({ section, onActive }: { section: Section; onActive: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [maxY, setMaxY] = useState(0);
  const [idx, setIdx] = useState(0);
  const n = section.screens.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const y = useTransform(scrollYProgress, (v) => -v * maxY);

  useEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      const frame = strip?.parentElement;
      if (!strip || !frame) return;
      setMaxY(Math.max(0, strip.scrollHeight - frame.clientHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [n]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (n > 1) setIdx(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))));
    if (v > 0.02 && v < 0.98) onActive(section.id);
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el || n < 2) return;
    const travel = el.offsetHeight - window.innerHeight;
    scrollToY(el.offsetTop + (i / (n - 1)) * travel);
  };

  const heightVh = 110 + (n - 1) * 46;

  return (
    <section ref={ref} id={section.id} className="relative scroll-mt-28" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-5">
        <Label section={section} />
        <DeviceMockup device="mac" url={section.url}>
          <motion.div ref={stripRef} style={{ y }} className="absolute inset-x-0 top-0 flex flex-col">
            {section.screens.map((s: Screen, i: number) => (
              <Image
                key={i}
                src={s.src}
                alt={s.alt}
                width={0}
                height={0}
                sizes="900px"
                draggable={false}
                loading="eager"
                className="block h-auto w-full select-none"
                style={{ width: '100%', height: 'auto' }}
              />
            ))}
          </motion.div>
        </DeviceMockup>
        <Controls n={n} idx={idx} onJump={jumpTo} />
      </div>
    </section>
  );
}

// Reduced motion — a clean stacked read, no scroll choreography.
function StaticFlow({ section }: { section: Section }) {
  return (
    <section id={section.id} className="scroll-mt-28 py-12">
      <div className={`mx-auto flex flex-col gap-6 ${section.device === 'iphone' ? 'max-w-[320px]' : 'max-w-3xl'}`}>
        {section.screens.map((s, i) => (
          <Image
            key={i}
            src={s.src}
            alt={s.alt}
            width={0}
            height={0}
            sizes={section.device === 'iphone' ? '320px' : '768px'}
            className="h-auto w-full rounded-xl"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    </section>
  );
}
