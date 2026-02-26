import Link from 'next/link'
import type { Project } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Tag from '@/components/ui/Tag'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600">
          {project.title}
        </h2>
        <Badge status={project.status} />
      </div>

      <p className="mb-4 text-sm leading-relaxed text-zinc-600 line-clamp-2">
        {project.description}
      </p>

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      )}
    </Link>
  )
}
