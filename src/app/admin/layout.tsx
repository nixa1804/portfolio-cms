import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth'

export const metadata = {
  title: 'Admin | Portfolio CMS',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin" className="text-sm font-semibold text-zinc-900">
              Portfolio CMS
            </Link>
            <nav className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/admin/projects"
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                Projects
              </Link>
              <Link href="/" target="_blank" className="text-sm text-zinc-600 hover:text-zinc-900">
                View site ↗
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-500 sm:inline">{session.user?.name}</span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
