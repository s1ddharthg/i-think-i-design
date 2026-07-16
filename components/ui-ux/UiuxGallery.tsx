'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { uiuxProjects } from '@/lib/uiux';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const WIDE_EVERY = 3;

export default function UiuxGallery() {
  const reduce = useReducedMotion();

  return (
    <section className="min-h-screen bg-black px-6 pt-32 pb-24 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">UI/UX</span>
          <h1 className="mt-5 text-balance text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[0.98] tracking-tight">
            Whole products, not pretty screens.
          </h1>
          <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-white/60">
            A courier app, a festival’s two products, a real course page rebuilt uninvited, a
            prediction market. Each one is a full flow — onboarding to checkout — shown the way it
            actually moves, inside a phone or a browser, with the honest notes left in.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {uiuxProjects.map((project, i) => {
            const wide = (i + 1) % WIDE_EVERY === 0;
            return (
              <motion.div
                key={project.slug}
                className={wide ? 'sm:col-span-2' : ''}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className={`group relative flex w-full flex-col justify-end overflow-hidden rounded-xl ${
                    wide ? 'aspect-[16/9]' : 'aspect-[4/5]'
                  }`}
                >
                  <Image
                    src={project.cover}
                    alt={project.coverAlt}
                    fill
                    sizes={wide ? '90vw' : '45vw'}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="relative p-6">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                      {project.index} · {project.discipline}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold text-white">{project.title}</h2>
                    <p className="mt-1 text-sm text-white/70">{project.tagline}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
