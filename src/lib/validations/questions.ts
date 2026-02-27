import { z } from 'zod/v4'

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
})

export const createQuestionSchema = z.object({
  content: z.string().min(10, 'Question must be at least 10 characters'),
  question_type: z.enum(['multiple_choice', 'scale', 'ranking']),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options required').max(6),
  category: z.string().min(1, 'Category is required'),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
  display_order: z.number().int().min(1).max(3),
})

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>

export const submitAnswerSchema = z.object({
  question_id: z.string().uuid(),
  answer: questionOptionSchema,
})

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>

export const createTipSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  external_url: z.string().url().optional().or(z.literal('')),
  scheduled_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)'),
})

export type CreateTipInput = z.infer<typeof createTipSchema>
