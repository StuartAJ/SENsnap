import { IS_DEMO, DEMO_ALL_QUESTIONS } from '@/lib/demo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminAnalyticsPage() {
  let totalRegistered = 0
  let activeUsers = 0
  let totalQuestions = 0

  if (IS_DEMO) {
    totalRegistered = 247
    activeUsers = 198
    totalQuestions = DEMO_ALL_QUESTIONS.length
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const [usersResult, activeResult, questionsResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('onboarding_status', 'active'),
      supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
    ])

    totalRegistered = usersResult.count ?? 0
    activeUsers = activeResult.count ?? 0
    totalQuestions = questionsResult.count ?? 0
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Completed onboarding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
