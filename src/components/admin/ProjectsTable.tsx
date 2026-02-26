'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Project } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface ProjectsTableProps {
  projects: Project[]
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return

    setDeletingSlug(slug)
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Failed to delete project')
        return
      }
      router.refresh()
    } finally {
      setDeletingSlug(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
        <p className="text-sm text-zinc-500">No projects yet.</p>
        <Link
          href="/admin/projects/new"
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          Create your first project →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-zinc-600 sm:px-4">Project</th>
            <th className="px-3 py-3 text-left font-medium text-zinc-600 sm:px-4">Status</th>
            <th className="hidden px-3 py-3 text-left font-medium text-zinc-600 sm:table-cell sm:px-4">Case study</th>
            <th className="px-3 py-3 text-right font-medium text-zinc-600 sm:px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-zinc-50">
              <td className="px-3 py-3 sm:px-4">
                <div>
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="font-medium text-zinc-900 hover:text-blue-600"
                  >
                    {project.title}
                  </Link>
                  <p className="text-xs text-zinc-400">/{project.slug}</p>
                </div>
              </td>
              <td className="px-3 py-3 sm:px-4">
                <Badge status={project.status} />
              </td>
              <td className="hidden px-3 py-3 sm:table-cell sm:px-4">
                <span className={`text-xs ${project.hasCaseStudy ? 'text-green-600' : 'text-zinc-400'}`}>
                  {project.hasCaseStudy ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-3 py-3 text-right sm:px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project.slug}/edit`}
                    className="rounded border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(project.slug, project.title)}
                    disabled={deletingSlug === project.slug}
                    className="rounded border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingSlug === project.slug ? '...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
