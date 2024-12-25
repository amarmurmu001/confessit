'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, TrashIcon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import DeleteModal from './DeleteModal'
import Link from 'next/link'

interface Form {
  id: string
  title: string
  description: string | null
  share_url: string
  is_active: boolean
  created_at: string
  form_responses: { count: number }[]
}

interface AdminDashboardProps {
  forms: Form[]
}

export default function AdminDashboard({ forms }: AdminDashboardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const supabase = createClientComponentClient()

  const filteredForms = forms.filter(form => {
    switch (filter) {
      case 'active':
        return form.is_active
      case 'inactive':
        return !form.is_active
      default:
        return true
    }
  })

  const handleToggleActive = async (formId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('confession_forms')
        .update({ is_active: !currentState })
        .eq('id', formId)

      if (error) throw error

      toast.success(`Form ${currentState ? 'deactivated' : 'activated'} successfully`)
    } catch (error) {
      console.error('Error toggling form state:', error)
      toast.error('Failed to update form state')
    }
  }

  const handleDelete = (formId: string) => {
    setSelectedFormId(formId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedFormId) return

    try {
      const { error } = await supabase
        .from('confession_forms')
        .delete()
        .eq('id', selectedFormId)

      if (error) throw error

      toast.success('Form deleted successfully')
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error('Error deleting form:', error)
      toast.error('Failed to delete form')
    }
  }

  const copyShareUrl = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forms/${shareUrl}`)
      toast.success('Share URL copied to clipboard')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Failed to copy URL')
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-content'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          All Forms
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-primary text-primary-content'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'inactive'
              ? 'bg-primary text-primary-content'
              : 'bg-base-200 text-base-content hover:bg-base-300'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredForms.map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-base-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-base-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-base-content mb-2">{form.title}</h3>
              {form.description && (
                <p className="text-base-content/60 mb-4">{form.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
                <span>{form.form_responses[0]?.count || 0} responses</span>
                <span>•</span>
                <span>{new Date(form.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(form.id, form.is_active)}
                    className="p-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80"
                    title={form.is_active ? 'Deactivate form' : 'Activate form'}
                  >
                    {form.is_active ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeSlashIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => copyShareUrl(form.share_url)}
                    className="p-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80"
                    title="Copy share URL"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                  <Link
                    href={`/admin/forms/${form.id}/responses`}
                    className="p-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80"
                    title="View responses"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="p-2 rounded-lg hover:bg-base-200 transition-colors text-base-content/80"
                  title="Delete form"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base-content/60 mb-4">No confession forms found</p>
          <Link
            href="/admin/forms/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create your first form
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Form"
        message="Are you sure you want to delete this form? All responses will be permanently deleted. This action cannot be undone."
      />
    </div>
  )
}
