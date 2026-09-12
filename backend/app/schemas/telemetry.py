from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
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
    captureOutput: int
    expectedOutput: int
    status: str
    lastUpdate: str
    designCapacity: str

class ShipmentMonitoringResponse(BaseModel):
    id: str
    shipmentId: str
    route: str
    origin: str
    destination: str
    mode: str
    eta: str
    status: str
    risk: str
    volume: str
    carrier: str

class OperationalSummary(BaseModel):
    critical: int
    warnings: int
    active: int
    resolvedToday: int
