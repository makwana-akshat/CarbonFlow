-- Add missing fields to orders table

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_ref VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS progress_percent NUMERIC DEFAULT 0;

-- Backfill order_ref for any existing rows if any exist (though currently there shouldn't be any)
UPDATE orders SET order_ref = 'CF-ORD-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || SUBSTRING(id::text FROM 1 FOR 6) WHERE order_ref IS NULL;

-- Make order_ref NOT NULL after backfilling
ALTER TABLE orders
ALTER COLUMN order_ref SET NOT NULL;
