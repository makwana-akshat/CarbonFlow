ALTER TABLE co2_requests 
ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES co2_listings(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_co2_requests_listing ON co2_requests(listing_id);
