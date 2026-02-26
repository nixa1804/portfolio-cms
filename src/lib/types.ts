export type ProjectStatus = 'In Development' | 'Completed' | 'Archived'

export interface CaseStudy {
  challenge: string
  solution: string
  architecture: string[]
  outcomes: string[]
}

export interface Project {
  id: string
  slug: string
  title: string
  status: ProjectStatus
  description: string
  tags: string[]
  goals: string[]
  hasCaseStudy: boolean
  caseStudy?: CaseStudy
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface ProjectRow {
  id: string
  slug: string
  title: string
  status: string
  description: string
  tags: string
  goals: string
  has_case_study: number
  case_study_challenge: string | null
  case_study_solution: string | null
  case_study_architecture: string | null
  case_study_outcomes: string | null
  order_index: number
  created_at: string
  updated_at: string
}
