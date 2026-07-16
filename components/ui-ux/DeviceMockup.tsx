'use client';

import type { ReactNode } from 'react';
import type { Device } from '@/lib/uiux';

// CSS-drawn device chrome so the frame stays crisp at any size — no bitmap
// mockup to go blurry. The screen content (an auto-scrolling filmstrip) is
// passed as children and clipped to the viewport.

export default function DeviceMockup({
  device,
  url,
  children,
}: {
  device: Device;
  url?: string;
  children: ReactNode;
}) {
  if (device === 'iphone') return <IphoneFrame>{children}</IphoneFrame>;
  return <MacFrame url={url}>{children}</MacFrame>;
}

function IphoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[clamp(220px,80vw,300px)]">
      {/* Bezel */}
      <div className="relative rounded-[2.8rem] bg-neutral-900 p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-white/10">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -left-[3px] top-52 h-12 w-[3px] rounded-l bg-neutral-700" />
        <span className="absolute -right-[3px] top-40 h-16 w-[3px] rounded-r bg-neutral-700" />
        {/* Screen */}
        <div className="relative aspect-[375/812] overflow-hidden rounded-[2.1rem] bg-black">
          {children}
          {/* Dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function MacFrame({ url, children }: { url?: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-neutral-800/80 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex min-w-0 max-w-[70%] items-center gap-2 rounded-md bg-neutral-900/80 px-3 py-1 text-[11px] text-white/40">
            <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span className="truncate">{url ?? 'localhost:3000'}</span>
          </div>
        </div>
        {/* Viewport */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black">{children}</div>
      </div>
    </div>
  );
}
