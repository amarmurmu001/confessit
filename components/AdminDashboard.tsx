'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import DeleteModal from './DeleteModal'
import { motion } from 'framer-motion'

type Confession = {
  id: string
  confession_text: string
  name: string | null
  is_anonymous: boolean
  is_shared: boolean
  created_at: string
}

type AdminDashboardProps = {
  confessions: Confession[]
}

export default function AdminDashboard({ confessions: initialConfessions }: AdminDashboardProps) {
  const [confessions, setConfessions] = useState(initialConfessions)
  const [filter, setFilter] = useState('all')
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [confessionToDelete, setConfessionToDelete] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleShare = async (id: string, isShared: boolean) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('confessions')
        .update({ is_shared: isShared })
        .eq('id', id)

      if (error) throw error

      setConfessions(confessions.map(conf =>
        conf.id === id ? { ...conf, is_shared: isShared } : conf
      ))

      toast.success(`Confession ${isShared ? 'shared' : 'unshared'} successfully`)
      router.refresh()
    } catch (error) {
      console.error('Error updating confession:', error)
      toast.error('Failed to update confession')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setConfessionToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!confessionToDelete) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('confessions')
        .delete()
        .eq('id', confessionToDelete)

      if (error) throw error

      setConfessions(confessions.filter(conf => conf.id !== confessionToDelete))
      toast.success('Confession deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting confession:', error)
      toast.error('Failed to delete confession')
    } finally {
      setLoading(false)
      setDeleteModalOpen(false)
    }
  }

  const filteredConfessions = confessions.filter(conf => {
    if (filter === 'today') {
      return new Date(conf.created_at).toDateString() === new Date().toDateString()
    }
    if (filter === 'shared') {
      return conf.is_shared
    }
    if (filter === 'not_shared') {
      return !conf.is_shared
    }
    return true
  })

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg p-1 bg-pink-50">
          {['all', 'today', 'shared', 'not_shared'].map((filterOption) => (
            <button
              key={filterOption}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption 
                  ? 'bg-white text-pink-600 shadow-sm' 
                  : 'text-pink-600/60 hover:text-pink-600'
              }`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {filteredConfessions.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-pink-600/60">
          No confessions found
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredConfessions.map((confession, index) => (
            <motion.div
              key={confession.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-pink-100"
            >
              <div className="p-6">
                <p className="text-lg font-medium text-gray-900">{confession.confession_text}</p>
                <p className="text-sm text-pink-600/60 mt-2">
                  {confession.is_anonymous ? 'Anonymous' : confession.name} - {
                    new Date(confession.created_at).toLocaleString()
                  }
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-pink-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-pink-600/80">Shared</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={confession.is_shared}
                        onChange={(e) => handleShare(confession.id, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${
                        confession.is_shared ? 'bg-pink-500' : 'bg-pink-200'
                      }`}>
                        <div className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-transform ${
                          confession.is_shared ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </div>
                    </div>
                  </label>
                  <button
                    className="px-3 py-1 rounded-lg text-pink-600 hover:bg-pink-50 transition-colors text-sm"
                    onClick={() => handleDelete(confession.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onDelete={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  )
}
