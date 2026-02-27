import type {
  Profile,
  Question,
  DailyResult,
  DailyTip,
} from '@/types'

/**
 * Demo mode is active when no Supabase URL is configured.
 * All data comes from in-memory mock data instead of the database.
 */
export const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL

const today = new Date().toISOString().split('T')[0]
const yesterday = (() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
})()

export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

export const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  email: 'demo@sensnap.co.uk',
  display_name: 'Sarah (Demo)',
  role: 'senco',
  school_type: 'mainstream_primary',
  region: 'london',
  years_experience: 8,
  onboarding_status: 'active',
  onboarding_answers_count: 7,
  streak_current: 4,
  streak_longest: 12,
  streak_last_answered_date: yesterday,
  is_admin: true,
  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-02-16T00:00:00Z',
}

export const DEMO_QUESTIONS_TODAY: Question[] = [
  {
    id: 'q-today-1',
    content:
      'How confident are you in your school\'s ability to meet the needs of pupils with SEND without an EHCP?',
    question_type: 'multiple_choice',
    options: [
      { id: 'very_confident', label: 'Very confident' },
      { id: 'fairly_confident', label: 'Fairly confident' },
      { id: 'not_very_confident', label: 'Not very confident' },
      { id: 'not_at_all', label: 'Not at all confident' },
    ],
    category: 'provision',
    scheduled_date: today,
    display_order: 1,
    is_active: true,
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'q-today-2',
    content:
      'In the last week, approximately how many hours did you spend on EHCP-related paperwork?',
    question_type: 'multiple_choice',
    options: [
      { id: '0_2', label: '0-2 hours' },
      { id: '3_5', label: '3-5 hours' },
      { id: '6_10', label: '6-10 hours' },
      { id: '10_plus', label: 'More than 10 hours' },
    ],
    category: 'ehcp',
    scheduled_date: today,
    display_order: 2,
    is_active: true,
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'q-today-3',
    content: 'How prepared does your school feel for the upcoming SEND reforms?',
    question_type: 'multiple_choice',
    options: [
      { id: 'very_prepared', label: 'Very prepared' },
      { id: 'somewhat_prepared', label: 'Somewhat prepared' },
      { id: 'not_prepared', label: 'Not very prepared' },
      { id: 'unaware', label: 'Not sure what changes are coming' },
    ],
    category: 'reform',
    scheduled_date: today,
    display_order: 3,
    is_active: true,
    created_at: '2026-02-15T00:00:00Z',
  },
]

export const DEMO_QUESTIONS_YESTERDAY: Question[] = [
  {
    id: 'q-yest-1',
    content:
      'What is the biggest barrier to effective SEN provision in your school?',
    question_type: 'multiple_choice',
    options: [
      { id: 'funding', label: 'Lack of funding' },
      { id: 'staffing', label: 'Insufficient staff' },
      { id: 'training', label: 'Lack of training' },
      { id: 'time', label: 'Not enough time' },
    ],
    category: 'staffing',
    scheduled_date: yesterday,
    display_order: 1,
    is_active: true,
    created_at: '2026-02-14T00:00:00Z',
  },
  {
    id: 'q-yest-2',
    content:
      'How often do you feel supported by your senior leadership team in your SENCO role?',
    question_type: 'multiple_choice',
    options: [
      { id: 'always', label: 'Always' },
      { id: 'usually', label: 'Usually' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'rarely', label: 'Rarely or never' },
    ],
    category: 'wellbeing',
    scheduled_date: yesterday,
    display_order: 2,
    is_active: true,
    created_at: '2026-02-14T00:00:00Z',
  },
  {
    id: 'q-yest-3',
    content: 'How many pupils on your SEN register currently have an EHCP?',
    question_type: 'multiple_choice',
    options: [
      { id: '0_5', label: '0-5' },
      { id: '6_15', label: '6-15' },
      { id: '16_30', label: '16-30' },
      { id: '30_plus', label: 'More than 30' },
    ],
    category: 'ehcp',
    scheduled_date: yesterday,
    display_order: 3,
    is_active: true,
    created_at: '2026-02-14T00:00:00Z',
  },
]

export const DEMO_RESULTS_YESTERDAY: DailyResult[] = [
  {
    id: 'r-yest-1',
    question_id: 'q-yest-1',
    results_date: yesterday,
    total_responses: 247,
    answer_breakdown: {
      funding: 89,
      staffing: 72,
      training: 48,
      time: 38,
    },
    demographic_breakdown: {
      by_role: {},
      by_school_type: {},
      by_region: {},
    },
    created_at: yesterday,
  },
  {
    id: 'r-yest-2',
    question_id: 'q-yest-2',
    results_date: yesterday,
    total_responses: 243,
    answer_breakdown: {
      always: 31,
      usually: 78,
      sometimes: 92,
      rarely: 42,
    },
    demographic_breakdown: {
      by_role: {},
      by_school_type: {},
      by_region: {},
    },
    created_at: yesterday,
  },
  {
    id: 'r-yest-3',
    question_id: 'q-yest-3',
    results_date: yesterday,
    total_responses: 251,
    answer_breakdown: {
      '0_5': 45,
      '6_15': 98,
      '16_30': 73,
      '30_plus': 35,
    },
    demographic_breakdown: {
      by_role: {},
      by_school_type: {},
      by_region: {},
    },
    created_at: yesterday,
  },
]

export const DEMO_TIP_TODAY: DailyTip = {
  id: 'tip-today',
  title: 'Graduated Approach Refresher',
  content:
    'Remember the four-stage graduated approach cycle: Assess, Plan, Do, Review. Each cycle should involve the pupil, parents, and class teachers. Keep brief notes at each stage to build a clear picture of what works.',
  category: 'provision',
  external_url: null,
  scheduled_date: today,
  is_active: true,
  created_at: '2026-02-15T00:00:00Z',
}

/** In-memory state for demo mode answer tracking */
const demoAnsweredQuestions = new Set<string>()

export function demoSubmitAnswer(questionId: string): {
  success: boolean
  completed: boolean
} {
  demoAnsweredQuestions.add(questionId)
  const totalToday = DEMO_QUESTIONS_TODAY.length
  const answeredToday = DEMO_QUESTIONS_TODAY.filter((q) =>
    demoAnsweredQuestions.has(q.id)
  ).length
  return { success: true, completed: answeredToday >= totalToday }
}

export function demoCheckCompletion(): {
  completed: boolean
  answeredCount: number
} {
  const answeredToday = DEMO_QUESTIONS_TODAY.filter((q) =>
    demoAnsweredQuestions.has(q.id)
  ).length
  return {
    completed: answeredToday >= DEMO_QUESTIONS_TODAY.length,
    answeredCount: answeredToday,
  }
}

export function demoResetAnswers() {
  demoAnsweredQuestions.clear()
}

export const DEMO_ALL_QUESTIONS: Question[] = [
  ...DEMO_QUESTIONS_TODAY,
  ...DEMO_QUESTIONS_YESTERDAY,
]

export const DEMO_ALL_TIPS: DailyTip[] = [
  DEMO_TIP_TODAY,
  {
    id: 'tip-yest',
    title: 'EHCP Annual Review Tip',
    content:
      'Annual reviews must be completed within 12 months of the EHCP being issued or the previous review. Start planning at least 6 weeks before the deadline.',
    category: 'ehcp',
    external_url: null,
    scheduled_date: yesterday,
    is_active: true,
    created_at: '2026-02-14T00:00:00Z',
  },
]
