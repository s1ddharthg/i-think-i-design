'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { projects } from '@/lib/projects';

const COUNT = 1600;

function Swirl() {
  const ref = useRef<THREE.Points>(null);
  const lastScroll = useRef(0);
  const speed = useRef(0);
  const reduceMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const accents = projects.map((p) => new THREE.Color(p.accent));
    const white = new THREE.Color('#ffffff');
    // ponytail: seeded-ish scatter via Math.random is fine — backdrop only, never replayed
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
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || reduceMotion) return;
    // spin speeds up with scroll velocity, then eases back — the page feels pulled into the vortex
    const sc = window.scrollY;
    const v = Math.min(Math.abs(sc - lastScroll.current) / 300, 1.4);
    lastScroll.current = sc;
    speed.current += (v - speed.current) * 0.05;
    ref.current.rotation.y += delta * (0.045 + speed.current * 0.6);
  });

  return (
    <points ref={ref} rotation={[0.12, 0, 0.05]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
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
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Swirl />
      </Canvas>
      {/* soft vignette so center text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,transparent_70%)]" />
    </div>
  );
}
