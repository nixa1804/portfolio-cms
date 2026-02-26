import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProjectBySlug } from '@/lib/queries'
import ProjectForm from '@/components/admin/ProjectForm'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  return { title: project ? `Edit ${project.title} | Admin` : 'Edit Project | Admin' }
}

export default async function EditProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to projects
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900">Edit: {project.title}</h1>
      </div>

      <div className="max-w-2xl">
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
