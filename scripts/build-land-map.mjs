// Regenerates public/map/land.json — the world landmass the About page's
// travel section draws.
//
//   node scripts/build-land-map.mjs
//
// Source is Natural Earth 1:110m land, public domain, shipped as TopoJSON by
// world-atlas. It is fetched rather than added as a dependency: this runs once
// when the geometry needs changing, and the committed JSON is what ships.
//
// Output is a plain ring list in equirectangular pixels on a 2000x1000 canvas
// (x = (lon+180)/360*2000, y = (90-lat)/180*1000) rather than an SVG. The map
// zooms to ~29x at the hill stations; a CSS-scaled SVG layer at that factor
// asks the compositor for a raster far past the maximum texture size and comes
// back blurred, so the section draws these rings to a canvas instead, which is
// resolution-independent at any zoom.

import { writeFile, mkdir } from 'node:fs/promises';

const SRC = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';
const W = 2000;
const H = 1000;

// Points closer together than this contribute nothing at the widest zoom the
// section reaches, and rings smaller than MIN_AREA read as dirt on the screen
// rather than islands.
const MIN_STEP = 1.2;
const MIN_AREA = 3;

const topo = await fetch(SRC).then((r) => {
  if (!r.ok) throw new Error(`${SRC} -> ${r.status}`);
  return r.json();
});

const {
  scale: [sx, sy],
  translate: [tx, ty],
} = topo.transform;

// TopoJSON arcs are quantized and delta-encoded; undo both to get lon/lat.
const arcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * sx + tx, y * sy + ty];
  });
});

const project = ([lon, lat]) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];

/**
 * Cut a ring wherever it crosses the ±180° meridian.
 *
 * An equirectangular projection maps 179°E and 179°W to opposite edges of the
 * canvas, so any landmass spanning the antimeridian — Eurasia at Chukotka,
 * Fiji, Antarctica — comes out as a shape with one edge stretched across all
 * 2000px of the map. Unsplit, that draws as a hard horizontal line straight
 * through the middle of the world.
 *
 * Each crossing gets a point interpolated onto the boundary, and the piece
 * after it restarts on the far edge at the same latitude. Both ends of every
 * piece then sit on the same edge, so closing the path runs down the edge of
 * the map, where it is invisible.
 */
function splitAtAntimeridian(pts) {
  const pieces = [];
  let current = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [prevLon, prevLat] = pts[i - 1];
    const [lon, lat] = pts[i];
    if (Math.abs(lon - prevLon) > 180) {
      // Which edge the previous point is heading for.
      const edge = lon > prevLon ? -1 : 1;
      // Re-express this point in the previous one's continuous frame so the
      // crossing latitude can be interpolated across the seam.
      const unwrapped = lon + edge * 360;
      const t = (edge * 180 - prevLon) / (unwrapped - prevLon);
      const seamLat = prevLat + (lat - prevLat) * t;
      current.push([edge * 180, seamLat]);
      pieces.push(current);
      current = [
        [-edge * 180, seamLat],
        [lon, lat],
      ];
    } else {
      current.push([lon, lat]);
    }
  }
  pieces.push(current);
  return pieces;
}

// A ring is a list of arc indices; a negative index means "walk that arc
// backwards". Consecutive arcs share an endpoint, so the seam is dropped.
function buildRing(indices) {
  const pts = [];
  for (const idx of indices) {
    const reversed = idx < 0;
    const arc = arcs[reversed ? ~idx : idx];
    const seq = reversed ? arc.slice().reverse() : arc;
    for (let i = pts.length ? 1 : 0; i < seq.length; i++) pts.push(seq[i]);
  }
  return pts; // still lon/lat — the seam split has to happen before projecting
}

function simplify(pts) {
  const out = [pts[0]];
  for (const [x, y] of pts) {
    const [px, py] = out[out.length - 1];
    if (Math.hypot(x - px, y - py) >= MIN_STEP) out.push([x, y]);
  }
  return out;
}

function area(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1];
  }
  return Math.abs(a / 2);
}

const polygons = topo.objects.land.geometries.flatMap((g) =>
  g.type === 'Polygon' ? [g.arcs] : g.arcs,
);

const round = (n) => Math.round(n * 10) / 10;
const rings = [];

for (const polygon of polygons) {
  for (const indices of polygon) {
    const lonLat = buildRing(indices);
    if (lonLat.length < 4) continue;
    for (const piece of splitAtAntimeridian(lonLat)) {
      if (piece.length < 4) continue;
      const pts = simplify(piece.map(project));
      if (pts.length < 4 || area(pts) < MIN_AREA) continue;
      // Flat [x, y, x, y, ...] — half the JSON punctuation of nested pairs.
      rings.push(pts.flatMap(([x, y]) => [round(x), round(y)]));
    }
  }
}

const json = JSON.stringify({ width: W, height: H, rings });
await mkdir('public/map', { recursive: true });
await writeFile('public/map/land.json', json);

const points = rings.reduce((n, r) => n + r.length / 2, 0);
console.log(`${rings.length} rings, ${points} points, ${(json.length / 1024).toFixed(1)}kb`);
