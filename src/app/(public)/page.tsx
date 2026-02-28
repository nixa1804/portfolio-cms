import { Suspense } from 'react'
import { getAllProjects } from '@/lib/queries'
import ProjectCard from '@/components/projects/ProjectCard'
import TagFilter from '@/components/projects/TagFilter'

export const metadata = {
  title: 'Projects | Portfolio CMS',
  description: 'Browse all portfolio projects.',
  openGraph: {
    title: 'Projects | Portfolio CMS',
    description: 'Browse all portfolio projects.',
    type: 'website',
  },
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { tag } = await searchParams
  const allProjects = await getAllProjects()

  const filtered = tag
    ? allProjects.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    : allProjects

  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Projects</h1>
      </header>

      <Suspense>
        <TagFilter tags={allTags} activeTag={tag ?? null} />
      </Suspense>

      {filtered.length === 0 ? (
        <p className="text-zinc-500">
          {tag ? `No projects tagged "${tag}".` : 'No projects yet.'}
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  )
}
