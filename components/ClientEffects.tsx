'use client';

import dynamic from 'next/dynamic';

// Site-wide decorative/behavioral layer (smooth scroll, custom cursor, scroll
// visualizer, music toggle, page-dive transition) — none of it is needed for
// first paint. Splitting it into its own client-only chunk keeps gsap,
// ScrollTrigger and Lenis (SmoothScroll's deps) out of every route's critical
// bundle except the home page, which already needs gsap for Hero.
const SmoothScroll = dynamic(() => import('./SmoothScroll'), { ssr: false });
const ScrollVisualizer = dynamic(() => import('./ScrollVisualizer'), { ssr: false });
const MusicToggle = dynamic(() => import('./MusicToggle'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
const VortexTransition = dynamic(() => import('./home/VortexTransition'), { ssr: false });

export default function ClientEffects() {
  return (
    <>
      <SmoothScroll />
      <ScrollVisualizer />
      <MusicToggle />
      <CustomCursor />
      <VortexTransition />
    </>
  );
}
