-- Drop existing status check on co2_listings to support frontend UI statuses (paused, sold_out, etc.)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'co2_listings_status_check'
  ) THEN
    ALTER TABLE co2_listings DROP CONSTRAINT co2_listings_status_check;
  END IF;
END
$$;

-- Add notes column
ALTER TABLE co2_listings
ADD COLUMN IF NOT EXISTS notes TEXT;
