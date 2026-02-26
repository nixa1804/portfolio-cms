import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'Portfolio CMS',
  description:
    'Portfolio CMS enables content updates for project cards, descriptions, and highlights without editing source code directly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} bg-white font-sans text-zinc-900 antialiased`}>
        {children}
      </body>
    </html>
  )
}
