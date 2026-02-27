import { IS_DEMO, DEMO_PROFILE } from '@/lib/demo'
import { AppHeader } from '@/components/layout/app-header'
import { BottomNav } from '@/components/layout/bottom-nav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let streak = 0
  let isAdmin = false

  if (IS_DEMO) {
    streak = DEMO_PROFILE.streak_current
    isAdmin = DEMO_PROFILE.is_admin
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('streak_current, is_admin')
        .eq('id', user.id)
        .single()

      if (profile) {
        streak = profile.streak_current ?? 0
        isAdmin = profile.is_admin ?? false
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader streak={streak} isAdmin={isAdmin} />
      <main className="mx-auto max-w-lg px-4 pb-20 pt-6">{children}</main>
      <BottomNav />
    </div>
  )
}
