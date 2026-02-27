-- Daily CPD tips shown after completing questions
CREATE TABLE daily_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  external_url TEXT,
  scheduled_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_tips_date ON daily_tips(scheduled_date) WHERE is_active = TRUE;
CREATE INDEX idx_daily_tips_active ON daily_tips(scheduled_date, is_active);
