'use client';

import { useRouter } from 'next/navigation';

// router.back() returns to wherever the visitor actually came from — the
// home page vortex if that's the entry point, or the category grid if they
// came from there — rather than a hardcoded destination.
export default function BackButton({ className = 'mt-20 inline-block text-sm text-white/60 hover:text-white' }: { className?: string }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className={className}>
      ← Back
    </button>
  );
}
