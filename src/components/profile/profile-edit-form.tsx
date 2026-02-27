'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { saveProfile } from '@/actions/onboarding'
import {
  SEN_ROLE_LABELS,
  SCHOOL_TYPE_LABELS,
  SCHOOL_REGION_LABELS,
  type Profile,
  type SenRole,
  type SchoolType,
  type SchoolRegion,
} from '@/types'

interface ProfileEditFormProps {
  readonly profile: Profile
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await saveProfile(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name">Name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile.display_name ?? ''}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">SEN Role</Label>
        <Select id="role" name="role" defaultValue={profile.role ?? ''} required>
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
        <Select
          id="school_type"
          name="school_type"
          defaultValue={profile.school_type ?? ''}
          required
        >
          <option value="">Select school type...</option>
          {(Object.entries(SCHOOL_TYPE_LABELS) as [SchoolType, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select
          id="region"
          name="region"
          defaultValue={profile.region ?? ''}
          required
        >
          <option value="">Select your region...</option>
          {(Object.entries(SCHOOL_REGION_LABELS) as [SchoolRegion, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
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
          defaultValue={profile.years_experience ?? ''}
          required
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Profile updated successfully.</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Update profile'}
      </Button>
    </form>
  )
}
