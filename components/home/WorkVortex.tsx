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

function CameraRig({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
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
      pinType: 'transform',
      onUpdate: (self) => {
        camera.position.z = 12 - self.progress * 10;
        camera.position.y = HEIGHT_SPAN / 2 - self.progress * HEIGHT_SPAN;
        camera.lookAt(0, camera.position.y, 0);
      },
    });

    return () => {
      st.kill();
    };
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
