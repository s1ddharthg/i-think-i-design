'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { graphicProjects } from '@/lib/graphicDesign';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Deliberate, hand-set order — not derived from catalog order or an auto
// "every nth card" rule. Pixalette and 15 Days of UI each get a full-width
// row; everything else runs three single-column cards per row.
const ORDER: { slug: string; wide?: boolean }[] = [
  { slug: 'velo' },
  { slug: 'moxie' },
  { slug: 'less-is-more' },
  { slug: 'pixalette', wide: true },
  { slug: 'pragyan-podcast' },
  { slug: 'festy-highlights' },
  { slug: 'pragyan-hackathon' },
  { slug: 'fifteen-days-of-ui', wide: true },
];

export default function GraphicGallery() {
  const reduce = useReducedMotion();
  const ordered = ORDER.map(({ slug, wide }) => ({
    project: graphicProjects.find((p) => p.slug === slug)!,
    wide,
  })).filter((o) => o.project);

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
            Give me one idea. I’ll cut everything else.
          </h1>
          <p className="mt-6 max-w-[62ch] text-pretty text-lg leading-relaxed text-white/60">
            A business question, a real haircare brand I made posters for uninvited, a hackathon
            deadline that very much did — hand me any of it and my first move is finding the one
            shape, color, or line that can carry the whole idea. Three of these had a real client
            and a real deadline. The rest exist because waiting for someone to hand me a brief felt
            slower than writing my own.
          </p>
        </motion.div>

        {/* Same card template as the UI/UX gallery: image on top, title and
            details below it, no overlay — one visual language across both
            sections. */}
        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3">
          {ordered.map(({ project, wide }, i) => (
            <motion.div
              key={project.slug}
              className={wide ? 'lg:col-span-3' : ''}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              <Link href={`/work/${project.slug}`} className="group block">
                <div
                  className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 ${
                    wide ? 'aspect-[21/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={project.cover}
                    alt={project.coverAlt}
                    fill
                    sizes={wide ? '(max-width:640px) 90vw, 90vw' : '(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw'}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold tracking-tight text-white">{project.title}</h2>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-white/55">{project.tagline}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
