-- Migration: Add latitude and longitude to marketplace tables

ALTER TABLE co2_listings 
ADD COLUMN IF NOT EXISTS latitude FLOAT NULL,
ADD COLUMN IF NOT EXISTS longitude FLOAT NULL;

ALTER TABLE co2_requests 
ADD COLUMN IF NOT EXISTS latitude FLOAT NULL,
ADD COLUMN IF NOT EXISTS longitude FLOAT NULL;

CREATE INDEX IF NOT EXISTS idx_co2_listings_lat_lng ON co2_listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_co2_requests_lat_lng ON co2_requests(latitude, longitude);
