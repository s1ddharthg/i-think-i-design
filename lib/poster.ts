// Deterministic generative "poster" artwork per project.
// Shared by the 3D WorkVortex planes (via THREE.CanvasTexture), the Gallery
// cards, and the work/[slug] hero (via <Poster />) so a project looks
// identical everywhere. Seeded from the slug — never Math.random at render.

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToHsl(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hsla(h: number, s: number, l: number, a = 1) {
  return `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;
}

// One shared, seeded noise tile for grain — same everywhere, generated once.
let noiseTile: HTMLCanvasElement | null = null;
function getNoiseTile() {
  if (noiseTile) return noiseTile;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(128, 128);
  const rnd = mulberry32(1337);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rnd() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  noiseTile = c;
  return c;
}

/**
 * Draws the poster for a project into any 2D context. Composition is
 * proportional to w/h, so the same slug reads as the same artwork across
 * aspect ratios (3D plane, 4:3 gallery card, 16:9 detail hero).
 */
export function drawPoster(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  slug: string,
  accent: string
) {
  const rnd = mulberry32(hashSeed(slug));
  const [hue, sat] = hexToHsl(accent);
  const analog = hue + 22 + rnd() * 24; // neighbouring tone for the wash
  const comp = hue + 150 + rnd() * 60; // opposing tone for the mark
  const min = Math.min(w, h);

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;

  // 1 — layered gradient wash: deep tinted base into the accent
  const ang = rnd() * Math.PI * 2;
  const r = Math.hypot(w, h) / 2;
  const dx = Math.cos(ang) * r;
  const dy = Math.sin(ang) * r;
  const wash = ctx.createLinearGradient(w / 2 - dx, h / 2 - dy, w / 2 + dx, h / 2 + dy);
  wash.addColorStop(0, hsla(hue, Math.min(sat * 0.6, 55), 9));
  wash.addColorStop(0.55, hsla(hue, Math.min(sat * 0.9, 75), 30));
  wash.addColorStop(1, hsla(analog, Math.min(sat * 0.8, 70), 48));
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  // 2 — soft radial glow in the analogous tone
  const gx = (0.2 + rnd() * 0.6) * w;
  const gy = (0.2 + rnd() * 0.6) * h;
  const glowR = (0.5 + rnd() * 0.35) * Math.max(w, h);
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
  glow.addColorStop(0, hsla(analog, Math.min(sat, 80), 62, 0.5));
  glow.addColorStop(1, hsla(analog, Math.min(sat, 80), 62, 0));
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // 3 — one bold geometric mark in the complementary tone
  const markColor = hsla(comp, Math.min(sat + 10, 78), 62, 0.85);
  const mx = (0.25 + rnd() * 0.5) * w;
  const my = (0.25 + rnd() * 0.5) * h;
  // decorrelated from the position stream so mark shapes spread evenly
  // across the 12 project slugs instead of clustering on one variant
  const variant = hashSeed('+f' + slug) % 6;
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = markColor;
  ctx.strokeStyle = markColor;
  switch (variant) {
    case 0: {
      // heavy ring
      ctx.lineWidth = min * (0.045 + rnd() * 0.03);
      ctx.beginPath();
      ctx.arc(mx, my, min * (0.24 + rnd() * 0.14), 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 1: {
      // solid disc bleeding off an edge
      const edgeX = rnd() < 0.5 ? -0.08 * w : 1.08 * w;
      ctx.beginPath();
      ctx.arc(edgeX, my, min * (0.38 + rnd() * 0.18), 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 2: {
      // diagonal bar across the frame
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((rnd() - 0.5) * 1.4);
      ctx.fillRect(-w, -min * (0.07 + rnd() * 0.05), w * 2, min * (0.14 + rnd() * 0.1));
      ctx.restore();
      break;
    }
    case 3: {
      // concentric open arcs
      ctx.lineWidth = min * 0.022;
      const start = rnd() * Math.PI * 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(mx, my, min * (0.14 + i * 0.11), start, start + Math.PI * (0.9 + rnd() * 0.6));
        ctx.stroke();
      }
      break;
    }
    case 4: {
      // sharp triangle
      const s = min * (0.3 + rnd() * 0.16);
      const rot = rnd() * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = rot + (i / 3) * Math.PI * 2;
        const px = mx + Math.cos(a) * s;
        const py = my + Math.sin(a) * s;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    default: {
      // quarter disc anchored in a corner
      const cx = rnd() < 0.5 ? 0 : w;
      const cy = rnd() < 0.5 ? 0 : h;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, min * (0.5 + rnd() * 0.2), 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  // 4 — hairline structure, like a poster grid showing through
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  const vx = (0.18 + rnd() * 0.64) * w;
  const hy = (0.18 + rnd() * 0.64) * h;
  ctx.beginPath();
  ctx.moveTo(vx, 0);
  ctx.lineTo(vx, h);
  ctx.moveTo(0, hy);
  ctx.lineTo(w, hy);
  ctx.stroke();

  // 5 — subtle grain
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = ctx.createPattern(getNoiseTile(), 'repeat')!;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}
