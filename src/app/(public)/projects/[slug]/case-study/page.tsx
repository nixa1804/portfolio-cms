import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug } from '@/lib/queries'
import BackLink from '@/components/ui/BackLink'
import ProjectGoals from '@/components/projects/ProjectGoals'
import CaseStudyContent from '@/components/projects/CaseStudyContent'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.filter((p) => p.hasCaseStudy).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Case Study | Portfolio CMS`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study | Portfolio CMS`,
      description: project.description,
      url: `/projects/${project.slug}/case-study`,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.hasCaseStudy || !project.caseStudy) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Case study
        </p>
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 sm:text-4xl">{project.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700">
          {project.description}
        </p>
      </header>

      <div className="mb-6">
        <ProjectGoals goals={project.goals} />
      </div>

      <div className="mb-10">
        <CaseStudyContent caseStudy={project.caseStudy} />
      </div>

      <BackLink href={`/projects/${project.slug}`} label={`Back to ${project.title}`} />
    </main>
  )
}
