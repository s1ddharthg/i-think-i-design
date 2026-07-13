'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experience = [
  { year: '2024 — Now', role: 'Product Designer', place: 'Freelance / Independent' },
  { year: '2022 — 2024', role: 'UI/UX Designer', place: 'Product Studio' },
  { year: '2020 — 2022', role: 'Graphic Designer', place: 'Design Agency' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);
    // reduced-motion users get untouched static content — animations only registered here
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-intro > *', {
        opacity: 0,
        y: 48,
        rotate: -1.5,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.from('.about-row', {
        opacity: 0,
        x: 64,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-rows', start: 'top 75%' },
      });
      gsap.from('.about-outro', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.about-outro', start: 'top 90%' },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-32 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:flex-row sm:gap-24">
        <div className="about-intro sm:w-1/2">
          <span className="block text-xs uppercase tracking-[0.3em] text-white/40">About</span>
          <p className="mt-6 text-xl leading-relaxed text-white/80">
            Designer working across UI/UX and graphic design — obsessed with the
            small details that make an interface feel considered, not just built.
          </p>
        </div>
        <div className="about-rows flex flex-1 flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">Experience</span>
          {experience.map((item) => (
            <div
              key={item.role}
              className="about-row flex items-baseline justify-between border-b border-white/10 pb-4"
            >
              <div>
                <p className="text-lg text-white">{item.role}</p>
                <p className="text-sm text-white/50">{item.place}</p>
              </div>
              <span className="text-sm text-white/40">{item.year}</span>
            </div>
          ))}
        </div>
      </div>
      {/* bridge into the Work vortex */}
      <div className="about-outro mx-auto mt-40 flex max-w-4xl flex-col items-center gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">Keep scrolling</p>
        <p className="text-2xl font-medium text-white/90 sm:text-3xl">Into the work.</p>
      </div>
    </section>
  );
}
