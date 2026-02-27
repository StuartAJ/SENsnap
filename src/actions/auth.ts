'use server'

import { redirect } from 'next/navigation'
import { IS_DEMO } from '@/lib/demo'
import { magicLinkSchema } from '@/lib/validations/auth'

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string

  const parsed = magicLinkSchema.safeParse({ email })
  if (!parsed.success) {
    return { error: 'Please enter a valid email address' }
  }

  if (IS_DEMO) {
    redirect('/daily')
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/callback`,
    },
  })

  if (error) {
    return { error: 'Failed to send magic link. Please try again.' }
  }

  redirect('/verify')
}

export async function signOut() {
  if (IS_DEMO) {
    redirect('/login')
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
