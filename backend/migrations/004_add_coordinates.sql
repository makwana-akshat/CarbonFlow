-- 004_add_coordinates.sql
-- Adds location data to the existing marketplace tables

-- Add coordinate and location columns to co2_listings
ALTER TABLE co2_listings 
ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_name TEXT;

-- Add coordinate and location columns to co2_requests
ALTER TABLE co2_requests 
ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_name TEXT;

-- Seed existing listings with approximate coordinates based on facility_name (Mock values)
UPDATE co2_listings 
SET 
    latitude = CASE 
        WHEN facility_name ILIKE '%Ahmedabad%' THEN 23.0225
        WHEN facility_name ILIKE '%Surat%' THEN 21.1702
        WHEN facility_name ILIKE '%Jamnagar%' THEN 22.4707
        WHEN facility_name ILIKE '%Hazira%' THEN 21.1100
        WHEN facility_name ILIKE '%Vadodara%' THEN 22.3072
        WHEN facility_name ILIKE '%Mundra%' THEN 22.8400
        WHEN facility_name ILIKE '%Mumbai%' THEN 19.0760
        WHEN facility_name ILIKE '%Pune%' THEN 18.5204
        WHEN facility_name ILIKE '%Chennai%' THEN 13.0827
        ELSE 23.0000 + random()
    END,
    longitude = CASE 
        WHEN facility_name ILIKE '%Ahmedabad%' THEN 72.5714
        WHEN facility_name ILIKE '%Surat%' THEN 72.8311
        WHEN facility_name ILIKE '%Jamnagar%' THEN 70.0700
        WHEN facility_name ILIKE '%Hazira%' THEN 72.6500
        WHEN facility_name ILIKE '%Vadodara%' THEN 73.1812
        WHEN facility_name ILIKE '%Mundra%' THEN 69.7200
        WHEN facility_name ILIKE '%Mumbai%' THEN 72.8777
        WHEN facility_name ILIKE '%Pune%' THEN 73.8567
        WHEN facility_name ILIKE '%Chennai%' THEN 80.2707
        ELSE 72.0000 + random()
    END,
    location_name = CASE 
        WHEN facility_name ILIKE '%Ahmedabad%' THEN 'Ahmedabad, Gujarat'
        WHEN facility_name ILIKE '%Surat%' THEN 'Surat, Gujarat'
        WHEN facility_name ILIKE '%Jamnagar%' THEN 'Jamnagar, Gujarat'
        WHEN facility_name ILIKE '%Hazira%' THEN 'Hazira, Gujarat'
        WHEN facility_name ILIKE '%Vadodara%' THEN 'Vadodara, Gujarat'
        WHEN facility_name ILIKE '%Mundra%' THEN 'Mundra, Gujarat'
        WHEN facility_name ILIKE '%Mumbai%' THEN 'Mumbai, Maharashtra'
        WHEN facility_name ILIKE '%Pune%' THEN 'Pune, Maharashtra'
        WHEN facility_name ILIKE '%Chennai%' THEN 'Chennai, Tamil Nadu'
        ELSE 'Industrial Zone'
    END;

-- Seed existing requests with random but realistic coordinates to match the mock regions
UPDATE co2_requests 
SET 
    latitude = CASE 
        WHEN id::text < '33333333' THEN 23.0700 -- Ahmedabad area
        WHEN id::text >= '33333333' AND id::text < '66666666' THEN 21.2100 -- Surat area
        WHEN id::text >= '66666666' AND id::text < '99999999' THEN 22.4400 -- Jamnagar area
        ELSE 19.0400 -- Mumbai area
    END,
    longitude = CASE 
        WHEN id::text < '33333333' THEN 72.6100
        WHEN id::text >= '33333333' AND id::text < '66666666' THEN 72.8700
        WHEN id::text >= '66666666' AND id::text < '99999999' THEN 70.0400
        ELSE 72.8400
    END,
    location_name = CASE 
        WHEN id::text < '33333333' THEN 'Ahmedabad, Gujarat'
        WHEN id::text >= '33333333' AND id::text < '66666666' THEN 'Surat, Gujarat'
        WHEN id::text >= '66666666' AND id::text < '99999999' THEN 'Jamnagar, Gujarat'
        ELSE 'Mumbai, Maharashtra'
    END;
