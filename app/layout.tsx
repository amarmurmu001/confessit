import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle'
import Navigation from '@/components/Navigation'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Confessit - Share Your Story Anonymously',
  description: 'A safe space to share your thoughts, feelings, and experiences without judgment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-base-100 text-base-content`}>
        <Providers>
          <Navigation />
          {children}
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  )
}
