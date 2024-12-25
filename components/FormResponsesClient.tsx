'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface FormResponse {
  id: string
  confession_text: string
  name: string | null
  is_anonymous: boolean
  created_at: string
}

interface Form {
  id: string
  title: string
  description: string | null
  share_url: string
  is_active: boolean
}

export default function FormResponsesClient({ formId }: { formId: string }) {
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/admin/auth')
          return
        }

        // Fetch form details
        const { data: form, error: formError } = await supabase
          .from('confession_forms')
          .select('*')
          .eq('id', formId)
          .eq('admin_id', session.user.id)
          .single()

        if (formError) throw formError

        // Fetch responses
        const { data: responses, error: responsesError } = await supabase
          .from('form_responses')
          .select('*')
          .eq('form_id', formId)
          .order('created_at', { ascending: false })

        if (responsesError) throw responsesError

        setForm(form)
        setResponses(responses)
      } catch (error) {
        console.error('Error fetching form and responses:', error)
        toast.error('Failed to load responses')
        router.push('/admin/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormAndResponses()
  }, [formId, router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-base-content mb-4">Form Not Found</h1>
          <p className="text-base-content/60">This form may have been deleted or you don't have access to it.</p>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 text-base-content/60 mb-2">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                <span>•</span>
                <span>{responses.length} responses</span>
              </div>
              <h1 className="text-4xl font-bold text-primary mb-2">{form.title}</h1>
              {form.description && (
                <p className="text-base-content/60 text-lg">{form.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/forms/${form.share_url}`)
                  toast.success('Share URL copied to clipboard')
                }}
                className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors text-base-content/80"
              >
                Copy Share URL
              </button>
            </div>
          </div>

          {/* Responses */}
          <div className="space-y-6">
            {responses.length === 0 ? (
              <div className="text-center py-12 bg-base-200 rounded-2xl">
                <p className="text-base-content/60 mb-2">No responses yet</p>
                <p className="text-sm text-base-content/40">Share your form to start collecting responses</p>
              </div>
            ) : (
              responses.map((response, index) => (
                <motion.div
                  key={response.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-base-200 p-6 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <pre className="whitespace-pre-wrap font-sans text-base-content">
                        {response.confession_text}
                      </pre>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-base-content/60">
                        {response.is_anonymous ? (
                          <div className="flex items-center gap-1">
                            <EyeSlashIcon className="w-4 h-4" />
                            <span className="text-sm">Anonymous</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <UserCircleIcon className="w-4 h-4" />
                            <span className="text-sm">{response.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-base-content/40">
                        {new Date(response.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 