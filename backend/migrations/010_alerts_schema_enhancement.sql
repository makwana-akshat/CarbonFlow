-- Add columns to support facility telemetry monitoring
ALTER TABLE facilities 
ADD COLUMN IF NOT EXISTS capture_output DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS expected_output DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS design_capacity VARCHAR(100);

-- Provide some safe defaults for existing rows if null to avoid UI crashes
UPDATE facilities SET capture_output = 96.0 WHERE capture_output IS NULL AND operational_status = 'active';
UPDATE facilities SET capture_output = 88.0 WHERE capture_output IS NULL AND operational_status = 'warning';
UPDATE facilities SET capture_output = 80.0 WHERE capture_output IS NULL AND operational_status = 'critical';

UPDATE facilities SET expected_output = 95.0 WHERE expected_output IS NULL;
UPDATE facilities SET design_capacity = '100k tpa' WHERE design_capacity IS NULL;
