import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllProjects, createProject, slugExists } from '@/lib/queries'
import { CreateProjectSchema } from '@/lib/validation'

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json({ data: projects })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = CreateProjectSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const exists = await slugExists(parsed.data.slug)
    if (exists) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 409 }
      )
    }

    const project = await createProject(parsed.data)
    return NextResponse.json({ data: project }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
