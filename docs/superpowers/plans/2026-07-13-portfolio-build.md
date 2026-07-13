# Sid Portfolio Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js + React Three Fiber designer portfolio: loader → hero → about → scroll-driven vortex work section → category galleries → project detail pages → contact page, with a capsule nav.

**Architecture:** Next.js App Router site. One shared R3F canvas-based scene for the home page's Work vortex (GSAP ScrollTrigger drives camera dive). Category gallery pages and project detail pages are plain React/Tailwind (no 3D) reading from a single typed placeholder data source. Contact page is static UI, no backend.

**Tech Stack:** Next.js 14 (App Router, TS), React Three Fiber + drei, three.js, GSAP + ScrollTrigger, Framer Motion, Tailwind CSS.

## Global Constraints
- No anime.js — GSAP (scroll/timeline), Framer Motion (UI/page transitions), R3F/three.js (3D) only.
- No backend/API for contact form — client-side success state only.
- Respect `prefers-reduced-motion`: disable vortex camera travel and parallax, fall back to fades/static frame.
- Placeholder project data: 6 `ui-ux` + 6 `graphic-design` entries in one typed array.
- No unit-test framework for this project (per spec: visual product, manual browser verification). Every task's "verify" step is: run `npm run dev`, load the relevant route, confirm the described behavior, then check `npm run build` still succeeds before committing.
- Bio line (exact, used verbatim in Hero): "I'm sid, a UI/UX designer and graphic designer and i believe nothing is better than designing at 1AM with some music."
- Nav items exact: `SG` (mark/home link), `UI/UX` (→ `/ui-ux`), `Graphic Design` (→ `/graphic-design`), `Contact` (→ `/contact`).

---

### Task 1: Scaffold Next.js project + dependencies

**Files:**
- Create: whole project scaffold via `create-next-app` (package.json, tsconfig.json, app/layout.tsx, app/page.tsx, app/globals.css, tailwind.config.ts, next.config.js)

**Interfaces:**
- Produces: base Next.js app runnable with `npm run dev`, Tailwind available in all files via `globals.css` import in `app/layout.tsx`.

- [ ] **Step 1: Scaffold**

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm --yes
```

- [ ] **Step 2: Install 3D/animation deps**

```bash
npm install three @react-three/fiber @react-three/drei gsap framer-motion
npm install -D @types/three
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, load `http://localhost:3000`, confirm default Next.js page renders with no console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with three.js/gsap/framer-motion deps"
```

---

### Task 2: Placeholder project data

**Files:**
- Create: `lib/projects.ts`

**Interfaces:**
- Produces:
```ts
export type Category = 'ui-ux' | 'graphic-design';
export type Project = {
  id: string;
  slug: string;
  category: Category;
  title: string;
  blurb: string;
  problem: string;
  approach: string;
  outcome: string;
  accent: string; // hex color, used as placeholder card background
};
export const projects: Project[];
export function getProject(slug: string): Project | undefined;
export function getByCategory(category: Category): Project[];
```
- Consumed by: Nav (none directly), WorkVortex (Task 8), Gallery (Task 11), project detail page (Task 12).

- [ ] **Step 1: Write the data file**

```ts
// lib/projects.ts
export type Category = 'ui-ux' | 'graphic-design';

export type Project = {
  id: string;
  slug: string;
  category: Category;
  title: string;
  blurb: string;
  problem: string;
  approach: string;
  outcome: string;
  accent: string;
};

export const projects: Project[] = [
  { id: '1', slug: 'flowbank-mobile-banking', category: 'ui-ux', title: 'FlowBank Mobile Banking', blurb: 'Redesigning everyday banking for speed and trust.', problem: 'Users abandoned transfers mid-flow due to unclear confirmation states.', approach: 'Simplified the transfer flow to three steps with real-time validation and a single confirmation screen.', outcome: 'Reduced transfer abandonment and support tickets related to failed transfers.', accent: '#6C5CE7' },
  { id: '2', slug: 'orbit-analytics-dashboard', category: 'ui-ux', title: 'Orbit Analytics Dashboard', blurb: 'Turning dense data into a dashboard people actually read.', problem: 'Analysts ignored the dashboard because key metrics were buried below the fold.', approach: 'Rebuilt the information hierarchy around a single primary metric per view with drill-down navigation.', outcome: 'Daily active dashboard usage grew across the analyst team.', accent: '#00B894' },
  { id: '3', slug: 'nimbus-travel-app', category: 'ui-ux', title: 'Nimbus Travel App', blurb: 'A booking flow that feels like planning a trip, not filling a form.', problem: 'The multi-step booking flow had high drop-off at payment.', approach: 'Merged trip details and payment into a single scrollable summary with inline editing.', outcome: 'Booking completion rate improved measurably in usability testing.', accent: '#0984E3' },
  { id: '4', slug: 'pulse-health-tracker', category: 'ui-ux', title: 'Pulse Health Tracker', blurb: 'Making daily health data feel encouraging, not clinical.', problem: 'Users felt anxious rather than motivated by the existing data-heavy UI.', approach: 'Shifted the visual language toward soft charts and milestone-based encouragement copy.', outcome: 'Improved week-two retention in early cohort testing.', accent: '#E17055' },
  { id: '5', slug: 'lumen-design-system', category: 'ui-ux', title: 'Lumen Design System', blurb: 'One system, every product surface.', problem: 'Three product teams maintained three inconsistent component libraries.', approach: 'Consolidated into a token-based system with documented usage guidelines.', outcome: 'Cut new-feature UI build time and eliminated visual drift across products.', accent: '#FDCB6E' },
  { id: '6', slug: 'atlas-onboarding-flow', category: 'ui-ux', title: 'Atlas Onboarding Flow', blurb: 'First impressions, redesigned.', problem: 'New users dropped off before reaching the core product value.', approach: 'Replaced a 7-screen onboarding tour with a 2-screen flow plus contextual in-product tips.', outcome: 'More new users reached activation in the first session.', accent: '#00CEC9' },
  { id: '7', slug: 'midnight-type-specimen', category: 'graphic-design', title: 'Midnight Type Specimen', blurb: 'A type specimen series shot entirely at 1AM.', problem: 'Wanted to explore typography outside a client-brief context.', approach: 'Designed a self-initiated specimen series pairing display type with long-exposure photography.', outcome: 'Selected for a small design-community feature.', accent: '#2D3436' },
  { id: '8', slug: 'echo-record-label-identity', category: 'graphic-design', title: 'Echo Record Label Identity', blurb: 'Visual identity for an independent record label.', problem: 'The label had no consistent visual identity across releases.', approach: 'Built a modular identity system: one mark, a strict grid, and a rotating duotone palette per release.', outcome: 'Consistent brand recognition across a dozen releases.', accent: '#D63031' },
  { id: '9', slug: 'grove-coffee-packaging', category: 'graphic-design', title: 'Grove Coffee Packaging', blurb: 'Packaging system for a small-batch coffee roaster.', problem: 'Shelf presence was weak against larger competing brands.', approach: 'Designed a bold single-color-per-origin packaging system with hand-drawn botanical marks.', outcome: 'Noticeable increase in shelf pick-up during in-store testing.', accent: '#6C5CE7' },
  { id: '10', slug: 'signal-festival-poster-series', category: 'graphic-design', title: 'Signal Festival Poster Series', blurb: 'A poster series for an experimental music festival.', problem: 'Needed a visual system flexible enough for a multi-day, multi-genre lineup.', approach: 'Built a generative grid system where each poster is a variation of the same rule set.', outcome: 'Series used across print, social, and venue signage.', accent: '#0984E3' },
  { id: '11', slug: 'anchor-editorial-layout', category: 'graphic-design', title: 'Anchor Editorial Layout', blurb: 'Editorial layout system for a design magazine.', problem: 'Long-form articles felt visually flat and interchangeable.', approach: 'Introduced a strict baseline grid with variable column widths tied to article type.', outcome: 'Improved read-through rate reported by the editorial team.', accent: '#00B894' },
  { id: '12', slug: 'nocturne-motion-titles', category: 'graphic-design', title: 'Nocturne Motion Titles', blurb: 'Title sequence design for an independent short film.', problem: 'The film needed titles that set tone without a large motion budget.', approach: 'Designed a minimal kinetic-type sequence built entirely from the film’s own color palette.', outcome: 'Praised in festival reviews as a highlight of the film’s craft.', accent: '#FDCB6E' },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getByCategory(category: Category) {
  return projects.filter((p) => p.category === category);
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — confirm no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/projects.ts
git commit -m "feat: add placeholder project data"
```

---

### Task 3: Capsule nav

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/layout.tsx` (render `<Nav />` inside `<body>`, above `{children}`)

**Interfaces:**
- Produces: `export default function Nav(): JSX.Element` — client component (`'use client'`), uses `usePathname()` from `next/navigation` for active-route state.
- Consumes: nothing external.

- [ ] **Step 1: Write the component**

```tsx
// components/Nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const links = [
  { href: '/ui-ux', label: 'UI/UX' },
  { href: '/graphic-design', label: 'Graphic Design' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-2 backdrop-blur-xl">
        <Link
          href="/"
          className="px-4 py-2 text-sm font-semibold tracking-tight text-white rounded-full hover:bg-white/10 transition-colors"
        >
          SG
        </Link>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <motion.div key={link.href} whileHover={{ y: -2 }} className="relative">
              <Link
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-full transition-colors block"
              >
                {link.label}
              </Link>
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Wire into layout**

In `app/layout.tsx`, import `Nav` and render `<Nav />` as the first child of `<body>`, before `{children}`.

- [ ] **Step 3: Verify**

Run: `npm run dev`, load `/`, confirm capsule nav renders centered top, links navigate to `/ui-ux`, `/graphic-design`, `/contact` (pages may 404 until later tasks — confirm URL changes correctly).

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/layout.tsx
git commit -m "feat: add capsule nav bar"
```

---

### Task 4: Loader

**Files:**
- Create: `components/Loader.tsx`

**Interfaces:**
- Produces: `export default function Loader({ onDone }: { onDone: () => void }): JSX.Element` — client component. Runs a GSAP progress animation 0→100 over ~1.8s, then fades/wipes out and calls `onDone`.
- Consumed by: `app/page.tsx` (Task 9).

- [ ] **Step 1: Write the component**

```tsx
// components/Loader.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: onDone,
        });
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(Math.round(counter.value)),
    });

    tl.to(barRef.current, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0);

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="mb-6 h-px w-48 overflow-hidden bg-white/20">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-white" />
      </div>
      <span className="text-sm tabular-nums text-white/60">{progress}%</span>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Standalone: temporarily render `<Loader onDone={() => console.log('done')} />` in `app/page.tsx`, run `npm run dev`, confirm progress counts to 100 then the panel wipes up and `"done"` logs to console. Revert the temporary render (Task 9 wires it properly).

- [ ] **Step 3: Commit**

```bash
git add components/Loader.tsx
git commit -m "feat: add loader"
```

---

### Task 5: Hero section

**Files:**
- Create: `components/home/Hero.tsx`

**Interfaces:**
- Produces: `export default function Hero(): JSX.Element` — server-renderable markup (client only if it needs a small R3F particle background; keep particles simple/optional — if included, wrap in a small client subcomponent).
- Consumed by: `app/page.tsx` (Task 9).

- [ ] **Step 1: Write the component**

```tsx
// components/home/Hero.tsx
export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="max-w-3xl text-3xl font-medium leading-snug tracking-tight text-white sm:text-5xl">
        I&apos;m sid, a UI/UX designer and graphic designer and i believe nothing is
        better than designing at 1AM with some music.
      </h1>
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px animate-pulse bg-white/40" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/`, confirm hero text centered, readable, scroll cue visible at bottom.

- [ ] **Step 3: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "feat: add hero section"
```

---

### Task 6: About section

**Files:**
- Create: `components/home/About.tsx`

**Interfaces:**
- Produces: `export default function About(): JSX.Element`.
- Consumed by: `app/page.tsx` (Task 9).

- [ ] **Step 1: Write the component**

```tsx
// components/home/About.tsx
const experience = [
  { year: '2024 — Now', role: 'Product Designer', place: 'Freelance / Independent' },
  { year: '2022 — 2024', role: 'UI/UX Designer', place: 'Product Studio' },
  { year: '2020 — 2022', role: 'Graphic Designer', place: 'Design Agency' },
];

export default function About() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-16 bg-black px-6 py-32 text-white sm:flex-row sm:gap-24">
      <div className="sm:w-1/2">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">About</span>
        <p className="mt-6 text-xl leading-relaxed text-white/80">
          Designer working across UI/UX and graphic design — obsessed with the
          small details that make an interface feel considered, not just built.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-6">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Experience</span>
        {experience.map((item) => (
          <div key={item.role} className="flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-lg text-white">{item.role}</p>
              <p className="text-sm text-white/50">{item.place}</p>
            </div>
            <span className="text-sm text-white/40">{item.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/`, scroll past hero, confirm About section renders bio + experience list.

- [ ] **Step 3: Commit**

```bash
git add components/home/About.tsx
git commit -m "feat: add about section"
```

---

### Task 7: Work vortex 3D scene

**Files:**
- Create: `components/home/WorkVortex.tsx`

**Interfaces:**
- Produces: `export default function WorkVortex(): JSX.Element` — client component (`'use client'`). Renders a pinned section with an R3F `<Canvas>`; GSAP ScrollTrigger scrubs camera Z-position and scene rotation as the user scrolls through the section; 12 `projects` entries (from `lib/projects.ts`) are placed as planes on a helix, each raycast-clickable navigating via `next/navigation`'s `useRouter().push('/work/' + slug)`.
- Consumes: `projects` from `lib/projects.ts` (Task 2).

- [ ] **Step 1: Write the component**

```tsx
// components/home/WorkVortex.tsx
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { projects } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 4.5;
const HEIGHT_SPAN = 26;

function ArtworkPlane({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const router = useRouter();

  const angle = (index / projects.length) * Math.PI * 4;
  const y = HEIGHT_SPAN / 2 - (index / (projects.length - 1)) * HEIGHT_SPAN;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.1 + angle;
    ref.current.position.x = Math.cos(t) * RADIUS;
    ref.current.position.z = Math.sin(t) * RADIUS;
    ref.current.position.y = y;
    ref.current.lookAt(0, y, 0);
  });

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/work/${project.slug}`);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <planeGeometry args={[1.6, 1.1]} />
      <meshStandardMaterial color={project.accent} />
    </mesh>
  );
}

function CameraRig({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      camera.position.set(0, 0, 8);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      scrub: 1,
      pin: true,
      onUpdate: (self) => {
        camera.position.z = 12 - self.progress * 10;
        camera.position.y = HEIGHT_SPAN / 2 - self.progress * HEIGHT_SPAN;
        camera.lookAt(0, camera.position.y, 0);
      },
    });

    return () => st.kill();
  }, [camera, sectionRef]);

  return null;
}

export default function WorkVortex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => projects, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full bg-black">
      <div className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-white">
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <h2 className="mt-2 text-4xl font-semibold">Work</h2>
      </div>
      <Canvas camera={{ position: [0, HEIGHT_SPAN / 2, 12], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <CameraRig sectionRef={sectionRef} />
        {items.map((project, i) => (
          <ArtworkPlane key={project.id} project={project} index={i} />
        ))}
      </Canvas>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/`, scroll to the Work section, confirm: section pins, colored planes swirl around the vertical axis and appear to travel past the camera while scrolling, clicking a plane navigates to `/work/<slug>` (route may 404 until Task 12 — confirm URL is correct). Test with OS "reduce motion" on: confirm camera stays static instead of scrubbing.

- [ ] **Step 3: Commit**

```bash
git add components/home/WorkVortex.tsx
git commit -m "feat: add scroll-driven work vortex 3D scene"
```

---

### Task 8: Footer

**Files:**
- Create: `components/Footer.tsx`

**Interfaces:**
- Produces: `export default function Footer(): JSX.Element`.

- [ ] **Step 1: Write the component**

```tsx
// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-white/10 bg-black px-6 py-12 text-white/50 sm:flex-row sm:justify-between">
      <span className="text-sm">© {new Date().getFullYear()} Sid</span>
      <Link href="/contact" className="text-sm text-white hover:underline">
        Contact
      </Link>
    </footer>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, confirm footer renders once wired into a page (wired in Task 9/11/12/13).

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add footer"
```

---

### Task 9: Compose home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Loader` (Task 4), `Hero` (Task 5), `About` (Task 6), `WorkVortex` (Task 7), `Footer` (Task 8).

- [ ] **Step 1: Write the page**

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import Loader from '@/components/Loader';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WorkVortex from '@/components/home/WorkVortex';
import Footer from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <main>
        <Hero />
        <About />
        <WorkVortex />
        <Footer />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/`, confirm full sequence: loader → hero → about → work vortex (scrollable/pinned/clickable) → footer.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose home page flow"
```

---

### Task 10: Shared gallery component + category pages

**Files:**
- Create: `components/Gallery.tsx`
- Create: `app/ui-ux/page.tsx`
- Create: `app/graphic-design/page.tsx`

**Interfaces:**
- Produces: `Gallery({ category }: { category: Category }): JSX.Element` — grid of `Project` cards linking to `/work/[slug]`.
- Consumes: `getByCategory`, `Project`, `Category` from `lib/projects.ts` (Task 2); `Footer` (Task 8).

- [ ] **Step 1: Write the gallery component**

```tsx
// components/Gallery.tsx
import Link from 'next/link';
import { Category, getByCategory } from '@/lib/projects';

export default function Gallery({ category }: { category: Category }) {
  const items = getByCategory(category);
  const title = category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';

  return (
    <section className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
      <h1 className="mb-16 text-4xl font-semibold">{title}</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="group flex aspect-[4/3] flex-col justify-end rounded-lg p-6 transition-transform hover:-translate-y-1"
            style={{ backgroundColor: project.accent }}
          >
            <h2 className="text-lg font-semibold text-white">{project.title}</h2>
            <p className="mt-1 text-sm text-white/80">{project.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write the category pages**

```tsx
// app/ui-ux/page.tsx
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function UiUxPage() {
  return (
    <>
      <Gallery category="ui-ux" />
      <Footer />
    </>
  );
}
```

```tsx
// app/graphic-design/page.tsx
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function GraphicDesignPage() {
  return (
    <>
      <Gallery category="graphic-design" />
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, load `/ui-ux` and `/graphic-design`, confirm 6 project cards each, correct titles/colors, links point to `/work/<slug>`.

- [ ] **Step 4: Commit**

```bash
git add components/Gallery.tsx app/ui-ux/page.tsx app/graphic-design/page.tsx
git commit -m "feat: add category gallery pages"
```

---

### Task 11: Project detail page

**Files:**
- Create: `app/work/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProject`, `projects` from `lib/projects.ts` (Task 2); `Footer` (Task 8).
- Produces: `generateStaticParams` returning all slugs; `notFound()` for unknown slugs.

- [ ] **Step 1: Write the page**

```tsx
// app/work/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, projects } from '@/lib/projects';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const categoryLabel = project.category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';
  const categoryHref = project.category === 'ui-ux' ? '/ui-ux' : '/graphic-design';

  return (
    <>
      <article className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-3xl">
          <div
            className="mb-12 aspect-[16/9] w-full rounded-lg"
            style={{ backgroundColor: project.accent }}
          />
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">{categoryLabel}</span>
          <h1 className="mt-3 text-4xl font-semibold">{project.title}</h1>
          <p className="mt-4 text-lg text-white/70">{project.blurb}</p>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Problem</h2>
              <p className="mt-3 text-white/80">{project.problem}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Approach</h2>
              <p className="mt-3 text-white/80">{project.approach}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Outcome</h2>
              <p className="mt-3 text-white/80">{project.outcome}</p>
            </div>
          </div>

          <Link href={categoryHref} className="mt-20 inline-block text-sm text-white/60 hover:text-white">
            ← Back to {categoryLabel}
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/work/flowbank-mobile-banking` and `/work/echo-record-label-identity`, confirm correct content per project; load `/work/does-not-exist`, confirm Next.js not-found page renders.

- [ ] **Step 3: Commit**

```bash
git add app/work/
git commit -m "feat: add project detail page"
```

---

### Task 12: Contact page

**Files:**
- Create: `app/contact/page.tsx`

**Interfaces:**
- Produces: client component, static form with local success state, no network call.

- [ ] **Step 1: Write the page**

```tsx
// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="flex min-h-screen flex-col justify-center bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto w-full max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">Contact</span>
          <a
            href="mailto:hello@sid.design"
            className="mt-6 block text-4xl font-semibold transition-opacity hover:opacity-70 sm:text-6xl"
          >
            hello@sid.design
          </a>

          <div className="mt-16 flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Dribbble</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>

          {sent ? (
            <p className="mt-16 text-white/70">Thanks — I&apos;ll get back to you soon.</p>
          ) : (
            <form
              className="mt-16 flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                required
                placeholder="Name"
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <textarea
                required
                placeholder="Message"
                rows={4}
                className="border-b border-white/20 bg-transparent py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="mt-4 w-fit rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, load `/contact`, confirm large email link + socials render, fill and submit form, confirm success message replaces the form with no network request (check Network tab empty).

- [ ] **Step 3: Commit**

```bash
git add app/contact/
git commit -m "feat: add contact page"
```

---

### Task 13: Final polish pass

**Files:**
- Modify: `app/globals.css` (base font, background color, scrollbar reset)
- Modify: `app/layout.tsx` (metadata: title/description)

**Interfaces:** none new.

- [ ] **Step 1: Set base styles**

In `app/globals.css`, ensure `html, body { background: #000; color: #fff; }` and a system sans font stack is applied via Tailwind's base layer (no new font dependency needed for v1).

- [ ] **Step 2: Set metadata**

In `app/layout.tsx`, set `export const metadata = { title: 'Sid — UI/UX & Graphic Design', description: "I'm sid, a UI/UX designer and graphic designer." }`.

- [ ] **Step 3: Full build verification**

```bash
npm run build
```

Expected: build succeeds with no type errors. Then `npm run dev` and click through every route from the nav and from the work vortex to confirm no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "chore: final polish pass"
```
