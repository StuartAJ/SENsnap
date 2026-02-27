-- Seed data: Example questions for the first 3 days
-- Day 1
INSERT INTO questions (content, question_type, options, category, scheduled_date, display_order) VALUES
(
  'How confident are you in your school''s ability to meet the needs of pupils with SEND without an EHCP?',
  'multiple_choice',
  '[{"id": "very_confident", "label": "Very confident"}, {"id": "fairly_confident", "label": "Fairly confident"}, {"id": "not_very_confident", "label": "Not very confident"}, {"id": "not_at_all", "label": "Not at all confident"}]'::jsonb,
  'provision',
  CURRENT_DATE,
  1
),
(
  'In the last week, approximately how many hours did you spend on EHCP-related paperwork?',
  'multiple_choice',
  '[{"id": "0_2", "label": "0-2 hours"}, {"id": "3_5", "label": "3-5 hours"}, {"id": "6_10", "label": "6-10 hours"}, {"id": "10_plus", "label": "More than 10 hours"}]'::jsonb,
  'ehcp',
  CURRENT_DATE,
  2
),
(
  'How prepared does your school feel for the upcoming SEND reforms?',
  'multiple_choice',
  '[{"id": "very_prepared", "label": "Very prepared"}, {"id": "somewhat_prepared", "label": "Somewhat prepared"}, {"id": "not_prepared", "label": "Not very prepared"}, {"id": "unaware", "label": "Not sure what changes are coming"}]'::jsonb,
  'reform',
  CURRENT_DATE,
  3
);

-- Day 2
INSERT INTO questions (content, question_type, options, category, scheduled_date, display_order) VALUES
(
  'What is the biggest barrier to effective SEN provision in your school?',
  'multiple_choice',
  '[{"id": "funding", "label": "Lack of funding"}, {"id": "staffing", "label": "Insufficient staff"}, {"id": "training", "label": "Lack of training"}, {"id": "time", "label": "Not enough time"}]'::jsonb,
  'staffing',
  CURRENT_DATE + INTERVAL '1 day',
  1
),
(
  'How often do you feel supported by your senior leadership team in your SENCO role?',
  'multiple_choice',
  '[{"id": "always", "label": "Always"}, {"id": "usually", "label": "Usually"}, {"id": "sometimes", "label": "Sometimes"}, {"id": "rarely", "label": "Rarely or never"}]'::jsonb,
  'wellbeing',
  CURRENT_DATE + INTERVAL '1 day',
  2
),
(
  'How many pupils on your SEN register currently have an EHCP?',
  'multiple_choice',
  '[{"id": "0_5", "label": "0-5"}, {"id": "6_15", "label": "6-15"}, {"id": "16_30", "label": "16-30"}, {"id": "30_plus", "label": "More than 30"}]'::jsonb,
  'ehcp',
  CURRENT_DATE + INTERVAL '1 day',
  3
);

-- Day 3
INSERT INTO questions (content, question_type, options, category, scheduled_date, display_order) VALUES
(
  'Have you received any formal training on the proposed SEND reforms?',
  'multiple_choice',
  '[{"id": "yes_detailed", "label": "Yes, detailed training"}, {"id": "yes_brief", "label": "Yes, a brief overview"}, {"id": "self_directed", "label": "No, but I''ve researched independently"}, {"id": "no", "label": "No, not yet"}]'::jsonb,
  'reform',
  CURRENT_DATE + INTERVAL '2 days',
  1
),
(
  'How would you rate parental engagement with SEN processes at your school?',
  'multiple_choice',
  '[{"id": "excellent", "label": "Excellent"}, {"id": "good", "label": "Good"}, {"id": "adequate", "label": "Adequate"}, {"id": "poor", "label": "Poor"}]'::jsonb,
  'parental_engagement',
  CURRENT_DATE + INTERVAL '2 days',
  2
),
(
  'On a typical day, what percentage of your time is spent on direct work with pupils versus admin?',
  'multiple_choice',
  '[{"id": "mostly_pupils", "label": "Mostly pupils (>70%)"}, {"id": "balanced", "label": "Roughly balanced"}, {"id": "mostly_admin", "label": "Mostly admin (>70%)"}, {"id": "all_admin", "label": "Almost entirely admin"}]'::jsonb,
  'staffing',
  CURRENT_DATE + INTERVAL '2 days',
  3
);

-- Seed data: Example daily tips
INSERT INTO daily_tips (title, content, category, scheduled_date) VALUES
(
  'Graduated Approach Refresher',
  'Remember the four-stage graduated approach cycle: **Assess, Plan, Do, Review**. Each cycle should involve the pupil, parents, and class teachers. Keep brief notes at each stage to build a clear picture of what works.',
  'provision',
  CURRENT_DATE
),
(
  'EHCP Annual Review Tip',
  'Annual reviews must be completed within 12 months of the EHCP being issued or the previous review. Start planning at least 6 weeks before the deadline to ensure all reports are gathered and parents are informed.',
  'ehcp',
  CURRENT_DATE + INTERVAL '1 day'
),
(
  'Quick Wins for Parental Engagement',
  'A short, jargon-free summary email after each review meeting can significantly improve parental understanding and trust. Consider using a simple template with three sections: What we discussed, What we agreed, What happens next.',
  'parental_engagement',
  CURRENT_DATE + INTERVAL '2 days'
);
