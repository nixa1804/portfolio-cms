import Card from '@/components/ui/Card'
import type { CaseStudy } from '@/lib/types'

interface CaseStudyContentProps {
  caseStudy: CaseStudy
}

export default function CaseStudyContent({ caseStudy }: CaseStudyContentProps) {
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold text-zinc-900">Challenge</h3>
          <p className="text-sm leading-relaxed text-zinc-700">{caseStudy.challenge}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-zinc-900">Solution</h3>
          <p className="text-sm leading-relaxed text-zinc-700">{caseStudy.solution}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-zinc-900">Architecture</h3>
          <ul className="space-y-2">
            {caseStudy.architecture.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-zinc-900">Outcomes</h3>
          <ul className="space-y-2">
            {caseStudy.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
