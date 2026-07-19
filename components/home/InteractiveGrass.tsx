'use client';

import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three/webgpu';
import {
  hash,
  instanceIndex,
  mix,
  positionLocal,
  positionWorld,
  sin,
  time,
  uniform,
  vec2,
  vec3,
} from 'three/tsl';

// A second, WebGPU-backed render surface, separate from WorkVortex's WebGL
// canvas — TSL node materials need the WebGPU renderer, and mixing renderers
// on one canvas isn't supported. The caller (WorkVortex) feature-detects
// `navigator.gpu` and only mounts this component when it's present, so
// browsers without WebGPU never see it.
const BLADE_COUNT = 4000;
const FIELD_W = 22;
const FIELD_D = 8;
// Ground-plane radius (world units) within which blades bend away from the
// pointer, and the max sideways displacement of a blade tip at the center.
const BEND_RADIUS = 1.1;
const BEND_STRENGTH = 0.35;

// Instanced field of leaning grass blades. Placement (position/rotation/
// scale) is set once, imperatively, via setMatrixAt — cheap for a one-time
// static layout and avoids a per-frame CPU loop. The per-blade lean and the
// height-based color gradient live in the node material, seeded from
// instanceIndex so every blade looks different without a CPU-side attribute
// buffer. On top of that, the material adds continuous wind sway (sine of
// time + world X + per-blade phase) and a pointer-bend uniform updated each
// frame from a ground-plane raycast — both scaled by height so blade bases
// stay planted and only the tips move.
function GrassField() {
  const pointerUniform = useMemo(() => uniform(vec2(999, 999)), []);

  const mesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(0.06, 0.6, 1, 4);
    geometry.translate(0, 0.3, 0);

    const material = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });
    const seed = hash(instanceIndex);
    const heightFactor = positionLocal.y.div(0.6).clamp(0, 1);
    const lean = seed.sub(0.5).mul(0.3);

    // Ambient wind: never zero, varies with world X and a per-blade phase
    // offset so neighboring blades don't crest in lockstep.
    const wind = sin(time.mul(1.4).add(positionWorld.x.mul(0.6)).add(seed.mul(6.28)))
      .mul(0.08)
      .mul(heightFactor);

    // Pointer bend: push blades away from the cursor's ground-plane hit,
    // linearly easing to zero at BEND_RADIUS.
    const toPointer = positionWorld.xz.sub(pointerUniform);
    const dist = toPointer.length();
    const falloff = dist.div(BEND_RADIUS).oneMinus().clamp(0, 1);
    const push = toPointer.normalize().mul(falloff.mul(BEND_STRENGTH)).mul(heightFactor);

    material.positionNode = positionLocal.add(
      vec3(lean.mul(positionLocal.y).add(wind).add(push.x), 0, push.y)
    );
    material.colorNode = mix(vec3(0.16, 0.42, 0.2), vec3(0.42, 0.68, 0.28), heightFactor);

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
  }, [pointerUniform]);

  // The overlay div is pointer-events-none except over the canvas itself, so
  // a plain `state.pointer` read can go stale once the cursor leaves the
  // canvas without crossing back over it (R3F only updates `pointer` on
  // events the canvas actually receives). Explicitly reset the uniform on
  // pointerleave so bent blades ease back out instead of freezing bent.
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const resetPointer = () => pointerUniform.value.set(999, 999);
    canvas.addEventListener('pointerleave', resetPointer);
    return () => canvas.removeEventListener('pointerleave', resetPointer);
  }, [gl, pointerUniform]);

  useFrame((state) => {
    const ray = state.raycaster;
    ray.setFromCamera(state.pointer, state.camera);
    const t = -ray.ray.origin.y / ray.ray.direction.y;
    if (t > 0) {
      const hit = ray.ray.origin.clone().addScaledVector(ray.ray.direction, t);
      pointerUniform.value.set(hit.x, hit.z);
    }
  });

  return <primitive object={mesh} />;
}

export default function InteractiveGrass() {
  // `'gpu' in navigator` (checked by the caller before mounting this
  // component) only confirms the WebGPU API exists — requestAdapter() can
  // still resolve null on a blocklisted GPU, driver issue, or restrictive
  // environment, rejecting renderer.init() below. R3F's async `gl` factory
  // has no error handling of its own, and a rejected promise there becomes
  // an unhandled promise rejection in dev, or reaches Next's route-level
  // error boundary in prod — replacing the whole homepage. A React error
  // boundary can't help: R3F calls the async `gl` factory fire-and-forget
  // inside a layout effect (see @react-three/fiber's CanvasImpl `run()`),
  // so a rejection there never becomes a synchronous throw during render
  // that a boundary would catch. Fail soft instead: catch it here, hand
  // Canvas a working fallback renderer so its setup never throws, and flip
  // this flag so the parent removes the grass on the next render.
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3">
      <Canvas
        className="pointer-events-auto"
        style={{ touchAction: 'pan-y' }}
        orthographic={false}
        camera={{ position: [0, 3, 8], fov: 45 }}
        gl={async (props) => {
          const canvas = props.canvas as HTMLCanvasElement;
          try {
            const renderer = new THREE.WebGPURenderer({ canvas, antialias: true, alpha: true });
            await renderer.init();
            return renderer;
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('InteractiveGrass: WebGPU init failed, disabling grass', err);
            }
            setFailed(true);
            // The component above unmounts on the next render regardless, so
            // whatever this resolves to is never actually drawn — it only
            // has to survive R3F's one-time setup (setSize/setPixelRatio
            // etc.) without throwing before that unmount lands. A real
            // WebGLRenderer would also work for that, but GrassField's
            // MeshBasicNodeMaterial only renders correctly through a Node
            // builder, which a plain WebGLRenderer doesn't wire up — if a
            // frame slipped in before the unmount (a real race against
            // React's next render), calling .render() with a Node material
            // on it throws inside R3F's uncaught requestAnimationFrame loop.
            // The inert stub sidesteps that entirely: its render() is a
            // no-op, so there's nothing left to race.
            return { domElement: canvas, render() {}, setSize() {}, setPixelRatio() {} };
          }
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
