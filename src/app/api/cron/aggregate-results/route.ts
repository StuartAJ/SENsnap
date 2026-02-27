import { IS_DEMO } from '@/lib/demo'
import { NextResponse } from 'next/server'
import { getYesterday } from '@/lib/utils'

export async function GET(request: Request) {
  if (IS_DEMO) {
    return NextResponse.json({ success: true, demo: true })
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()
    const yesterday = getYesterday()

    const { error } = await supabase.rpc('aggregate_daily_results', {
      target_date: yesterday,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Aggregation failed', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      date: yesterday,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal error', details: message },
      { status: 500 }
    )
  }
}
