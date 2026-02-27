'use server'

import {
  IS_DEMO,
  DEMO_QUESTIONS_TODAY,
  demoSubmitAnswer,
  demoCheckCompletion,
} from '@/lib/demo'
import {
  submitAnswerSchema,
  createOwnQuestionSchema,
} from '@/lib/validations/questions'
import { getToday } from '@/lib/utils'
import type { Question } from '@/types'
import { revalidatePath } from 'next/cache'

async function getQuestionsForDate(
  supabase: any,
  userId: string,
  targetDate: string
): Promise<Question[]> {
  const [globalResult, customResult] = await Promise.all([
    supabase
      .from('questions')
      .select('*')
      .eq('scheduled_date', targetDate)
      .eq('is_active', true)
      .is('created_by', null)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('questions')
      .select('*')
      .eq('scheduled_date', targetDate)
      .eq('is_active', true)
      .eq('created_by', userId)
      .order('created_at', { ascending: true }),
  ])

  const globalQuestions = (globalResult.data ?? []) as Question[]
  const customQuestions = (customResult.data ?? []) as Question[]

  return [...globalQuestions, ...customQuestions].sort((a, b) => {
    const aIsGlobal = a.created_by == null
    const bIsGlobal = b.created_by == null

    if (aIsGlobal !== bIsGlobal) {
      return aIsGlobal ? -1 : 1
    }

    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order
    }

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { questions: [], error: 'Not authenticated' }
  }

  const questions = await getQuestionsForDate(supabase, user.id, today)

  return { questions }
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

  const todayQuestions = await getQuestionsForDate(supabase, user.id, today)

  if (!todayQuestions.length) {
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

export async function createMyQuestion(formData: FormData) {
  const optionsRaw = formData.get('options') as string
  const raw = {
    content: formData.get('content') as string,
    question_type: formData.get('question_type') as string,
    options: JSON.parse(optionsRaw),
    category: formData.get('category') as string,
    scheduled_date: formData.get('scheduled_date') as string,
  }

  const parsed = createOwnQuestionSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid question data. Please check all fields.' }
  }

  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('questions').insert({
    content: parsed.data.content,
    question_type: parsed.data.question_type,
    options: parsed.data.options,
    category: parsed.data.category,
    scheduled_date: parsed.data.scheduled_date,
    display_order: 1,
    created_by: user.id,
  })

  if (error) {
    return { error: 'Failed to create question.' }
  }

  revalidatePath('/daily')
  revalidatePath('/questions')

  return { success: true }
}

export async function getMyQuestions(): Promise<Question[]> {
  if (IS_DEMO) {
    return []
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data } = await supabase
    .from('questions')
    .select('*')
    .eq('created_by', user.id)
    .eq('is_active', true)
    .order('scheduled_date', { ascending: false })

  return (data ?? []) as Question[]
}

export async function deleteMyQuestion(questionId: string) {
  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('questions')
    .update({ is_active: false })
    .eq('id', questionId)
    .eq('created_by', user.id)

  if (error) {
    return { error: 'Failed to delete question.' }
  }

  revalidatePath('/daily')
  revalidatePath('/questions')

  return { success: true }
}
