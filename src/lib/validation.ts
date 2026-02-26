import { z } from 'zod'

export const ProjectStatusSchema = z.enum(['In Development', 'Completed', 'Archived'])

export const CaseStudySchema = z.object({
  challenge: z.string().min(1, 'Challenge is required'),
  solution: z.string().min(1, 'Solution is required'),
  architecture: z.array(z.string().min(1)).min(1, 'At least one architecture point is required'),
  outcomes: z.array(z.string().min(1)).min(1, 'At least one outcome is required'),
})

const ProjectBaseSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required'),
  status: ProjectStatusSchema,
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string().min(1)).default([]),
  goals: z.array(z.string().min(1)).min(1, 'At least one goal is required'),
  hasCaseStudy: z.boolean().default(false),
  caseStudy: CaseStudySchema.optional(),
  orderIndex: z.number().int().default(0),
})

export const CreateProjectSchema = ProjectBaseSchema.refine(
  (data) => !data.hasCaseStudy || data.caseStudy !== undefined,
  { message: 'Case study data is required when hasCaseStudy is true', path: ['caseStudy'] }
)

export const UpdateProjectSchema = ProjectBaseSchema.partial().omit({ slug: true })

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
