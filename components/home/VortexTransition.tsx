'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { optimizedSrc } from '@/lib/optimizedImage';

type DiveDetail = {
  rect: { x: number; y: number; width: number; height: number };
  src: string;
  slug: string;
};

type Pending = {
  path: string;
  originCenterX: number;
  originCenterY: number;
  originWidth: number;
  originHeight: number;
};

const EASE_IN: [number, number, number, number] = [0.55, 0, 0.85, 0.35];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Listens for a 'vortex:dive' CustomEvent dispatched by WorkVortex on click.
// Clones the clicked plane's cover into a fixed-position overlay at its exact
// screen rect, flings it toward the viewer with a twisting motion-blur while
// the world fades to black behind it, swaps the route at full black, then
// flies the same clone from that blur back to identity landing exactly on
// the destination case study's hero rect (marked with data-dive-target) —
// a shared-element landing rather than a wipe. Once landed, the clone fades
// out over the real <Image> beneath it (same rect, same crop) for an
// invisible handoff. Lives in the root layout so it survives the navigation.
export default function VortexTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const imgRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [src, setSrc] = useState('');
  const pending = useRef<Pending | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotate = useMotionValue(0);
  const blur = useMotionValue(0);
  const saturate = useMotionValue(1);
  const cloneOpacity = useMotionValue(1);
  const backdropOpacity = useMotionValue(0);
  const filter = useMotionTemplate`blur(${blur}px) saturate(${saturate})`;

  useEffect(() => {
    function onDive(e: Event) {
      const { rect, src, slug } = (e as CustomEvent<DiveDetail>).detail;
      const targetPath = `/work/${slug}`;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        router.push(targetPath);
        return;
      }

      pending.current = {
        path: targetPath,
        originCenterX: rect.x + rect.width / 2,
        originCenterY: rect.y + rect.height / 2,
        originWidth: rect.width,
        originHeight: rect.height,
      };
      // The clone flies up to full-viewport scale, but stays blurred/backdrop-
      // covered for nearly all of that flight and fades over the destination's
      // own <Image> right after landing — it never needs source resolution.
      setSrc(optimizedSrc(src, window.innerWidth <= 768 ? 750 : 1920));

      if (imgRef.current) {
        Object.assign(imgRef.current.style, {
          left: `${rect.x}px`,
          top: `${rect.y}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        });
      }
      x.set(0);
      y.set(0);
      scaleX.set(1);
      scaleY.set(1);
      rotate.set(0);
      blur.set(0);
      saturate.set(1);
      cloneOpacity.set(1);
      backdropOpacity.set(0);

      setActive(true);
    }

    window.addEventListener('vortex:dive', onDive);
    return () => window.removeEventListener('vortex:dive', onDive);
  }, [router, x, y, scaleX, scaleY, rotate, blur, saturate, cloneOpacity, backdropOpacity]);

  // Flight out: grow/spin/blur toward the viewer while the world fades to
  // black. Runs once `active` flips true and the overlay has mounted, so
  // refs are guaranteed populated (a raw rAF can fire before React commits).
  useEffect(() => {
    if (!active) return;
    const p = pending.current;
    if (!p) return;

    const opts = { duration: 0.42, ease: EASE_IN };
    const flight = [
      animate(scaleX, 19, opts),
      animate(scaleY, 19, opts),
      animate(rotate, 46, opts),
      animate(blur, 40, opts),
      animate(saturate, 1.7, opts),
      animate(backdropOpacity, 1, opts),
    ];
    Promise.all(flight).then(() => router.push(p.path));

    return () => flight.forEach((f) => f.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Once the new route has actually mounted: measure its hero rect and fly
  // the clone from the mid-flight blur into an exact landing on it, fading
  // the backdrop out as it lands. Falls back to a plain fade-out in place if
  // no target is found.
  useEffect(() => {
    const p = pending.current;
    if (!active || !p || pathname !== p.path) return;

    const target = document.querySelector('[data-dive-target]');
    const rect = target?.getBoundingClientRect();

    const opts = { duration: rect ? 0.45 : 0.3, ease: EASE_OUT };
    const landing = rect
      ? [
          animate(x, rect.x + rect.width / 2 - p.originCenterX, opts),
          animate(y, rect.y + rect.height / 2 - p.originCenterY, opts),
          animate(scaleX, rect.width / p.originWidth, opts),
          animate(scaleY, rect.height / p.originHeight, opts),
          animate(rotate, 0, opts),
          animate(blur, 0, opts),
          animate(saturate, 1, opts),
          animate(backdropOpacity, 0, opts),
        ]
      : [animate(cloneOpacity, 0, opts), animate(backdropOpacity, 0, opts)];

    Promise.all(landing).then(() => {
      if (!rect) {
        setActive(false);
        pending.current = null;
        return;
      }
      animate(cloneOpacity, 0, { duration: 0.15 }).then(() => {
        setActive(false);
        pending.current = null;
      });
    });

    return () => landing.forEach((f) => f.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999]">
      <motion.div className="fixed inset-0 bg-black" style={{ opacity: backdropOpacity }} />
      <motion.div
        ref={imgRef}
        className="fixed origin-center rounded-2xl bg-cover bg-center will-change-transform"
        style={{ backgroundImage: src ? `url(${src})` : undefined, x, y, scaleX, scaleY, rotate, filter, opacity: cloneOpacity }}
      />
    </div>
  );
}
