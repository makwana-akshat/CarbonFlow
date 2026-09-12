from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid

class OrderBase(BaseModel):
    listing_id: uuid.UUID
    volume: float
    transport_mode: str

class OrderCreate(OrderBase):
    pass

class OrderUpdateStatus(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: uuid.UUID
    buyer_id: uuid.UUID
    supplier_id: uuid.UUID
    listing_id: Optional[uuid.UUID] = None
    volume: float
    total_value: float
    status: str
    transport_mode: str
    eta: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    # Optional fields for frontend display populated by joining
    supplier_name: Optional[str] = None
    buyer_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)
