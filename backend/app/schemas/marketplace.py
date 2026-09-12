from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid

class CO2ListingBase(BaseModel):
    facility_name: str
    co2_grade: str
    volume_tpa: float
    price_per_ton: float
    purity_percentage: float
    transport_modes: List[str]
    status: str = "active"

class CO2ListingCreate(CO2ListingBase):
    pass

class CO2ListingResponse(CO2ListingBase):
    id: uuid.UUID
    supplier_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CO2RequestBase(BaseModel):
    required_grade: str
    volume_needed: float
    target_price: float
    status: str = "active"

class CO2RequestCreate(CO2RequestBase):
    pass

class CO2RequestResponse(CO2RequestBase):
    id: uuid.UUID
    buyer_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
