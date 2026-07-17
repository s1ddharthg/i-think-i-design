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

const RADIUS = 4.8;
const HEIGHT_SPAN = 22;

type VortexItem = {
  slug: string;
  title: string;
  accent: string;
  category: 'ui-ux' | 'graphic-design';
  cover: string;
};

const UIUX_ACCENTS = ['#ffd34e', '#ff8a5c', '#8c96ff', '#57c98b', '#ff6f91'];

// Every real cover — graphic + UI/UX — interleaved so the dive alternates
// disciplines instead of showing one block then the other.
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

function ArtworkPlane({ item, index, count }: { item: VortexItem; index: number; count: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const boost = useRef(0);
  const ndc = useMemo(() => new THREE.Vector3(), []);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 430; // ~ the 2.4 x 1.6 plane
    const ctx = canvas.getContext('2d');
    if (ctx) drawFramedArtwork(ctx, canvas.width, canvas.height, item.slug, item.accent, item.category, item.title);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [item.slug, item.accent, item.category, item.title]);
  useEffect(() => () => texture.dispose(), [texture]);

  // Swap in the real cover photo once it loads.
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.src = item.cover;
    img.onload = () => {
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');
      if (cancelled || !canvas || !ctx) return;
      drawFramedArtwork(ctx, canvas.width, canvas.height, item.slug, item.accent, item.category, item.title, img);
      texture.needsUpdate = true;
    };
    return () => {
      cancelled = true;
    };
  }, [item.slug, item.accent, item.category, item.title, item.cover, texture]);

  const angle = (index / count) * Math.PI * 6;
  const y = HEIGHT_SPAN / 2 - (index / (count - 1)) * HEIGHT_SPAN;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = (reduceMotion ? 0 : state.clock.elapsedTime * 0.1) + angle;
    ref.current.position.set(Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS);
    ref.current.lookAt(0, y, 0);
    if (reduceMotion) return;

    const dist = ref.current.position.distanceTo(state.camera.position);
    const near = THREE.MathUtils.clamp(1 - (dist - 2.4) / 6, 0, 1);

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
      <planeGeometry args={[2.4, 1.6]} />
      <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} />
    </mesh>
  );
}

function CameraRig({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const { camera } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const progress = useRef(0);
  const smoothed = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (reduceMotion) {
      camera.position.set(0, 0, 9);
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
        progress.current = self.progress;
      },
    });
    return () => {
      st.kill();
    };
  }, [camera, sectionRef, reduceMotion]);

  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    if (reduceMotion) return;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, progress.current, 4, delta);
    const p = smoothed.current;
    camera.position.z = 13 - p * 11;
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
    <section ref={sectionRef} className="relative h-screen w-full">
      <div
        ref={headingRef}
        className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-center text-white"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Selected work</span>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Dive <span style={{ color: 'var(--accent)' }}>in.</span>
        </h2>
      </div>
      <Canvas camera={{ position: [0, HEIGHT_SPAN / 2, 13], fov: 50 }} dpr={[1, 1.75]}>
        <CameraRig sectionRef={sectionRef} />
        {items.map((item, i) => (
          <ArtworkPlane key={item.slug} item={item} index={i} count={items.length} />
        ))}
      </Canvas>
    </section>
  );
}
