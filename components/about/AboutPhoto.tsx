'use client';

import Image from 'next/image';

/**
 * A photo slot that is safe to ship empty.
 *
 * Pointing next/image at a file that doesn't exist yet fails the build, so
 * until a real photo lands this renders a framed placeholder at the exact
 * aspect ratio the final image will occupy — the layout is already final, and
 * dropping a file in swaps it with no reflow. Filling one in means setting its
 * `src` in the PHOTOS map in AboutContent.tsx; nothing else changes.
 */
export default function AboutPhoto({
  src,
  alt,
  caption,
  ratio,
  sizes,
  className = '',
  priority = false,
}: {
  src?: string;
  alt: string;
  caption: string;
  ratio: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="text-white/25"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.6" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span className="text-xs tracking-[0.2em] text-white/30 uppercase">{caption}</span>
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}
