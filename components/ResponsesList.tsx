'use client'

import { ArrowLeftIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import CopyShareButton from '@/app/admin/forms/[formId]/responses/CopyShareButton'
import { motion, AnimatePresence } from 'framer-motion'

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

interface ResponsesListProps {
  form: Form
  responses: Response[]
}

export default function ResponsesList({ form, responses }: ResponsesListProps) {
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
              <CopyShareButton shareUrl={form.share_url} />
            </div>
          </div>

          {/* Responses */}
          <div className="space-y-6">
            <AnimatePresence>
              {responses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 bg-base-200 rounded-2xl"
                >
                  <p className="text-base-content/60 mb-2">No responses yet</p>
                  <p className="text-sm text-base-content/40">Share your form to start collecting responses</p>
                </motion.div>
              ) : (
                responses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 