'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function CopyShareButton({ shareUrl }: { shareUrl: string }) {
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = async () => {
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forms/${shareUrl}`)
      toast.success('Share URL copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy URL')
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isCopying}
      className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors text-base-content/80 disabled:opacity-50"
    >
      {isCopying ? 'Copying...' : 'Copy Share URL'}
    </button>
  )
} 