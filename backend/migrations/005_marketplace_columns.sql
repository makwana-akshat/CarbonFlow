-- Add missing columns to co2_listings (Supply)
ALTER TABLE co2_listings
ADD COLUMN location text,
ADD COLUMN distance_km numeric DEFAULT 0,
ADD COLUMN source_type text,
ADD COLUMN availability_window text,
ADD COLUMN capture_capacity_tpa numeric DEFAULT 0,
ADD COLUMN storage_pressure_bar numeric DEFAULT 0,
ADD COLUMN is_verified boolean DEFAULT false;

-- Add missing columns to co2_requests (Demand)
ALTER TABLE co2_requests
ADD COLUMN is_urgent boolean DEFAULT false,
ADD COLUMN offtake_frequency text;
