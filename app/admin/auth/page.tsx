'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminAuth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Get the redirectedFrom parameter or default to dashboard
      const redirectTo = searchParams.get('redirectedFrom') || '/admin/dashboard'
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      console.error('Auth error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Image
            src="/icon.png"
            alt="Confessit Logo"
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-xl"
          />
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-base-content/60">Sign in to manage confessions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-base-content mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-base-content mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-base-200 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-content rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}