import { createClient } from '@libsql/client'

function createDbClient() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set')
  }

  return createClient({ url, authToken })
}

const globalForDb = globalThis as unknown as { db: ReturnType<typeof createClient> | undefined }

export const db = globalForDb.db ?? createDbClient()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
