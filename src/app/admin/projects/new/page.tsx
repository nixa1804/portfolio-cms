import Link from 'next/link'
import ProjectForm from '@/components/admin/ProjectForm'

export const metadata = {
  title: 'New Project | Admin',
}

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/projects" className="text-sm text-blue-600 hover:underline">
          ← Back to projects
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-zinc-900">New project</h1>
      </div>

      <div className="max-w-2xl">
        <ProjectForm />
      </div>
    </div>
  )
}
