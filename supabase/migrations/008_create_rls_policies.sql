-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- QUESTIONS: All authenticated users can read active questions
CREATE POLICY "Authenticated users can read active questions"
  ON questions FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Admins can manage questions
CREATE POLICY "Admins can manage questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RESPONSES: Users can insert their own responses
CREATE POLICY "Users can insert own responses"
  ON responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own responses
CREATE POLICY "Users can read own responses"
  ON responses FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all responses (for analytics)
CREATE POLICY "Admins can read all responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- DAILY_RESULTS: All authenticated users can read
CREATE POLICY "Authenticated users can read results"
  ON daily_results FOR SELECT
  USING (auth.role() = 'authenticated');

-- DAILY_TIPS: All authenticated users can read active tips
CREATE POLICY "Authenticated users can read active tips"
  ON daily_tips FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Admins can manage tips
CREATE POLICY "Admins can manage tips"
  ON daily_tips FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- PUSH_SUBSCRIPTIONS: Users can manage their own subscriptions
CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
