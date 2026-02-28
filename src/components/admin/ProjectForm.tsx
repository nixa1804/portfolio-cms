'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project, ProjectStatus } from '@/lib/types'
import { useToast } from '@/components/ToastProvider'

interface ProjectFormProps {
  project?: Project
}

const STATUS_OPTIONS: ProjectStatus[] = ['In Development', 'Completed', 'Archived']

type FieldErrors = Record<string, string>

function validate(fields: {
  title: string
  slug: string
  description: string
  goals: string
  hasCaseStudy: boolean
  challenge: string
  solution: string
  architecture: string
  outcomes: string
}): FieldErrors {
  const errors: FieldErrors = {}

  if (!fields.title.trim()) errors.title = 'Title is required'
  if (!fields.slug.trim()) {
    errors.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(fields.slug)) {
    errors.slug = 'Only lowercase letters, numbers, and hyphens'
  }
  if (!fields.description.trim()) errors.description = 'Description is required'
  if (!fields.goals.split('\n').map((g) => g.trim()).filter(Boolean).length) {
    errors.goals = 'At least one goal is required'
  }
  if (fields.hasCaseStudy) {
    if (!fields.challenge.trim()) errors.challenge = 'Challenge is required'
    if (!fields.solution.trim()) errors.solution = 'Solution is required'
    if (!fields.architecture.split('\n').map((a) => a.trim()).filter(Boolean).length) {
      errors.architecture = 'At least one architecture point is required'
    }
    if (!fields.outcomes.split('\n').map((o) => o.trim()).filter(Boolean).length) {
      errors.outcomes = 'At least one outcome is required'
    }
  }

  return errors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-600">{message}</p>
}

function inputClass(hasError: boolean) {
  return `w-full rounded-md border px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
      : 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500'
  }`
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const { addToast } = useToast()
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

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  function getFields() {
    return { title, slug, description, goals, hasCaseStudy, challenge, solution, architecture, outcomes }
  }

  function touch(name: string) {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const errors = validate(getFields())
    setFieldErrors(errors)
  }

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Touch all fields and validate before submit
    const allTouched = Object.fromEntries(
      ['title', 'slug', 'description', 'goals', 'challenge', 'solution', 'architecture', 'outcomes'].map(
        (k) => [k, true]
      )
    )
    setTouched(allTouched)
    const errors = validate(getFields())
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

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
        addToast(data.error ?? 'Something went wrong', 'error')
        return
      }

      addToast(isEdit ? 'Project saved.' : 'Project created.', 'success')
      router.push('/admin/projects')
      router.refresh()
    } catch {
      addToast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Helper: return error only if field was touched
  const e = (name: string) => (touched[name] ? fieldErrors[name] : undefined)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(ev) => handleTitleChange(ev.target.value)}
            onBlur={() => touch('title')}
            className={inputClass(!!e('title'))}
            placeholder="Portfolio CMS"
          />
          <FieldError message={e('title')} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(ev) => setSlug(ev.target.value)}
            onBlur={() => touch('slug')}
            disabled={isEdit}
            className={`${inputClass(!!e('slug'))} disabled:bg-zinc-50 disabled:text-zinc-500`}
            placeholder="portfolio-cms"
          />
          {isEdit ? (
            <p className="mt-1 text-xs text-zinc-500">Slug cannot be changed after creation.</p>
          ) : (
            <FieldError message={e('slug')} />
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Status</label>
          <select
            value={status}
            onChange={(ev) => setStatus(ev.target.value as ProjectStatus)}
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
            onChange={(ev) => setOrderIndex(Number(ev.target.value))}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Description</label>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          onBlur={() => touch('description')}
          rows={3}
          className={inputClass(!!e('description'))}
          placeholder="Describe the project..."
        />
        <FieldError message={e('description')} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Tags <span className="text-zinc-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(ev) => setTags(ev.target.value)}
          className={inputClass(false)}
          placeholder="Next.js, TypeScript, Tailwind CSS"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Goals <span className="text-zinc-400">(one per line)</span>
        </label>
        <textarea
          value={goals}
          onChange={(ev) => setGoals(ev.target.value)}
          onBlur={() => touch('goals')}
          rows={4}
          className={inputClass(!!e('goals'))}
          placeholder="Enable content edits without full code deployments.&#10;Keep the editing workflow simple and fast."
        />
        <FieldError message={e('goals')} />
      </div>

      <div className="rounded-md border border-zinc-200 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={hasCaseStudy}
            onChange={(ev) => setHasCaseStudy(ev.target.checked)}
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
                onChange={(ev) => setChallenge(ev.target.value)}
                onBlur={() => touch('challenge')}
                rows={2}
                className={inputClass(!!e('challenge'))}
              />
              <FieldError message={e('challenge')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Solution</label>
              <textarea
                value={solution}
                onChange={(ev) => setSolution(ev.target.value)}
                onBlur={() => touch('solution')}
                rows={2}
                className={inputClass(!!e('solution'))}
              />
              <FieldError message={e('solution')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Architecture <span className="text-zinc-400">(one per line)</span>
              </label>
              <textarea
                value={architecture}
                onChange={(ev) => setArchitecture(ev.target.value)}
                onBlur={() => touch('architecture')}
                rows={4}
                className={inputClass(!!e('architecture'))}
              />
              <FieldError message={e('architecture')} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Outcomes <span className="text-zinc-400">(one per line)</span>
              </label>
              <textarea
                value={outcomes}
                onChange={(ev) => setOutcomes(ev.target.value)}
                onBlur={() => touch('outcomes')}
                rows={4}
                className={inputClass(!!e('outcomes'))}
              />
              <FieldError message={e('outcomes')} />
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
