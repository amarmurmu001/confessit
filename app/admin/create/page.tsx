'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PaperAirplaneIcon, UserCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CreateConfession() {
  const [confession, setConfession] = useState('')
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const MAX_LENGTH = 500
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleConfessionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_LENGTH) {
      setConfession(text)
      setCharCount(text.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confession.trim()) {
      toast.error('Please write your confession')
      return
    }

    if (!isAnonymous && !name.trim()) {
      toast.error('Please enter your name or choose anonymous')
      return
    }

    setIsSubmitting(true)
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to create confessions')
      }

      const { data, error } = await supabase
        .from('confessions')
        .insert([
          {
            confession_text: confession.trim(),
            name: isAnonymous ? null : name.trim(),
            is_anonymous: isAnonymous,
            is_shared: false,
            admin_id: session.user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Confession created successfully')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error creating confession:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create confession')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Create Confession</h1>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors text-base-content/80"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-base-200 p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              {/* Confession Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="confession" className="block text-sm font-medium text-base-content">
                    Confession Content
                  </label>
                  <span className={`text-sm ${charCount > MAX_LENGTH * 0.9 ? 'text-primary' : 'text-base-content/60'}`}>
                    {charCount}/{MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="confession"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-base-content placeholder:text-base-content/40"
                  placeholder="Write the confession content..."
                  value={confession}
                  onChange={handleConfessionChange}
                  required
                  maxLength={MAX_LENGTH}
                />
              </div>

              {/* Identity Selection */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-3">
                  Identity Type
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAnonymous(true)
                      setName('')
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      isAnonymous 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    <EyeSlashIcon className="w-5 h-5" />
                    <span>Anonymous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      !isAnonymous 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Use Name</span>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <AnimatePresence>
                {!isAnonymous && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-base-content mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content placeholder:text-base-content/40"
                      placeholder="Enter the name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !confession.trim() || (!isAnonymous && !name.trim())}
                  className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-full text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Confession</span>
                      <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
} 