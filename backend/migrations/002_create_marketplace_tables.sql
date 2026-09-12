-- co2_listings
CREATE TABLE co2_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    facility_name TEXT NOT NULL,
    co2_grade TEXT NOT NULL,
    volume_tpa NUMERIC NOT NULL CHECK (volume_tpa > 0),
    price_per_ton NUMERIC NOT NULL CHECK (price_per_ton >= 0),
    purity_percentage NUMERIC NOT NULL CHECK (purity_percentage >= 0 AND purity_percentage <= 100),
    transport_modes TEXT[] NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_co2_listings_supplier ON co2_listings(supplier_id);
CREATE INDEX idx_co2_listings_status ON co2_listings(status);
CREATE INDEX idx_co2_listings_grade ON co2_listings(co2_grade);

CREATE TRIGGER update_co2_listings_updated_at
    BEFORE UPDATE ON co2_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- co2_requests
CREATE TABLE co2_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    required_grade TEXT NOT NULL,
    volume_needed NUMERIC NOT NULL CHECK (volume_needed > 0),
    target_price NUMERIC NOT NULL CHECK (target_price >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_co2_requests_buyer ON co2_requests(buyer_id);
CREATE INDEX idx_co2_requests_status ON co2_requests(status);

CREATE TRIGGER update_co2_requests_updated_at
    BEFORE UPDATE ON co2_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- facilities
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    region TEXT NOT NULL,
    operational_status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_facilities_owner ON facilities(owner_id);

CREATE TRIGGER update_facilities_updated_at
    BEFORE UPDATE ON facilities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- orders (Offtake Agreements)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES co2_listings(id) ON DELETE SET NULL,
    volume NUMERIC NOT NULL CHECK (volume > 0),
    total_value NUMERIC NOT NULL CHECK (total_value >= 0),
    status TEXT NOT NULL DEFAULT 'pending',
    transport_mode TEXT NOT NULL,
    eta TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_facility ON alerts(facility_id);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_severity ON alerts(severity);
