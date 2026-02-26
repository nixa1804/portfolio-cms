import { db } from './db'
import type { Project, ProjectRow } from './types'
import type { CreateProjectInput, UpdateProjectInput } from './validation'

function rowToProject(row: ProjectRow): Project {
  const project: Project = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status as Project['status'],
    description: row.description,
    tags: JSON.parse(row.tags),
    goals: JSON.parse(row.goals),
    hasCaseStudy: row.has_case_study === 1,
    orderIndex: row.order_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }

  if (row.has_case_study === 1) {
    project.caseStudy = {
      challenge: row.case_study_challenge ?? '',
      solution: row.case_study_solution ?? '',
      architecture: JSON.parse(row.case_study_architecture ?? '[]'),
      outcomes: JSON.parse(row.case_study_outcomes ?? '[]'),
    }
  }

  return project
}

export async function getAllProjects(): Promise<Project[]> {
  const result = await db.execute(
    'SELECT * FROM projects ORDER BY order_index ASC, created_at ASC'
  )
  return result.rows.map((row) => rowToProject(row as unknown as ProjectRow))
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM projects WHERE slug = ?',
    args: [slug],
  })
  if (result.rows.length === 0) return null
  return rowToProject(result.rows[0] as unknown as ProjectRow)
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await db.execute({
    sql: `INSERT INTO projects (
      id, slug, title, status, description, tags, goals,
      has_case_study, case_study_challenge, case_study_solution,
      case_study_architecture, case_study_outcomes,
      order_index, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.slug,
      data.title,
      data.status,
      data.description,
      JSON.stringify(data.tags),
      JSON.stringify(data.goals),
      data.hasCaseStudy ? 1 : 0,
      data.caseStudy?.challenge ?? null,
      data.caseStudy?.solution ?? null,
      JSON.stringify(data.caseStudy?.architecture ?? []),
      JSON.stringify(data.caseStudy?.outcomes ?? []),
      data.orderIndex,
      now,
      now,
    ],
  })

  return (await getProjectBySlug(data.slug))!
}

export async function updateProject(
  slug: string,
  data: UpdateProjectInput
): Promise<Project | null> {
  const existing = await getProjectBySlug(slug)
  if (!existing) return null

  const now = new Date().toISOString()
  const merged = { ...existing, ...data }

  await db.execute({
    sql: `UPDATE projects SET
      title = ?, status = ?, description = ?, tags = ?, goals = ?,
      has_case_study = ?, case_study_challenge = ?, case_study_solution = ?,
      case_study_architecture = ?, case_study_outcomes = ?,
      order_index = ?, updated_at = ?
      WHERE slug = ?`,
    args: [
      merged.title,
      merged.status,
      merged.description,
      JSON.stringify(merged.tags),
      JSON.stringify(merged.goals),
      merged.hasCaseStudy ? 1 : 0,
      merged.caseStudy?.challenge ?? null,
      merged.caseStudy?.solution ?? null,
      JSON.stringify(merged.caseStudy?.architecture ?? []),
      JSON.stringify(merged.caseStudy?.outcomes ?? []),
      merged.orderIndex,
      now,
      slug,
    ],
  })

  return getProjectBySlug(slug)
}

export async function deleteProject(slug: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'DELETE FROM projects WHERE slug = ?',
    args: [slug],
  })
  return (result.rowsAffected ?? 0) > 0
}

export async function getProjectCount(): Promise<number> {
  const result = await db.execute('SELECT COUNT(*) as count FROM projects')
  const row = result.rows[0] as unknown as { count: number }
  return row.count
}

export async function slugExists(slug: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'SELECT id FROM projects WHERE slug = ?',
    args: [slug],
  })
  return result.rows.length > 0
}
