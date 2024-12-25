'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      router.refresh()
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors text-base-content/80 hover:text-base-content disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </>
      )}
    </button>
  )
}