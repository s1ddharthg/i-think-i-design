'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

type DiveDetail = {
  rect: { x: number; y: number; width: number; height: number };
  src: string;
  slug: string;
};

// Listens for a 'vortex:dive' CustomEvent dispatched by WorkVortex on click.
// Clones the clicked plane's cover into a fixed-position overlay at its exact
// screen rect, then scales/rotates/blurs it toward the viewer — the "sucked
// into the vortex" moment — before the black flash at its peak covers the
// route swap. Lives in the root layout so it survives the navigation itself.
export default function VortexTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const imgRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [src, setSrc] = useState('');
  const pendingRect = useRef<DiveDetail['rect'] | null>(null);
  const pendingPath = useRef<string | null>(null);

  useEffect(() => {
    function onDive(e: Event) {
      const { rect, src, slug } = (e as CustomEvent<DiveDetail>).detail;
      const targetPath = `/work/${slug}`;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        router.push(targetPath);
        return;
      }

      pendingRect.current = rect;
      pendingPath.current = targetPath;
      setSrc(src);
      setActive(true);
    }

    window.addEventListener('vortex:dive', onDive);
    return () => window.removeEventListener('vortex:dive', onDive);
  }, [router]);

  // Runs once `active` flips true and the overlay has actually mounted, so
  // the refs below are guaranteed to be populated (unlike a raw rAF, which
  // can fire before React commits the new DOM).
  useEffect(() => {
    if (!active) return;
    const rect = pendingRect.current;
    const targetPath = pendingPath.current;
    if (!rect || !targetPath || !imgRef.current || !blackRef.current) return;

    gsap.set(imgRef.current, {
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: rect.height,
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
    });
    gsap.set(blackRef.current, { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(imgRef.current, {
      scale: 16,
      rotate: 10,
      filter: 'blur(24px)',
      duration: 0.55,
      ease: 'power2.in',
    });
    tl.to(blackRef.current, { opacity: 1, duration: 0.3, ease: 'power1.in' }, 0.28);
    tl.call(() => router.push(targetPath), undefined, 0.5);

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Once the new route has actually mounted, fade the black cover out.
  useEffect(() => {
    if (!active || !pendingPath.current || pathname !== pendingPath.current) return;
    if (!blackRef.current) return;

    gsap.to(blackRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power1.out',
      delay: 0.05,
      onComplete: () => {
        setActive(false);
        pendingPath.current = null;
        pendingRect.current = null;
      },
    });
  }, [pathname, active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999]">
      <div
        ref={imgRef}
        className="fixed origin-center rounded-2xl bg-cover bg-center will-change-transform"
        style={{ backgroundImage: src ? `url(${src})` : undefined }}
      />
      <div ref={blackRef} className="fixed inset-0 bg-black opacity-0" />
    </div>
  );
}
