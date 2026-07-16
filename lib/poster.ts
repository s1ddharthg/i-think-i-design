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

// CSS object-fit: cover, drawn manually since canvas has no such primitive.
function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource & { width: number; height: number },
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Frames the poster artwork like the surface it would actually ship on —
 * a macOS browser chrome for UI/UX work, an Instagram post chrome for
 * graphic design — used only by the 3D vortex planes. `drawPoster` itself
 * (shared by Gallery/Poster/detail hero) is untouched by this.
 *
 * `coverImage`, when passed, replaces the generated poster in the content
 * area for graphic-design projects — those have real cover art; UI/UX
 * projects don't, so they always fall back to the generated poster.
 */
export function drawFramedArtwork(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  slug: string,
  accent: string,
  category: 'ui-ux' | 'graphic-design',
  title: string,
  coverImage?: CanvasImageSource & { width: number; height: number }
) {
  ctx.save();
  ctx.fillStyle = '#111114';
  ctx.fillRect(0, 0, w, h);

  if (category === 'ui-ux') {
    const barH = h * 0.12;

    // content area first, clipped under the bar
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, barH, w, h - barH);
    ctx.clip();
    ctx.translate(0, barH);
    drawPoster(ctx, w, h - barH, slug, accent);
    ctx.restore();

    // browser chrome bar
    ctx.fillStyle = '#2b2b30';
    ctx.fillRect(0, 0, w, barH);
    const dotR = barH * 0.16;
    const dotY = barH / 2;
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.arc(barH * 0.5 + i * dotR * 3, dotY, dotR, 0, Math.PI * 2);
      ctx.fill();
    });
    // address pill
    const pillW = w * 0.42;
    const pillH = barH * 0.5;
    const pillX = (w - pillW) / 2;
    const pillY = (barH - pillH) / 2;
    const r = pillH / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.moveTo(pillX + r, pillY);
    ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, r);
    ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, r);
    ctx.arcTo(pillX, pillY + pillH, pillX, pillY, r);
    ctx.arcTo(pillX, pillY, pillX + pillW, pillY, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = `${Math.round(pillH * 0.5)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${title.toLowerCase().replace(/\s+/g, '')}.app`, w / 2, pillY + pillH / 2 + 1);
  } else {
    const headerH = h * 0.15;
    const footerH = h * 0.13;

    // content between header and footer
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, headerH, w, h - headerH - footerH);
    ctx.clip();
    if (coverImage) {
      drawCoverFit(ctx, coverImage, 0, headerH, w, h - headerH - footerH);
    } else {
      ctx.translate(0, headerH);
      drawPoster(ctx, w, h - headerH - footerH, slug, accent);
    }
    ctx.restore();

    // header: avatar + handle
    ctx.fillStyle = '#111114';
    ctx.fillRect(0, 0, w, headerH);
    const avatarR = headerH * 0.3;
    const avatarX = headerH * 0.55;
    const avatarY = headerH / 2;
    ctx.beginPath();
    ctx.fillStyle = accent;
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 ${Math.round(headerH * 0.32)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('sid.design', avatarX + avatarR + headerH * 0.3, avatarY);

    // footer: heart / comment / share outlines
    ctx.fillRect(0, h - footerH, w, footerH);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = Math.max(1.5, footerH * 0.06);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const iconY = h - footerH / 2;
    const iconS = footerH * 0.34;
    let ix = headerH * 0.55;

    // heart
    ctx.beginPath();
    ctx.moveTo(ix, iconY + iconS * 0.28);
    ctx.bezierCurveTo(ix - iconS, iconY - iconS * 0.5, ix - iconS * 1.6, iconY + iconS * 0.55, ix, iconY + iconS);
    ctx.bezierCurveTo(ix + iconS * 1.6, iconY + iconS * 0.55, ix + iconS, iconY - iconS * 0.5, ix, iconY + iconS * 0.28);
    ctx.stroke();
    ix += iconS * 2.6;

    // comment bubble
    ctx.beginPath();
    ctx.ellipse(ix, iconY - iconS * 0.1, iconS * 0.85, iconS * 0.7, 0, Math.PI * 0.15, Math.PI * 1.85, true);
    ctx.stroke();
    ix += iconS * 2.4;

    // share arrow
    ctx.beginPath();
    ctx.moveTo(ix - iconS * 0.9, iconY + iconS * 0.6);
    ctx.lineTo(ix + iconS * 0.9, iconY - iconS * 0.6);
    ctx.moveTo(ix, iconY - iconS * 0.6);
    ctx.lineTo(ix + iconS * 0.9, iconY - iconS * 0.6);
    ctx.lineTo(ix + iconS * 0.9, iconY + iconS * 0.3);
    ctx.stroke();
  }

  ctx.restore();
}
