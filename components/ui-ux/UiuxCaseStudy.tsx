'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Quote } from 'lucide-react';
import type { UiuxProject } from '@/lib/uiux';
import { uiuxProjects } from '@/lib/uiux';
import SectionFlow from '@/components/ui-ux/SectionFlow';
import BackButton from '@/components/BackButton';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function UiuxCaseStudy({ project }: { project: UiuxProject }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(project.sections[0]?.id);
  const activeSection = project.sections.find((s) => s.id === active) ?? project.sections[0];

  const boards = (project.extras ?? []).filter((e) => e.kind === 'board');
  const compares = (project.extras ?? []).filter((e) => e.kind === 'compare');

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <article className="bg-black text-white">
      <BackButton />

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-6xl items-center justify-end px-6 pt-20 pb-4">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-xs text-white/50 sm:flex">
          <Link href="/" className="hover:text-white">Sid</Link>
          <span>/</span>
          <Link href="/ui-ux" className="hover:text-white">UI/UX</Link>
          <span>/</span>
          <span className="text-white/70">{project.title}</span>
        </nav>
      </div>

      {/* Hero cover — contained, no dramatic crop */}
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

      {/* Overview */}
      <div className="mx-auto max-w-4xl px-6 pt-12 pb-6">
        <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
          <h1 className="text-balance text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold leading-[0.98] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/60">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
              {project.discipline}
            </span>
            {project.roles.map((r) => (
              <span key={r} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/50">{r}</span>
            ))}
            {project.externalLink && (
              <a
                href={project.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition-colors duration-200 ease-out hover:border-white/30 hover:text-white"
              >
                {project.externalLink.label}
                <ExternalLink className="h-3 w-3" strokeWidth={2} />
              </a>
            )}
          </div>
        </motion.div>

        <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="mt-10 border-t border-white/10 pt-10">
          <p className="text-pretty max-w-[62ch] text-lg leading-relaxed text-white/80">{project.brief}</p>
        </motion.div>

        {/* The thinking — the PM layer: pain points, competitive landscape,
            approach, and how success would’ve been measured. */}
        {project.process && (
          <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={fadeUp} className="mt-20">
            <h2 className="text-2xl font-semibold tracking-tight text-white/95">The thinking</h2>

            <div className="mt-8 border-t border-white/10 pt-8">
              <h3 className="text-lg font-semibold text-white/90">The problem</h3>
              <div className={project.process.businessPain ? 'mt-4 grid gap-6 sm:grid-cols-2' : 'mt-4'}>
                <p className="text-pretty leading-relaxed text-white/75">{project.process.userPain}</p>
                {project.process.businessPain && (
                  <p className="text-pretty leading-relaxed text-white/75">{project.process.businessPain}</p>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-8">
              <h3 className="text-lg font-semibold text-white/90">The approach</h3>
              <p className="text-pretty mt-4 max-w-[68ch] leading-relaxed text-white/75">{project.process.competitors}</p>
              {project.process.approach && (
                <p className="text-pretty mt-4 max-w-[68ch] leading-relaxed text-white/75">{project.process.approach}</p>
              )}
            </div>

            {/* Outcome — hidden in production for now
            <div className="mt-8 border-t border-white/10 pt-8">
              <h3 className="text-lg font-semibold text-white/90">The outcome</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.process.kpis.map((k) => (
                  <li key={k} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">{k}</li>
                ))}
              </ul>
              <p className="text-pretty mt-4 max-w-[68ch] leading-relaxed text-white/85">{project.process.outcome}</p>
            </div>
            */}
          </motion.div>
        )}

        {/* Key decisions */}
        <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-white/95">Key decisions</h2>
          <ol className="mt-8 flex flex-col gap-7">
            {project.keyDecisions.map((d, i) => (
              <motion.li key={i} className="flex gap-5" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}>
                <span className="mt-1 shrink-0 font-mono text-sm text-white/50">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-pretty text-white/75">{d}</span>
              </motion.li>
            ))}
          </ol>
        </motion.div>

      </div>

      {/* Mockup showcase — the boards, before you interact with the flow */}
      {boards.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
          <div className="flex flex-col gap-10">
            {boards.map((b, i) => (
              <motion.figure key={i} initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.8, ease: EASE }}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <Image src={b.src} alt={b.alt} width={1600} height={1000} sizes="(max-width:768px) 92vw, 1100px" className="h-auto w-full" />
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      )}

      {/* Walkthrough — pinned left menu, screens flow up the device on the right */}
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-8">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 pr-4">
              <span className="text-sm font-medium text-white/70">Contents</span>
              <ul className="mt-5 flex flex-col gap-1">
                {project.sections.map((s) => {
                  const on = active === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex items-center gap-3 py-1.5"
                        onClick={(e) => {
                          e.preventDefault();
                          setActive(s.id);
                          const el = document.getElementById(s.id);
                          const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: object) => void } }).lenis;
                          if (el && lenis) lenis.scrollTo(el, { offset: -80 });
                          else el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span className={`h-px transition-all duration-300 ${on ? 'w-8 bg-white' : 'w-4 bg-white/20 group-hover:w-6 group-hover:bg-white/50'}`} />
                        <span className={`text-sm transition-colors ${on ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>{s.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSection?.id}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mt-8 max-w-[13rem] text-pretty text-sm leading-relaxed text-white/55"
                >
                  {activeSection?.blurb}
                </motion.p>
              </AnimatePresence>
            </div>
          </aside>

          <div>
            {project.sections.map((s) => (
              <SectionFlow key={s.id} section={s} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>

      {/* Before / after against the live site */}
      {compares.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-col gap-16">
            {compares.map((ex, i) => (
              <motion.figure key={i} initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease: EASE }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <figure>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <Image src={ex.before.src} alt={ex.before.alt} width={1500} height={1125} sizes="45vw" className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{ex.before.label}</figcaption>
                  </figure>
                  <figure>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <Image src={ex.after.src} alt={ex.after.alt} width={1500} height={1125} sizes="45vw" className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{ex.after.label}</figcaption>
                  </figure>
                </div>
                <figcaption className="mt-3 text-sm text-white/50">{ex.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      )}

      {/* Insight — the pull-quote, standing on its own */}
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-28">
        <motion.figure
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="group"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors duration-300 ease-out group-hover:border-white/40 group-hover:text-white/90">
              <Quote aria-hidden className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">Insight</span>
          </div>
          <blockquote className="text-balance mt-6 text-2xl font-medium leading-snug text-white/90 sm:text-3xl">
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

function ViewSimilar({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const i = uiuxProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const similar = [1, 2, 3].map((o) => uiuxProjects[(i + o) % uiuxProjects.length]);

  return (
    <section className="border-t border-white/10 bg-black px-6 py-24 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <span className="text-sm font-medium text-white/70">View similar</span>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {similar.map((p, k) => (
            <motion.div key={p.slug} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE, delay: k * 0.08 }}>
              <Link href={`/work/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image src={p.cover} alt={p.coverAlt} fill sizes="33vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
                </div>
                <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">{p.discipline}</span>
                <h3 className="mt-1 text-lg font-semibold text-white">{p.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
