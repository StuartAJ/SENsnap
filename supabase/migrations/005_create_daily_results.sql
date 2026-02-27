-- Pre-aggregated daily results for fast dashboard reads
CREATE TABLE daily_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  results_date DATE NOT NULL,
  total_responses INTEGER NOT NULL DEFAULT 0,
  answer_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  demographic_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_results_question_date ON daily_results(question_id, results_date);
CREATE INDEX idx_daily_results_date ON daily_results(results_date);
