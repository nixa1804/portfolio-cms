import Link from 'next/link'
import { getAllProjects } from '@/lib/queries'
import ProjectsTable from '@/components/admin/ProjectsTable'

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          + New project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  )
}
