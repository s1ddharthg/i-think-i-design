'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { projects } from '@/lib/projects';
import { drawPoster } from '@/lib/poster';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 4.5;
const HEIGHT_SPAN = 26;

function usePrefersReducedMotion() {
  return useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
}

function ArtworkPlane({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const router = useRouter();
  const reduceMotion = usePrefersReducedMotion();
  const boost = useRef(0); // smoothed camera-proximity + cursor reactivity
  const ndc = useMemo(() => new THREE.Vector3(), []);

  // Generated poster texture — deterministic per slug, shared drawPoster
  // with the 2D Gallery/detail pages. Only runs in-browser (inside Canvas).
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 352; // matches the 1.6 x 1.1 plane
    const ctx = canvas.getContext('2d');
    if (ctx) drawPoster(ctx, canvas.width, canvas.height, project.slug, project.accent);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [project.slug, project.accent]);
  useEffect(() => () => texture.dispose(), [texture]);

  const angle = (index / projects.length) * Math.PI * 4;
  const y = HEIGHT_SPAN / 2 - (index / (projects.length - 1)) * HEIGHT_SPAN;

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = (reduceMotion ? 0 : state.clock.elapsedTime * 0.1) + angle;
    ref.current.position.set(Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS);
    ref.current.lookAt(0, y, 0);
    if (reduceMotion) return;

    // near-camera: scale up + brighten as the dive approaches this plane
    const dist = ref.current.position.distanceTo(state.camera.position);
    const near = THREE.MathUtils.clamp(1 - (dist - 2.2) / 5.5, 0, 1);

    // cursor proximity: nearest plane to the pointer lifts and glows
    ndc.copy(ref.current.position).project(state.camera);
    let hover = 0;
    if (Math.abs(ndc.z) <= 1) {
      const d = Math.hypot(ndc.x - state.pointer.x, ndc.y - state.pointer.y);
      hover = THREE.MathUtils.clamp(1 - d / 0.4, 0, 1);
    }

    const target = Math.min(near * 0.7 + hover * 0.6, 1);
    boost.current = THREE.MathUtils.damp(boost.current, target, 6, delta);

    ref.current.scale.setScalar(1 + boost.current * 0.28);
    // tilt toward the viewer as it reacts (applied after lookAt, so no drift)
    ref.current.rotateX(-0.16 * boost.current);
    ref.current.rotateZ(0.05 * Math.sin(state.clock.elapsedTime * 0.8 + index) * boost.current);
    matRef.current?.color.setScalar(0.82 + boost.current * 0.42);
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
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200%',
      scrub: true,
      pin: true,
      pinType: 'transform',
      onUpdate: (self) => {
        // only record progress — the dive itself is damped in useFrame
        progress.current = self.progress;
      },
    });

    return () => {
      st.kill();
    };
  }, [camera, sectionRef, reduceMotion]);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    // damped trailing dive — never 1:1 scrub-locked
    smoothed.current = THREE.MathUtils.damp(smoothed.current, progress.current, 4, delta);
    const p = smoothed.current;
    camera.position.z = 12 - p * 10;
    camera.position.y = HEIGHT_SPAN / 2 - p * HEIGHT_SPAN;
    // gentle pointer sway for depth
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.9, 3, delta);
    camera.lookAt(0, camera.position.y, 0);
  });

  return null;
}

export default function WorkVortex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => projects, []);

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
      // heading dissolves as the dive begins
      gsap.to(headingRef.current, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=60%',
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full">
      <div
        ref={headingRef}
        className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-white"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <h2 className="mt-2 text-4xl font-semibold">Work</h2>
      </div>
      <Canvas camera={{ position: [0, HEIGHT_SPAN / 2, 12], fov: 50 }}>
        <CameraRig sectionRef={sectionRef} />
        {items.map((project, i) => (
          <ArtworkPlane key={project.id} project={project} index={i} />
        ))}
      </Canvas>
    </section>
  );
}
