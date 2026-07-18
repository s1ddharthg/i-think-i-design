'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three/webgpu';

// A second, WebGPU-backed render surface, separate from WorkVortex's WebGL
// canvas — TSL node materials (added in a later task) need the WebGPU
// renderer, and mixing renderers on one canvas isn't supported. The caller
// (WorkVortex) feature-detects `navigator.gpu` and only mounts this
// component when it's present, so browsers without WebGPU never see it.
//
// ponytail: flat placeholder plane only — real grass geometry/shaders land
// in a later task in this sequence.
export default function InteractiveGrass() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3">
      <Canvas
        className="pointer-events-auto"
        orthographic={false}
        camera={{ position: [0, 4, 9], fov: 45 }}
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
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 10]} />
          <meshBasicMaterial color="#2f6b3a" />
        </mesh>
      </Canvas>
    </div>
  );
}
