import Bone from '@/components/skeleton/Bone';

export default function Loading() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-black px-6 pt-32 pb-24 text-white md:px-10">
      <div className="relative mx-auto w-full max-w-[1100px]">
        <Bone className="h-[clamp(2.4rem,6vw,5.5rem)] w-4/5" />
        <Bone className="mt-4 h-5 w-full max-w-lg" />

        <div className="mt-16 flex max-w-2xl flex-col gap-12 border-t border-white/10 pt-12">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bone key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <Bone className="h-12 w-full" />
            <Bone className="h-12 w-full" />
          </div>

          <Bone className="h-24 w-full" />
          <Bone className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </section>
  );
}
