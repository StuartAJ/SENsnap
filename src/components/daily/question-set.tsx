'use client'

import { useState, useCallback } from 'react'
import { QuestionCard } from './question-card'
import { CompletionScreen } from './completion-screen'
import { Progress } from '@/components/ui/progress'
import { submitAnswer } from '@/actions/questions'
import type { Question, QuestionOption, DailyTip } from '@/types'

interface QuestionSetProps {
  readonly questions: Question[]
  readonly tip: DailyTip | null
  readonly streakCurrent: number
}

export function QuestionSet({ questions, tip, streakCurrent }: QuestionSetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answering, setAnswering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newStreak, setNewStreak] = useState(streakCurrent)

  const handleAnswer = useCallback(
    async (questionId: string, answer: QuestionOption) => {
      setAnswering(true)
      setError(null)

      const formData = new FormData()
      formData.set('question_id', questionId)
      formData.set('answer', JSON.stringify(answer))

      const result = await submitAnswer(formData)

      if (result.error) {
        setError(result.error)
        setAnswering(false)
        return
      }

      if (result.completed) {
        setNewStreak(streakCurrent + 1)
        setCompleted(true)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }

      setAnswering(false)
    },
    [streakCurrent]
  )

  if (completed) {
    return <CompletionScreen tip={tip} streak={newStreak} />
  }

  const currentQuestion = questions[currentIndex]
  if (!currentQuestion) {
    return <CompletionScreen tip={tip} streak={newStreak} />
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={currentIndex + 1} max={questions.length} />
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        disabled={answering}
      />
    </div>
  )
}
