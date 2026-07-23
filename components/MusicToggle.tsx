'use client';

import { useRef, useState } from 'react';
import { audioBus } from '@/lib/audioBus';

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wiredRef = useRef(false);

  const wireAnalyser = () => {
    if (wiredRef.current || !audioRef.current) return;
    wiredRef.current = true;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioBus.analyser = analyser;
    audioBus.data = new Uint8Array(analyser.frequencyBinCount);
    return ctx;
  };

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    const ctx = wireAnalyser();
    if (ctx && ctx.state === 'suspended') await ctx.resume();
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio ref={audioRef} src="/audio/background-music-jazz.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        aria-pressed={playing}
        className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-3.5 py-2 text-white backdrop-blur-xl transition-[background-color,transform] duration-200 ease-out hover:bg-white/10 active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,box-shadow,transform] duration-200 ease-out group-hover:scale-125 ${
            playing ? 'animate-pulse bg-accent shadow-[0_0_6px_var(--accent)]' : 'bg-white/30'
          }`}
        />
        <span className="grid">
          <span
            className="col-start-1 row-start-1 text-[11px] font-semibold tracking-wider whitespace-nowrap transition-opacity duration-200 ease-out"
            style={{ opacity: playing ? 1 : 0 }}
          >
            MUSIC ON
          </span>
          <span
            className="col-start-1 row-start-1 text-[11px] font-semibold tracking-wider whitespace-nowrap text-white/70 transition-opacity duration-200 ease-out"
            style={{ opacity: playing ? 0 : 1 }}
          >
            MUSIC OFF
          </span>
        </span>
      </button>
    </div>
  );
}
