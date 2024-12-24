'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-base-100/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            Confessit
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#confess" className="hover:text-primary transition-colors">
              Share Confession
            </Link>
            <Link href="/admin/auth" className="btn btn-primary btn-sm">
              Admin Login
            </Link>
          </div>

          <button 
            className="md:hidden btn btn-ghost btn-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              className="w-6 h-6 stroke-current"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                className="hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="#confess" 
                className="hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Share Confession
              </Link>
              <Link 
                href="/admin/auth" 
                className="btn btn-primary btn-sm w-fit"
                onClick={() => setIsOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}