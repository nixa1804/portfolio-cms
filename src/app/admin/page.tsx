import Link from 'next/link'
import { getAllProjects } from '@/lib/queries'

export default async function AdminDashboard() {
  const projects = await getAllProjects()
  const completed = projects.filter((p) => p.status === 'Completed').length
  const inDevelopment = projects.filter((p) => p.status === 'In Development').length
  const withCaseStudy = projects.filter((p) => p.hasCaseStudy).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your portfolio content.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: 'Total projects', value: projects.length },
          { label: 'Completed', value: completed },
          { label: 'In development', value: inDevelopment },
          { label: 'With case study', value: withCaseStudy },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/projects"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Manage projects
        </Link>
        <Link
          href="/admin/projects/new"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          + New project
        </Link>
      </div>
    </div>
  )
}
