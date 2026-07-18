'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { uiuxProjects } from '@/lib/uiux';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
          <h1 className="text-balance text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[0.98] tracking-tight">
            Whole products, not pretty screens.
          </h1>
          <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-white/60">
            A courier app, a festival’s two products, a real course page rebuilt uninvited, a
            prediction market, a techno-fest site. Each one is a full flow — onboarding to checkout —
            shown the way it actually moves, inside a phone or a browser, with the honest notes left in.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {uiuxProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              {/* Image on top, then the title + details below it — no overlay. */}
              <Link href={`/work/${project.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image
                    src={project.cover}
                    alt={project.coverAlt}
                    fill
                    sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <div className="mt-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {project.discipline}
                  </span>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-white">
                    {project.title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
