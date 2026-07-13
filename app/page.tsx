'use client';

import { useState } from 'react';
import Loader from '@/components/Loader';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WorkVortex from '@/components/home/WorkVortex';
import Footer from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <main>
        <Hero />
        <About />
        <WorkVortex />
        <Footer />
      </main>
    </>
  );
}
