import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import SignOutButton from '@/components/SignOutButton'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Confessit',
  description: 'Create and manage confession forms',
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

  // Fetch confession forms created by this admin
  const { data: forms, error } = await supabase
    .from('confession_forms')
    .select(`
      id,
      title,
      description,
      share_url,
      is_active,
      created_at,
      form_responses (
        count
      )
    `)
    .eq('admin_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching forms:', error)
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
                Confession Forms
              </h1>
              <p className="text-base-content/60">Create and manage confession forms</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/forms/create"
              className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/90 transition-colors"
            >
              Create Form
            </Link>
            <p className="text-sm text-base-content/80">
              Signed in as: {session.user.email}
            </p>
            <SignOutButton />
          </div>
        </div>
        <AdminDashboard forms={forms || []} />
      </main>
    </div>
  )
}