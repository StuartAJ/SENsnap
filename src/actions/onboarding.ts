'use server'

import { redirect } from 'next/navigation'
import { IS_DEMO } from '@/lib/demo'
import { onboardingSchema } from '@/lib/validations/profile'

export async function saveProfile(formData: FormData) {
  const raw = {
    display_name: formData.get('display_name') as string,
    role: formData.get('role') as string,
    school_type: formData.get('school_type') as string,
    region: formData.get('region') as string,
    years_experience: Number(formData.get('years_experience')),
  }

  const parsed = onboardingSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Please fill in all fields correctly.' }
  }

  if (IS_DEMO) {
    redirect('/daily')
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.display_name,
      role: parsed.data.role,
      school_type: parsed.data.school_type,
      region: parsed.data.region,
      years_experience: parsed.data.years_experience,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'Failed to save profile. Please try again.' }
  }

  redirect('/daily')
}
