import { IS_DEMO } from '@/lib/demo'
import { NextResponse } from 'next/server'

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
    const { sendPushNotification } = await import('@/lib/push/web-push')
    const supabase = createAdminClient()

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, keys')

    if (error || !subscriptions) {
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    const expiredIds: string[] = []
    let sentCount = 0

    for (const sub of subscriptions) {
      const result = await sendPushNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        {
          title: 'SEN Snap',
          body: 'Your 3 daily questions are ready!',
          url: '/daily',
        }
      )

      if (result.success) {
        sentCount++
      } else if (result.expired) {
        expiredIds.push(sub.id)
      }
    }

    if (expiredIds.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', expiredIds)
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      expired: expiredIds.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal error', details: message },
      { status: 500 }
    )
  }
}
