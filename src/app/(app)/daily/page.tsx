import { getDailyQuestions, checkDailyCompletion } from '@/actions/questions'
import { getDailyTip } from '@/actions/tips'
import { getStreak } from '@/actions/streak'
import { QuestionSet } from '@/components/daily/question-set'
import { CompletionScreen } from '@/components/daily/completion-screen'
import { IS_DEMO, DEMO_PROFILE } from '@/lib/demo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function DailyPage() {
  let onboardingStatus = 'active'
  let onboardingAnswersCount = 7

  if (IS_DEMO) {
    onboardingStatus = DEMO_PROFILE.onboarding_status
    onboardingAnswersCount = DEMO_PROFILE.onboarding_answers_count
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profileData } = await supabase
      .from('profiles')
      .select('onboarding_status, onboarding_answers_count')
      .eq('id', user.id)
      .single()

    if (profileData) {
      onboardingStatus = profileData.onboarding_status
      onboardingAnswersCount = profileData.onboarding_answers_count
    }
  }

  const [{ questions, error }, { completed }, { tip }, streakData] =
    await Promise.all([
      getDailyQuestions(),
      checkDailyCompletion(),
      getDailyTip(),
      getStreak(),
    ])

  if (error || questions.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No questions today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Check back later — new questions are published daily.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (completed) {
    return <CompletionScreen tip={tip} streak={streakData.current} />
  }

  return (
    <div className="space-y-4">
      {onboardingStatus === 'pending' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          <Badge variant="secondary" className="mb-1">
            Onboarding
          </Badge>
          <p>
            You&apos;re in your onboarding week. Your responses will be included
            in results after{' '}
            {Math.max(0, 7 - onboardingAnswersCount)} more days of answering.
          </p>
        </div>
      )}

      <QuestionSet
        questions={questions}
        tip={tip}
        streakCurrent={streakData.current}
      />
    </div>
  )
}
