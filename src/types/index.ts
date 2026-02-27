export type SenRole =
  | 'senco'
  | 'sen_teacher'
  | 'sen_ta'
  | 'inclusion_lead'
  | 'head_of_sen'
  | 'other'

export type SchoolType =
  | 'mainstream_primary'
  | 'mainstream_secondary'
  | 'special_school'
  | 'ap_pru'
  | 'independent'
  | 'nursery'
  | 'post16'
  | 'other'

export type SchoolRegion =
  | 'north_east'
  | 'north_west'
  | 'yorkshire'
  | 'east_midlands'
  | 'west_midlands'
  | 'east_of_england'
  | 'london'
  | 'south_east'
  | 'south_west'

export type QuestionType = 'multiple_choice' | 'scale' | 'ranking'

export type OnboardingStatus = 'pending' | 'active' | 'suspended'

export interface QuestionOption {
  readonly id: string
  readonly label: string
}

export interface Profile {
  readonly id: string
  readonly email: string
  readonly display_name: string | null
  readonly role: SenRole | null
  readonly school_type: SchoolType | null
  readonly region: SchoolRegion | null
  readonly years_experience: number | null
  readonly onboarding_status: OnboardingStatus
  readonly onboarding_answers_count: number
  readonly streak_current: number
  readonly streak_longest: number
  readonly streak_last_answered_date: string | null
  readonly is_admin: boolean
  readonly created_at: string
  readonly updated_at: string
}

export interface Question {
  readonly id: string
  readonly content: string
  readonly question_type: QuestionType
  readonly options: readonly QuestionOption[]
  readonly category: string
  readonly scheduled_date: string
  readonly display_order: number
  readonly is_active: boolean
  readonly created_at: string
}

export interface Response {
  readonly id: string
  readonly user_id: string
  readonly question_id: string
  readonly answer: QuestionOption
  readonly answered_at: string
}

export interface DailyResult {
  readonly id: string
  readonly question_id: string
  readonly results_date: string
  readonly total_responses: number
  readonly answer_breakdown: Record<string, number>
  readonly demographic_breakdown: {
    readonly by_role: Record<string, Record<string, number>>
    readonly by_school_type: Record<string, Record<string, number>>
    readonly by_region: Record<string, Record<string, number>>
  }
  readonly created_at: string
}

export interface DailyTip {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly category: string
  readonly external_url: string | null
  readonly scheduled_date: string
  readonly is_active: boolean
  readonly created_at: string
}

export interface PushSubscriptionRecord {
  readonly id: string
  readonly user_id: string
  readonly endpoint: string
  readonly keys: {
    readonly p256dh: string
    readonly auth: string
  }
  readonly created_at: string
}

export const SEN_ROLE_LABELS: Record<SenRole, string> = {
  senco: 'SENCO',
  sen_teacher: 'SEN Teacher',
  sen_ta: 'SEN Teaching Assistant',
  inclusion_lead: 'Inclusion Lead',
  head_of_sen: 'Head of SEN',
  other: 'Other SEN Role',
}

export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  mainstream_primary: 'Mainstream Primary',
  mainstream_secondary: 'Mainstream Secondary',
  special_school: 'Special School',
  ap_pru: 'AP / PRU',
  independent: 'Independent',
  nursery: 'Nursery',
  post16: 'Post-16',
  other: 'Other',
}

export const SCHOOL_REGION_LABELS: Record<SchoolRegion, string> = {
  north_east: 'North East',
  north_west: 'North West',
  yorkshire: 'Yorkshire & The Humber',
  east_midlands: 'East Midlands',
  west_midlands: 'West Midlands',
  east_of_england: 'East of England',
  london: 'London',
  south_east: 'South East',
  south_west: 'South West',
}

export const QUESTION_CATEGORIES = [
  'ehcp',
  'provision',
  'staffing',
  'reform',
  'wellbeing',
  'behaviour',
  'parental_engagement',
  'cpd',
  'assessment',
  'transition',
] as const

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number]

export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  ehcp: 'EHCP Processes',
  provision: 'Ordinarily Available Provision',
  staffing: 'Staffing & Workload',
  reform: 'SEND Reform',
  wellbeing: 'Staff Wellbeing',
  behaviour: 'Behaviour Support',
  parental_engagement: 'Parental Engagement',
  cpd: 'CPD & Training',
  assessment: 'Assessment',
  transition: 'Transitions',
}
