'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Minimal outline icons, hand-drawn to Instagram's proportions — no icon
// library needed for a handful of static glyphs used in exactly one place.
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? '#ff3040' : 'none'}
    stroke={filled ? '#ff3040' : 'currentColor'}
    strokeWidth={1.6}
    className="h-6 w-6"
  >
    <path d="M12 20.5s-7.5-4.6-9.7-9.1C.8 8 2 4.6 5.3 3.7c2-.5 4 .3 5.2 2 .4.6.9.6 1.3 0 1.2-1.7 3.2-2.5 5.2-2 3.3.9 4.5 4.3 3 7.7-2.2 4.5-9.7 9.1-9.7 9.1Z" />
  </svg>
);
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
    <path
      d="M21 11.5a8.38 8.38 0 0 1-4.7 7.6 8.5 8.5 0 0 1-8.6-.9L3 21l1.9-4.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 7.6-8.4 8.38 8.38 0 0 1 9.4 7.4Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
    <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2 15 22l-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.6}
    className="h-6 w-6"
  >
    <path d="M6 3h12v18l-6-4.5L6 21V3Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HANDLE = 'sid.design';

function Header() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-500 p-[1.5px]">
        <div className="h-full w-full rounded-full border border-white bg-white" />
      </div>
      <span className="text-[13px] font-semibold text-black">{HANDLE}</span>
      <span className="ml-auto text-black/70">···</span>
    </div>
  );
}

// Real navigator.share() when the browser supports it, otherwise a clipboard
// copy with a small toast — no backend, no fake modal, just what the web
// platform already gives us for free.
function useShare(url: string, title: string) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to nothing
        return;
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return { share, copied };
}

function ActionRow({
  liked,
  saved,
  onLike,
  onSave,
  onComment,
  onShare,
  copied,
}: {
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComment: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  return (
    <div className="relative flex items-center gap-3.5 px-3 pt-2.5 text-black">
      <motion.button
        type="button"
        aria-label={liked ? 'Unlike' : 'Like'}
        onClick={onLike}
        whileHover={{ scale: 1.18, rotate: -6 }}
        whileTap={{ scale: 0.8 }}
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeartIcon filled={liked} />
      </motion.button>
      <motion.button
        type="button"
        aria-label="Comment"
        onClick={onComment}
        whileHover={{ scale: 1.18, rotate: 6 }}
        whileTap={{ scale: 0.85 }}
      >
        <CommentIcon />
      </motion.button>
      <motion.button
        type="button"
        aria-label="Share"
        onClick={onShare}
        whileHover={{ scale: 1.18, x: 2, y: -2 }}
        whileTap={{ scale: 0.85 }}
      >
        <SendIcon />
      </motion.button>
      <motion.button
        type="button"
        aria-label={saved ? 'Remove from saved' : 'Save'}
        onClick={onSave}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.8 }}
        className="ml-auto"
      >
        <BookmarkIcon filled={saved} />
      </motion.button>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-8 right-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-medium text-white"
          >
            Link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentComposer({ open }: { open: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden px-3"
        >
          <div className="flex items-center gap-2 border-t border-black/10 py-2.5">
            <div className="h-6 w-6 shrink-0 rounded-full bg-black/10" />
            <input
              disabled
              placeholder="Add a comment…"
              className="w-full bg-transparent text-[13px] text-black placeholder:text-black/40 focus:outline-none"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function InstagramPost({
  src,
  alt,
  postCaption,
}: {
  src: string;
  alt: string;
  postCaption: string;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { share, copied } = useShare(
    typeof window !== 'undefined' ? window.location.href : '',
    postCaption
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-lg bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_28px_70px_-15px_rgba(0,0,0,0.75)]"
    >
      <Header />
      <div
        className="relative aspect-[4/5] w-full cursor-pointer bg-black/5"
        onDoubleClick={() => setLiked(true)}
      >
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      </div>
      <ActionRow
        liked={liked}
        saved={saved}
        onLike={() => setLiked((v) => !v)}
        onSave={() => setSaved((v) => !v)}
        onComment={() => setCommentsOpen((v) => !v)}
        onShare={share}
        copied={copied}
      />
      <div className="px-3 pt-2 pb-3">
        <p className="text-[12px] font-semibold text-black">{liked ? '2,482' : '2,481'} likes</p>
        <p className="mt-0.5 text-[13px] leading-snug text-black">
          <span className="font-semibold">{HANDLE}</span> {postCaption}
        </p>
      </div>
      <CommentComposer open={commentsOpen} />
    </motion.div>
  );
}

// A stable per-tile base like count, derived from the src so it doesn't
// reshuffle on every render but still varies tile to tile.
function baseLikes(src: string) {
  let hash = 0;
  for (let i = 0; i < src.length; i++) hash = (hash * 31 + src.charCodeAt(i)) % 900;
  return 120 + hash;
}

function GridTile({ src, alt }: { src: string; alt: string }) {
  const [liked, setLiked] = useState(false);
  const count = baseLikes(src) + (liked ? 1 : 0);

  return (
    <button
      type="button"
      onClick={() => setLiked((v) => !v)}
      className="group relative aspect-square w-full overflow-hidden bg-black/5"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/25 group-hover:opacity-100">
        <motion.span
          whileHover={{ scale: 1.15 }}
          className="flex items-center gap-1.5 text-sm font-semibold text-white"
        >
          <HeartIcon filled={liked} />
          {count.toLocaleString()}
        </motion.span>
      </div>
    </button>
  );
}

export function InstagramGrid({
  images,
  fullBleed,
}: {
  images: { src: string; alt: string }[];
  fullBleed?: boolean;
}) {
  if (fullBleed) {
    return (
      <div className="grid grid-cols-3 gap-1 bg-black sm:gap-1.5">
        {images.map((im, i) => (
          <GridTile key={i} src={im.src} alt={im.alt} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-amber-300 via-rose-400 to-indigo-500 p-[1.5px]">
          <div className="h-full w-full rounded-full border border-white bg-white" />
        </div>
        <span className="text-[13px] font-semibold text-black">{HANDLE}</span>
      </div>
      <div className="grid grid-cols-3 gap-[2px] bg-black/10">
        {images.map((im, i) => (
          <GridTile key={i} src={im.src} alt={im.alt} />
        ))}
      </div>
    </div>
  );
}
