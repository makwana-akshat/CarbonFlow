from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime
import uuid

class ContractCreate(BaseModel):
    order_id: uuid.UUID

class ContractStatusUpdate(BaseModel):
    status: str

class ContractVersionCreate(BaseModel):
    volume: Optional[str] = None
    price_per_ton: Optional[str] = None
    purity: Optional[str] = None
    delivery_date: Optional[date] = None
    transportation_terms: Optional[str] = None
    payment_terms: Optional[str] = None
    changes: List[str]

class ContractTimelineEventResponse(BaseModel):
    step: int
    label: str
    timestamp: str
    actor: str
    role: str
    action: str
    notes: Optional[str] = None
    status: str

class ContractVersionResponse(BaseModel):
    version: str
    isCurrent: bool
    summary: str
    date: str
    author: str
    changes: List[str]

class ContractResponse(BaseModel):
    id: str
    contract_id: str
    supplier_name: str
    buyer_name: str
    volume: str
    contract_value: str
    created_date: str
    status: str
    version: str
    purity: str
    price_per_ton: str
    delivery_date: str
    transportation_terms: str
    payment_terms: str
    audit_hash: str
    iso_standard: str
    timeline: List[ContractTimelineEventResponse]
    version_history: List[ContractVersionResponse]

class ComplianceSummaryResponse(BaseModel):
    active_contracts: int
    pending_approval: int
    completed: int
    with_amendments: int
