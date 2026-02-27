'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { saveProfile } from '@/actions/onboarding'
import {
  SEN_ROLE_LABELS,
  SCHOOL_TYPE_LABELS,
  SCHOOL_REGION_LABELS,
  type SenRole,
  type SchoolType,
  type SchoolRegion,
} from '@/types'

export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await saveProfile(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Welcome to SEN Snap</CardTitle>
        <CardDescription>
          Tell us a bit about yourself so we can show you relevant insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Your name</Label>
            <Input
              id="display_name"
              name="display_name"
              placeholder="e.g. Sarah"
              required
              minLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Your SEN role</Label>
            <Select id="role" name="role" required>
              <option value="">Select your role...</option>
              {(Object.entries(SEN_ROLE_LABELS) as [SenRole, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_type">School type</Label>
            <Select id="school_type" name="school_type" required>
              <option value="">Select school type...</option>
              {(
                Object.entries(SCHOOL_TYPE_LABELS) as [SchoolType, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select id="region" name="region" required>
              <option value="">Select your region...</option>
              {(
                Object.entries(SCHOOL_REGION_LABELS) as [SchoolRegion, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_experience">Years of SEN experience</Label>
            <Input
              id="years_experience"
              name="years_experience"
              type="number"
              min={0}
              max={50}
              placeholder="e.g. 5"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Get started'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
