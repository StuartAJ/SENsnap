-- Questions table for daily polls
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'multiple_choice',
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  display_order INTEGER NOT NULL CHECK (display_order >= 1 AND display_order <= 3),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Each date should have exactly 3 questions (enforced at app level, indexed for fast lookup)
CREATE INDEX idx_questions_scheduled_date ON questions(scheduled_date);
CREATE INDEX idx_questions_active_date ON questions(scheduled_date, is_active) WHERE is_active = TRUE;
CREATE UNIQUE INDEX idx_questions_date_order ON questions(scheduled_date, display_order) WHERE is_active = TRUE;
