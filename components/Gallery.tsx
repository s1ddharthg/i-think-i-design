'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Category, getByCategory, Project } from '@/lib/projects';
import Poster from '@/components/Poster';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const [magnetic, setMagnetic] = useState(false);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    // Deferred to an effect on purpose: matchMedia is unavailable during SSR,
    // so this stays false on the server and first client render, then
    // resolves post-mount — swapping to a lazy useState initializer would
    // read window during render and reintroduce a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMagnetic(
      !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }, [reduceMotion]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: (index % 3) * 0.08 }}
      style={{ x: sx, y: sy }}
      onPointerEnter={(e) => {
        if (!magnetic) return;
        // See Footer's MagneticCTA: cache the rect once per hover instead of
        // reading layout on every pointermove while transform is animating.
        rectRef.current = e.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(e) => {
        if (!magnetic) return;
        const r = rectRef.current ?? e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 10);
        y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg p-6"
      >
        <Poster
          slug={project.slug}
          accent={project.accent}
          width={640}
          height={480}
          className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <h2 className="relative text-lg font-semibold text-white">{project.title}</h2>
        <p className="relative mt-1 text-sm text-white/80">{project.blurb}</p>
      </Link>
    </motion.div>
  );
}

export default function Gallery({ category }: { category: Category }) {
  const items = getByCategory(category);
  const title = category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';

  return (
    <section className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
      <h1 className="mb-16 text-4xl font-semibold">{title}</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
