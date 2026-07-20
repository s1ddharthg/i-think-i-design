'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Site-wide smooth scroll. Lenis drives a weighted, slightly-delayed scroll —
// the "wormhole" pull — and is wired into GSAP's ticker so every ScrollTrigger
// (hero parallax, the Work vortex dive, case-study pins) stays in sync.
// Disabled for reduced-motion users, who get native instant scrolling.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      lerp: 0.085, // lower = heavier, more delayed — the pulled-in feel
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Lenis caches its scroll limit (max scrollable distance) at creation
    // time. Sections that mount later — e.g. WorkVortex, which is code-split
    // via next/dynamic and adds its own pinned scroll range once it loads —
    // change the document's real scrollable height after that cache is set,
    // and nothing tells Lenis to recompute it. Left unfixed, Lenis silently
    // clamps scrolling at the stale (shorter) limit: the page looks like it
    // stops scrolling partway through, exactly where the late-mounting
    // section begins. Every GSAP ScrollTrigger refresh (which fires once
    // WorkVortex's pin registers, and on window resize) must also resize
    // Lenis so the two stay in sync.
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onRefresh);

    // Same class of bug, a different trigger: case-study pages render their
    // screen filmstrips with intrinsic (width=0/height=0, CSS auto-height)
    // images — the real layout height only settles once each image finishes
    // decoding, well after Lenis's first measurement. That has nothing to do
    // with GSAP, so the ScrollTrigger refresh hook above never fires for it;
    // scrolling would silently cap partway down the page exactly like the
    // vortex bug did. Watching document height directly catches this and any
    // future late layout shift, regardless of what causes it.
    //
    // Must observe document.body, not document.documentElement: this
    // codebase sets h-full (height: 100%) on <html> in app/layout.tsx, so
    // documentElement's own box (offsetHeight/clientHeight, what
    // ResizeObserver reports) is capped at the viewport height and never
    // resizes as content grows — only its scrollHeight changes, which
    // ResizeObserver cannot see. <body> only carries min-h-full, so it's a
    // normal block box that really does grow to fit its content, and fires
    // when a late image lands. Observing documentElement here silently
    // never fired, leaving the exact dead zone this comment describes
    // unfixed on any page with late layout growth (e.g. case-study
    // filmstrips) that outpaced Lenis's initial measurement or a GSAP
    // refresh.
    // Debounced, not immediate: on mobile, sections sized with svh units
    // change document.body's height every time the address bar hides/shows
    // during a scroll gesture. GSAP's ScrollTrigger deliberately excludes
    // 'resize' from its auto-refresh events for exactly this reason — an
    // immediate resize->lenis.resize() here bypasses that protection and
    // recomputes scroll limits mid-gesture, which is its own feedback loop
    // (recompute nudges scroll -> chrome toggles again -> resize fires again),
    // visible as the page shaking. Waiting for resizing to settle keeps the
    // late-image-layout fix this observer exists for, without the mid-scroll churn.
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => lenis.resize(), 200);
    });
    ro.observe(document.body);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Expose so other components (loader hand-off, anchor jumps) can reach it.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      clearTimeout(resizeTimeout);
      ro.disconnect();
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
