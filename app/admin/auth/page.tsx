'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')
  const supabase = createClientComponentClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      let { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/admin/auth/callback` },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          })

      if (error) throw error

      if (isSignUp) {
        toast.success('Check your email for the confirmation link!')
      } else if (data.session) {
        // Silently redirect without toast for successful login
        router.replace(redirectedFrom || '/admin/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-lg border border-base-300 bg-base-100 p-6 shadow-lg"
      >
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-base-content">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered relative block w-full rounded-t-md border-0 py-1.5 text-base-content"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered relative block w-full rounded-b-md border-0 py-1.5 text-base-content"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${
                loading ? 'loading' : ''
              }`}
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="btn btn-link text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}