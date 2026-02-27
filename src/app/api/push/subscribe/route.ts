import { IS_DEMO } from '@/lib/demo'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (IS_DEMO) {
    return NextResponse.json({ success: true, demo: true })
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscription } = await request.json()

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      {
        onConflict: 'endpoint',
      }
    )

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal error', details: message },
      { status: 500 }
    )
  }
}
