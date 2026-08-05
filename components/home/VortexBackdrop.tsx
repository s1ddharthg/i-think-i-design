'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projects } from '@/lib/projects';

const COUNT = 1600;
const ACCENTS = [...new Set(projects.map((p) => p.accent))];

// Generated once at module load, not per-render: this is a fixed scatter of
// points, not derived from props or state, so it doesn't belong in a hook.
// Computing it here (instead of useMemo(() => ..., [])) sidesteps the
// react-hooks/purity rule, which flags Math.random anywhere in render.
function buildSwirlGeometry() {
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const accents = projects.map((p) => new THREE.Color(p.accent));
  const white = new THREE.Color('#ffffff');
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    const angle = t * Math.PI * 16 + Math.random() * 0.9;
    const radius = 4 + t * 9 + Math.random() * 2.5;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 2] = Math.sin(angle) * radius - 6;
    const c = Math.random() < 0.16 ? accents[i % accents.length] : white;
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  return { positions: pos, colors: col };
}
const SWIRL_GEOMETRY = buildSwirlGeometry();

function Swirl() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const lastScroll = useRef(0);
  const speed = useRef(0);
  // color-beat state: a scroll-velocity spike snaps the field to a project
  // accent (instant attack), which then decays back to the drifting tint
  const beat = useRef({ strength: 0, idx: 0, cooldown: 0 });
  const beatColor = useMemo(() => new THREE.Color('#ffffff'), []);
  const tint = useMemo(() => new THREE.Color('#ffffff'), []);
  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const finePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    []
  );
  // the canvas wrapper is pointer-events-none, so r3f's state.pointer never
  // updates here — track the cursor at the window level instead
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer, reduceMotion]);

  const { positions, colors } = SWIRL_GEOMETRY;

  useFrame((state, delta) => {
    if (!ref.current || reduceMotion) return;
    // spin speeds up with scroll velocity, then eases back — the page feels pulled into the vortex
    const sc = window.scrollY;
    const v = Math.min(Math.abs(sc - lastScroll.current) / 300, 1.4);
    lastScroll.current = sc;
    speed.current += (v - speed.current) * 0.05;
    ref.current.rotation.y += delta * (0.045 + speed.current * 0.6);

    // subtle pointer parallax — the whole field leans toward the cursor
    if (finePointer) {
      ref.current.rotation.x = THREE.MathUtils.damp(
        ref.current.rotation.x,
        0.12 + pointer.current.y * 0.06,
        2,
        delta
      );
      ref.current.rotation.z = THREE.MathUtils.damp(
        ref.current.rotation.z,
        0.05 - pointer.current.x * 0.06,
        2,
        delta
      );
    }

    const mat = matRef.current;
    if (!mat) return;

    // slow hue drift on the multiplier tint — pastel, disciplined
    tint.setHSL((state.clock.elapsedTime * 0.012) % 1, 0.28, 0.78);

    // quick color-beat on a fast-scroll spike
    const b = beat.current;
    b.cooldown -= delta;
    if (v > 1 && b.cooldown <= 0) {
      beatColor.set(ACCENTS[b.idx++ % ACCENTS.length]);
      b.strength = 1;
      b.cooldown = 0.7;
    }
    b.strength = THREE.MathUtils.damp(b.strength, 0, 3, delta);
    mat.color.copy(tint).lerp(beatColor, b.strength * 0.9);
    mat.opacity = 0.5 + b.strength * 0.3;
  });

  return (
    <points ref={ref} rotation={[0.12, 0, 0.05]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function VortexBackdrop() {
  // Additive blending over a full-screen point cloud is a fillrate cost, not
  // a geometry one: every one of the 1600 sprites blends against whatever is
  // already in the framebuffer, and that bill scales with the number of
  // pixels, so it doubles and then some at dpr 1.5. Desktop GPUs absorb it;
  // phones are the ones that have to render this *and* the tube canvas, so
  // they render it at dpr 1. Only the sprite edges soften, and they are
  // 0.045 units wide against a black backdrop.
  const finePointer = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    []
  );

  // Stays running the whole scroll, including behind WorkVortex's own
  // canvas further down — that section has gaps between its image planes,
  // so a paused (frozen) swirl reads as a broken, static background. The
  // swirl is a cheap single point cloud, so keeping it live alongside the
  // heavier tube canvas is not the bottleneck worth optimizing for.
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={finePointer ? [1, 1.5] : 1}
        gl={{ antialias: false }}
      >
        <Swirl />
      </Canvas>
      {/* soft vignette so center text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,transparent_70%)]" />
    </div>
  );
}
