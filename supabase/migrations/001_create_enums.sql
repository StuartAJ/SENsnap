-- SEN Snap: Custom enum types
CREATE TYPE sen_role AS ENUM (
  'senco',
  'sen_teacher',
  'sen_ta',
  'inclusion_lead',
  'head_of_sen',
  'other'
);

CREATE TYPE school_type AS ENUM (
  'mainstream_primary',
  'mainstream_secondary',
  'special_school',
  'ap_pru',
  'independent',
  'nursery',
  'post16',
  'other'
);

CREATE TYPE school_region AS ENUM (
  'north_east',
  'north_west',
  'yorkshire',
  'east_midlands',
  'west_midlands',
  'east_of_england',
  'london',
  'south_east',
  'south_west'
);

CREATE TYPE question_type AS ENUM (
  'multiple_choice',
  'scale',
  'ranking'
);

CREATE TYPE onboarding_status AS ENUM (
  'pending',
  'active',
  'suspended'
);
