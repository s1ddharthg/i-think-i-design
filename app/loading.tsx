import Bone from '@/components/skeleton/Bone';

export default function Loading() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex w-full max-w-5xl flex-col items-center">
        <Bone className="h-[clamp(2.6rem,7.5vw,6rem)] w-4/5" />
        <Bone className="mt-4 h-[clamp(2.6rem,7.5vw,6rem)] w-3/5" />
        <Bone className="mt-8 h-5 w-full max-w-xl" />
        <Bone className="mt-3 h-5 w-2/3 max-w-xl" />
      </div>
    </section>
  );
}
