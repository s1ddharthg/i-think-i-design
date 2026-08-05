// Local /public covers are multi-megabyte source PNGs. Two spots load them
// as raw <img>/CSS background instead of next/image (a canvas texture needs
// a real HTMLImageElement, and the vortex dive clone is a plain styled div) —
// both were pulling the full source file even though neither ever renders
// near that resolution. Routing through Next's own image-optimizer endpoint
// gets the same resize + automatic webp/avif re-encode <Image> would give,
// from a plain string URL.
// The optimizer rejects any width outside images.imageSizes + images.deviceSizes
// with a 400 rather than rounding to the nearest one, and callers here pass a
// plain number instead of going through <Image>'s sizes machinery, so nothing
// stops a typo'd width. Since both callers use the result as an <img> src, a
// rejected width surfaces only as an image that never loads.
const ALLOWED_WIDTHS = [
  32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

export function optimizedSrc(src: string, width: number, quality = 75) {
  if (!src.startsWith('/')) return src; // remote/data URLs: nothing to optimize
  if (process.env.NODE_ENV !== 'production' && !ALLOWED_WIDTHS.includes(width)) {
    console.error(
      `optimizedSrc: width ${width} is not in next.config.ts images sizes — ` +
        `/_next/image will 400 and "${src}" will never load. ` +
        `Use one of ${ALLOWED_WIDTHS.join(', ')}.`
    );
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
