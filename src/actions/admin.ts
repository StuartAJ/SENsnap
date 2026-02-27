'use server'

import {
  IS_DEMO,
  DEMO_ALL_QUESTIONS,
  DEMO_ALL_TIPS,
} from '@/lib/demo'
import { createQuestionSchema, createTipSchema } from '@/lib/validations/questions'
import { revalidatePath } from 'next/cache'

export async function createQuestion(formData: FormData) {
  const optionsRaw = formData.get('options') as string
  const raw = {
    content: formData.get('content') as string,
    question_type: formData.get('question_type') as string,
    options: JSON.parse(optionsRaw),
    category: formData.get('category') as string,
    scheduled_date: formData.get('scheduled_date') as string,
    display_order: Number(formData.get('display_order')),
  }

  const parsed = createQuestionSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid question data. Please check all fields.' }
  }

  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.from('questions').insert({
    content: parsed.data.content,
    question_type: parsed.data.question_type,
    options: parsed.data.options,
    category: parsed.data.category,
    scheduled_date: parsed.data.scheduled_date,
    display_order: parsed.data.display_order,
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'A question already exists for this date and position.' }
    }
    return { error: 'Failed to create question.' }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function deleteQuestion(questionId: string) {
  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase
    .from('questions')
    .update({ is_active: false })
    .eq('id', questionId)

  if (error) {
    return { error: 'Failed to delete question.' }
  }

  revalidatePath('/admin/questions')
  return { success: true }
}

export async function createTip(formData: FormData) {
  const raw = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    category: formData.get('category') as string,
    external_url: (formData.get('external_url') as string) || '',
    scheduled_date: formData.get('scheduled_date') as string,
  }

  const parsed = createTipSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid tip data. Please check all fields.' }
  }

  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.from('daily_tips').insert({
    title: parsed.data.title,
    content: parsed.data.content,
    category: parsed.data.category,
    external_url: parsed.data.external_url || null,
    scheduled_date: parsed.data.scheduled_date,
  })

  if (error) {
    return { error: 'Failed to create tip.' }
  }

  revalidatePath('/admin/tips')
  return { success: true }
}

export async function deleteTip(tipId: string) {
  if (IS_DEMO) {
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase
    .from('daily_tips')
    .update({ is_active: false })
    .eq('id', tipId)

  if (error) {
    return { error: 'Failed to delete tip.' }
  }

  revalidatePath('/admin/tips')
  return { success: true }
}

export async function getAdminStats() {
  if (IS_DEMO) {
    return { totalUsers: 247, responsesToday: 183 }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const [usersResult, responsesTodayResult] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .gte('answered_at', new Date().toISOString().split('T')[0]),
  ])

  return {
    totalUsers: usersResult.count ?? 0,
    responsesToday: responsesTodayResult.count ?? 0,
  }
}

export async function getAdminQuestions() {
  if (IS_DEMO) {
    return DEMO_ALL_QUESTIONS
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data } = await supabase
    .from('questions')
    .is('created_by', null)
    .select('*')
    .eq('is_active', true)
    .order('scheduled_date', { ascending: false })
    .limit(50)

  return data ?? []
}

export async function getAdminTips() {
  if (IS_DEMO) {
    return DEMO_ALL_TIPS
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data } = await supabase
    .from('daily_tips')
    .select('*')
    .eq('is_active', true)
    .order('scheduled_date', { ascending: false })
    .limit(50)

  return data ?? []
}
