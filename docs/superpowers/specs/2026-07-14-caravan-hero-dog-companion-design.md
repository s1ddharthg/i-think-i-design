# Caravan Hero + Dog Companion — Design Spec

Reference: user-supplied photo of a VW T1 camper, man sitting on the roof, back to camera, in a flower field, staring at a swirling sky portal. Brief: reproduce the *van + man + grass* part in real-time 3D on the home page, drop the sky entirely, make the grass respond to the cursor, and add a separate 2D dog companion the visitor can pat.

Decisions locked in with the user:
- **Realism strategy: hybrid, resolved to PBR-primitive.** Searched for free, license-clear, no-login GLB/glTF van + humanoid models (Sketchfab, CGTrader, TurboSquid, Poly Haven). Every usable result sits behind an account/paywall for the actual binary — no reliable automated download path. Falling back to hand-built geometry + physically-based materials + real lighting + post-processing, which is how real Three.js car-configurator sites fake photorealism without scanned assets.
- **Placement: replaces the current hero.** `VortexBackdrop.tsx`'s particle swirl is retired from the home page. `WorkVortex.tsx` (further down the page) is untouched — it's a separate component with its own particle system, not a shared dependency.

## Part A — Caravan Hero Scene

### Architecture
New `components/home/CaravanScene.tsx`, an r3f `<Canvas>` mounted `fixed inset-0 z-0` in `app/page.tsx`, in the exact slot `VortexBackdrop` occupies today. `Hero.tsx`'s text overlay logic (word reveal, scroll-out parallax) is unchanged — it keeps sitting in `main z-10` on top of whatever fills z-0.

Sub-components, one file each:
- `Van.tsx` — grouped primitives: `RoundedBox` (drei) body panels, cylinder wheels, plane windshield/windows. Paint via `MeshPhysicalMaterial` (clearcoat 1, clearcoatRoughness 0.1, metalness 0.6, roughness 0.35, warm rust-orange to match the reference). Two small emissive headlight meshes.
- `Figure.tsx` — low-poly humanoid from capsules/cylinders, static sitting pose, knees drawn up, facing away from camera (matches reference — he's backlit with no visible face there either, so we lose nothing by skipping face/hand detail). Near-black `MeshStandardMaterial`, low roughness, lit almost entirely by rim light so it reads as a silhouette.
- `Grass.tsx` — instanced blade mesh (drei `<Instances>`), thousands of blades across the ground plane. Custom vertex shader: ambient wind sway (sine + time), plus a `cursorWorldPos` uniform that bends blades away from the projected cursor position within a radius — this is the "interactive grass" requirement. Sparse red/white flower accents as tiny extra instances, echoing the reference photo.
- `Lighting.tsx` (or inline in `CaravanScene.tsx`) — no sky dome, no HDRI environment sphere. Deep indigo `THREE.Fog` for the background (cheap horizon hide, moody, matches "no sky" instruction), one cool hemisphere fill, one warm rim/backlight behind the figure, headlight point lights with slight flicker.
- Post-processing via new dependency `@react-three/postprocessing`: Bloom (catches headlights + rim light), Vignette, subtle film-grain Noise, ACES tone mapping. This is the biggest lever for "hyperrealistic" given primitive geometry.

### Interaction & data flow
Cursor tracked at `window` level (mirrors the existing `VortexBackdrop` pattern, since the canvas wrapper is `pointer-events-none`). Screen coords are unprojected to a world-space point on the ground plane (raycast against y=0) each frame and written into the grass shader's uniform. Gated behind `(hover: hover) and (pointer: fine)` — touch devices get ambient wind only, no cursor bend.

### Accessibility / performance
- `prefers-reduced-motion: reduce` freezes wind sway and camera drift; scene renders as a static frame.
- `dpr` capped `[1, 1.5]` like the existing canvas, same `gl={{ antialias: false }}` tradeoff.
- Instance count and post-processing passes tuned to stay smooth on a mid laptop GPU; grass blade count is the one dial to turn down first if frame time is a problem.

### Testing
Manual verification only (this is a visual feature): load the home page, confirm van/figure/grass render without the old particle vortex, move the cursor and confirm grass bends near it, confirm reduced-motion freezes the scene, confirm mobile/touch doesn't error without a fine pointer.

## Part B — Dog Companion

### Architecture
New `components/home/DogCompanion.tsx`, mounted once in `app/page.tsx` alongside the other home sections (scoped to the home page, not the global layout — the brief frames it as part of this page's art, not a site-wide fixture).

- Pure 2D: a small hand-drawn inline SVG dog (side profile, running pose), no 3D, no image asset dependency.
- Fixed to the bottom of the viewport (`fixed bottom-* `), horizontal position follows the cursor's x with a spring/lerp (framer-motion, already a dependency) so it reads as "your avatar" trailing you along the bottom edge — not a literal 1:1 follow, a little lag so it feels alive.
- Continuous run-cycle animation: legs swing via a looping CSS/framer-motion keyframe, independent of cursor movement, so the dog is always "running."
- On click/tap ("pat"): shows a speech bubble (framer-motion fade/scale in) with one line from a fixed compliment array (e.g. "sid is an amazing designer"), advancing to the next line each pat, wrapping around (`index % array.length`). Bubble auto-dismisses after a few seconds or on next pat.

### Data flow
All local component state — a `patIndex` ref/state and the cursor-x tracked via the same `pointermove` pattern already used elsewhere in this codebase. No global store needed.

### Testing
Manual: dog visible and running at page load, horizontal position eases toward cursor, click/tap cycles through compliment lines in order without repeating the same line twice in a row on wraparound, works on touch (tap instead of hover).

## Out of scope
- No actual GLB/GLTF asset sourcing or licensing negotiation (ruled out above).
- No physics engine for grass or dog — everything is shader/keyframe driven.
- No changes to `WorkVortex.tsx`, `About.tsx`, `Footer.tsx`, or any non-home page.
