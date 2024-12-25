import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { content, name, isAnonymous } = await request.json()

    // Validate request body
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Confession content is required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Insert confession into database
    const { data, error } = await supabase
      .from('confessions')
      .insert([
        {
          confession_text: content.trim(),
          name: isAnonymous ? null : name?.trim(),
          is_anonymous: isAnonymous,
          is_shared: false // Default to false, will be set to true after moderation
        }
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

    return NextResponse.json(
      { message: 'Confession submitted successfully', confession: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing confession:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 