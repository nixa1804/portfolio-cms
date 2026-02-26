import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const projects = [
  {
    id: crypto.randomUUID(),
    slug: 'portfolio-cms',
    title: 'Portfolio CMS',
    status: 'In Development',
    description:
      'Portfolio CMS enables content updates for project cards, descriptions, and highlights without editing source code directly. It is designed to keep publishing simple while preserving performance and SEO standards.',
    tags: JSON.stringify(['Next.js', 'App Router', 'REST API']),
    goals: JSON.stringify([
      'Enable content edits without full code deployments.',
      'Keep the editing workflow simple and fast.',
      'Maintain SEO and performance quality while updating content.',
    ]),
    has_case_study: 1,
    case_study_challenge:
      'Portfolio updates are often blocked by code-only workflows, which slows content changes and increases deploy overhead.',
    case_study_solution:
      'I designed a lightweight CMS flow that allows structured content edits while preserving validation, SEO metadata, and fast rendering.',
    case_study_architecture: JSON.stringify([
      'Next.js App Router pages for public content rendering.',
      'REST API endpoints for controlled content updates.',
      'Structured content schema for projects, highlights, and links.',
      'Caching strategy to keep read performance high after updates.',
    ]),
    case_study_outcomes: JSON.stringify([
      'Faster content publishing without touching page code.',
      'Consistent project presentation and metadata quality.',
      'Lower friction for maintaining portfolio freshness.',
    ]),
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    slug: 'personal-portfolio',
    title: 'Personal Portfolio',
    status: 'Completed',
    description:
      'A personal portfolio website built with Next.js and Tailwind CSS, showcasing projects and professional experience. Designed for performance, accessibility, and clean presentation.',
    tags: JSON.stringify(['Next.js', 'Tailwind CSS', 'TypeScript']),
    goals: JSON.stringify([
      'Present work clearly to potential employers and clients.',
      'Achieve strong Lighthouse scores across all metrics.',
      'Keep the design minimal and focused on content.',
    ]),
    has_case_study: 0,
    case_study_challenge: null,
    case_study_solution: null,
    case_study_architecture: '[]',
    case_study_outcomes: '[]',
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

async function seed() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not set in .env.local')
  }

  const db = createClient({ url, authToken })

  console.log('Seeding database...')

  for (const project of projects) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO projects (
        id, slug, title, status, description, tags, goals,
        has_case_study, case_study_challenge, case_study_solution,
        case_study_architecture, case_study_outcomes,
        order_index, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        project.id,
        project.slug,
        project.title,
        project.status,
        project.description,
        project.tags,
        project.goals,
        project.has_case_study,
        project.case_study_challenge,
        project.case_study_solution,
        project.case_study_architecture,
        project.case_study_outcomes,
        project.order_index,
        project.created_at,
        project.updated_at,
      ],
    })
    console.log(`  ✓ Inserted: ${project.title}`)
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
