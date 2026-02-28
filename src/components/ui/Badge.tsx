import type { ProjectStatus } from '@/lib/types'

const statusStyles: Record<ProjectStatus, string> = {
  'In Development': 'bg-amber-100 text-amber-800',
  'Completed': 'bg-green-100 text-green-800',
  'Archived': 'bg-zinc-100 text-zinc-600',
}

interface BadgeProps {
  status: ProjectStatus
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 sm:text-sm ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
