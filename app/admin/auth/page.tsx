'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AuthError } from '@supabase/supabase-js'


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminLoggedIn = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/admin/dashboard') // Redirect to admin dashboard or another page
      }
    }

    checkAdminLoggedIn()
  }, [router, supabase])


const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    if (!isLogin && password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    let error: AuthError | null = null;

    if (isLogin) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      error = loginError;
    } else {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
        },
      })
      error = signupError;
    }

    if (error) throw error

    toast.success(isLogin ? 'Logged in successfully' : 'Check your email to confirm your account')
    router.push('/admin/dashboard')
  } catch (error) {
    if (error instanceof AuthError) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }
  } finally {
    setIsLoading(false)
  }
}

  

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="max-w-4xl w-full p-4 flex flex-col lg:flex-row gap-8 items-center">
        {/* Info Section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl font-bold mb-4">
            {isLogin ? 'Welcome Back' : 'Join Confessit'}
          </h1>
          <p className="text-lg text-base-content/70">
            {isLogin
              ? 'Access the admin dashboard to manage confessions and moderate content.'
              : 'Create an admin account to start managing confessions and moderating content.'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="card flex-1 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleAuth} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    {isLogin ? 'Logging in...' : 'Signing up...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}