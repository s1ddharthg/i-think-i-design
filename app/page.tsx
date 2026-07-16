'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import VortexBackdrop from '@/components/home/VortexBackdrop';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WorkVortex from '@/components/home/WorkVortex';
import Footer from '@/components/Footer';

const LOADER_KEY = 'sg-loader-shown';

export default function Home() {
  // sessionStorage, not module state: Next.js can remount this page's module
  // on client-side route transitions, which would silently reset an
  // in-memory flag. sessionStorage survives that. SSR always returns true
  // (deterministic, no window) so the first hydration always matches.
  // The read here is pure (React 18 Strict Mode double-invokes lazy
  // initializers in dev — a setItem side effect here would make the second
  // invocation see the first one's write and return a different answer).
  // The actual write happens once in the effect below.
  const [loading, setLoading] = useState(() =>
    typeof window === 'undefined' ? true : !sessionStorage.getItem(LOADER_KEY)
  );

  useEffect(() => {
    sessionStorage.setItem(LOADER_KEY, '1');
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
