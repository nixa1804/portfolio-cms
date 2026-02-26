import Link from 'next/link'

interface BackLinkProps {
  href: string
  label: string
}

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} className="text-sm text-blue-600 hover:underline">
      {label}
    </Link>
  )
}
