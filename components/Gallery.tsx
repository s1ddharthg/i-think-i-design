import Link from 'next/link';
import { Category, getByCategory } from '@/lib/projects';

export default function Gallery({ category }: { category: Category }) {
  const items = getByCategory(category);
  const title = category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';

  return (
    <section className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
      <h1 className="mb-16 text-4xl font-semibold">{title}</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.slug}`}
            className="group flex aspect-[4/3] flex-col justify-end rounded-lg p-6 transition-transform hover:-translate-y-1"
            style={{ backgroundColor: project.accent }}
          >
            <h2 className="text-lg font-semibold text-white">{project.title}</h2>
            <p className="mt-1 text-sm text-white/80">{project.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
