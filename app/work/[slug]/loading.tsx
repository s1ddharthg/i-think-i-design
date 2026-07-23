import Bone from '@/components/skeleton/Bone';

export default function Loading() {
  return (
    <article className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
      <div className="mx-auto max-w-3xl">
        <Bone className="mb-12 aspect-[16/9] w-full" />
        <Bone className="h-3 w-24" />
        <Bone className="mt-3 h-10 w-3/4" />
        <Bone className="mt-4 h-5 w-full" />
        <Bone className="mt-2 h-5 w-2/3" />

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Bone className="h-3 w-20" />
              <Bone className="mt-3 h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
