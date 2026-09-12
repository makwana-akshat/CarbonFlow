ALTER TABLE co2_requests
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS min_purity_required NUMERIC,
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS application VARCHAR(255),
ADD COLUMN IF NOT EXISTS required_by_date DATE,
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(100);

-- Try to drop the standard named constraint, if it exists, to allow new statuses.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'co2_requests_status_check'
  ) THEN
    ALTER TABLE co2_requests DROP CONSTRAINT co2_requests_status_check;
  END IF;
END
$$;
