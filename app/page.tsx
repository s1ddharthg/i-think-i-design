'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import VortexBackdrop from '@/components/home/VortexBackdrop';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WorkVortex from '@/components/home/WorkVortex';
import Footer from '@/components/Footer';

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
