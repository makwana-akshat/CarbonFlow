ALTER TABLE audit_contracts 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_audit_contracts_order ON audit_contracts(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_contracts_supplier ON audit_contracts(supplier_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_contracts_buyer ON audit_contracts(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_contracts_status ON audit_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contract_versions_contract ON contract_versions(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_timeline_contract ON contract_timeline_events(contract_id);
