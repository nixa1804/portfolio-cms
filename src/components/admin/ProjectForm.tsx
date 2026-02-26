'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project, ProjectStatus } from '@/lib/types'

interface ProjectFormProps {
  project?: Project
}

const STATUS_OPTIONS: ProjectStatus[] = ['In Development', 'Completed', 'Archived']

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const isEdit = !!project

  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'In Development')
  const [description, setDescription] = useState(project?.description ?? '')
  const [tags, setTags] = useState(project?.tags.join(', ') ?? '')
  const [goals, setGoals] = useState(project?.goals.join('\n') ?? '')
  const [hasCaseStudy, setHasCaseStudy] = useState(project?.hasCaseStudy ?? false)
  const [challenge, setChallenge] = useState(project?.caseStudy?.challenge ?? '')
  const [solution, setSolution] = useState(project?.caseStudy?.solution ?? '')
  const [architecture, setArchitecture] = useState(
    project?.caseStudy?.architecture.join('\n') ?? ''
  )
  const [outcomes, setOutcomes] = useState(project?.caseStudy?.outcomes.join('\n') ?? '')
  const [orderIndex, setOrderIndex] = useState(project?.orderIndex ?? 0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit) {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      title,
      slug,
      status,
      description,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      goals: goals.split('\n').map((g) => g.trim()).filter(Boolean),
      hasCaseStudy,
      orderIndex,
      ...(hasCaseStudy && {
        caseStudy: {
          challenge,
          solution,
          architecture: architecture.split('\n').map((a) => a.trim()).filter(Boolean),
          outcomes: outcomes.split('\n').map((o) => o.trim()).filter(Boolean),
        },
      }),
    }

    try {
      const url = isEdit ? `/api/projects/${project!.slug}` : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      router.push('/admin/projects')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Portfolio CMS"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={isEdit}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-zinc-50 disabled:text-zinc-500"
            placeholder="portfolio-cms"
          />
          {isEdit && (
            <p className="mt-1 text-xs text-zinc-500">Slug cannot be changed after creation.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Order</label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Describe the project..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Tags <span className="text-zinc-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Next.js, TypeScript, Tailwind CSS"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Goals <span className="text-zinc-400">(one per line)</span>
        </label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enable content edits without full code deployments.&#10;Keep the editing workflow simple and fast."
        />
      </div>

      <div className="rounded-md border border-zinc-200 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={hasCaseStudy}
            onChange={(e) => setHasCaseStudy(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-zinc-700">Include case study</span>
        </label>

        {hasCaseStudy && (
          <div className="mt-5 space-y-5 border-t border-zinc-100 pt-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Challenge</label>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required={hasCaseStudy}
                rows={2}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Solution</label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required={hasCaseStudy}
                rows={2}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Architecture <span className="text-zinc-400">(one per line)</span>
              </label>
              <textarea
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                required={hasCaseStudy}
                rows={4}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Outcomes <span className="text-zinc-400">(one per line)</span>
              </label>
              <textarea
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
                required={hasCaseStudy}
                rows={4}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
