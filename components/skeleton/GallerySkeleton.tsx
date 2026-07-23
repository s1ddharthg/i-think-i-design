import Bone from './Bone';

export default function GallerySkeleton() {
  return (
    <section className="min-h-screen bg-black px-6 pt-32 pb-24 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Bone className="h-[clamp(2.5rem,6vw,4.25rem)] w-full" />
          <Bone className="mt-4 h-[clamp(2.5rem,6vw,4.25rem)] w-2/3" />
          <Bone className="mt-6 h-4 w-full" />
          <Bone className="mt-3 h-4 w-5/6" />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Bone className="aspect-[4/3] w-full" />
              <Bone className="mt-4 h-3 w-24" />
              <Bone className="mt-2 h-6 w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
