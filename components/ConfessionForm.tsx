'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ConfessionForm() {
  const [confession, setConfession] = useState('')
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('confessions')
        .insert([
          {
            confession_text: confession.trim(),
            name: isAnonymous ? null : name.trim(),
            is_anonymous: isAnonymous,
          }
        ])

      if (error) throw error

      toast.success('Confession submitted successfully!')
      setConfession('')
      setName('')
      router.refresh()
    } catch (error) {
      console.error('Error submitting confession:', error)
      toast.error('Failed to submit confession. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Your Confession</span>
          <span className="label-text-alt">{confession.length}/500</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32 resize-none"
          placeholder="Share your thoughts..."
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          required
          maxLength={500}
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span className="label-text">Submit Anonymously</span>
        </label>
      </div>

      {!isAnonymous && (
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Your Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting || !confession.trim()}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner"></span>
            Submitting...
          </>
        ) : (
          'Share Confession'
        )}
      </button>
    </form>
  )
}