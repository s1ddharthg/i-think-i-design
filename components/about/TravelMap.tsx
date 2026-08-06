'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/reducedMotion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  TRAVEL_STOPS,
  MAP_W,
  MAP_H,
  PX_PER_DEG,
  toMapX,
  toMapY,
  formatCoords,
  type TravelStop,
} from '@/lib/travel';

gsap.registerPlugin(ScrollTrigger);

// --- Scroll budget -----------------------------------------------------------
// A tall block with a sticky 100svh stage inside it: vertical scroll through
// the block is what drives the camera sideways across the map. CSS sticky does
// the pinning rather than ScrollTrigger's pin, which keeps Lenis and a
// pin-spacer out of each other's way — ScrollTrigger only reports progress here.
const INTRO_SVH = 60; // the fall from world view onto Chennai
// Scroll spent on each hop, parked ends included. Trimmed from 64 when the
// route went from ten stops to eighteen: seventeen legs at the old budget was
// eleven and a half screens of scrolling. Most of the new legs are under two
// degrees, so they need less room to read than the Chennai-Tokyo hop did.
const LEG_SVH = 52;

// Fraction of a leg spent parked at each end. Without it the camera never
// stops and there is no moment to read a place; 0.22 leaves a little under
// half of every leg as rest.
const DWELL = 0.22;

// How far the camera pulls out mid-hop, as a multiple of the distance covered.
// Short hops never trigger it — Munnar to Vagamon is under half a degree, well
// inside the span the stop already frames.
const TRANSIT_PULL = 1.9;

const WORLD_SPAN = 300; // degrees framed at the very top, before the dive

const LAND_FILL = 'rgba(255,255,255,0.07)';
const LAND_STROKE = 'rgba(255,255,255,0.32)';
const GRATICULE = 'rgba(238,255,0,0.045)';
const GRATICULE_MAJOR = 'rgba(238,255,0,0.1)';
/** Graticule intervals in degrees, coarsest first. */
const GRATICULE_LADDER = [30, 10, 5, 2, 1, 0.5, 0.25, 0.1];
const ROUTE_STROKE = 1.6; // px on screen, held there by counter-scaling the group

type Land = { rings: number[][]; bboxes: Float32Array };
type Camera = { x: number; y: number; scale: number };

type LenisScrollOpts = {
  duration?: number;
  lock?: boolean;
  force?: boolean;
  onComplete?: () => void;
};
type LenisScrollEvent = { scroll: number; velocity: number };
type LenisLike = {
  on: (e: 'scroll', cb: (v: LenisScrollEvent) => void) => void;
  off: (e: 'scroll', cb: (v: LenisScrollEvent) => void) => void;
  scrollTo: (target: number, opts?: LenisScrollOpts) => void;
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Smootherstep, not smoothstep. Cubic smoothstep has a continuous velocity but
// a discontinuous acceleration at both ends, and with a stop every half-screen
// that shows up as a small jolt each time the camera leaves a city and again
// as it arrives — seventeen times over the section. The quintic zeroes the
// second derivative at 0 and 1 as well, so departures and arrivals ease rather
// than snap. Same endpoints, same total distance, no extra scroll cost.
const smoothstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const LEGS = TRAVEL_STOPS.length - 1;
const TRAVEL_SVH = INTRO_SVH + LEGS * LEG_SVH;
const INTRO_FRAC = INTRO_SVH / TRAVEL_SVH;

/** Where the camera sits, and which stop is being read, at a given progress. */
function solveCamera(progress: number, viewWidth: number) {
  const p = clamp01(progress);

  // Leg progress starts only once the intro dive has landed, so the world view
  // is not still unfolding while the camera has already left for Tokyo.
  const legP = clamp01((p - INTRO_FRAC) / (1 - INTRO_FRAC));
  const t = legP * LEGS;
  const i = Math.min(Math.floor(t), LEGS - 1);
  const f = t - i;

  const a = TRAVEL_STOPS[i];
  const b = TRAVEL_STOPS[i + 1];
  const e = smoothstep(clamp01((f - DWELL) / (1 - 2 * DWELL)));

  const x = lerp(toMapX(a.lon), toMapX(b.lon), e);
  const y = lerp(toMapY(a.lat), toMapY(b.lat), e);

  // Zoom interpolates in log space: equal scroll should buy an equal *ratio*
  // of zoom, or the pull-out lurches at one end and crawls at the other. The
  // sine term is the pull-out, peaking mid-hop and exactly zero at both stops.
  const dist = Math.hypot(b.lon - a.lon, b.lat - a.lat);
  const lnA = Math.log(a.span);
  const lnB = Math.log(b.span);
  const lnTransit = Math.log(Math.max(a.span, b.span, dist * TRANSIT_PULL));
  const bulge = Math.sin(Math.PI * e) * (lnTransit - (lnA + lnB) / 2);
  let span = Math.exp(lerp(lnA, lnB, e) + bulge);

  // The dive. Cubed so the whole world holds for a beat, then drops fast.
  const intro = p < INTRO_FRAC ? (1 - p / INTRO_FRAC) ** 3 : 0;
  if (intro > 0)
    span = Math.exp(lerp(Math.log(span), Math.log(WORLD_SPAN), intro));

  return {
    camera: { x, y, scale: viewWidth / (span * PX_PER_DEG) } as Camera,
    leg: i,
    legEase: e,
    active: e < 0.5 ? i : i + 1,
    intro,
  };
}

/** Quadratic arc between two stops, bulging toward the top of the map. */
function legPath(a: TravelStop, b: TravelStop) {
  const ax = toMapX(a.lon);
  const ay = toMapY(a.lat);
  const bx = toMapX(b.lon);
  const by = toMapY(b.lat);
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const lift = len * 0.18;
  return `M${ax} ${ay} Q${ax + dx / 2 + nx * lift} ${ay + dy / 2 + ny * lift} ${bx} ${by}`;
}

export default function TravelMap() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const routeRef = useRef<SVGGElement>(null);
  const legRefs = useRef<(SVGPathElement | null)[]>([]);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const landRef = useRef<Land | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const activeRef = useRef(0);
  const arrivedRef = useRef(false);
  // Set by whichever draw path is live, so a resize can repaint without the
  // sizing effect needing to know which one that is.
  const redrawRef = useRef<(() => void) | null>(null);

  const [active, setActive] = useState(0);
  const [arrived, setArrived] = useState(false); // the intro dive has landed
  const [ready, setReady] = useState(false); // land geometry settled

  const paths = useMemo(
    () =>
      TRAVEL_STOPS.slice(0, -1).map((a, i) => legPath(a, TRAVEL_STOPS[i + 1])),
    [],
  );

  // --- Land geometry --------------------------------------------------------
  // Fetched rather than imported so 59kb of coastline stays out of the JS
  // bundle. This section sits several screens below the fold; it has time.
  useEffect(() => {
    let cancelled = false;
    fetch('/map/land.json')
      .then((r) => r.json())
      .then((data: { rings: number[][] }) => {
        if (cancelled) return;
        // Per-ring bounds, so the draw loop can skip the ~120 rings nowhere
        // near the viewport once the camera is down among the hill stations.
        const bboxes = new Float32Array(data.rings.length * 4);
        data.rings.forEach((ring, r) => {
          let minX = Infinity;
          let minY = Infinity;
          let maxX = -Infinity;
          let maxY = -Infinity;
          for (let k = 0; k < ring.length; k += 2) {
            if (ring[k] < minX) minX = ring[k];
            if (ring[k] > maxX) maxX = ring[k];
            if (ring[k + 1] < minY) minY = ring[k + 1];
            if (ring[k + 1] > maxY) maxY = ring[k + 1];
          }
          bboxes.set([minX, minY, maxX, maxY], r * 4);
        });
        landRef.current = { rings: data.rings, bboxes };
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // Graticule, route and markers still draw. A missing coastline is a
        // poorer map, not a broken section.
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Painting -------------------------------------------------------------
  const paint = useCallback((cam: Camera) => {
    const canvas = canvasRef.current;
    const { w, h } = sizeRef.current;
    if (!canvas || !w || !h) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(cam.scale, cam.scale);
    ctx.translate(-cam.x, -cam.y);

    // Visible window in map units, with margin so a ring does not pop as its
    // bounding box crosses the edge.
    const halfW = (w / 2 / cam.scale) * 1.1;
    const halfH = (h / 2 / cam.scale) * 1.1;
    const left = cam.x - halfW;
    const right = cam.x + halfW;
    const top = cam.y - halfH;
    const bottom = cam.y + halfH;

    // Graticule under the land, so a coastline is always the strongest edge.
    //
    // The interval adapts to the zoom. A fixed 10° grid is right for the world
    // view and useless at the hill stations, where the whole frame is 9° wide
    // and would contain no line at all — six of the ten stops sat in an empty
    // black rectangle. Picking the coarsest interval that still lays down
    // roughly six lines keeps the frame scaled at every altitude, and drawing
    // the fifth line brighter gives the grid a hierarchy to read against.
    const visibleDeg = w / cam.scale / PX_PER_DEG;
    const stepDeg = GRATICULE_LADDER.find((d) => visibleDeg / d >= 6) ?? 0.1;

    const grid = (degrees: number, style: string) => {
      const step = degrees * PX_PER_DEG;
      ctx.strokeStyle = style;
      ctx.lineWidth = 1 / cam.scale;
      ctx.beginPath();
      for (let x = Math.floor(left / step) * step; x <= right; x += step) {
        ctx.moveTo(x, Math.max(top, 0));
        ctx.lineTo(x, Math.min(bottom, MAP_H));
      }
      for (let y = Math.floor(top / step) * step; y <= bottom; y += step) {
        ctx.moveTo(Math.max(left, 0), y);
        ctx.lineTo(Math.min(right, MAP_W), y);
      }
      ctx.stroke();
    };

    grid(stepDeg, GRATICULE);
    grid(stepDeg * 5, GRATICULE_MAJOR);

    const land = landRef.current;
    if (land) {
      ctx.beginPath();
      const { rings, bboxes } = land;
      for (let r = 0; r < rings.length; r++) {
        const o = r * 4;
        if (bboxes[o] > right || bboxes[o + 2] < left) continue;
        if (bboxes[o + 1] > bottom || bboxes[o + 3] < top) continue;
        const ring = rings[r];
        ctx.moveTo(ring[0], ring[1]);
        for (let k = 2; k < ring.length; k += 2)
          ctx.lineTo(ring[k], ring[k + 1]);
        ctx.closePath();
      }
      ctx.fillStyle = LAND_FILL;
      ctx.fill('evenodd');
      ctx.strokeStyle = LAND_STROKE;
      ctx.lineWidth = 1 / cam.scale;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  /** Positions the route group and every marker for a given camera. */
  const place = useCallback((cam: Camera) => {
    const { w, h } = sizeRef.current;
    if (routeRef.current) {
      routeRef.current.setAttribute(
        'transform',
        `translate(${w / 2} ${h / 2}) scale(${cam.scale}) translate(${-cam.x} ${-cam.y})`,
      );
      // Counter-scaled by hand rather than with vector-effect: non-scaling-stroke
      // moves the whole stroke into screen space, dash pattern included, and
      // that quietly defeats pathLength="1" — the dash array stops meaning
      // "one path length" and starts meaning "one CSS pixel", so every leg
      // that should be hidden renders as a 1px dotted line instead. Stroke
      // width inherits, so setting it on the group covers all nine legs.
      routeRef.current.setAttribute(
        'stroke-width',
        String(ROUTE_STROKE / cam.scale),
      );
    }
    for (let i = 0; i < TRAVEL_STOPS.length; i++) {
      const el = markerRefs.current[i];
      if (!el) continue;
      const sx = (toMapX(TRAVEL_STOPS[i].lon) - cam.x) * cam.scale + w / 2;
      const sy = (toMapY(TRAVEL_STOPS[i].lat) - cam.y) * cam.scale + h / 2;
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      // Off-frame markers are hidden rather than left stacking against the
      // edges of a section that is mostly open sea.
      const off = sx < -80 || sx > w + 80 || sy < -80 || sy > h + 80;
      el.style.opacity = off ? '0' : '1';
      el.style.pointerEvents = off ? 'none' : 'auto';
    }
  }, []);

  /** Everything that moves per scroll frame. */
  const render = useCallback(
    (progress: number) => {
      const { w } = sizeRef.current;
      if (!w) return;

      const {
        camera,
        leg,
        legEase,
        active: next,
        intro,
      } = solveCamera(progress, w);
      paint(camera);
      place(camera);

      // Each leg draws from its own dash offset, so the trace arrives exactly
      // when the camera does instead of running ahead of it.
      for (let i = 0; i < LEGS; i++) {
        const el = legRefs.current[i];
        if (!el) continue;
        const drawn = i < leg ? 1 : i > leg ? 0 : legEase;
        el.style.strokeDashoffset = String(1 - drawn);
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${clamp01(progress)})`;
      }

      // Guarded: these are the only two pieces of scroll state React owns, and
      // setting them unconditionally would re-render the stage every frame.
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
      const landed = intro < 0.2;
      if (arrivedRef.current !== landed) {
        arrivedRef.current = landed;
        setArrived(landed);
      }
    },
    [paint, place],
  );

  // --- Sizing ---------------------------------------------------------------
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      redrawRef.current?.();
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // --- Scroll ---------------------------------------------------------------
  useEffect(() => {
    if (!ready) return;

    if (reduce) {
      // One static frame wide enough to hold every stop, whole route already
      // traced. No camera, nothing that moves.
      const lons = TRAVEL_STOPS.map((s) => s.lon);
      const lats = TRAVEL_STOPS.map((s) => s.lat);
      const draw = () => {
        const { w } = sizeRef.current;
        if (!w) return;
        const cam = {
          x: toMapX((Math.min(...lons) + Math.max(...lons)) / 2),
          y: toMapY((Math.min(...lats) + Math.max(...lats)) / 2),
          scale:
            w / ((Math.max(...lons) - Math.min(...lons)) * 1.25 * PX_PER_DEG),
        };
        paint(cam);
        place(cam);
        for (const el of legRefs.current) {
          if (el) el.style.strokeDashoffset = '0';
        }
      };
      redrawRef.current = draw;
      draw();
      return () => {
        redrawRef.current = null;
      };
    }

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
    redrawRef.current = () => render(st.progress);
    render(st.progress);
    return () => {
      redrawRef.current = null;
      st.kill();
    };
  }, [ready, reduce, render, paint, place]);

  /**
   * Lenis owns scroll position site-wide, so its instance is used when
   * present; the native fallback covers reduced-motion visitors, for whom
   * Lenis is never created.
   */
  const scrollToY = useCallback((top: number, opts?: LenisScrollOpts) => {
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    if (lenis) lenis.scrollTo(top, opts);
    else window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  /** Jump straight to a stop. */
  const goTo = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const legP = index / LEGS;
      let p = INTRO_FRAC + legP * (1 - INTRO_FRAC);
      // Land in the middle of the stop's rest, not the instant it arrives.
      if (index > 0) p -= ((1 - INTRO_FRAC) / LEGS) * (DWELL / 2);
      // offsetTop would be measured against the nearest positioned ancestor;
      // this is measured against the document, which is what scrollTo wants.
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollToY(
        sectionTop + clamp01(p) * (section.offsetHeight - window.innerHeight),
      );
    },
    [scrollToY],
  );

  /**
   * Out. Eighteen stops is roughly nine screens of scrolling, and someone who
   * has seen four cities and wants the rest of the page should not have to
   * wheel through the other fourteen to get there. Lands on whatever follows
   * the section rather than its last frame.
   */
  const skip = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    scrollToY(sectionTop + section.offsetHeight);
  }, [scrollToY]);

  /**
   * The return journey. Coming back up out of the footer, the route is a
   * nine-screen wall between the visitor and the rest of the page — and one
   * they have already read, replayed backwards. So the moment an upward scroll
   * re-enters the section from below, it is jumped clear over the whole thing
   * and set down just above the top edge.
   *
   * Only that one crossing is caught. Scrolling up from inside the section,
   * having arrived through it, still walks the route in reverse — that is
   * someone going back for a city they just passed, which is the one case
   * where retracing is the point.
   */
  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    if (!section) return;

    let lenis: LenisLike | undefined;
    let frame = 0;
    let jumping = false;
    let release: ReturnType<typeof setTimeout>;
    let previous = window.scrollY;

    const onScroll = ({ scroll, velocity }: LenisScrollEvent) => {
      const wasBelow = previous;
      previous = scroll;
      if (jumping || velocity >= 0 || !lenis) return;

      // offsetTop is measured against the offset parent; this is measured
      // against the document, which is what a scroll target needs. Read only
      // on an upward frame rather than every frame — a forced layout on every
      // scroll event is how a section like this loses its frame budget.
      const top = section.getBoundingClientRect().top + window.scrollY;
      // Where the pin lets go and the footer starts sliding up.
      const exit = top + section.offsetHeight - window.innerHeight;
      if (wasBelow < exit || scroll >= exit) return;

      jumping = true;
      lenis.scrollTo(Math.max(0, top - window.innerHeight), {
        duration: 0.8,
        lock: true,
        force: true,
        onComplete: () => {
          jumping = false;
        },
      });
      // onComplete does not fire if the tween is interrupted, and a stuck flag
      // would disable this for the rest of the visit.
      clearTimeout(release);
      release = setTimeout(() => {
        jumping = false;
      }, 950);
    };

    // SmoothScroll is loaded through next/dynamic, so window.lenis is not
    // there yet on this component's first effect pass.
    const attach = () => {
      lenis = (window as unknown as { lenis?: LenisLike }).lenis;
      if (!lenis) {
        frame = requestAnimationFrame(attach);
        return;
      }
      lenis.on('scroll', onScroll);
    };
    attach();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(release);
      lenis?.off('scroll', onScroll);
    };
  }, [reduce]);

  const stop = TRAVEL_STOPS[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Travel log"
      className="relative"
      style={reduce ? undefined : { height: `${TRAVEL_SVH + 100}svh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden border-y border-white/10 bg-black"
      >
        <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <g ref={routeRef}>
            {paths.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  legRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke="var(--accent)"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
                opacity={0.85}
              />
            ))}
          </g>
        </svg>

        {/* Markers live in screen space rather than inside the scaled SVG, so
            labels stay one size and stay real text. They duplicate the rail
            below, which is the accessible route to every stop — so these are
            hidden from assistive tech and kept out of the tab order rather
            than making ten offscreen buttons focusable. */}
        <div className="absolute inset-0" aria-hidden>
          {TRAVEL_STOPS.map((s, i) => (
            <div
              key={s.slug}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              className="absolute top-0 left-0 opacity-0 will-change-transform"
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i)}
                data-cursor="link"
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
              >
                <Reticle active={i === active} />
                {i === 0 && (
                  <span className="travel-home-pulse pointer-events-none absolute top-1/2 left-1/2 block h-8 w-8 rounded-full border border-[var(--accent)]" />
                )}
                {/* Only the stop being read is named. Six of these sit inside
                    a couple of degrees of each other, and at world zoom every
                    label at once is an unreadable pile — hover brings back the
                    rest for anyone hunting a particular pin. */}
                <span
                  className={`pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 font-mono text-[0.58rem] tracking-[0.22em] whitespace-nowrap uppercase transition-opacity duration-200 ${
                    i === active
                      ? 'text-[var(--accent)] opacity-100'
                      : 'text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {s.name}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* The canvas runs edge to edge; without the corners falling away the
            type sitting on it does not read. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(125% 95% at 50% 45%, transparent 42%, rgba(0,0,0,0.62) 100%)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-[var(--accent)]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6 md:p-10">
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-white/40 uppercase">
            Travel log
          </span>
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-white/40 uppercase tabular-nums">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(TRAVEL_STOPS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Bottom right, above the stop rail. The top-right corner is the site
            music toggle's, and a button that sits under another button is not
            a way out of a nine-screen section. Given a border and real padding
            too — this is the one control on the stage someone actively looks
            for, and it was reading as a caption.
            A real button, so it doubles as the skip link this section owed
            anyone tabbing through: every marker is deliberately unfocusable,
            and the rail only moves you deeper in. */}
        <button
          type="button"
          onClick={skip}
          data-cursor="link"
          // py-3 rather than py-2.5: at text-[0.7rem] the smaller padding came
          // out under 40px tall, short of the ~44px touch-target minimum —
          // the one control on this stage someone actively reaches for is not
          // where to lose those few pixels.
          className="absolute right-6 bottom-20 z-10 border border-white/25 bg-black/50 px-4 py-3 font-mono text-[0.7rem] tracking-[0.28em] text-white/70 uppercase backdrop-blur-sm transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] focus-visible:border-[var(--accent)] focus-visible:bg-[var(--accent)] focus-visible:text-[var(--accent-ink)] md:right-10 md:bottom-24 md:px-5 md:text-[0.75rem]"
        >
          Skip <span aria-hidden>&rarr;</span>
        </button>

        <Polaroids stop={stop} reduce={reduce} />

        {/* Keyed remount rather than AnimatePresence: the readout swaps
            whenever scroll crosses a midpoint, and `mode="wait"` gates the
            incoming element on the outgoing one's exit — miss that completion
            once and the panel is stuck naming the previous city for the rest
            of the section, which is exactly what it did. A remount replays
            `initial` and cannot deadlock. There is no exit to lose: the swap
            happens while the camera is already moving. */}
        {/* Sits higher on narrow screens than it does on wide ones: there the
            readout runs the full width of the stage, so the skip button in the
            bottom-right corner would land on the last line of the note. */}
        <div className="pointer-events-none absolute right-6 bottom-32 left-6 md:right-10 md:bottom-28 md:left-10">
          <motion.div
            key={stop.slug}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-xl"
          >
            {/* Reduced-motion visitors never run the dive, so there is no
                arrival to wait for — the static frame is already landed. */}
            {active === 0 && (arrived || reduce) && (
              <span
                className="block font-mono text-[0.65rem] tracking-[0.4em] uppercase"
                style={{ color: 'var(--accent)' }}
              >
                Here I am
              </span>
            )}
            <h3 className="mt-2 text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.9] font-semibold tracking-tighter">
              {stop.name}
            </h3>
            <p className="mt-3 text-sm text-white/55">{stop.where}</p>
            <p className="mt-1 font-mono text-[0.6rem] tracking-[0.18em] text-white/35 tabular-nums">
              {formatCoords(stop.lon, stop.lat)}
            </p>
            {stop.note && (
              <p className="mt-4 max-w-sm text-sm text-white/70">{stop.note}</p>
            )}
          </motion.div>
        </div>

        {/* Every stop, always reachable — a marker is only clickable while it
            happens to be in frame, and this section runs long. */}
        <nav
          aria-label="Travel stops"
          className="absolute inset-x-0 bottom-0 overflow-x-auto border-t border-white/10 bg-black/60 backdrop-blur-sm"
        >
          <ul className="flex min-w-max">
            {TRAVEL_STOPS.map((s, i) => (
              <li
                key={s.slug}
                className="border-r border-white/10 last:border-r-0"
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  data-cursor="link"
                  aria-current={i === active ? 'true' : undefined}
                  className={`flex items-baseline gap-2 px-4 py-3 font-mono text-[0.6rem] tracking-[0.22em] uppercase transition-colors duration-200 md:px-5 ${
                    i === active
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)]'
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  <span className="tabular-nums opacity-60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// The pin. Two states, not one drawing dimmed: the stop being read gets the
// full targeting reticle — corner brackets, diamond core, a ring sweeping out
// of it — and every other stop gets a plain dot. Eighteen reticles at world
// zoom is a bright smudge over south India and reads as noise; a dot is still
// unmistakably a marked place, and it lets the reticle mean something.
//
// Drawn at a fixed pixel size in screen space, so both hold at every zoom.
// ---------------------------------------------------------------------------

function Reticle({ active }: { active: boolean }) {
  if (!active) {
    return (
      <span className="relative block h-6 w-6">
        {/* Solid white, with a dark halo under it so the dot survives being
            dropped on a pale coastline as readably as it does on open sea. */}
        <span className="absolute top-1/2 left-1/2 block h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 shadow-[0_0_0_2.5px_rgba(0,0,0,0.65)] transition-colors duration-200 group-hover:bg-[var(--accent)]" />
      </span>
    );
  }

  return (
    <span className="relative block h-6 w-6">
      <span className="travel-pin-scan pointer-events-none absolute inset-0 rounded-full border border-[var(--accent)]" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.4}
        strokeLinecap="square"
        className="h-6 w-6 text-[var(--accent)]"
      >
        <path
          d="M3.5 8.5v-5h5M15.5 3.5h5v5M20.5 15.5v5h-5M8.5 20.5h-5v-5"
          stroke="currentColor"
        />
        <path
          d="M12 8.4 15.6 12 12 15.6 8.4 12Z"
          stroke="currentColor"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Polaroids. Always the right-hand side — the readout (city, region,
// coordinates, note) owns the bottom left, and alternating the photos across
// the stage meant half the stops had type and paper fighting for the same
// corner. A stop with two photos stacks them corner-on-corner: the second card
// offset down and across by roughly half its own size, so the pair sits on the
// diagonal of a square with the overlap doing the work of a paperclip. An empty
// `photos` list renders the frame with the film still undeveloped rather than a
// broken image.
//
// `offset` is in card widths/heights, applied as a translate on top of the
// anchor so the pair scales with the card at every breakpoint instead of
// drifting apart on a wide display.
// ---------------------------------------------------------------------------

type Slot = { rotate: number; offset: [number, number] };

// Pulled further off the right edge on narrow screens: the offset card adds
// half a card width to the pair's footprint. At 20% this cleared a 390px
// phone but left under 2px of margin at 360px (many Android widths) — close
// enough to rounding error that it clipped on real hardware. 23% gives it
// room on anything down to a legacy 320px screen.
const ANCHOR = 'right-[23%] top-[13%] md:right-[13%]';

// Back card first: the second frame lands on top, down-right of the first.
const SLOTS: Slot[] = [
  { rotate: -4, offset: [0, 0] },
  { rotate: 3, offset: [0.52, 0.58] },
];

function Polaroids({ stop, reduce }: { stop: TravelStop; reduce: boolean }) {
  const frames = stop.photos.length ? stop.photos.slice(0, 2) : [null];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {SLOTS.map((slot, i) => {
        if (i >= frames.length) return null;
        const photo = frames[i];
        return (
          <motion.figure
            // Same keyed-remount reasoning as the readout above.
            key={`${stop.slug}-${i}`}
            // Never from scale 0 — the card is a physical object that was
            // already somewhere. It lands; it does not materialise.
            initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.34,
              delay: reduce ? 0 : i * 0.07,
              ease: [0.23, 1, 0.32, 1],
            }}
            className={`absolute w-[8.5rem] bg-[#f6f4ef] p-2.5 pb-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] md:w-[13rem] md:p-3 md:pb-10 lg:w-[15rem] ${ANCHOR}`}
            // `translate` and `rotate` are their own CSS properties, not
            // shorthands for `transform` — which is what framer-motion writes
            // for the y/scale entrance. The two compose instead of one
            // clobbering the other, so the card can be offset and tilted while
            // still animating in.
            style={{
              translate: `${slot.offset[0] * 100}% ${slot.offset[1] * 100}%`,
              rotate: `${slot.rotate}deg`,
              zIndex: i,
            }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
              {photo ? (
                <Image
                  src={`/images/travel/${stop.slug}/${photo}`}
                  alt={stop.name}
                  fill
                  sizes="(max-width: 768px) 8.5rem, 15rem"
                  // Already resampled to 1600px q82 by
                  // scripts/travel-photos.ps1, so the optimizer has nothing
                  // left to win — and running it would bill a transformation
                  // and a cache write per photo per breakpoint. Served straight
                  // off the CDN instead.
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-white/10 p-3">
                  <span className="text-center font-mono text-[0.5rem] leading-relaxed tracking-[0.25em] text-white/25 uppercase md:text-[0.55rem]">
                    Roll not
                    <br />
                    scanned
                  </span>
                </div>
              )}
            </div>
            <figcaption
              className="mt-1 pl-1.5 font-hand text-[1.1rem] leading-tight text-neutral-600 md:mt-1.5 md:text-[1.4rem]"
              style={{ rotate: `${-slot.rotate * 0.6}deg` }}
            >
              {stop.name.toLowerCase()}
            </figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}
