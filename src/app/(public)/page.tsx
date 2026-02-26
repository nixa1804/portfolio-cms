import { getAllProjects } from '@/lib/queries'
import ProjectCard from '@/components/projects/ProjectCard'

export const metadata = {
  title: 'Projects | Portfolio CMS',
  description: 'Browse all portfolio projects.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">Projects</h1>
      </header>

      {projects.length === 0 ? (
        <p className="text-zinc-500">No projects yet.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  )
}
