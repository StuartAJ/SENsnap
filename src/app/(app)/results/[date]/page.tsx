import {
  IS_DEMO,
  DEMO_QUESTIONS_YESTERDAY,
  DEMO_RESULTS_YESTERDAY,
} from '@/lib/demo'
import { formatDate } from '@/lib/utils'
import { ResultsGrid } from '@/components/results/results-grid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Question, DailyResult } from '@/types'

interface ResultsDatePageProps {
  params: Promise<{ date: string }>
}

export default async function ResultsDatePage({ params }: ResultsDatePageProps) {
  const { date } = await params
  let questions: Question[]
  let results: DailyResult[]

  if (IS_DEMO) {
    questions = DEMO_QUESTIONS_YESTERDAY
    results = DEMO_RESULTS_YESTERDAY
  } else {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      questions = []
      results = []
    } else {
      const [globalQuestionsResult, personalQuestionsResult] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .eq('scheduled_date', date)
          .eq('is_active', true)
          .is('created_by', null)
          .order('display_order', { ascending: true }),
        supabase
          .from('questions')
          .select('*')
          .eq('scheduled_date', date)
          .eq('is_active', true)
          .eq('created_by', user.id)
          .order('created_at', { ascending: true }),
      ])

      questions = [
        ...(globalQuestionsResult.data ?? []) as Question[],
        ...(personalQuestionsResult.data ?? []) as Question[],
      ].sort((a, b) => {
        const aIsGlobal = a.created_by == null
        const bIsGlobal = b.created_by == null

        if (aIsGlobal !== bIsGlobal) {
          return aIsGlobal ? -1 : 1
        }

        if (a.display_order !== b.display_order) {
          return a.display_order - b.display_order
        }

        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })

      if (questions.length === 0) {
        results = []
      } else {
        const questionIds = questions.map((question) => question.id)

        const { data: resultsData } = await supabase
          .from('daily_results')
          .select('*')
          .eq('results_date', date)
          .in('question_id', questionIds)

        results = (resultsData ?? []) as DailyResult[]
      }
    }
  }

  if (questions.length === 0 || results.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No results for this date</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No aggregated results are available for {formatDate(date)}.
          </p>
          <Link href="/results">
            <Button variant="link" className="mt-2">
              Back to latest results
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Results</h1>
          <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
        </div>
      </div>

      <ResultsGrid questions={questions} results={results} />
    </div>
  )
}
