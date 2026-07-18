'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import { hash, instanceIndex, mix, positionLocal, vec3 } from 'three/tsl';

// A second, WebGPU-backed render surface, separate from WorkVortex's WebGL
// canvas — TSL node materials need the WebGPU renderer, and mixing renderers
// on one canvas isn't supported. The caller (WorkVortex) feature-detects
// `navigator.gpu` and only mounts this component when it's present, so
// browsers without WebGPU never see it.
const BLADE_COUNT = 4000;
const FIELD_W = 22;
const FIELD_D = 8;

// Instanced field of leaning grass blades. Placement (position/rotation/
// scale) is set once, imperatively, via setMatrixAt — cheap for a one-time
// static layout and avoids a per-frame CPU loop. The per-blade lean and the
// height-based color gradient live in the node material instead, seeded
// from instanceIndex so every blade looks different without a CPU-side
// attribute buffer. A later task adds wind sway / pointer bending on top.
function GrassField() {
  const mesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(0.06, 0.6, 1, 4);
    geometry.translate(0, 0.3, 0);

    const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
    const seed = hash(instanceIndex);
    const lean = seed.sub(0.5).mul(0.3);
    material.positionNode = positionLocal.add(vec3(lean.mul(positionLocal.y), 0, 0));
    material.colorNode = mix(
      vec3(0.16, 0.42, 0.2),
      vec3(0.42, 0.68, 0.28),
      positionLocal.y.div(0.6).clamp(0, 1)
    );

    const instanced = new THREE.InstancedMesh(geometry, material, BLADE_COUNT);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < BLADE_COUNT; i++) {
      dummy.position.set((Math.random() - 0.5) * FIELD_W, 0, (Math.random() - 0.5) * FIELD_D);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.7 + Math.random() * 0.6);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
    return instanced;
  }, []);

  return <primitive object={mesh} />;
}

export default function InteractiveGrass() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3">
      <Canvas
        className="pointer-events-auto"
        orthographic={false}
        camera={{ position: [0, 3, 8], fov: 45 }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: true,
            alpha: true,
          });
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight intensity={1.2} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[FIELD_W, FIELD_D]} />
          <meshBasicMaterial color="#1c3d22" />
        </mesh>
        <GrassField />
      </Canvas>
    </div>
  );
}
