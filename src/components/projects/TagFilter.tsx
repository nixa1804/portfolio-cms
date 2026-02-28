'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface TagFilterProps {
  tags: string[]
  activeTag: string | null
}

export default function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function selectTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    router.push(`/?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => selectTag(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          !activeTag
            ? 'bg-blue-600 text-white'
            : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => selectTag(tag)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeTag === tag
              ? 'bg-blue-600 text-white'
              : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
