-- Profiles table extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role sen_role,
  school_type school_type,
  region school_region,
  years_experience INTEGER CHECK (years_experience >= 0 AND years_experience <= 50),
  onboarding_status onboarding_status NOT NULL DEFAULT 'pending',
  onboarding_answers_count INTEGER NOT NULL DEFAULT 0,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_longest INTEGER NOT NULL DEFAULT 0,
  streak_last_answered_date DATE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Index for admin lookups
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;
CREATE INDEX idx_profiles_onboarding_status ON profiles(onboarding_status);
