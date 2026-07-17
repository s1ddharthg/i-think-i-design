'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { graphicProjects, type GraphicProject } from '@/lib/graphicDesign';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Next three case studies after the current one, wrapping around — stable
// and deterministic, no randomness to keep track of.
function similarTo(slug: string): GraphicProject[] {
  const i = graphicProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return [];
  return [1, 2, 3].map((offset) => graphicProjects[(i + offset) % graphicProjects.length]);
}

export default function ViewSimilar({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const similar = similarTo(slug);

  return (
    <section className="border-t border-white/10 bg-black px-6 py-24 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs uppercase tracking-[0.3em] text-white/50"
        >
          View similar
        </motion.span>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {similar.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              <Link
                href={`/work/${project.slug}`}
                className="group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-xl"
              >
                <Image
                  src={project.cover}
                  alt={project.coverAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative p-5">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
