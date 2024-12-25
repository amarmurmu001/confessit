import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { content, name, is_anonymous } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Confession content is required' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current admin's session
    const { data: { session } } = await supabase.auth.getSession()
    const admin_id = session?.user?.id

    const { data, error } = await supabase
      .from('confessions')
      .insert([
        {
          confession_text: content.trim(),
          name: is_anonymous ? null : name?.trim(),
          is_anonymous,
          is_shared: false,
          admin_id: admin_id || null, // Store the admin_id who created the confession
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting confession:', error)
      return NextResponse.json(
        { error: 'Failed to submit confession' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing confession:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current admin's session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get confessions created by the current admin
    const { data: confessions, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('admin_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching confessions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch confessions' },
        { status: 500 }
      )
    }

    return NextResponse.json(confessions)
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 