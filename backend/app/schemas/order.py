from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid

class OrderBase(BaseModel):
    listing_id: Optional[uuid.UUID] = None
    volume: float
    total_value: float
    status: str = "pending"
    transport_mode: str
    eta: Optional[datetime] = None

class OrderCreate(OrderBase):
    supplier_id: uuid.UUID

class OrderResponse(OrderBase):
    id: uuid.UUID
    buyer_id: uuid.UUID
    supplier_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
