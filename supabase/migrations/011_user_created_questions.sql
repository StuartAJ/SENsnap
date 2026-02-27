-- User-owned questions support
ALTER TABLE questions
ADD COLUMN created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Keep strict ordering constraints for admin-curated questions only
DROP INDEX IF EXISTS idx_questions_date_order;
CREATE UNIQUE INDEX idx_questions_date_order_admin
  ON questions(scheduled_date, display_order)
  WHERE is_active = TRUE AND created_by IS NULL;

CREATE INDEX idx_questions_created_by_active
  ON questions(created_by, scheduled_date)
  WHERE is_active = TRUE AND created_by IS NOT NULL;

-- Users can create and disable their own non-admin questions
CREATE POLICY "Users can create own questions"
  ON questions FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can disable own questions"
  ON questions FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
