'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { graphicProjects } from '@/lib/graphicDesign';
import { uiuxProjects } from '@/lib/uiux';
import { drawFramedArtwork, hashSeed } from '@/lib/poster';
import { optimizedSrc } from '@/lib/optimizedImage';

gsap.registerPlugin(ScrollTrigger);

// A scroll-driven image tube — projects ring a cylinder in rows, each row
// spinning at its own speed for a parallax read, adapted from
// github.com/matdn/helmet's tube technique. Fewer, larger planes per row
// (4, not a dozen) instead of a dense wall, and the dive is vertical through
// the tube's rows rather than a rotating drum viewed from outside — that
// half stays true to this site's existing "Dive in." pinned-scroll feel.
// The original's central helmet is deliberately absent: the work is the
// subject here, and a centrepiece competes with it.
const COLS = 4;
const RADIUS = 9.5;
const PLANE_W = 6.2;
const PLANE_H = 4.13;
const ROW_GAP = 7.4;
// Per-row spin multiplier — cycles if there are ever more rows than speeds.
const ROW_SPEEDS = [0.55, 0.95, 1.35, 0.75];
// Scroll distance the dive occupies, as a multiple of the sticky viewport.
// The section is this tall; the sticky child inside it is 100svh, so the
// camera travels for (SCROLL_SPAN - 1) viewports of scrolling.
const SCROLL_SPAN = 3.6;

// Distance from camera at which a plane is fully present, and the distance
// over which it fades away behind it. The camera sits outside the tube
// (z = 15, radius 9.5) looking at the axis, and plane materials are
// front-side only — so the planes actually on screen are the *far* wall,
// seen through the gaps in the near wall, at roughly 22-38 units out.
const DEPTH_NEAR = 21;
const DEPTH_RANGE = 17;

type VortexItem = {
  slug: string;
  title: string;
  accent: string;
  category: 'ui-ux' | 'graphic-design';
  cover: string;
};

type SharedProgress = { smoothed: number };

const UIUX_ACCENTS = ['#eeff00', '#fff35c', '#d4ff3d', '#f5ff8a', '#e8ff00'];

const CATEGORY_LABEL: Record<VortexItem['category'], string> = {
  'ui-ux': 'UI/UX',
  'graphic-design': 'Graphic Design',
};

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

// R3F's pointer state updates from touch-drag the same as mouse hover — on
// mobile every scroll gesture reads as a "hover" at the touch point. Gating
// pointer-driven effects to real hover-capable pointers (mice/trackpads)
// keeps them off touch devices, where they'd fight the scroll gesture.
function useFinePointer() {
  return useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    []
  );
}

// A stable 0..1 per project, so each plane's tilt and radius offset are the
// same on every visit and identical between server and client. Math.random
// here would reshuffle the tube on each render and break that.
function seeded01(slug: string, salt: string) {
  return (hashSeed(salt + slug) % 10000) / 10000;
}

// One canvas texture per project, high enough resolution that the larger
// planes stay sharp instead of blurring up.
function useCoverTextures(items: VortexItem[], lowCost: boolean) {
  const map = useMemo(() => {
    const m = new Map<string, THREE.CanvasTexture>();
    if (typeof document === 'undefined') return m;
    // Sized to what a plane actually occupies on screen, which is far less
    // than it looks. The camera sits 15 out with a 50° vertical fov and the
    // visible planes are ~24 units away, so the frustum is about 22 world
    // units tall there; a 6.2-unit-wide plane therefore covers roughly a
    // quarter of the viewport width — on the order of 220 CSS px, or ~390
    // device px at the desktop dpr cap of 1.75.
    //
    // These used to be 1824x1216. Twenty-four RGBA textures at that size,
    // plus their mipmap chains, is around 280 MB of VRAM to render detail no
    // display was ever going to resolve — the kind of allocation a phone
    // answers by evicting textures mid-scroll. 768 wide keeps roughly 2x
    // headroom over the largest a plane ever gets (hover scales it 14%) and
    // costs about 50 MB; the touch tier renders at dpr 1, so it needs less
    // again. Anisotropy is a per-pixel sampling cost, so it drops too.
    const w = lowCost ? 448 : 768;
    const h = lowCost ? 299 : 512;
    items.forEach((item) => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) drawFramedArtwork(ctx, canvas.width, canvas.height, item.slug, item.accent, item.category, item.title);
      const t = new THREE.CanvasTexture(canvas);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = lowCost ? 4 : 16;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.generateMipmaps = true;
      m.set(item.slug, t);
    });
    return m;
  }, [items, lowCost]);

  useEffect(() => {
    let cancelled = false;
    items.forEach((item) => {
      const texture = map.get(item.slug);
      if (!texture) return;
      const img = new window.Image();
      // Matched to the canvas it is drawn into — asking the optimizer for
      // 1200px only to scale it down into a 768px canvas was paying for
      // bytes over the wire that were thrown away on arrival.
      img.src = optimizedSrc(item.cover, lowCost ? 448 : 768);
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
  }, [items, map, lowCost]);

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
  hoverRef,
  registry,
}: {
  item: VortexItem;
  texture: THREE.CanvasTexture | undefined;
  col: number;
  rowIndex: number;
  y: number;
  progressRef: React.RefObject<SharedProgress>;
  hoverRef: React.RefObject<string | null>;
  registry: React.RefObject<THREE.Mesh[]>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const router = useRouter();
  const { camera, gl } = useThree();
  const reduceMotion = usePrefersReducedMotion();
  const boost = useRef(0);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const toCamera = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);

  // Alternate rows offset by half a step so the tube reads as a brick
  // pattern rather than a stack of identical rings.
  const baseAngle = (col / COLS) * Math.PI * 2 + (rowIndex % 2) * (Math.PI / COLS);
  const speed = ROW_SPEEDS[rowIndex % ROW_SPEEDS.length];

  // Seeded imperfection. A tube of planes at one exact radius, all perfectly
  // upright, reads as a machined grid — the single loudest "this is CG" tell
  // in the whole scene. Nudging each plane's radius, roll and lean by a
  // fraction costs nothing (it's the same position write) and buys most of
  // the hand-placed feel a physically modelled scene would.
  const radius = RADIUS * (0.93 + seeded01(item.slug, 'r') * 0.14);
  const roll = (seeded01(item.slug, 'z') - 0.5) * 0.11;
  const lean = (seeded01(item.slug, 'x') - 0.5) * 0.14;

  // The raycast in HoverTracker needs the live meshes, and the click handler
  // needs to know which project it hit.
  useEffect(() => {
    const mesh = ref.current;
    const list = registry.current;
    if (!mesh || !list) return;
    mesh.userData.slug = item.slug;
    list.push(mesh);
    return () => {
      const i = list.indexOf(mesh);
      if (i !== -1) list.splice(i, 1);
    };
  }, [item.slug, registry]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = reduceMotion ? 0 : progressRef.current.smoothed;
    const spin = (reduceMotion ? 0 : state.clock.elapsedTime * 0.05 + p * Math.PI * 1.4) * speed;
    const angle = baseAngle + spin;
    ref.current.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    ref.current.lookAt(0, y, 0);
    // After lookAt, local Z is the plane's normal — so these two rotate the
    // plane within its own face and tip it slightly off the ring.
    ref.current.rotateZ(roll);
    ref.current.rotateX(lean);
    if (reduceMotion) return;

    const mat = matRef.current;
    if (!mat) return;

    // Atmospheric depth. three.js fog would be the obvious tool, but it
    // blends fragments toward an opaque fog colour — distant planes would
    // become solid black rectangles, hiding the swirl backdrop behind this
    // canvas instead of receding into it. Fading opacity by distance costs
    // the same (the distance is already needed below) and composites right.
    const dist = ref.current.position.distanceTo(state.camera.position);
    const depth = THREE.MathUtils.clamp((dist - DEPTH_NEAR) / DEPTH_RANGE, 0, 1);
    mat.opacity = 1 - depth * 0.94;

    // Fake specular. The gloss sweep baked into the texture is static; this
    // makes it respond to the plane's angle, so a plane catches the light as
    // it turns to face the camera and dims as it turns away. Everything here
    // is dot products on vectors already in hand — no lights, no shader.
    ref.current.getWorldDirection(normal);
    toCamera.copy(state.camera.position).sub(ref.current.position).normalize();
    const facing = THREE.MathUtils.clamp(normal.dot(toCamera), 0, 1);
    const sheen = facing * facing * facing;

    const target = hoverRef.current === item.slug ? 1 : (1 - depth) * 0.45;
    boost.current = THREE.MathUtils.damp(boost.current, target, 3.5, delta);

    ref.current.scale.setScalar(1 + boost.current * 0.14);
    mat.color.setScalar(0.78 - depth * 0.24 + sheen * 0.22 + boost.current * 0.3);
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
        // Hands VortexTransition the plane's exact on-screen rect, so it can
        // fly a clone of the cover from here into the case study's hero.
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
    >
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshBasicMaterial ref={matRef} map={texture} toneMapped={false} transparent />
    </mesh>
  );
}

// One raycast per frame against the live planes, on fine pointers only.
//
// R3F's own onPointerOver/onPointerOut would be free, but they only fire when
// the *pointer* moves. Every plane here is in constant motion, so a still
// cursor would keep reporting whichever plane happened to be under it when it
// last moved — the label would go stale within a second. Re-casting each frame
// is the only way the label tracks what's actually under the cursor, and one
// ray against ~24 quads is nothing next to drawing them.
function HoverTracker({
  registry,
  hoverRef,
  onChange,
}: {
  registry: React.RefObject<THREE.Mesh[]>;
  hoverRef: React.RefObject<string | null>;
  onChange: (slug: string | null) => void;
}) {
  useFrame((state) => {
    const meshes = registry.current;
    if (!meshes?.length) return;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    // Skip planes the depth fade has already taken to near-nothing — a ray
    // still hits them, but labelling something the visitor cannot actually
    // see reads as the label picking at random.
    const hit = state.raycaster
      .intersectObjects(meshes, false)
      .find((i) => ((i.object as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity > 0.35);
    const slug = (hit?.object.userData.slug as string | undefined) ?? null;
    if (slug === hoverRef.current) return;
    hoverRef.current = slug;
    onChange(slug);
  });
  return null;
}

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
  const finePointer = useFinePointer();
  const raw = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (reduceMotion) {
      camera.position.set(0, 0, 15);
      camera.lookAt(0, 0, 0);
      return;
    }
    // Progress reporting only — no pin.
    //
    // This used to pin the section with pinType: 'transform', and that was the
    // mobile shake. ScrollTrigger writes the pin's transform on the GSAP
    // ticker (driven by Lenis's scroll event) while R3F writes camera.position
    // on its own independent rAF, and nothing orders those two against each
    // other. Whenever R3F rendered before the transform landed, the canvas
    // *contents* moved one way in the same frame the canvas *element* moved
    // the other. Desktop hid it behind small per-frame deltas; a mobile
    // fling's bigger deltas and chunkier frames turned it into visible shake.
    //
    // The sticky child in the markup below does the same job with no JS in the
    // loop at all — it's positioned by the compositor, so there is no longer a
    // second writer to desync from. anticipatePin, pinType and the JS-measured
    // viewport height that used to guard the old approach all went with it.
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        raw.current = self.progress;
      },
    });
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
    if (finePointer) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 1.1, 3, delta);
    }
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
  const finePointer = useFinePointer();
  const reduceMotion = usePrefersReducedMotion();
  const textures = useCoverTextures(items, !finePointer);
  const progressRef = useRef<SharedProgress>({ smoothed: 0 });

  const registry = useRef<THREE.Mesh[]>([]);
  const hoverRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<VortexItem | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const bySlug = useMemo(() => new Map(items.map((i) => [i.slug, i])), [items]);
  const onHoverChange = useCallback(
    (slug: string | null) => setHovered(slug ? bySlug.get(slug) ?? null : null),
    [bySlug]
  );

  // The label follows the real cursor position, written straight to style so
  // it never re-renders React on pointer movement.
  useEffect(() => {
    if (!finePointer || reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      const el = cursorRef.current;
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer, reduceMotion]);

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
    <section
      ref={sectionRef}
      id="work-vortex"
      className="relative w-full"
      // vh is the *large* viewport height and svh the address-bar-collapsed
      // one — both fixed values on mobile, unlike dvh, which changes every
      // time the browser chrome slides and would resize this section (and
      // therefore the scroll position) mid-gesture.
      style={{ height: reduceMotion ? '100svh' : `${SCROLL_SPAN * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          ref={headingRef}
          className="pointer-events-none absolute top-16 left-1/2 z-10 -translate-x-1/2 text-center text-white"
        >
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Dive <span style={{ color: 'var(--accent)' }}>in.</span>
          </h2>
        </div>

        <Canvas
          camera={{ position: [0, heightSpan / 2, 15], fov: 50 }}
          dpr={finePointer ? [1, 1.75] : 1}
          gl={{ antialias: finePointer }}
        >
          <CameraRig sectionRef={sectionRef} progressRef={progressRef} heightSpan={heightSpan} />
          {finePointer && !reduceMotion && (
            <HoverTracker registry={registry} hoverRef={hoverRef} onChange={onHoverChange} />
          )}
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
                hoverRef={hoverRef}
                registry={registry}
              />
            ));
          })}
        </Canvas>

        {/* Hover label — title and category, following the cursor. Fine
            pointers only; on touch there is no cursor to follow, and the
            titles are already baked into the artwork itself. */}
        {finePointer && !reduceMotion && (
          <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 z-20">
            <div
              className="ml-5 -translate-y-1/2 rounded-xl border border-white/15 bg-black/70 px-3.5 py-2 backdrop-blur-md transition-opacity duration-200"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <p className="text-sm font-medium whitespace-nowrap text-white">
                {hovered?.title ?? ''}
              </p>
              <p
                className="text-[0.68rem] tracking-[0.16em] whitespace-nowrap uppercase"
                style={{ color: 'var(--accent)' }}
              >
                {hovered ? CATEGORY_LABEL[hovered.category] : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
