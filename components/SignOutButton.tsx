'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Signed out successfully')
      router.push('/admin/auth')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button 
      onClick={handleSignOut} 
      className="btn btn-outline"
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Signing out...
        </>
      ) : (
        'Sign Out'
      )}
    </button>
  )
}