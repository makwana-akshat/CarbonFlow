from pydantic import BaseModel, ConfigDict
from typing import Optional
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
    updated_at: datetime
    facilities: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)
