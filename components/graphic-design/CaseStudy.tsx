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

      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 pt-20 pb-4">
        <BackButton className="text-sm text-white/60 hover:text-white" />
        <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-xs text-white/40 sm:flex">
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

      {/* Fixed aspect ratio, standardised across every case study, so the
          cover plus the overview below it fits one desktop viewport
          regardless of the source image's native dimensions. */}
      <div className="relative aspect-[21/9] max-h-[58vh] w-full overflow-hidden bg-white/5">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-10 pb-24">
        <motion.div
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            {project.index} — Graphic Design
          </span>
          <h1 className="mt-5 text-balance text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold leading-[0.98] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/60">{project.tagline}</p>
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

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              My Role
            </span>
            <div className="flex flex-wrap gap-2">
              {project.roles.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-white/40">{project.role}</p>
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
                <span className="mt-1 shrink-0 font-mono text-sm text-white/30">
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

      <div className="mx-auto max-w-4xl px-6 pb-32">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">
            {project.reflectionHeading}
          </span>
          <p className="text-pretty mt-4 text-lg leading-relaxed text-white/70">
            {project.reflection}
          </p>
        </motion.div>
      </div>

      <ViewSimilar slug={project.slug} />
    </article>
  );
}
