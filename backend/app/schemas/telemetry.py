from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class AlertBase(BaseModel):
    facility_id: Optional[uuid.UUID] = None
    severity: str
    title: str
    description: Optional[str] = None
    is_resolved: bool = False

class AlertCreate(AlertBase):
    pass

class AlertResponse(AlertBase):
    id: uuid.UUID
    created_at: datetime
    # We will pass the parsed extra fields as a flat dict so it matches frontend needs
    extra_fields: Optional[Dict[str, Any]] = None
    facilities: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

class FacilityMonitoringResponse(BaseModel):
    id: str
    facility: str
    region: str
    captureOutput: Optional[float] = None
    expectedOutput: Optional[float] = None
    status: str
    lastUpdate: str
    designCapacity: Optional[str] = None

class ShipmentMonitoringResponse(BaseModel):
    id: str
    shipmentId: str
    route: Optional[str] = None
    origin: str
    destination: str
    mode: str
    eta: Optional[str] = None
    status: str
    risk: str
    volume: Optional[str] = None
    carrier: Optional[str] = None

class OperationalSummary(BaseModel):
    critical: int
    warnings: int
    active: int
    resolvedToday: int

class StatusBreakdown(BaseModel):
    label: str
    count: int
    color: str

class OperationsCategory(BaseModel):
    category: str
    total: int
    breakdown: List[StatusBreakdown]

class OperationsHealthIndexResponse(BaseModel):
    categories: List[OperationsCategory]
