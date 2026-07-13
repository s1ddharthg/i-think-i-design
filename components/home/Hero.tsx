export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="max-w-3xl text-3xl font-medium leading-snug tracking-tight text-white sm:text-5xl">
        I&apos;m sid, a UI/UX designer and graphic designer and i believe nothing is
        better than designing at 1AM with some music.
      </h1>
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px animate-pulse bg-white/40" />
      </div>
    </section>
  );
}
