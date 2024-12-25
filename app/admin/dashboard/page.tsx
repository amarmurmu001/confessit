import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import SignOutButton from '@/components/SignOutButton'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Confessit',
  description: 'Manage confessions and moderate content',
}

export default async function AdminDashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/auth')
  }

  const { data: confessions, error } = await supabase
    .from('confessions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching confessions:', error)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/icon.png"
              alt="Confessit Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-primary">
                Admin Dashboard
              </h1>
              <p className="text-base-content/60">Manage and moderate confessions</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-base-content/80">
              Signed in as: {session.user.email}
            </p>
            <SignOutButton />
          </div>
        </div>
        <AdminDashboard confessions={confessions || []} />
      </main>
    </div>
  )
}