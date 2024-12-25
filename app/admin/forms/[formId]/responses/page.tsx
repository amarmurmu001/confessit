'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import ResponsesList from '@/components/ResponsesList'
import toast from 'react-hot-toast'

interface Response {
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

export default function FormResponsesPage({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    let isSubscribed = true

    const fetchData = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/admin/auth')
          return
        }

        // Fetch form details with admin check
        const { data: formData, error: formError } = await supabase
          .from('confession_forms')
          .select('*')
          .eq('id', params.formId)
          .eq('admin_id', session.user.id)
          .single()

        if (formError || !formData) {
          throw new Error('Form not found or you do not have permission to view it')
        }

        // Fetch responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('form_responses')
          .select('*')
          .eq('form_id', params.formId)
          .order('created_at', { ascending: false })

        if (responsesError) {
          throw new Error('Failed to load responses')
        }

        if (isSubscribed) {
          setForm(formData as Form)
          setResponses(responsesData as Response[] || [])
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error(error instanceof Error ? error.message : 'An error occurred')
        router.push('/admin/dashboard')
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isSubscribed = false
    }
  }, [params.formId, router, supabase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-100">
      <ResponsesList form={form} responses={responses} />
    </div>
  )
} 