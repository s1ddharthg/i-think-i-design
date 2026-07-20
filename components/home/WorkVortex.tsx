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

// A scroll-driven image tube — projects ring a cylinder in rows, each row
// spinning at its own speed for a parallax read, adapted from
// github.com/matdn/helmet's tube technique. Fewer, larger planes per row
// (4, not a dozen) instead of a dense wall, and the dive is vertical through
// the tube's rows rather than a rotating drum viewed from outside — that
// half stays true to this site's existing "Dive in." pinned-scroll feel.
const COLS = 4;
const RADIUS = 9.5;
const PLANE_W = 6.2;
const PLANE_H = 4.13;
const ROW_GAP = 7.4;
// Per-row spin multiplier — cycles if there are ever more rows than speeds.
const ROW_SPEEDS = [0.55, 0.95, 1.35, 0.75];

type VortexItem = {
  slug: string;
  title: string;
  accent: string;
  category: 'ui-ux' | 'graphic-design';
  cover: string;
};

type SharedProgress = { smoothed: number };

const UIUX_ACCENTS = ['#eeff00', '#fff35c', '#d4ff3d', '#f5ff8a', '#e8ff00'];

// Every real project — graphic + UI/UX, no repeats, no placeholders —
// interleaved so the dive alternates disciplines row to row.
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

function chunkIntoRows(items: VortexItem[], cols: number): VortexItem[][] {
  const rows: VortexItem[][] = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return rows;
}

function usePrefersReducedMotion() {
  return useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
}

// One canvas texture per project, high enough resolution that the larger
// planes stay sharp instead of blurring up.
function useCoverTextures(items: VortexItem[]) {
  const map = useMemo(() => {
    const m = new Map<string, THREE.CanvasTexture>();
    if (typeof document === 'undefined') return m;
    items.forEach((item) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
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

function TubePlane({
  item,
  texture,
  col,
  rowIndex,
  y,
  progressRef,
}: {
  item: VortexItem;
  texture: THREE.CanvasTexture | undefined;
  col: number;
  rowIndex: number;
  y: number;
  progressRef: React.RefObject<SharedProgress>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const router = useRouter();
  const { camera, gl } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const boost = useRef(0);
  const ndc = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);

  // Alternate rows offset by half a step so the tube reads as a brick
  // pattern rather than a stack of identical rings.
  const baseAngle = (col / COLS) * Math.PI * 2 + (rowIndex % 2) * (Math.PI / COLS);
  const speed = ROW_SPEEDS[rowIndex % ROW_SPEEDS.length];

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = reduceMotion ? 0 : progressRef.current.smoothed;
    const spin = (reduceMotion ? 0 : state.clock.elapsedTime * 0.05 + p * Math.PI * 1.4) * speed;
    const angle = baseAngle + spin;
    ref.current.position.set(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
    ref.current.lookAt(0, y, 0);
    if (reduceMotion) return;

    const dist = ref.current.position.distanceTo(state.camera.position);
    const near = THREE.MathUtils.clamp(1 - (dist - 3.2) / 8, 0, 1);

    ndc.copy(ref.current.position).project(state.camera);
    let hover = 0;
    if (Math.abs(ndc.z) <= 1) {
      const d = Math.hypot(ndc.x - state.pointer.x, ndc.y - state.pointer.y);
      hover = THREE.MathUtils.clamp(1 - d / 0.35, 0, 1);
    }

    const target = Math.min(near * 0.6 + hover * 0.6, 1);
    boost.current = THREE.MathUtils.damp(boost.current, target, 2.5, delta);

    ref.current.scale.setScalar(1 + boost.current * 0.22);
    matRef.current?.color.setScalar(0.85 + boost.current * 0.35);
  });

  if (!texture) return null;

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (!ref.current) {
          router.push(`/work/${item.slug}`);
          return;
        }
        const hw = PLANE_W / 2;
        const hh = PLANE_H / 2;
        const localCorners: [number, number][] = [
          [-hw, -hh],
          [hw, -hh],
          [hw, hh],
          [-hw, hh],
        ];
        const domRect = gl.domElement.getBoundingClientRect();
        const xs: number[] = [];
        const ys: number[] = [];
        for (const [lx, ly] of localCorners) {
          corner.set(lx, ly, 0);
          ref.current.localToWorld(corner);
          corner.project(camera);
          xs.push((corner.x * 0.5 + 0.5) * domRect.width + domRect.left);
          ys.push((1 - (corner.y * 0.5 + 0.5)) * domRect.height + domRect.top);
        }
        const rect = {
          x: Math.min(...xs),
          y: Math.min(...ys),
          width: Math.max(...xs) - Math.min(...xs),
          height: Math.max(...ys) - Math.min(...ys),
        };
        window.dispatchEvent(
          new CustomEvent('vortex:dive', { detail: { rect, src: item.cover, slug: item.slug } })
        );
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} />
    </mesh>
  );
}

// The tube's centrepiece — a pair of sunglasses instead of a helmet, built
// from primitives (this project has no 3D-model asset pipeline, and every
// other visual on the site is already procedural). They track the cursor
// rather than the scroll, so the one thing at the centre of the dive is the
// one thing responding directly to the visitor instead of to the page.
//
// ponytail: pulled from the scene below (kept here, commented, for a
// replacement centrepiece) — not deleted outright since the geometry/tracking
// logic is reusable for whatever replaces it.
/*
function Sunglasses() {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const finePointer = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    []
  );
  const pointer = useRef({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer, reduceMotion]);

  const lensMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1c2430',
        emissive: '#eeff00',
        emissiveIntensity: 0.06,
        metalness: 0.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.78,
      }),
    []
  );
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d8dae0',
        emissive: '#3a3d44',
        emissiveIntensity: 0.25,
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );
  useEffect(() => () => {
    lensMat.dispose();
    frameMat.dispose();
  }, [lensMat, frameMat]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Always the literal focal point of the dive — parked exactly where the
    // camera is already looking, so it never has to compete with the tube.
    const targetY = reduceMotion ? 0 : camera.position.y;
    group.current.position.set(0, targetY, 0);

    if (reduceMotion) return;

    yaw.current = THREE.MathUtils.damp(yaw.current, pointer.current.x * 0.4, 4, delta);
    pitch.current = THREE.MathUtils.damp(pitch.current, -pointer.current.y * 0.22, 4, delta);
    group.current.rotation.y = yaw.current;
    group.current.rotation.x = pitch.current;
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
  });

  const lensR = 0.62;

  return (
    <group ref={group} scale={1.15}>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * (lensR + 0.06), 0, 0]}>
          <mesh material={lensMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[lensR, lensR, 0.06, 32]} />
          </mesh>
          <mesh material={frameMat} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[lensR, 0.055, 12, 32]} />
          </mesh>
          <mesh
            material={frameMat}
            position={[side * 0.95, 0, -0.55]}
            rotation={[0, side * 0.42, 0]}
          >
            <boxGeometry args={[1.1, 0.06, 0.06]} />
          </mesh>
        </group>
      ))}
      <mesh material={frameMat}>
        <boxGeometry args={[0.34, 0.07, 0.07]} />
      </mesh>
    </group>
  );
}
*/

function CameraRig({
  sectionRef,
  progressRef,
  heightSpan,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<SharedProgress>;
  heightSpan: number;
}) {
  const { camera } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const raw = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (reduceMotion) {
      camera.position.set(0, 0, 13);
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
    camera.position.z = 15;
    camera.position.y = heightSpan / 2 - p * heightSpan;
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
  const rows = useMemo(() => chunkIntoRows(items, COLS), [items]);
  const heightSpan = (rows.length - 1) * ROW_GAP + ROW_GAP;
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
    <section ref={sectionRef} id="work-vortex" className="relative h-[100svh] w-full">
      <div
        ref={headingRef}
        className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-center text-white"
      >
        <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Dive <span style={{ color: 'var(--accent)' }}>in.</span>
        </h2>
      </div>
      <Canvas camera={{ position: [0, heightSpan / 2, 15], fov: 50 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 8]} intensity={1.4} />
        <pointLight position={[-4, -2, 6]} intensity={0.6} color="#88ccff" />
        <CameraRig sectionRef={sectionRef} progressRef={progressRef} heightSpan={heightSpan} />
        {/* <Sunglasses /> — pulled out, see commented-out definition above */}
        {rows.map((row, rowIndex) => {
          const y = heightSpan / 2 - rowIndex * ROW_GAP;
          return row.map((item, col) => (
            <TubePlane
              key={item.slug}
              item={item}
              texture={textures.get(item.slug)}
              col={col}
              rowIndex={rowIndex}
              y={y}
              progressRef={progressRef}
            />
          ));
        })}
      </Canvas>
    </section>
  );
}
