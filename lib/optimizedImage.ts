// Local /public covers are multi-megabyte source PNGs. Two spots load them
// as raw <img>/CSS background instead of next/image (a canvas texture needs
// a real HTMLImageElement, and the vortex dive clone is a plain styled div).
// This used to route through Next's image-optimizer endpoint to resize them
// down first, but images.unoptimized is now on site-wide (to stop image
// cache writes), which makes Next's optimizer 400 any request instead of
// passing it through — so there is no resize left to route to. Both callers
// now just get the raw file at full resolution.
export function optimizedSrc(src: string) {
  return src;
}
