'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/Loader';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Footer from '@/components/Footer';

// Both pull in three.js + @react-three/fiber — split out of the initial
// bundle so the WebGL dependency only loads once a visitor actually reaches
// these sections, not on every page load.
const VortexBackdrop = dynamic(() => import('@/components/home/VortexBackdrop'), { ssr: false });
const WorkVortex = dynamic(() => import('@/components/home/WorkVortex'), { ssr: false });

// Module-scoped, NOT sessionStorage: this flag persists across client-side
// navigations (clicking "SG" to come home never replays the loader) but resets
// on a full page load — so the loader shows only on first entry or a refresh,
// which is exactly the desired behaviour. SSR has no window and renders with
// the flag false → loading true, matching the first client render.
let hasShownLoader = false;

export default function Home() {
  const [loading, setLoading] = useState(!hasShownLoader);

  useEffect(() => {
    hasShownLoader = true;
  }, []);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <VortexBackdrop />
      <main className="relative z-10">
        <Hero intro={!loading} />
        <About />
        <WorkVortex />
        <Footer />
      </main>
    </>
  );
}
