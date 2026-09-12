from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from decimal import Decimal
import uuid
from datetime import date, datetime

class AuditTimelineEvent(BaseModel):
    step: int
    label: str
    timestamp_str: Optional[str] = None
    actor: Optional[str] = None
    role: Optional[str] = None
    action: Optional[str] = None
    notes: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

class ContractVersionInfo(BaseModel):
    version: str
    is_current: bool
    summary: Optional[str] = None
    effective_date: Optional[date] = None
    author: Optional[str] = None
    changes: Optional[List[str]] = []

    model_config = ConfigDict(from_attributes=True)

class AuditContractResponse(BaseModel):
    id: uuid.UUID
    contract_id: str
    supplier_name: str
    buyer_name: str
    volume: str
    contract_value: str
    created_date: date
    status: str
    version: str
    purity: Optional[str] = None
    price_per_ton: Optional[str] = None
    delivery_date: Optional[date] = None
    transportation_terms: Optional[str] = None
    payment_terms: Optional[str] = None
    audit_hash: Optional[str] = None
    iso_standard: Optional[str] = None
    timeline: List[AuditTimelineEvent] = []
    version_history: List[ContractVersionInfo] = []

    model_config = ConfigDict(from_attributes=True)

class ComplianceSummaryResponse(BaseModel):
    active_contracts: int
    pending_approval: int
    completed: int
    with_amendments: int
