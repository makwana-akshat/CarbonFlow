-- Add fields for Procurement Plans (which map to co2_requests)
ALTER TABLE co2_requests 
ADD COLUMN IF NOT EXISTS secured_volume NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS contracted_corridors TEXT[] DEFAULT '{}';
