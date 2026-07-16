'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { Screen } from '@/lib/uiux';

// Screens stacked vertically inside the device viewport, auto-scrolling on a
// slow ping-pong loop. Hover / focus / touch pauses it; the container is a real
// scroll surface so the visitor can take over and scroll manually at any time.
// Reduced-motion visitors get a static, hand-scrollable strip.

const SPEED = 0.035; // px per ms ≈ 35px/s

export default function AutoScrollFilmstrip({
  screens,
  rounded = false,
}: {
  screens: Screen[];
  rounded?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const dir = useRef(1);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      const max = el.scrollHeight - el.clientHeight;
      if (!paused.current && max > 2) {
        let next = el.scrollTop + dir.current * SPEED * dt;
        if (next <= 0) {
          next = 0;
          dir.current = 1;
        } else if (next >= max) {
          next = max;
          dir.current = -1;
        }
        el.scrollTop = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, screens]);

  const hold = () => {
    paused.current = true;
  };
  const release = () => {
    paused.current = false;
  };

  return (
    <div
      ref={ref}
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocus={hold}
      onBlur={release}
      onTouchStart={hold}
      className="absolute inset-0 overflow-y-auto overscroll-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      tabIndex={0}
      aria-label="Scrollable screen sequence"
    >
      <div className="flex flex-col">
        {screens.map((s, i) => (
          <Image
            key={i}
            src={s.src}
            alt={s.alt}
            width={0}
            height={0}
            sizes="(max-width: 768px) 90vw, 600px"
            className={`block h-auto w-full${rounded ? ' first:rounded-t-none' : ''}`}
            style={{ width: '100%', height: 'auto' }}
            priority={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
