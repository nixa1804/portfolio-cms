import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: 'Portfolio CMS',
  description:
    'Portfolio CMS enables content updates for project cards, descriptions, and highlights without editing source code directly.',
  openGraph: {
    title: 'Portfolio CMS',
    description:
      'Portfolio CMS enables content updates for project cards, descriptions, and highlights without editing source code directly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} bg-white font-sans text-zinc-900 antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
