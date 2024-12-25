'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CreateForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    setIsSubmitting(true)
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to create forms')
      }

      // Generate a unique URL-friendly identifier
      const shareUrl = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

      const { data, error } = await supabase
        .from('confession_forms')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            admin_id: session.user.id,
            share_url: shareUrl,
            is_active: true,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Form created successfully')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error creating form:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Create Form</h1>
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
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-base-content mb-2">
                  Form Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content placeholder:text-base-content/40"
                  placeholder="Enter form title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-base-content mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-base-content placeholder:text-base-content/40"
                  placeholder="Enter form description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-6 py-3 bg-primary text-primary-content rounded-full text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:hover:bg-primary"
                >
                  {isSubmitting ? 'Creating...' : 'Create Form'}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
} 