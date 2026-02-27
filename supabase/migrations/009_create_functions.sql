-- Trigger: Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function: Get today's 3 daily questions
CREATE OR REPLACE FUNCTION get_daily_questions(target_date DATE)
RETURNS SETOF questions AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM questions
  WHERE scheduled_date = target_date
    AND is_active = TRUE
  ORDER BY display_order ASC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Aggregate daily results (called by nightly cron)
CREATE OR REPLACE FUNCTION aggregate_daily_results(target_date DATE)
RETURNS VOID AS $$
DECLARE
  q RECORD;
  total_count INTEGER;
  answer_data JSONB;
  demo_data JSONB;
BEGIN
  FOR q IN
    SELECT id FROM questions
    WHERE scheduled_date = target_date AND is_active = TRUE
  LOOP
    -- Count total responses from active (non-pending) users only
    SELECT COUNT(*)
    INTO total_count
    FROM responses r
    JOIN profiles p ON p.id = r.user_id
    WHERE r.question_id = q.id
      AND p.onboarding_status = 'active';

    -- Answer breakdown
    SELECT COALESCE(jsonb_object_agg(answer_id, cnt), '{}'::jsonb)
    INTO answer_data
    FROM (
      SELECT r.answer->>'id' AS answer_id, COUNT(*) AS cnt
      FROM responses r
      JOIN profiles p ON p.id = r.user_id
      WHERE r.question_id = q.id
        AND p.onboarding_status = 'active'
      GROUP BY r.answer->>'id'
    ) sub;

    -- Demographic breakdowns
    SELECT jsonb_build_object(
      'by_role', COALESCE((
        SELECT jsonb_object_agg(role_val, role_breakdown)
        FROM (
          SELECT p.role::text AS role_val,
            jsonb_object_agg(sub.answer_id, sub.cnt) AS role_breakdown
          FROM (
            SELECT r.user_id, r.answer->>'id' AS answer_id, COUNT(*) AS cnt
            FROM responses r
            JOIN profiles p ON p.id = r.user_id
            WHERE r.question_id = q.id
              AND p.onboarding_status = 'active'
            GROUP BY r.user_id, r.answer->>'id'
          ) sub
          JOIN profiles p ON p.id = sub.user_id
          WHERE p.role IS NOT NULL
          GROUP BY p.role
        ) grouped
      ), '{}'::jsonb),
      'by_school_type', COALESCE((
        SELECT jsonb_object_agg(st_val, st_breakdown)
        FROM (
          SELECT p.school_type::text AS st_val,
            jsonb_object_agg(sub.answer_id, sub.cnt) AS st_breakdown
          FROM (
            SELECT r.user_id, r.answer->>'id' AS answer_id, COUNT(*) AS cnt
            FROM responses r
            JOIN profiles p ON p.id = r.user_id
            WHERE r.question_id = q.id
              AND p.onboarding_status = 'active'
            GROUP BY r.user_id, r.answer->>'id'
          ) sub
          JOIN profiles p ON p.id = sub.user_id
          WHERE p.school_type IS NOT NULL
          GROUP BY p.school_type
        ) grouped
      ), '{}'::jsonb),
      'by_region', COALESCE((
        SELECT jsonb_object_agg(reg_val, reg_breakdown)
        FROM (
          SELECT p.region::text AS reg_val,
            jsonb_object_agg(sub.answer_id, sub.cnt) AS reg_breakdown
          FROM (
            SELECT r.user_id, r.answer->>'id' AS answer_id, COUNT(*) AS cnt
            FROM responses r
            JOIN profiles p ON p.id = r.user_id
            WHERE r.question_id = q.id
              AND p.onboarding_status = 'active'
            GROUP BY r.user_id, r.answer->>'id'
          ) sub
          JOIN profiles p ON p.id = sub.user_id
          WHERE p.region IS NOT NULL
          GROUP BY p.region
        ) grouped
      ), '{}'::jsonb)
    )
    INTO demo_data;

    -- Upsert the aggregated result
    INSERT INTO daily_results (question_id, results_date, total_responses, answer_breakdown, demographic_breakdown)
    VALUES (q.id, target_date, total_count, answer_data, demo_data)
    ON CONFLICT (question_id, results_date)
    DO UPDATE SET
      total_responses = EXCLUDED.total_responses,
      answer_breakdown = EXCLUDED.answer_breakdown,
      demographic_breakdown = EXCLUDED.demographic_breakdown,
      created_at = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update user streak after answering all daily questions
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID, p_answer_date DATE)
RETURNS VOID AS $$
DECLARE
  current_streak INTEGER;
  longest_streak INTEGER;
  last_date DATE;
BEGIN
  SELECT streak_current, streak_longest, streak_last_answered_date
  INTO current_streak, longest_streak, last_date
  FROM profiles
  WHERE id = p_user_id;

  -- Already answered today
  IF last_date = p_answer_date THEN
    RETURN;
  END IF;

  -- Consecutive day: increment streak
  IF last_date = p_answer_date - INTERVAL '1 day' THEN
    current_streak := current_streak + 1;
  ELSE
    -- Gap in answering: reset streak
    current_streak := 1;
  END IF;

  -- Update longest if needed
  IF current_streak > longest_streak THEN
    longest_streak := current_streak;
  END IF;

  UPDATE profiles
  SET streak_current = current_streak,
      streak_longest = longest_streak,
      streak_last_answered_date = p_answer_date
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
