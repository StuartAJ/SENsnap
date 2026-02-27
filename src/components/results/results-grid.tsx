import { ResultChart } from './result-chart'
import type { Question, DailyResult } from '@/types'

interface ResultsGridProps {
  readonly questions: Question[]
  readonly results: DailyResult[]
}

export function ResultsGrid({ questions, results }: ResultsGridProps) {
  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const result = results.find((r) => r.question_id === question.id)
        if (!result) return null

        return (
          <ResultChart key={question.id} question={question} result={result} />
        )
      })}
    </div>
  )
}
