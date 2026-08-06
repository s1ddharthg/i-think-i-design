'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from '@/lib/reducedMotion';

// The About hero is one screen and holds nothing but the headline and the
// gravity trail. Leaving it half-scrolled shows neither the trail nor the page
// underneath, so the first gesture out of it takes the whole screen at once.
//
// Deliberately not CSS `scroll-snap-type`: Lenis owns scroll position on this
// site and drives it by writing transforms frame by frame, so the browser's
// own snapping fights it for the same pixels — the page ends up stuttering
// between the two. Watching Lenis's scroll event and answering with its own
// scrollTo keeps one thing in charge.

type LenisScrollEvent = { scroll: number; velocity: number };
type LenisLike = {
  on: (e: 'scroll', cb: (v: LenisScrollEvent) => void) => void;
  off: (e: 'scroll', cb: (v: LenisScrollEvent) => void) => void;
  scrollTo: (
    target: number,
    opts?: {
      duration?: number;
      lock?: boolean;
      force?: boolean;
      onComplete?: () => void;
    },
  ) => void;
};

const DURATION = 0.9;

// Neither end counts as "mid-hero" — without this the snap re-fires the
// instant it lands, because settling at exactly 0 still reports as being
// inside the range.
const DEAD_ZONE = 8;

export function useHeroSnap(hero: RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();

  useEffect(() => {
    // Reduced-motion visitors never get a Lenis instance at all, and taking
    // their scroll away would be the worst thing this hook could do to them.
    if (reduce) return;

    const el = hero.current;
    if (!el) return;

    let lenis: LenisLike | undefined;
    let snapping = false;
    let frame = 0;
    let release: ReturnType<typeof setTimeout>;

    const onScroll = ({ scroll, velocity }: LenisScrollEvent) => {
      if (snapping || !lenis) return;

      const height = el.offsetHeight;
      if (scroll <= DEAD_ZONE || scroll >= height - DEAD_ZONE) return;

      // Which way the gesture was going. A velocity of exactly zero means the
      // position was set rather than scrolled to (a hash jump, a restored
      // position), in which case the nearer edge is the honest answer.
      const down = velocity !== 0 ? velocity > 0 : scroll > height / 2;

      snapping = true;
      // `lock` holds the wheel off for the duration, which is what makes this
      // a snap rather than a suggestion the next notch immediately overrides.
      lenis.scrollTo(down ? height : 0, {
        duration: DURATION,
        lock: true,
        force: true,
        onComplete: () => {
          snapping = false;
        },
      });
      // onComplete does not fire if something else interrupts the tween, and
      // a stuck flag would disable the snap for the rest of the visit.
      clearTimeout(release);
      release = setTimeout(
        () => {
          snapping = false;
        },
        DURATION * 1000 + 150,
      );
    };

    // SmoothScroll is loaded through next/dynamic, so window.lenis is not
    // there yet on the first render of a page that mounts alongside it.
    const attach = () => {
      lenis = (window as unknown as { lenis?: LenisLike }).lenis;
      if (!lenis) {
        frame = requestAnimationFrame(attach);
        return;
      }
      lenis.on('scroll', onScroll);
    };
    attach();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(release);
      lenis?.off('scroll', onScroll);
    };
  }, [hero, reduce]);
}
