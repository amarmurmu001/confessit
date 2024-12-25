'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { PaperAirplaneIcon, UserCircleIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function ConfessionForm() {
  const [confession, setConfession] = useState('')
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const MAX_LENGTH = 500 // Reasonable length for a confession

  const handleConfessionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= MAX_LENGTH) {
      setConfession(text)
      setCharCount(text.length)
    }
  }

  const resetForm = () => {
    setConfession('')
    setName('')
    setCharCount(0)
    setIsAnonymous(true)
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
      const response = await fetch('/api/confessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: confession.trim(),
          name: isAnonymous ? null : name.trim(),
          is_anonymous: isAnonymous
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit confession')
      }

      toast.success('Your confession has been submitted and will be shared after review.')
      resetForm()
    } catch (error) {
      console.error('Error submitting confession:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit confession')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
              Your Confession
            </label>
            <span className={`text-sm ${charCount > MAX_LENGTH * 0.9 ? 'text-primary' : 'text-base-content/60'}`}>
              {charCount}/{MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="confession"
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-base-content placeholder:text-base-content/40"
            placeholder="Share your thoughts..."
            value={confession}
            onChange={handleConfessionChange}
            required
            maxLength={MAX_LENGTH}
          />
          <p className="mt-1 text-sm text-base-content/60">
            Your confession will be reviewed before being shared publicly.
          </p>
        </div>

        {/* Identity Selection */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-3">
            How would you like to share?
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

        {/* Name Input (shown only when not anonymous) */}
        <AnimatePresence>
          {!isAnonymous && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-base-content mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base-content placeholder:text-base-content/40"
                placeholder="Enter your name"
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
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Share {isAnonymous ? 'Anonymously' : 'with Name'}</span>
                <PaperAirplaneIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-base-content/60 text-center">
          By submitting, you agree to our community guidelines and terms of service.
        </p>
      </div>
    </motion.form>
  )
}