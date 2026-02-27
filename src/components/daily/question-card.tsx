'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Question, QuestionOption } from '@/types'

interface QuestionCardProps {
  readonly question: Question
  readonly onAnswer: (questionId: string, answer: QuestionOption) => void
  readonly disabled?: boolean
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  function handleSelect(option: QuestionOption) {
    if (disabled) return
    setSelectedOption(option.id)
    onAnswer(question.id, option)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium leading-relaxed">
          {question.content}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {question.options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? 'default' : 'outline'}
            className={cn(
              'w-full justify-start text-left h-auto py-3 px-4',
              selectedOption === option.id && 'ring-2 ring-primary'
            )}
            onClick={() => handleSelect(option)}
            disabled={disabled}
          >
            {option.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
