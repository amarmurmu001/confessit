'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface FormResponse {
  id: string
  created_at: string
  confession_text: string
  name: string | null
  is_anonymous: boolean
}

interface ConfessionForm {
  id: string
  title: string
  description: string
  share_url: string
  admin_id: string
}

export default function FormResponses() {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [form, setForm] = useState<ConfessionForm | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/admin/auth')
          return
        }

        // Fetch form details
        const { data: formData, error: formError } = await supabase
          .from('confession_forms')
          .select('*')
          .eq('id', params.formId)
          .single()

        if (formError) throw formError
        if (!formData) {
          toast.error('Form not found')
          router.replace('/admin/dashboard')
          return
        }

        // Check if user owns this form
        if (formData.admin_id !== session.user.id) {
          toast.error('You do not have permission to view this form')
          router.replace('/admin/dashboard')
          return
        }

        setForm(formData)

        // Fetch responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('form_responses')
          .select('*')
          .eq('form_id', params.formId)
          .order('created_at', { ascending: false })

        if (responsesError) throw responsesError
        setResponses(responsesData)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFormAndResponses()
  }, [params.formId, router, supabase])

  const copyShareUrl = async () => {
    if (!form) return
    const shareUrl = `${window.location.origin}/forms/${form.share_url}`
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Share URL copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">{form.title}</h1>
            <p className="mt-1 text-base-content/60">{form.description}</p>
          </div>
          <button
            onClick={copyShareUrl}
            className="btn btn-primary"
          >
            Copy Share URL
          </button>
        </div>

        <div className="divider"></div>

        {responses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-base-content/60">
              No responses yet
            </h3>
            <p className="mt-2 text-base-content/40">
              Share your form to start collecting responses
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card bg-base-200 shadow-lg"
              >
                <div className="card-body">
                  <p className="text-base-content whitespace-pre-wrap">
                    {response.confession_text}
                  </p>
                  <div className="card-actions justify-between items-center mt-4">
                    <div className="text-sm text-base-content/60">
                      {response.is_anonymous
                        ? 'Anonymous'
                        : `From: ${response.name}`}
                    </div>
                    <div className="text-sm text-base-content/60">
                      {new Date(response.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 