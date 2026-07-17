'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { graphicProjects } from '@/lib/graphicDesign';
import { uiuxProjects } from '@/lib/uiux';
import { drawFramedArtwork } from '@/lib/poster';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 7.6;
const HEIGHT_SPAN = 30;
const PLANE_W = 4.4;
const PLANE_H = 2.93;
// Progress-driven radial pull: the ring contracts toward the camera's dolly
// path as you scroll deeper, so items visibly move toward the screen on top
// of the camera's own forward dolly.
const CONTRACTION = 0.4;

type VortexItem = {
  slug: string;
  title: string;
  accent: string;
  category: 'ui-ux' | 'graphic-design';
  cover: string;
};

type SharedProgress = { smoothed: number };

const UIUX_ACCENTS = ['#eeff00', '#fff35c', '#d4ff3d', '#f5ff8a', '#e8ff00'];

// Every real project — graphic + UI/UX — one plane each, interleaved so the
// dive alternates disciplines instead of showing one block then the other.
function buildItems(): VortexItem[] {
  const g: VortexItem[] = graphicProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    accent: '#ffffff',
    category: 'graphic-design',
    cover: p.cover,
  }));
  const u: VortexItem[] = uiuxProjects.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    accent: UIUX_ACCENTS[i % UIUX_ACCENTS.length],
    category: 'ui-ux',
    cover: p.cover,
  }));
  const out: VortexItem[] = [];
  const max = Math.max(g.length, u.length);
  for (let i = 0; i < max; i++) {
    if (u[i]) out.push(u[i]);
    if (g[i]) out.push(g[i]);
  }
  return out;
}

function usePrefersReducedMotion() {
  return useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
}

// One canvas texture per project, at a high enough resolution that the
// larger planes stay sharp instead of blurring up.
function useCoverTextures(items: VortexItem[]) {
  const map = useMemo(() => {
    const m = new Map<string, THREE.CanvasTexture>();
    // Canvas/texture creation needs a DOM — r3f's <Canvas> never renders its
    // children during SSR, but this hook runs one level above it in
    // WorkVortex, so it executes on the server too and must no-op there.
    if (typeof document === 'undefined') return m;
    items.forEach((item) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1536;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) drawFramedArtwork(ctx, canvas.width, canvas.height, item.slug, item.accent, item.category, item.title);
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      m.set(item.slug, t);
    });
    return m;
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    items.forEach((item) => {
      const texture = map.get(item.slug);
      if (!texture) return;
      const img = new window.Image();
      img.src = item.cover;
      img.onload = () => {
        if (cancelled) return;
        const canvas = texture.image as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        try {
          drawFramedArtwork(ctx, canvas.width, canvas.height, item.slug, item.accent, item.category, item.title, img);
          texture.needsUpdate = true;
        } catch (err) {
          // Some source SVGs (e.g. ones exported with <foreignObject>) taint
          // any canvas they're drawn into per spec, even same-origin — WebGL
          // then refuses to upload that canvas as a texture and throws.
          // One bad asset must never crash the whole scene: leave this plane
          // on its generated-poster fallback (already drawn, pre-cover-load)
          // and keep going.
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`WorkVortex: couldn't draw cover for "${item.slug}" into canvas`, err);
          }
        }
      };
    });
    return () => {
      cancelled = true;
    };
  }, [items, map]);

  useEffect(() => () => map.forEach((t) => t.dispose()), [map]);

  return map;
}

function ArtworkPlane({
  item,
  texture,
  index,
  count,
  progressRef,
}: {
  item: VortexItem;
  texture: THREE.CanvasTexture | undefined;
  index: number;
  count: number;
  progressRef: React.RefObject<SharedProgress>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const boost = useRef(0);
  const ndc = useMemo(() => new THREE.Vector3(), []);

  const angle = (index / count) * Math.PI * 6;
  const y = HEIGHT_SPAN / 2 - (index / (count - 1)) * HEIGHT_SPAN;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = reduceMotion ? 0 : progressRef.current.smoothed;
    const radius = RADIUS * (1 - p * CONTRACTION);
    const t = (reduceMotion ? 0 : state.clock.elapsedTime * 0.1) + angle;
    ref.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
    ref.current.lookAt(0, y, 0);
    if (reduceMotion) return;

    const dist = ref.current.position.distanceTo(state.camera.position);
    const near = THREE.MathUtils.clamp(1 - (dist - 2.8) / 6.5, 0, 1);

    ndc.copy(ref.current.position).project(state.camera);
    let hover = 0;
    if (Math.abs(ndc.z) <= 1) {
      const d = Math.hypot(ndc.x - state.pointer.x, ndc.y - state.pointer.y);
      hover = THREE.MathUtils.clamp(1 - d / 0.4, 0, 1);
    }

    const target = Math.min(near * 0.7 + hover * 0.6, 1);
    boost.current = THREE.MathUtils.damp(boost.current, target, 6, delta);

    ref.current.scale.setScalar(1 + boost.current * 0.3);
    ref.current.rotateX(-0.16 * boost.current);
    ref.current.rotateZ(0.05 * Math.sin(state.clock.elapsedTime * 0.8 + index) * boost.current);
    matRef.current?.color.setScalar(0.82 + boost.current * 0.42);
  });

  if (!texture) return null;

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/work/${item.slug}`);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} />
    </mesh>
  );
}

function CameraRig({
  sectionRef,
  progressRef,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<SharedProgress>;
}) {
  const { camera } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const raw = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (reduceMotion) {
      camera.position.set(0, 0, 11);
      camera.lookAt(0, 0, 0);
      return;
    }
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=260%',
      scrub: true,
      pin: true,
      pinType: 'transform',
      onUpdate: (self) => {
        raw.current = self.progress;
      },
    });
    // This canvas is code-split (next/dynamic) and mounts well after Lenis
    // has already cached the document's scroll limit — refresh immediately
    // so Lenis picks up the pinned range this trigger just added, instead of
    // waiting for some other, unrelated refresh to happen to notice.
    ScrollTrigger.refresh();
    return () => {
      st.kill();
    };
  }, [camera, sectionRef, reduceMotion]);

  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    if (reduceMotion) return;
    progressRef.current.smoothed = THREE.MathUtils.damp(progressRef.current.smoothed, raw.current, 4, delta);
    const p = progressRef.current.smoothed;
    camera.position.z = 15 - p * 13;
    camera.position.y = HEIGHT_SPAN / 2 - p * HEIGHT_SPAN;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 1.1, 3, delta);
    camera.lookAt(0, camera.position.y, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

export default function WorkVortex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => buildItems(), []);
  const textures = useCoverTextures(items);
  const progressRef = useRef<SharedProgress>({ smoothed: 0 });

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
      gsap.to(headingRef.current, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=60%', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work-vortex" className="relative h-screen w-full">
      <div
        ref={headingRef}
        className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-center text-white"
      >
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Dive <span style={{ color: 'var(--accent)' }}>in.</span>
        </h2>
      </div>
      <Canvas camera={{ position: [0, HEIGHT_SPAN / 2, 15], fov: 50 }} dpr={[1, 1.75]}>
        <CameraRig sectionRef={sectionRef} progressRef={progressRef} />
        {items.map((item, i) => (
          <ArtworkPlane
            key={item.slug}
            item={item}
            texture={textures.get(item.slug)}
            index={i}
            count={items.length}
            progressRef={progressRef}
          />
        ))}
      </Canvas>
    </section>
  );
}
