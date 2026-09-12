from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    co2_capacity: Optional[str] = None
    facility_location: Optional[str] = None
    is_verified: Optional[bool] = False
    notif_price_alerts: Optional[bool] = True
    notif_supply_alerts: Optional[bool] = True
    notif_order_updates: Optional[bool] = True
    notif_contract_notifs: Optional[bool] = False

class UserCreate(UserBase):
    clerk_user_id: str
    role: str = "buyer"

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: uuid.UUID
    clerk_user_id: str
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
