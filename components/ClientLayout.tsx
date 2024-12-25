'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ThemeToggle from '@/components/ThemeToggle'
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isFormsPage = pathname?.startsWith('/forms')

  return (
    <>
      {!isFormsPage && <Navigation />}
      <Toaster position="bottom-right" />
      {children}
      {!isFormsPage && <ThemeToggle />}
    </>
  )
} 