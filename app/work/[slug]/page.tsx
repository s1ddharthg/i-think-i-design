import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProject, projects } from '@/lib/projects';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const categoryLabel = project.category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';
  const categoryHref = project.category === 'ui-ux' ? '/ui-ux' : '/graphic-design';

  return (
    <>
      <article className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-3xl">
          <div
            className="mb-12 aspect-[16/9] w-full rounded-lg"
            style={{ backgroundColor: project.accent }}
          />
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">{categoryLabel}</span>
          <h1 className="mt-3 text-4xl font-semibold">{project.title}</h1>
          <p className="mt-4 text-lg text-white/70">{project.blurb}</p>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Problem</h2>
              <p className="mt-3 text-white/80">{project.problem}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Approach</h2>
              <p className="mt-3 text-white/80">{project.approach}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/40">Outcome</h2>
              <p className="mt-3 text-white/80">{project.outcome}</p>
            </div>
          </div>

          <Link href={categoryHref} className="mt-20 inline-block text-sm text-white/60 hover:text-white">
            ← Back to {categoryLabel}
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
