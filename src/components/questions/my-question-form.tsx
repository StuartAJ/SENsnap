'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createMyQuestion } from '@/actions/questions'
import { QUESTION_CATEGORY_LABELS, type QuestionCategory } from '@/types'
import { Plus, Trash2 } from 'lucide-react'
import { getToday } from '@/lib/utils'

export function MyQuestionForm() {
  const [options, setOptions] = useState([
    { id: 'option_1', label: '' },
    { id: 'option_2', label: '' },
  ])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function addOption() {
    if (options.length >= 6) return
    setOptions((prev) => [
      ...prev,
      { id: `option_${prev.length + 1}`, label: '' },
    ])
  }

  function removeOption(index: number) {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  function updateOptionLabel(index: number, label: string) {
    setOptions((prev) =>
      prev.map((option, optionIndex) =>
        optionIndex === index ? { ...option, label } : option
      )
    )
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    formData.set('options', JSON.stringify(options))

    const result = await createMyQuestion(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setOptions([
        { id: 'option_1', label: '' },
        { id: 'option_2', label: '' },
      ])
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a question for yourself</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Question text</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="e.g. How confident are you in your school's SEN provision?"
              required
              minLength={10}
            />
          </div>

          <input type="hidden" name="question_type" value="multiple_choice" />

          <div className="space-y-2">
            <Label>Answer options</Label>
            {options.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <Input
                  value={option.label}
                  onChange={(event) => updateOptionLabel(index, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="gap-1"
              >
                <Plus className="h-3 w-3" /> Add option
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" required>
              <option value="">Select...</option>
              {(
                Object.entries(QUESTION_CATEGORY_LABELS) as [
                  QuestionCategory,
                  string,
                ][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Ask on</Label>
            <Input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              defaultValue={getToday()}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">Question added successfully.</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
