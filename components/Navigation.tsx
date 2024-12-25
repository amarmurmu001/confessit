'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname } from 'next/navigation'
import SignOutButton from './SignOutButton'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    } catch (error) {
      console.error('Error checking admin status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-base-100 border-b border-base-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Confessit Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-primary text-lg font-medium">Confessit</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-base-content/60 hover:text-base-content transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-base-content/60 hover:text-base-content transition-colors">
              How It Works
            </Link>
            <Link href="#confess" className="text-base-content/60 hover:text-base-content transition-colors">
              Share Confession
            </Link>
          </div>

          {/* Admin Section */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && (isAdmin ? (
              <>
                <Link 
                  href="/admin/dashboard"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link 
                href="/admin/auth"
                className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/90 transition-colors"
              >
                Admin Login
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              id="mobile-button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-base-content/60 hover:text-base-content"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-base-100 border-t border-base-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              href="#features"
              className="block px-3 py-2 text-base-content/60 hover:text-base-content transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works"
              className="block px-3 py-2 text-base-content/60 hover:text-base-content transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="#confess"
              className="block px-3 py-2 text-base-content/60 hover:text-base-content transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Share Confession
            </Link>
            {!isLoading && (isAdmin ? (
              <div className="space-y-1 pt-2 border-t border-base-200">
                <Link 
                  href="/admin/dashboard"
                  className="block px-3 py-2 text-primary hover:text-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-base-200">
                <Link 
                  href="/admin/auth"
                  className="block px-3 py-2 text-primary hover:text-primary/90 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}