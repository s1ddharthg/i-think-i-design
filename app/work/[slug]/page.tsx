import { notFound } from 'next/navigation';
import { getProject, projects } from '@/lib/projects';
import { getGraphicProject } from '@/lib/graphicDesign';
import { getUiuxProject, uiuxProjects } from '@/lib/uiux';
import Footer from '@/components/Footer';
import Poster from '@/components/Poster';
import BackButton from '@/components/BackButton';
import CaseStudy from '@/components/graphic-design/CaseStudy';
import UiuxCaseStudy from '@/components/ui-ux/UiuxCaseStudy';

export function generateStaticParams() {
  return [...projects, ...uiuxProjects].map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const graphicProject = getGraphicProject(slug);
  if (graphicProject) {
    return (
      <>
        <CaseStudy project={graphicProject} />
        <Footer />
      </>
    );
  }

  const uiuxProject = getUiuxProject(slug);
  if (uiuxProject) {
    return (
      <>
        <UiuxCaseStudy project={uiuxProject} />
        <Footer />
      </>
    );
  }

  const project = getProject(slug);
  if (!project) notFound();

  const categoryLabel = project.category === 'ui-ux' ? 'UI/UX' : 'Graphic Design';

  return (
    <>
      <article className="min-h-screen bg-black px-6 pt-32 pb-24 text-white">
        <div className="mx-auto max-w-3xl">
          <Poster
            slug={project.slug}
            accent={project.accent}
            width={1280}
            height={720}
            className="mb-12 aspect-[16/9] w-full rounded-lg"
          />
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">{categoryLabel}</span>
          <h1 className="mt-3 text-4xl font-semibold">{project.title}</h1>
          <p className="mt-4 text-lg text-white/70">{project.blurb}</p>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Problem</h2>
              <p className="mt-3 text-white/80">{project.problem}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Approach</h2>
              <p className="mt-3 text-white/80">{project.approach}</p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">Outcome</h2>
              <p className="mt-3 text-white/80">{project.outcome}</p>
            </div>
          </div>

          <BackButton />
        </div>
      </article>
      <Footer />
    </>
  );
}
