'use server'

import {
  IS_DEMO,
  DEMO_QUESTIONS_TODAY,
  demoSubmitAnswer,
  demoCheckCompletion,
} from '@/lib/demo'
import { submitAnswerSchema } from '@/lib/validations/questions'
import { getToday } from '@/lib/utils'
import type { Question } from '@/types'

export async function getDailyQuestions(): Promise<{
  questions: Question[]
  error?: string
}> {
  if (IS_DEMO) {
    return { questions: DEMO_QUESTIONS_TODAY }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const today = getToday()

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('scheduled_date', today)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(3)

  if (error) {
    return { questions: [], error: 'Failed to load questions' }
  }

  return { questions: (data ?? []) as Question[] }
}

export async function checkDailyCompletion(): Promise<{
  completed: boolean
  answeredCount: number
}> {
  if (IS_DEMO) {
    return demoCheckCompletion()
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const today = getToday()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { completed: false, answeredCount: 0 }
  }

  const { data: todayQuestions } = await supabase
    .from('questions')
    .select('id')
    .eq('scheduled_date', today)
    .eq('is_active', true)

  if (!todayQuestions || todayQuestions.length === 0) {
    return { completed: false, answeredCount: 0 }
  }

  const questionIds = todayQuestions.map((q) => q.id)

  const { count } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('question_id', questionIds)

  const answeredCount = count ?? 0
  return {
    completed: answeredCount >= todayQuestions.length,
    answeredCount,
  }
}

export async function submitAnswer(formData: FormData) {
  const raw = {
    question_id: formData.get('question_id') as string,
    answer: JSON.parse(formData.get('answer') as string),
  }

  const parsed = submitAnswerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid answer submission' }
  }

  if (IS_DEMO) {
    const result = demoSubmitAnswer(parsed.data.question_id)
    return { success: result.success, completed: result.completed }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('responses').insert({
    user_id: user.id,
    question_id: parsed.data.question_id,
    answer: parsed.data.answer,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already answered this question' }
    }
    return { error: 'Failed to submit answer' }
  }

  const { completed } = await checkDailyCompletion()

  if (completed) {
    await supabase.rpc('update_user_streak', {
      p_user_id: user.id,
      p_answer_date: getToday(),
    })

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_answers_count, onboarding_status')
      .eq('id', user.id)
      .single()

    if (profile && profile.onboarding_status === 'pending') {
      const newCount = profile.onboarding_answers_count + 1
      const updates: Record<string, unknown> = {
        onboarding_answers_count: newCount,
      }

      if (newCount >= 7) {
        updates.onboarding_status = 'active'
      }

      await supabase.from('profiles').update(updates).eq('id', user.id)
    }
  }

  return { success: true, completed }
}
