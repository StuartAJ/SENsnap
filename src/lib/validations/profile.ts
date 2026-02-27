import { z } from 'zod/v4'

export const onboardingSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.enum([
    'senco',
    'sen_teacher',
    'sen_ta',
    'inclusion_lead',
    'head_of_sen',
    'other',
  ]),
  school_type: z.enum([
    'mainstream_primary',
    'mainstream_secondary',
    'special_school',
    'ap_pru',
    'independent',
    'nursery',
    'post16',
    'other',
  ]),
  region: z.enum([
    'north_east',
    'north_west',
    'yorkshire',
    'east_midlands',
    'west_midlands',
    'east_of_england',
    'london',
    'south_east',
    'south_west',
  ]),
  years_experience: z.number().int().min(0).max(50),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const profileUpdateSchema = onboardingSchema.partial()

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
