'use server'

import { IS_DEMO, DEMO_PROFILE } from '@/lib/demo'

export async function getStreak(): Promise<{
  current: number
  longest: number
  lastAnsweredDate: string | null
}> {
  if (IS_DEMO) {
    return {
      current: DEMO_PROFILE.streak_current,
      longest: DEMO_PROFILE.streak_longest,
      lastAnsweredDate: DEMO_PROFILE.streak_last_answered_date,
    }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { current: 0, longest: 0, lastAnsweredDate: null }
  }

  const { data } = await supabase
    .from('profiles')
    .select('streak_current, streak_longest, streak_last_answered_date')
    .eq('id', user.id)
    .single()

  if (!data) {
    return { current: 0, longest: 0, lastAnsweredDate: null }
  }

  return {
    current: data.streak_current ?? 0,
    longest: data.streak_longest ?? 0,
    lastAnsweredDate: data.streak_last_answered_date ?? null,
  }
}
