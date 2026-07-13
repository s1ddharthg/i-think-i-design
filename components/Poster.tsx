'use client';

import { useEffect, useRef } from 'react';
import { drawPoster } from '@/lib/poster';

/**
 * Renders a project's generated poster artwork as a canvas element.
 * Same drawPoster used by the 3D vortex textures, so artwork matches 1:1.
 */
export default function Poster({
  slug,
  accent,
  width,
  height,
  className,
}: {
  slug: string;
  accent: string;
  width: number;
  height: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) drawPoster(ctx, canvas.width, canvas.height, slug, accent);
  }, [slug, accent]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      aria-hidden
      className={className}
      // accent shows before hydration paints the artwork — no black flash
      style={{ backgroundColor: accent }}
    />
  );
}
