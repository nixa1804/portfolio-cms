import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllProjects, getProjectBySlug } from '@/lib/queries'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'
import BackLink from '@/components/ui/BackLink'
import ProjectGoals from '@/components/projects/ProjectGoals'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} | Portfolio CMS`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Project details
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">{project.title}</h1>
          <Badge status={project.status} />
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-700">
          {project.description}
        </p>
      </header>

      {project.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="mb-8">
        <ProjectGoals goals={project.goals} />
      </div>

      <div className="mb-10 flex gap-3">
        {project.hasCaseStudy && (
          <Link
            href={`/projects/${project.slug}/case-study`}
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            Case study
          </Link>
        )}
      </div>

      <BackLink href="/" label="Back to all projects" />
    </main>
  )
}
