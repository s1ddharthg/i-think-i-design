'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { GraphicProject } from '@/lib/graphicDesign';
import VisualSequence from '@/components/graphic-design/VisualSequence';
import ScrollVortex from '@/components/graphic-design/ScrollVortex';
import BackButton from '@/components/BackButton';
import ViewSimilar from '@/components/graphic-design/ViewSimilar';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CaseStudy({ project }: { project: GraphicProject }) {
  const reduce = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <article className="bg-black text-white">
      <ScrollVortex />

      <BackButton />

      <div className="mx-auto flex max-w-6xl items-center justify-end px-6 pt-20 pb-4">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-xs text-white/50 sm:flex">
          <Link href="/" className="hover:text-white">
            Sid
          </Link>
          <span>/</span>
          <Link href="/graphic-design" className="hover:text-white">
            Graphic Design
          </Link>
          <span>/</span>
          <span className="text-white/70">{project.title}</span>
        </nav>
      </div>

      {/* Hero cover — contained, same format as the UI/UX case studies. */}
      <div className="mx-auto max-w-6xl px-6">
        <div data-dive-target className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority
            loading="eager"
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-12 pb-24">
        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h1 className="text-balance text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold leading-[0.98] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/60">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {project.roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/50"
              >
                {r}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mt-10 border-t border-white/10 pt-10 sm:mt-12"
        >
          <p className="text-pretty max-w-[62ch] text-lg leading-relaxed text-white/80">
            {project.brief}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mt-20 sm:mt-24"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-white/95">Key decisions</h2>
          <ol className="mt-8 flex flex-col gap-7">
            {project.keyDecisions.map((d, i) => (
              <motion.li
                key={i}
                className="flex gap-5"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              >
                <span className="mt-1 shrink-0 font-mono text-sm text-white/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-pretty text-white/75">{d}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

      </div>

      <div className="mx-auto max-w-6xl px-6 pb-28">
        <VisualSequence visuals={project.visuals} />
      </div>

      {/* Insight — the pull-quote, standing on its own */}
      <div className="mx-auto max-w-3xl px-6 pb-32">
        <motion.figure
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="group"
        >
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/35">
            <span className="h-1 w-1 rounded-full bg-white/35 transition-colors duration-300 ease-out group-hover:bg-white/70" />
            Insight
          </span>
          <span aria-hidden className="mt-3 block font-serif text-6xl leading-none text-white/15 transition-colors duration-300 ease-out group-hover:text-white/35 sm:text-7xl">
            “
          </span>
          <blockquote className="text-balance -mt-3 text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
            {project.caption}
          </blockquote>
          <span
            aria-hidden
            className="mt-6 block h-px w-16 origin-left scale-x-75 bg-white/25 transition-all duration-300 ease-out group-hover:w-24 group-hover:scale-x-100 group-hover:bg-white/60"
          />
        </motion.figure>
      </div>

      <ViewSimilar slug={project.slug} />
    </article>
  );
}
