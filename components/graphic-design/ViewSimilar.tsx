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
        <span className="text-sm font-medium text-white/70">View similar</span>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {similar.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            >
              <Link href={`/work/${project.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <Image
                    src={project.cover}
                    alt={project.coverAlt}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{project.title}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
