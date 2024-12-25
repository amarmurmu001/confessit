import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If accessing admin routes without auth
    if (!session && req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/auth') {
      const redirectUrl = new URL('/admin/auth', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If accessing auth page with session
    if (session && req.nextUrl.pathname === '/admin/auth') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to proceed
    return res
  }
} 