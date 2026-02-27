'use server'

import { IS_DEMO, DEMO_TIP_TODAY } from '@/lib/demo'
import { getToday } from '@/lib/utils'
import type { DailyTip } from '@/types'

export async function getDailyTip(): Promise<{
  tip: DailyTip | null
  error?: string
}> {
  if (IS_DEMO) {
    return { tip: DEMO_TIP_TODAY }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const today = getToday()

  const { data, error } = await supabase
    .from('daily_tips')
    .select('*')
    .eq('scheduled_date', today)
    .eq('is_active', true)
    .single()

  if (error) {
    return { tip: null }
  }

  return { tip: data as DailyTip }
}
