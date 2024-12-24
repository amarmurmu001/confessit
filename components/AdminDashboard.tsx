'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleShare = async (id: string, isShared: boolean) => {
    try {
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
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) return

    try {
      const { error } = await supabase
        .from('confessions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setConfessions(confessions.filter(conf => conf.id !== id))
      toast.success('Confession deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting confession:', error)
      toast.error('Failed to delete confession')
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
      <div className="flex justify-center space-x-2 mb-6">
        {['all', 'today', 'shared', 'not_shared'].map((filterOption) => (
          <button
            key={filterOption}
            className={`btn btn-sm ${filter === filterOption ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {filteredConfessions.length === 0 ? (
        <div className="text-center py-8 text-base-content/70">
          No confessions found
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredConfessions.map(confession => (
            <div key={confession.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <p className="text-lg">{confession.confession_text}</p>
                <p className="text-sm text-base-content/70">
                  {confession.is_anonymous ? 'Anonymous' : confession.name} - {
                    new Date(confession.created_at).toLocaleString()
                  }
                </p>
                <div className="card-actions justify-end items-center mt-4">
                  <label className="label cursor-pointer space-x-2">
                    <span className="label-text">Shared</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={confession.is_shared}
                      onChange={(e) => handleShare(confession.id, e.target.checked)}
                    />
                  </label>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(confession.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}