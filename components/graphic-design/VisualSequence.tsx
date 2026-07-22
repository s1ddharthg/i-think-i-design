'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { Visual } from '@/lib/graphicDesign';
import { InstagramPost, InstagramGrid } from '@/components/graphic-design/InstagramMockups';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function reveal(reduce: boolean | null) {
  return {
    initial: reduce ? false : ({ opacity: 0, y: 28 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE },
  };
}

// A single real photo/poster at its true ratio, centered — not full-bleed,
// not paired with text beside it. Used for the odd shot that doesn't have a
// natural partner to sit next to.
function SingleImage({ visual, reduce }: { visual: Extract<Visual, { kind: 'image' }>; reduce: boolean | null }) {
  return (
    <motion.figure {...reveal(reduce)} className="mx-auto w-full max-w-2xl">
      <Image
        src={visual.src}
        alt={visual.alt}
        width={visual.width}
        height={visual.height}
        sizes="(min-width: 768px) 56vw, 92vw"
        className="h-auto w-full rounded-sm"
      />
    </motion.figure>
  );
}

// The full-width beat between groups — wide "out in the world" shots
// (billboards, standees, signage) that would lose their frame cropped into
// an Instagram ratio, shown at true scale instead.
function FeatureRow({ visual, reduce }: { visual: Extract<Visual, { kind: 'image' }>; reduce: boolean | null }) {
  return (
    <motion.figure {...reveal(reduce)} className="w-full">
      <Image
        src={visual.src}
        alt={visual.alt}
        width={visual.width}
        height={visual.height}
        sizes="100vw"
        className="h-auto w-full"
      />
    </motion.figure>
  );
}

// Two photos side by side, or a bento mosaic once there are three or four —
// replaces the old image-plus-caption row. `fill` + a fixed aspect box means
// no intrinsic dimensions are needed per tile.
function GalleryTile({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-sm bg-white/5 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 44vw, 92vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}

function GalleryRow({ visual, reduce }: { visual: Extract<Visual, { kind: 'gallery' }>; reduce: boolean | null }) {
  const { images } = visual;
  const Tile = GalleryTile;

  return (
    <motion.div {...reveal(reduce)} className="w-full">
      {images.length <= 2 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {images.map((im, i) => (
            <Tile key={i} src={im.src} alt={im.alt} className="aspect-[4/5]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <Tile src={images[0].src} alt={images[0].alt} className="col-span-2 aspect-[16/9] sm:col-span-1 sm:aspect-auto sm:row-span-2" />
          {images.slice(1).map((im, i) => (
            <Tile key={i} src={im.src} alt={im.alt} className="aspect-square" />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// A standalone beat of copy — bigger and slower than a caption, giving the
// process room to breathe between image groups.
function TextRow({ visual, reduce }: { visual: Extract<Visual, { kind: 'text' }>; reduce: boolean | null }) {
  return (
    <motion.p
      {...reveal(reduce)}
      className="text-pretty mx-auto max-w-2xl text-center text-xl leading-relaxed text-white/70 sm:text-2xl"
    >
      {visual.body}
    </motion.p>
  );
}

// Every Instagram mockup in a project renders at this same fixed width,
// solo or grouped — 3 of them side by side still fit inside max-w-5xl below,
// so the tile size never has to shrink to make a row fit.
const IG_TILE = 'w-full max-w-[20rem]';

function IgPostRow({ visual, reduce }: { visual: Extract<Visual, { kind: 'ig-post' }>; reduce: boolean | null }) {
  return (
    <motion.div {...reveal(reduce)} className="flex flex-col items-center">
      <div className={IG_TILE}>
        <InstagramPost src={visual.src} alt={visual.alt} postCaption={visual.postCaption} />
      </div>
    </motion.div>
  );
}

// Two or more regular-size Instagram mockups in a row read as a set, not a
// stack — three per row, wrapping to a second row at four or more, same
// rule for every case study rather than a per-project layout choice. Each
// tile is capped at the same IG_TILE width as a solo post, so grouping never
// changes how big an individual mockup renders.
function IgPostGroup({
  visuals,
  reduce,
}: {
  visuals: Extract<Visual, { kind: 'ig-post' }>[];
  reduce: boolean | null;
}) {
  return (
    <motion.div
      {...reveal(reduce)}
      className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-x-6 gap-y-12"
    >
      {visuals.map((v, i) => (
        <div key={i} className={`flex flex-col items-center ${IG_TILE}`}>
          <InstagramPost src={v.src} alt={v.alt} postCaption={v.postCaption} />
        </div>
      ))}
    </motion.div>
  );
}

function IgGridRow({ visual, reduce }: { visual: Extract<Visual, { kind: 'ig-grid' }>; reduce: boolean | null }) {
  if (visual.fullBleed) {
    return (
      <motion.div {...reveal(reduce)} className="flex flex-col">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <InstagramGrid images={visual.images} fullBleed />
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div {...reveal(reduce)} className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <InstagramGrid images={visual.images} />
      </div>
    </motion.div>
  );
}

type RenderItem =
  | { type: 'single'; visual: Visual }
  | { type: 'ig-group'; visuals: Extract<Visual, { kind: 'ig-post' }>[] };

// Consecutive regular-size ig-post entries (no run-breaking text/gallery/etc.
// between them) become one grouped grid instead of individually stacked rows.
// A run of exactly one stays a normal single row.
function groupVisuals(visuals: Visual[]): RenderItem[] {
  const items: RenderItem[] = [];
  let run: Extract<Visual, { kind: 'ig-post' }>[] = [];

  const flushRun = () => {
    if (run.length === 0) return;
    if (run.length === 1) items.push({ type: 'single', visual: run[0] });
    else items.push({ type: 'ig-group', visuals: run });
    run = [];
  };

  for (const v of visuals) {
    if (v.kind === 'ig-post' && v.size !== 'lg') {
      run.push(v);
    } else {
      flushRun();
      items.push({ type: 'single', visual: v });
    }
  }
  flushRun();
  return items;
}

export default function VisualSequence({ visuals }: { visuals: Visual[] }) {
  const reduce = useReducedMotion();
  const items = groupVisuals(visuals);

  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      {items.map((item, i) => {
        if (item.type === 'ig-group') return <IgPostGroup key={i} visuals={item.visuals} reduce={reduce} />;
        const v = item.visual;
        if (v.kind === 'ig-post') return <IgPostRow key={i} visual={v} reduce={reduce} />;
        if (v.kind === 'ig-grid') return <IgGridRow key={i} visual={v} reduce={reduce} />;
        if (v.kind === 'gallery') return <GalleryRow key={i} visual={v} reduce={reduce} />;
        if (v.kind === 'text') return <TextRow key={i} visual={v} reduce={reduce} />;
        if (v.size === 'lg') return <FeatureRow key={i} visual={v} reduce={reduce} />;
        return <SingleImage key={i} visual={v} reduce={reduce} />;
      })}
    </div>
  );
}
