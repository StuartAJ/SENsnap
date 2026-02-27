-- Responses table (immutable — no updates allowed)
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer JSONB NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Each user can only answer each question once
CREATE UNIQUE INDEX idx_responses_user_question ON responses(user_id, question_id);

-- Fast lookups for aggregation
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_responses_answered_at ON responses(answered_at);
