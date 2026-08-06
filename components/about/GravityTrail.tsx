'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/reducedMotion';

// Images fall out of the cursor and land on the floor of the section. Ported
// from the Codrops "Made With GSAP" gravity-trail demo, physics unchanged: the
// pointer's travelled distance is accumulated, and every time it crosses a
// threshold one image is dropped at the cursor, thrown sideways by the
// direction of travel, and dropped to the bottom edge with a bounce.
//
// Bound to one element rather than the window on purpose — this runs in the
// About hero and nowhere else on the site.

const MEDIA = [
  '/images/trail/01.jpg',
  '/images/trail/03.jpeg',
  '/images/trail/04.png',
  '/images/trail/05.jpg',
  '/images/trail/07.png',
  '/images/trail/08.jpeg',
  '/images/trail/09.jpg',
  '/images/trail/10.png',
];

// A drop every screen-width/8 of pointer travel. Coarse pointers cover ground
// in fewer, longer gestures, so they get a shorter fuse or the effect never
// fires at all on a phone.
const SPAWN_DIVISOR = { fine: 8, coarse: 6 };

// No image spawns within this many pixels of the floor — one that did would
// have no fall left in it and would just pop into existence on the ground.
const FLOOR_MARGIN = 200;

export default function GravityTrail({
  scope,
}: {
  /** The element the trail lives in. Listeners and images both go here. */
  scope: RefObject<HTMLElement | null>;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = scope.current;
    const layer = layerRef.current;
    if (!root || !layer || reduce) return;

    let travelled = 0;
    let lastX = 0;
    let lastY = 0;
    let primed = false; // the first move only seeds lastX/lastY
    let next = 0; // which image is up

    const coarse = window.matchMedia('(hover: none)').matches;
    const spawnEvery =
      window.innerWidth / (coarse ? SPAWN_DIVISOR.coarse : SPAWN_DIVISOR.fine);

    // Every timeline that is still running, so unmounting mid-fall does not
    // leave GSAP ticking against detached nodes.
    const live = new Set<gsap.core.Timeline>();

    // Only the horizontal delta is carried into the throw: vertical pointer
    // speed already shows up in where the image spawns, and feeding it into
    // the fall as well fought gravity instead of adding to it.
    function drop(x: number, y: number, dx: number) {
      const root = scope.current;
      const layer = layerRef.current;
      if (!root || !layer) return;

      const H = root.clientHeight;
      if (y > H - FLOOR_MARGIN) return;

      const img = document.createElement('img');
      img.src = MEDIA[next];
      img.alt = '';
      // Decoration, and there are up to a dozen of them on screen at once.
      img.setAttribute('aria-hidden', 'true');
      layer.appendChild(img);
      next = (next + 1) % MEDIA.length;

      const tl = gsap.timeline({
        onComplete: () => {
          img.remove();
          live.delete(tl);
          tl.kill();
        },
      });
      live.add(tl);

      // Lands, rather than materialising: it arrives oversized and springs
      // back, which is what sells it as an object with mass.
      tl.fromTo(
        img,
        {
          xPercent: -50 + (Math.random() - 0.5) * 80,
          yPercent: -50 + (Math.random() - 0.5) * 10,
          scaleX: 1.3,
          scaleY: 1.3,
          rotation: (Math.random() - 0.5) * 20,
        },
        {
          scaleX: 1,
          scaleY: 1,
          ease: 'elastic.out(2, 0.6)',
          duration: 0.4,
        },
      );

      // Horizontal carry, from the direction the pointer was already going.
      tl.fromTo(
        img,
        { x },
        {
          x: `+=${dx * 2}`,
          rotation: 0,
          ease: 'power1.in',
          duration: 0.4,
        },
        '<',
      );

      // The fall. `back.in` overshoots at the end, which reads as the weight
      // arriving before the image does. yPercent lands the card's bottom edge
      // exactly on the floor once the 0.9 scale is accounted for.
      tl.fromTo(
        img,
        { y },
        {
          y: `+=${H - y}`,
          scale: 0.9,
          yPercent: -95,
          ease: 'back.in(1.1)',
          duration: 0.4,
        },
        '<',
      );

      // Bounce, then out through the bottom. Images dropped higher up hit
      // harder, so the ease stiffens with the height they fell from.
      tl.to(img, {
        x: `+=${dx * 1.6}`,
        rotation: (Math.random() - 0.5) * 40,
        ease: 'power1.in',
        duration: 0.3,
      });
      tl.to(
        img,
        {
          yPercent: 150,
          ease: `back.in(${1.5 + (1 - y / H)})`,
          duration: 0.3,
        },
        '<',
      );
    }

    function onMove(clientX: number, clientY: number) {
      const root = scope.current;
      if (!root) return;

      const x = gsap.utils.clamp(0, window.innerWidth, clientX);
      const y = gsap.utils.clamp(0, window.innerHeight, clientY);

      if (!primed) {
        primed = true;
        lastX = x;
        lastY = y;
        return;
      }

      travelled += Math.abs(x - lastX) + Math.abs(y - lastY);
      if (travelled > spawnEvery) {
        travelled = 0;
        // Client coords are viewport-relative; the layer is not. Only the
        // spawn needs the correction, so the rect is read here rather than on
        // every move — a layout read per pointer event, interleaved with
        // GSAP's transform writes, is how you thrash.
        drop(x, y - root.getBoundingClientRect().top, x - lastX);
      }

      lastX = x;
      lastY = y;
    }

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches?.[0];
      if (t) onMove(t.clientX, t.clientY);
    };

    root.addEventListener('mousemove', onMouseMove);
    root.addEventListener('touchstart', onTouchMove, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      root.removeEventListener('mousemove', onMouseMove);
      root.removeEventListener('touchstart', onTouchMove);
      root.removeEventListener('touchmove', onTouchMove);
      live.forEach((tl) => tl.kill());
      live.clear();
      layer.replaceChildren();
    };
  }, [scope, reduce]);

  // Behind the headline, and never in front of the pointer: the listeners are
  // on the section, so this layer does not need to receive events itself.
  return (
    <div
      ref={layerRef}
      aria-hidden
      className="gravity-trail pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  );
}
