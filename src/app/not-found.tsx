import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-600">404</p>
      <h1 className="mb-3 text-3xl font-bold text-zinc-900 sm:text-4xl">Page not found</h1>
      <p className="mb-8 max-w-sm text-sm text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Back to projects
      </Link>
    </main>
  )
}
