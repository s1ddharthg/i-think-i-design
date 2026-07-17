'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experience = [
  { year: '2025 — 2026', role: 'Creative Director', place: 'Festember', logo: '/logos/festember.png' },
  { year: '2025', role: 'Software Intern', place: 'Oracle', logo: '/logos/oracle.svg' },
  { year: '2024', role: 'Product Management Intern', place: 'Anumati by Perfios AA', logo: '/logos/anumati.png' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);
    // reduced-motion users get untouched static content — animations only registered here
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-intro > *', {
        opacity: 0,
        y: 44,
        rotate: -1.5,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.from('.about-row', {
        opacity: 0,
        x: 48,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
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
          <span className="block text-xs uppercase tracking-[0.3em] text-white/50">About</span>
          <p className="mt-6 text-xl leading-relaxed text-white/80">
            Designer working across UI/UX and graphic design — obsessed with the
            small details that make an interface feel considered, not just built.
          </p>
        </div>
        <div className="about-rows flex flex-1 flex-col gap-2">
          <span className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">Experience</span>
          {experience.map((item) => (
            <div
              key={item.role}
              className="about-row group flex items-center justify-between gap-4 border-b border-white/10 py-4 transition-colors hover:border-white/30"
            >
              <div className="flex items-center gap-4">
                <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 transition-[box-shadow] group-hover:ring-white/25">
                  <Image src={item.logo} alt={`${item.place} logo`} fill sizes="40px" className="object-cover" />
                </span>
                <div>
                  <p className="text-lg text-white transition-colors group-hover:[color:var(--accent)]">
                    {item.role}
                  </p>
                  <p className="text-sm text-white/50">{item.place}</p>
                </div>
              </div>
              <span className="font-mono text-sm text-white/50 tabular-nums">{item.year}</span>
            </div>
          ))}
        </div>
      </div>
      {/* bridge into the Work vortex */}
      <div className="about-outro mx-auto mt-40 flex max-w-4xl flex-col items-center gap-3 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">Keep scrolling</p>
        <p className="text-2xl font-medium text-white/90 sm:text-3xl">Into the work.</p>
      </div>
    </section>
  );
}
