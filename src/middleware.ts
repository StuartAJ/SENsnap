import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/verify', '/callback']

export async function middleware(request: NextRequest) {
  // Demo mode: no Supabase configured, allow all routes through
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({
            request,
          })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  // Refresh the session (important for Server Components)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    // If logged in and hitting login page, redirect to daily
    if (user && (pathname === '/login' || pathname === '/')) {
      const url = request.nextUrl.clone()
      url.pathname = '/daily'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // API routes for cron jobs use secret-based auth
  if (pathname.startsWith('/api/cron')) {
    return supabaseResponse
  }

  // Not authenticated: redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check if user has completed onboarding
  if (pathname !== '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_status')
      .eq('id', user.id)
      .single()

    // No profile or no role set: needs onboarding
    if (!profile || !profile.role) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Admin routes: check admin access
    if (pathname.startsWith('/admin')) {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!adminProfile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/daily'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
