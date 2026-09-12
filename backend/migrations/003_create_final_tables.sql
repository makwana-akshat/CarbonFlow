-- 3.4 Recommendations Table
CREATE TABLE recommendations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    user_role           VARCHAR(20) NOT NULL,
    listing_id          UUID REFERENCES co2_listings(id) ON DELETE CASCADE,
    requirement_id      UUID REFERENCES co2_requests(id) ON DELETE CASCADE,
    company_name        VARCHAR(255) NOT NULL,
    facility_type       VARCHAR(255),
    location            VARCHAR(255),
    match_score         DECIMAL(5,2) NOT NULL,           -- 0-100
    is_best_match       BOOLEAN DEFAULT FALSE,
    is_verified         BOOLEAN DEFAULT FALSE,
    tags                TEXT[],
    co2_grade           VARCHAR(255),
    volume              VARCHAR(100),                    -- e.g. "8,500 t/mo"
    price_per_ton       VARCHAR(50),                     -- formatted string
    co2_source          VARCHAR(30)
        CHECK (co2_source IN ('DAC', 'Biogenic', 'Point-Source Capture')),
    transport_mode      VARCHAR(30)
        CHECK (transport_mode IN ('Pipeline', 'ISO Rail Tanker', 'Cryogenic Truck', 'Barge')),
    purity              VARCHAR(100),
    delivery_timeline   VARCHAR(255),
    certification       VARCHAR(255),
    route_steps         JSONB,                           -- array of {icon_type, label}
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Audit Contracts Table
CREATE TABLE audit_contracts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id             VARCHAR(50) UNIQUE NOT NULL,     -- e.g. "CF-001"
    supplier_user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
    supplier_name           VARCHAR(255) NOT NULL,
    buyer_name              VARCHAR(255) NOT NULL,
    volume                  VARCHAR(100) NOT NULL,           -- e.g. "5,000 t"
    volume_tonnes           DECIMAL(12,2),
    contract_value          VARCHAR(100),                    -- e.g. "₹2.25 Cr"
    contract_value_inr      DECIMAL(16,2),
    status                  VARCHAR(30) NOT NULL DEFAULT 'Draft'
        CHECK (status IN (
            'Draft', 'Pending Review', 'Approved',
            'Active', 'Completed', 'Expired', 'Cancelled'
        )),
    version                 VARCHAR(10) NOT NULL DEFAULT 'v1',
    purity                  VARCHAR(50),                     -- e.g. "≥98.0%"
    price_per_ton           VARCHAR(50),                     -- e.g. "₹4,500/t"
    delivery_date           DATE,
    transportation_terms    TEXT,
    payment_terms           TEXT,
    audit_hash              VARCHAR(255),                    -- cryptographic hash
    iso_standard            VARCHAR(255),
    created_date            DATE DEFAULT CURRENT_DATE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_audit_contracts_updated_at
    BEFORE UPDATE ON audit_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Contract Audit Timeline Events
CREATE TABLE contract_timeline_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES audit_contracts(id) ON DELETE CASCADE,
    step            INT NOT NULL,
    label           VARCHAR(100) NOT NULL,
    timestamp_str   VARCHAR(100),                           -- display string
    actor           VARCHAR(255),
    role            VARCHAR(255),
    action          TEXT,
    notes           TEXT,
    status          VARCHAR(20) NOT NULL
        CHECK (status IN ('completed', 'in-progress', 'upcoming')),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Contract Version History
CREATE TABLE contract_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id     UUID REFERENCES audit_contracts(id) ON DELETE CASCADE,
    version         VARCHAR(10) NOT NULL,
    is_current      BOOLEAN DEFAULT FALSE,
    summary         TEXT,
    effective_date  DATE,
    author          VARCHAR(255),
    changes         TEXT[],
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Shipments Table
CREATE TABLE shipments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_ref    VARCHAR(50) UNIQUE NOT NULL,         -- e.g. "SHP-8924"
    order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
    origin          VARCHAR(255) NOT NULL,
    destination     VARCHAR(255) NOT NULL,
    route_label     VARCHAR(255),                        -- e.g. "Mundra -> Ahmedabad"
    transport_mode  VARCHAR(50) NOT NULL,
    eta             VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'in-transit'
        CHECK (status IN ('in-transit', 'delayed', 'at-risk', 'delivered')),
    risk            VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (risk IN ('low', 'medium', 'high')),
    volume          VARCHAR(100),                        -- e.g. "320 t" or "180 t/h"
    volume_tonnes   DECIMAL(12,2),
    carrier         VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3.11 Routes Table (Logistics)
CREATE TABLE routes (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_ref               VARCHAR(50),
    supplier_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_id                UUID REFERENCES users(id) ON DELETE CASCADE,
    supplier_name           VARCHAR(255),
    buyer_name              VARCHAR(255),
    from_lat                DECIMAL(9,6) NOT NULL,
    from_lng                DECIMAL(9,6) NOT NULL,
    to_lat                  DECIMAL(9,6) NOT NULL,
    to_lng                  DECIMAL(9,6) NOT NULL,
    distance_km             DECIMAL(8,2),
    travel_time_hrs         DECIMAL(6,2),
    estimated_cost_inr      DECIMAL(14,2),
    transport_mode          VARCHAR(20)
        CHECK (transport_mode IN ('Road', 'Rail', 'Pipeline', 'Barge')),
    is_recommended          BOOLEAN DEFAULT FALSE,
    emissions_tco2e         DECIMAL(8,4),
    reliability_score       DECIMAL(4,2),
    geometry                JSONB,                       -- array of {lat, lng} points
    alternatives            JSONB,                       -- array of RouteAlternative
    created_at              TIMESTAMPTZ DEFAULT NOW()
);
