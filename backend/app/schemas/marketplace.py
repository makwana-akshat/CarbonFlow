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
    location: Optional[str] = None
    distance_km: Optional[float] = 0
    source_type: Optional[str] = None
    availability_window: Optional[str] = None
    capture_capacity_tpa: Optional[float] = 0
    storage_pressure_bar: Optional[float] = 0
    is_verified: Optional[bool] = False

class CO2ListingCreate(CO2ListingBase):
    pass

class CO2ListingUpdate(BaseModel):
    facility_name: Optional[str] = None
    co2_grade: Optional[str] = None
    volume_tpa: Optional[float] = None
    price_per_ton: Optional[float] = None
    purity_percentage: Optional[float] = None
    transport_modes: Optional[List[str]] = None
    status: Optional[str] = None

class CO2ListingResponse(CO2ListingBase):
    id: uuid.UUID
    supplier_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CO2RequestBase(BaseModel):
    title: str
    application: str
    volume_needed: float
    min_purity_required: float
    target_price: float
    location: str
    required_by_date: Optional[str] = None
    delivery_method: Optional[str] = None
    status: str = "draft"
    is_urgent: Optional[bool] = False
    offtake_frequency: Optional[str] = None

class CO2RequestCreate(CO2RequestBase):
    pass

class CO2RequestUpdate(BaseModel):
    title: Optional[str] = None
    application: Optional[str] = None
    volume_needed: Optional[float] = None
    min_purity_required: Optional[float] = None
    target_price: Optional[float] = None
    location: Optional[str] = None
    required_by_date: Optional[str] = None
    delivery_method: Optional[str] = None
    status: Optional[str] = None

class CO2RequestResponse(CO2RequestBase):
    id: uuid.UUID
    buyer_id: uuid.UUID
    buyer_company_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
