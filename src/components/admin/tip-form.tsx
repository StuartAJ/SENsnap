'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createTip } from '@/actions/admin'
import { QUESTION_CATEGORY_LABELS, type QuestionCategory } from '@/types'

export function TipForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await createTip(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Daily Tip</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. EHCP Annual Review Tip"
              required
              minLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write the tip content here..."
              required
              minLength={20}
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="scheduled_date">Scheduled date</Label>
              <Input
                id="scheduled_date"
                name="scheduled_date"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_url">External URL (optional)</Label>
            <Input
              id="external_url"
              name="external_url"
              type="url"
              placeholder="https://..."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">Tip created successfully.</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create tip'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
