# Sid — Designer Portfolio: Design Spec

## Stack
Next.js 14 (App Router) + TypeScript, React Three Fiber + drei (3D), GSAP + ScrollTrigger (scroll choreography), Framer Motion (UI micro-interactions/page transitions), Tailwind CSS (layout/typography). No anime.js — dropped to avoid overlapping animation engines. Deploy target: Vercel.

## Routes
- `/` — loader → hero → about → work (vortex dive)
- `/ui-ux` — gallery grid, 6 placeholder projects
- `/graphic-design` — gallery grid, 6 placeholder projects
- `/work/[slug]` — project detail page (shared template, category-aware)
- `/contact` — stan.vision-inspired contact page

## Nav
Fixed capsule pill (glass/blur background). Items: `SG` mark, `UI/UX`, `Graphic Design`, `Contact`. GSAP magnetic hover, active-route indicator dot. Links to `/ui-ux`, `/graphic-design`, `/contact` directly (bypasses home scroll sequence).

## Home page flow
1. **Loader** — full-screen, minimal (thin progress line/percentage, monochrome). Preloads 3D assets/textures. GSAP exit wipe on complete.
2. **Hero** — centered typographic intro: name + the bio line ("I'm sid, a UI/UX designer and graphic designer and i believe nothing is better than designing at 1AM with some music"). Subtle 3D background accent (ambient particles/orbiting shapes), scroll cue at bottom.
3. **About section** — short bio line + work experience (compact timeline/list). Minimal editorial typography, generous whitespace.
4. **Work section** — heading "WORK". Scroll-driven, wodniack.dev-style: section pins, camera pushes forward into a vertical vortex tunnel. 12 artwork planes (placeholders: solid/gradient cards + project title) swirl around the vertical axis as the camera travels through. Continuous single vortex — no split/fork paths. Each artwork is raycast-clickable → `/work/[slug]`.
5. **Footer** — minimal, contact link + socials + copyright. Appears after work section (and on gallery/detail/contact pages).

## Project detail page
Hero image/placeholder, title, category tag, description blocks (problem/approach/outcome placeholders), back link to category or home.

## Contact page
Inspired by stan.vision/contact: oversized typography, single large animated email link as primary CTA, socials list with hover-distort text, minimal static form (name/email/message) — submit shows a success state client-side only, no backend.

## Data
Placeholder projects as typed array `lib/projects.ts` — `id, slug, category ('ui-ux' | 'graphic-design'), title, blurb, accent color`. Swappable for real content later without touching components.

## Performance / accessibility
R3F scene degrades on mobile (fewer planes, disable parallax, simpler CSS/GSAP transition instead of full shader dive on low-end/mobile). Respect `prefers-reduced-motion` — fall back to fades, static frame instead of vortex travel.

## Testing / verification
No unit-test suite for visual work. Verification is manual via dev server + browser: loader completes, hero/about render, work vortex scroll-dive triggers and artworks are clickable, all routes reachable, mobile viewport check.

---

## Addendum 2026-07-13: "awwwards-tier" pass

Direction: whole site was already vortex-themed end to end (see prior work); this pass raises production value specifically — bespoke artwork, richer/faster color life, loader identity, cursor interaction, and a contact page that matches the stan.vision reference more closely.

- **Custom placeholder artwork**: replace flat accent-color plane fills in the Work vortex (and gallery/detail hero blocks) with generative, deterministic-per-project textures — layered gradient wash (accent + a computed complementary), one bold geometric mark, subtle grain — rendered once per project (seeded by slug, not `Math.random()` at render time) so each project has a distinct, consistent "poster" look. This is the "custom placeholder" — not real photography, but no longer flat rectangles either.
- **Vibrancy / quick color switches**: the shared vortex backdrop and Work planes get a color life beyond static accents — hue/tint drift over time plus a quick pulse/switch keyed to scroll velocity spikes (fast scroll = a snappier color beat), and glow/bloom-style emphasis near the camera. Keep the palette disciplined (drawn from `lib/projects.ts` accents + a couple of derived tones) — vibrant, not random-rainbow noise.
- **Smoother animation**: replace any linear scrub easing with eased/lerped camera and object motion; add scale/tilt reactivity as planes approach camera; richer stagger and entrance choreography on Hero/About (already scroll-triggered — this pass adds polish, not new mechanics).
- **Loader identity**: headline copy "Good things take time" in large display type as the dominant element; keep the thin progress line/percentage as a secondary/small detail beneath it, not the focal point.
- **Mouse interaction**: a lightweight global cursor-reactive layer — subtle parallax/glow following the pointer, magnetic hover extended from Nav to gallery cards and contact links, cursor-proximity reactivity on Work vortex planes. Must degrade gracefully on touch devices (no pointer) and respect `prefers-reduced-motion`.
- **Contact page**: tighten toward the stan.vision reference — larger kinetic email link (per-letter or line hover distort), underline-wipe hover on socials, animated focus states on form fields, background gets a subtle vortex-color bleed instead of flat black. Same no-backend static success state as before.
- **Bar**: awwwards-tier polish — consistent premium easing curves everywhere, no linear/robotic transitions, no motion added without purpose.

No new routes, no new dependencies unless a strong case emerges (check what's installed — three, @react-three/fiber, @react-three/drei, gsap, framer-motion — before reaching further). `prefers-reduced-motion` and mobile/perf fallbacks from the original spec still apply and extend to all new motion.
