import { z } from 'zod/v4'

export const magicLinkSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

export type MagicLinkInput = z.infer<typeof magicLinkSchema>
