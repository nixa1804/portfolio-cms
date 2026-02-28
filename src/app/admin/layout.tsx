import { auth } from '@/lib/auth'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import ToastProvider from '@/components/ToastProvider'

export const metadata = {
  title: 'Admin | Portfolio CMS',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {session && (
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/admin" className="shrink-0 text-sm font-semibold text-zinc-900">
                Portfolio CMS
              </Link>
              <nav className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/admin/projects"
                  className="text-xs text-zinc-600 hover:text-zinc-900 sm:text-sm"
                >
                  Projects
                </Link>
                <Link href="/" target="_blank" className="text-xs text-zinc-600 hover:text-zinc-900 sm:text-sm">
                  View site ↗
                </Link>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="max-w-[52px] truncate text-xs text-zinc-500 sm:max-w-[120px]">{session.user?.name}</span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <button
                  type="submit"
                  className="cursor-pointer whitespace-nowrap rounded-md border border-zinc-200 px-2 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 sm:px-2.5"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      <ToastProvider>
        <main className={session ? 'mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10' : 'flex flex-1 flex-col'}>{children}</main>
      </ToastProvider>
    </div>
  )
}
