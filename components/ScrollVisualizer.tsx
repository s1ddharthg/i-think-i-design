'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/lib/reducedMotion';
import { audioBus } from '@/lib/audioBus';

const BAR_COUNT = 14;

type LenisScrollEvent = { progress: number; velocity: number };
type LenisLike = {
  on: (event: 'scroll', cb: (e: LenisScrollEvent) => void) => void;
  off: (event: 'scroll', cb: (e: LenisScrollEvent) => void) => void;
};

// Site-wide scroll indicator: a column of bars on the left edge that reads
// like an audio visualizer. Bars near the current scroll position glow
// brighter; how hard they jitter tracks scroll speed, settling to a slow
// idle pulse at rest. Reduced-motion visitors get the brightness cue with
// no jitter — the bars only move when scroll position actually changes.
export default function ScrollVisualizer() {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;

    if (lenis) {
      const onScroll = (e: LenisScrollEvent) => {
        progress.set(e.progress);
        velocityRef.current = e.velocity;
      };
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      velocityRef.current = y - lastY;
      lastY = y;
      progress.set(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [progress]);

  useAnimationFrame(() => {
    velocityRef.current *= 0.92;
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-12 flex-col items-start justify-center gap-[9px] pl-3 sm:flex"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Bar key={i} index={i} count={BAR_COUNT} progress={progress} velocityRef={velocityRef} reduce={!!reduce} />
      ))}
    </div>
  );
}

function Bar({
  index,
  count,
  progress,
  velocityRef,
  reduce,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  velocityRef: React.RefObject<number>;
  reduce: boolean;
}) {
  const scaleX = useMotionValue(reduce ? 0.45 : 0.15);
  const barPos = index / (count - 1);
  const opacity = useTransform(progress, (p) => {
    const dist = Math.abs(barPos - p);
    return 0.18 + Math.max(0, 1 - dist * 3.2) * 0.72;
  });

  // Each bar needs its own idle phase and gain so the row breathes instead of
  // pulsing in unison. These were Math.random in a useRef, which runs during
  // render — impure, and re-rolled whenever a bar remounted. The golden ratio
  // and golden angle spread consecutive indices about as evenly as random
  // does, without ever producing a different answer for the same bar.
  const phase = (index * 2.39996323) % (Math.PI * 2);
  const weight = 0.5 + ((index * 0.61803399) % 1) * 0.9;

  useAnimationFrame((t) => {
    if (reduce) return;
    const idle = Math.sin(t / 380 + phase) * 0.06 + 0.06;
    const v = Math.min(1, Math.abs(velocityRef.current) / 32);

    let audioLevel = 0;
    if (audioBus.analyser && audioBus.data) {
      audioBus.analyser.getByteFrequencyData(audioBus.data);
      const bin = Math.floor((index / count) * audioBus.data.length);
      audioLevel = audioBus.data[bin] / 255;
    }

    scaleX.set(Math.min(1, 0.15 + idle + v * weight * 0.75 + audioLevel * weight * 0.85));
  });

  return (
    <motion.div
      style={{ scaleX, opacity, transformOrigin: 'left center' }}
      className="h-[4px] w-8 rounded-r-full bg-white"
    />
  );
}
