'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Project } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { useToast } from '@/components/ToastProvider'

interface ProjectsTableProps {
  projects: Project[]
}

interface PendingDelete {
  slug: string
  title: string
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${pendingDelete.slug}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        addToast(data.error ?? 'Failed to delete project', 'error')
        return
      }
      addToast(`"${pendingDelete.title}" deleted.`, 'success')
      router.refresh()
    } finally {
      setDeleting(false)
      setPendingDelete(null)
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
    <>
      {pendingDelete && (
        <ConfirmModal
          title="Delete project?"
          message={`"${pendingDelete.title}" will be permanently deleted. This cannot be undone.`}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <div className="rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
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
                      className="inline-flex items-center gap-1.5 rounded border border-zinc-200 px-2 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 sm:px-2.5 sm:py-1"
                      title="Edit"
                    >
                      <svg className="h-3.5 w-3.5 sm:hidden" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z" />
                      </svg>
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => setPendingDelete({ slug: project.slug, title: project.title })}
                      className="inline-flex items-center gap-1.5 rounded border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 sm:px-2.5 sm:py-1"
                      title="Delete"
                    >
                      <svg className="h-3.5 w-3.5 sm:hidden" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4.5 4.5l.75 8h5.5l.75-8" />
                      </svg>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
