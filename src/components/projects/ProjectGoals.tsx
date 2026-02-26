import Card from '@/components/ui/Card'

interface ProjectGoalsProps {
  goals: string[]
}

export default function ProjectGoals({ goals }: ProjectGoalsProps) {
  return (
    <Card>
      <h3 className="mb-4 font-semibold text-zinc-900">Project goals</h3>
      <ul className="space-y-2">
        {goals.map((goal, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            {goal}
          </li>
        ))}
      </ul>
    </Card>
  )
}
