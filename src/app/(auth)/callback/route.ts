import { IS_DEMO } from '@/lib/demo'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  if (IS_DEMO) {
    return NextResponse.redirect(`${origin}/daily`)
  }

  const code = searchParams.get('code')

  if (code) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}/daily`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
