// Local /public covers are multi-megabyte source PNGs. Two spots load them
// as raw <img>/CSS background instead of next/image (a canvas texture needs
// a real HTMLImageElement, and the vortex dive clone is a plain styled div) —
// both were pulling the full source file even though neither ever renders
// near that resolution. Routing through Next's own image-optimizer endpoint
// gets the same resize + automatic webp/avif re-encode <Image> would give,
// from a plain string URL.
export function optimizedSrc(src: string, width: number, quality = 75) {
  if (!src.startsWith('/')) return src; // remote/data URLs: nothing to optimize
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
