import { IS_DEMO, DEMO_PROFILE } from '@/lib/demo'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProfileEditForm } from '@/components/profile/profile-edit-form'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Flame, LogOut } from 'lucide-react'
import type { Profile } from '@/types'

export default async function ProfilePage() {
  let profile: Profile

  if (IS_DEMO) {
    profile = DEMO_PROFILE
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!data) redirect('/onboarding')

    profile = data as Profile
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">
                  {profile.streak_current}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">
                {profile.streak_longest}
              </span>
              <p className="text-xs text-muted-foreground">Longest streak</p>
            </div>
          </div>
          {profile.onboarding_status === 'pending' && (
            <Badge variant="secondary" className="mt-4">
              Onboarding: {profile.onboarding_answers_count}/7 days
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileEditForm profile={profile} />
        </CardContent>
      </Card>

      <form action={signOut}>
        <Button variant="outline" className="w-full gap-2">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </form>
    </div>
  )
}
