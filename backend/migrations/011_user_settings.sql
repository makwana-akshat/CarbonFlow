-- Add missing profile and organization fields to the users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS co2_capacity TEXT,
ADD COLUMN IF NOT EXISTS facility_location TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notif_price_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notif_supply_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notif_order_updates BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notif_contract_notifs BOOLEAN DEFAULT false;
